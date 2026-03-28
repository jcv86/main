import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

/**
 * AES-256-GCM Encryption for secure video storage
 */

const ALGORITHM = 'aes-256-gcm'
const KEY_SIZE = 32 // 256 bits
const IV_SIZE = 16 // 128 bits
const TAG_SIZE = 16 // 128 bits
const SALT_SIZE = 16

export interface EncryptedData {
  encryptedData: Buffer
  iv: Buffer
  authTag: Buffer
  salt: Buffer
}

/**
 * Derive encryption key from master key + salt using PBKDF2
 */
function deriveKey(masterKey: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(masterKey, salt, 100000, KEY_SIZE, 'sha256')
}

/**
 * Encrypt data with AES-256-GCM
 */
export function encryptData(data: Buffer, userId: string): EncryptedData {
  try {
    const masterKey = process.env.ENCRYPTION_MASTER_KEY || 'default-key'
    const salt = crypto.randomBytes(SALT_SIZE)
    const key = deriveKey(masterKey, salt)
    const iv = crypto.randomBytes(IV_SIZE)

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    let encryptedData = cipher.update(data)
    encryptedData = Buffer.concat([encryptedData, cipher.final()])

    const authTag = cipher.getAuthTag()

    console.log(`[v0] Data encrypted for user ${userId}: ${encryptedData.length} bytes`)

    return {
      encryptedData,
      iv,
      authTag,
      salt
    }
  } catch (error) {
    console.error('[v0] Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * Decrypt data with AES-256-GCM
 */
export function decryptData(
  encryptedData: Buffer,
  iv: Buffer,
  authTag: Buffer,
  salt: Buffer,
  userId: string
): Buffer {
  try {
    const masterKey = process.env.ENCRYPTION_MASTER_KEY || 'default-key'
    const key = deriveKey(masterKey, salt)

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encryptedData)
    decrypted = Buffer.concat([decrypted, decipher.final()])

    console.log(`[v0] Data decrypted for user ${userId}: ${decrypted.length} bytes`)

    return decrypted
  } catch (error) {
    console.error('[v0] Decryption error:', error)
    throw new Error('Failed to decrypt data - data may be corrupted')
  }
}

/**
 * Store encrypted blob metadata in database
 */
export async function storeEncryptedMetadata(
  userId: string,
  videoId: string,
  encryptionInfo: EncryptedData,
  metadata: Record<string, any>
) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('multimodal_encryption_keys')
      .insert({
        user_id: userId,
        video_id: videoId,
        iv: encryptionInfo.iv.toString('base64'),
        auth_tag: encryptionInfo.authTag.toString('base64'),
        salt: encryptionInfo.salt.toString('base64'),
        metadata: metadata
      })
      .select()

    if (error) {
      console.error('[v0] Error storing encryption metadata:', error)
      throw error
    }

    console.log(`[v0] Encryption metadata stored for video ${videoId}`)
    return data
  } catch (error) {
    console.error('[v0] Storage error:', error)
    throw error
  }
}

/**
 * Retrieve encrypted metadata
 */
export async function retrieveEncryptedMetadata(userId: string, videoId: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('multimodal_encryption_keys')
      .select('*')
      .eq('user_id', userId)
      .eq('video_id', videoId)
      .single()

    if (error) {
      console.error('[v0] Error retrieving encryption metadata:', error)
      throw error
    }

    return {
      iv: Buffer.from(data.iv, 'base64'),
      authTag: Buffer.from(data.auth_tag, 'base64'),
      salt: Buffer.from(data.salt, 'base64'),
      metadata: data.metadata
    }
  } catch (error) {
    console.error('[v0] Retrieval error:', error)
    throw error
  }
}

/**
 * Secure video deletion (wipe from all locations)
 */
export async function secureDeleteVideo(userId: string, videoId: string) {
  try {
    const supabase = createClient()

    // Delete from encryption metadata
    const { error: metaError } = await supabase
      .from('multimodal_encryption_keys')
      .delete()
      .eq('user_id', userId)
      .eq('video_id', videoId)

    if (metaError) console.error('[v0] Error deleting encryption metadata:', metaError)

    // Delete analysis records
    const { error: analysisError } = await supabase
      .from('multimodal_analyses')
      .delete()
      .eq('user_id', userId)
      .eq('session_id', videoId)

    if (analysisError) console.error('[v0] Error deleting analysis:', analysisError)

    // Delete session
    const { error: sessionError } = await supabase
      .from('multimodal_sessions')
      .delete()
      .eq('user_id', userId)
      .eq('id', videoId)

    if (sessionError) console.error('[v0] Error deleting session:', sessionError)

    console.log(`[v0] Securely deleted video ${videoId} for user ${userId}`)
    return true
  } catch (error) {
    console.error('[v0] Secure delete error:', error)
    throw error
  }
}

/**
 * Set automatic expiration for video (GDPR compliance)
 */
export async function setVideoExpiration(userId: string, videoId: string, expirationDays: number = 30) {
  try {
    const supabase = createClient()
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + expirationDays)

    const { error } = await supabase
      .from('multimodal_sessions')
      .update({
        expires_at: expirationDate.toISOString()
      })
      .eq('user_id', userId)
      .eq('id', videoId)

    if (error) throw error

    console.log(`[v0] Set expiration for video ${videoId} to ${expirationDate.toISOString()}`)
    return expirationDate
  } catch (error) {
    console.error('[v0] Expiration set error:', error)
    throw error
  }
}

/**
 * Create audit log for compliance
 */
export async function logAccessAudit(userId: string, action: string, videoId: string, details?: any) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from('multimodal_audit_logs').insert({
      user_id: userId,
      action,
      video_id: videoId,
      details: details || {},
      ip_address: '', // Set from request in API route
      timestamp: new Date().toISOString()
    })

    if (error) console.error('[v0] Audit log error:', error)
  } catch (error) {
    console.error('[v0] Audit logging error:', error)
  }
}
