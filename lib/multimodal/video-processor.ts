import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'

const execAsync = promisify(exec)

export interface VideoProcessingResult {
  framesPath: string
  audioPath: string
  frames: string[]
  duration: number
  fps: number
  resolution: { width: number; height: number }
}

/**
 * Extract frames from video file at specified interval
 */
export async function extractFrames(
  videoPath: string,
  framesDir: string,
  frameInterval: number = 1 // Extract 1 frame per second
): Promise<{ frames: string[]; duration: number; fps: number }> {
  try {
    // Create frames directory
    if (!fs.existsSync(framesDir)) {
      fs.mkdirSync(framesDir, { recursive: true })
    }

    // Get video info (duration, fps, resolution)
    const { stdout: ffprobeOutput } = await execAsync(
      `ffprobe -v error -select_streams v:0 -show_entries stream=duration,r_frame_rate,width,height -of csv=p=0 "${videoPath}"`
    )

    const [duration, frameRate, width, height] = ffprobeOutput.trim().split(',')
    const fps = eval(frameRate) // Convert "30000/1001" to number
    const durationSeconds = parseFloat(duration)

    // Extract frames at specified interval
    const framePattern = path.join(framesDir, 'frame_%04d.jpg')
    await execAsync(
      `ffmpeg -i "${videoPath}" -vf "fps=1/${frameInterval}" -q:v 2 "${framePattern}" -hide_banner -loglevel error`
    )

    // Get list of extracted frames
    const frames = fs.readdirSync(framesDir)
      .filter(f => f.startsWith('frame_') && f.endsWith('.jpg'))
      .sort()
      .map(f => path.join(framesDir, f))

    console.log(`[v0] Extracted ${frames.length} frames from video`)

    return {
      frames,
      duration: durationSeconds,
      fps: Math.round(fps)
    }
  } catch (error) {
    console.error('[v0] Frame extraction error:', error)
    throw new Error(`Failed to extract frames: ${error}`)
  }
}

/**
 * Extract audio from video file as MP3
 */
export async function extractAudio(
  videoPath: string,
  audioPath: string
): Promise<{ duration: number }> {
  try {
    // Extract audio to MP3
    await execAsync(
      `ffmpeg -i "${videoPath}" -q:a 9 -n "${audioPath}" -hide_banner -loglevel error`
    )

    // Get audio duration
    const { stdout: ffprobeOutput } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1:nokey_sep=1 "${audioPath}"`
    )

    const duration = parseFloat(ffprobeOutput.trim())
    console.log(`[v0] Extracted audio: ${duration}s`)

    return { duration }
  } catch (error) {
    console.error('[v0] Audio extraction error:', error)
    throw new Error(`Failed to extract audio: ${error}`)
  }
}

/**
 * Extract resolution info from video
 */
export async function getVideoResolution(videoPath: string): Promise<{ width: number; height: number }> {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "${videoPath}"`
    )

    const [width, height] = stdout.trim().split(',').map(Number)
    return { width, height }
  } catch (error) {
    console.error('[v0] Resolution extraction error:', error)
    throw error
  }
}

/**
 * Process video: extract frames and audio
 */
export async function processVideoFile(
  videoPath: string,
  outputDir: string,
  frameInterval: number = 1
): Promise<VideoProcessingResult> {
  try {
    const framesDir = path.join(outputDir, 'frames')
    const audioPath = path.join(outputDir, 'audio.mp3')

    // Extract frames and audio in parallel
    const [framesResult, audioResult, resolution] = await Promise.all([
      extractFrames(videoPath, framesDir, frameInterval),
      extractAudio(videoPath, audioPath),
      getVideoResolution(videoPath)
    ])

    return {
      framesPath: framesDir,
      audioPath,
      frames: framesResult.frames,
      duration: framesResult.duration,
      fps: framesResult.fps,
      resolution
    }
  } catch (error) {
    console.error('[v0] Video processing error:', error)
    throw error
  }
}

/**
 * Cleanup temporary files
 */
export async function cleanupProcessedFiles(outputDir: string): Promise<void> {
  try {
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true })
      console.log(`[v0] Cleaned up ${outputDir}`)
    }
  } catch (error) {
    console.error('[v0] Cleanup error:', error)
  }
}
