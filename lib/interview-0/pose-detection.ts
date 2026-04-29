'use client'

import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

let poseLandmarker: PoseLandmarker | null = null

export async function initializePoseLandmarker() {
  if (poseLandmarker) return poseLandmarker

  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
  )

  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/image_segmenter/pose_landmarker_heavy/float16/latest/pose_landmarker_heavy.task'
    },
    runningMode: 'VIDEO'
  })

  return poseLandmarker
}

interface PoseIssue {
  text: string
  severity: 'low' | 'medium' | 'high'
  deduct: number
}

interface PoseAnalysisResult {
  score: number
  issues: PoseIssue[]
  landmarks: any
}

export async function analyzePose(videoElement: HTMLVideoElement): Promise<PoseAnalysisResult> {
  try {
    const landmarker = await initializePoseLandmarker()
    if (!landmarker) throw new Error('Failed to initialize pose landmarker')

    // Detect pose
    const result = landmarker.detectForVideo(videoElement, Date.now())

    if (!result.landmarks || result.landmarks.length === 0) {
      return {
        score: 40,
        issues: [
          { text: 'No se detectó pose. Asegúrate de estar completamente visible en la cámara', severity: 'high', deduct: 30 }
        ],
        landmarks: null
      }
    }

    const landmarks = result.landmarks[0]
    const issues: PoseIssue[] = []
    let score = 100

    // Landmark indices (MediaPipe 33 landmarks)
    const LEFT_SHOULDER = 11
    const RIGHT_SHOULDER = 12
    const LEFT_EAR = 7
    const RIGHT_EAR = 8
    const NOSE = 0
    const LEFT_EYE = 1
    const RIGHT_EYE = 2
    const LEFT_HIP = 23
    const RIGHT_HIP = 24

    // 1. Check head position (centered and facing camera)
    const nose = landmarks[NOSE]
    const leftEye = landmarks[LEFT_EYE]
    const rightEye = landmarks[RIGHT_EYE]

    if (nose && leftEye && rightEye) {
      // Check if facing camera (eyes and nose visibility)
      const eyeVisibility = (leftEye.visibility || 0 + rightEye.visibility || 0) / 2
      if (eyeVisibility < 0.7) {
        issues.push({
          text: 'Mantén la mirada al frente hacia la cámara',
          severity: 'high',
          deduct: 20
        })
        score -= 20
      }

      // Check horizontal centering (nose should be roughly centered)
      const noseX = nose.x || 0
      if (noseX < 0.35 || noseX > 0.65) {
        issues.push({
          text: 'Centra tu cabeza - no mires hacia los lados',
          severity: 'medium',
          deduct: 15
        })
        score -= 15
      }
    }

    // 2. Check shoulder alignment and posture
    const leftShoulder = landmarks[LEFT_SHOULDER]
    const rightShoulder = landmarks[RIGHT_SHOULDER]

    if (leftShoulder && rightShoulder) {
      const shoulderVisibility = (leftShoulder.visibility || 0 + rightShoulder.visibility || 0) / 2
      if (shoulderVisibility < 0.6) {
        issues.push({
          text: 'Asegúrate de que ambos hombros sean visibles',
          severity: 'medium',
          deduct: 12
        })
        score -= 12
      }

      // Check if shoulders are level (not tilted)
      const shoulderDiff = Math.abs((leftShoulder.y || 0) - (rightShoulder.y || 0))
      if (shoulderDiff > 0.15) {
        issues.push({
          text: 'Relaja los hombros - mantén una postura recta',
          severity: 'low',
          deduct: 10
        })
        score -= 10
      }
    }

    // 3. Check distance from camera (based on shoulder width)
    if (leftShoulder && rightShoulder) {
      const shoulderWidth = Math.abs((rightShoulder.x || 0) - (leftShoulder.x || 0))
      // Good distance: shoulder width should be 0.3-0.5 of frame
      if (shoulderWidth < 0.25) {
        issues.push({
          text: 'Acércate un poco más a la cámara',
          severity: 'medium',
          deduct: 15
        })
        score -= 15
      } else if (shoulderWidth > 0.55) {
        issues.push({
          text: 'Aléjate un poco de la cámara',
          severity: 'low',
          deduct: 8
        })
        score -= 8
      }
    }

    // 4. Check if person is looking down (chin angle)
    const leftHip = landmarks[LEFT_HIP]
    const rightHip = landmarks[RIGHT_HIP]

    if (nose && leftHip && rightHip) {
      const bodyVerticalPos = ((leftHip.y || 0) + (rightHip.y || 0)) / 2
      const noseVerticalPos = nose.y || 0

      // If nose is too close to bottom, person is looking down
      if (noseVerticalPos > bodyVerticalPos * 0.8) {
        issues.push({
          text: 'Levanta la cabeza - mira hacia adelante',
          severity: 'high',
          deduct: 18
        })
        score -= 18
      }
    }

    // Minimum score of 45 if issues detected, 70+ if no major issues
    const finalScore = Math.max(45, Math.min(100, score))

    return {
      score: finalScore,
      issues: issues.sort((a, b) => b.deduct - a.deduct), // Sort by severity
      landmarks
    }
  } catch (err) {
    console.error('[v0] Pose analysis error:', err)
    return {
      score: 50,
      issues: [
        { text: 'Error en detección de pose. Intenta nuevamente.', severity: 'medium', deduct: 20 }
      ],
      landmarks: null
    }
  }
}
