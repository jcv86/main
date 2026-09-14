'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { A3ModuleId } from '@/lib/a3/module-catalog'

const A3_DRAFT_PREFIX = 'dtc:a3'

export function createA3DraftStorageKey(userId: string, moduleId: A3ModuleId): string {
  const normalizedUserId = userId.trim()
  if (!normalizedUserId) throw new Error('A user scope is required for A3 drafts.')

  return `${A3_DRAFT_PREFIX}:${encodeURIComponent(normalizedUserId)}:module:${moduleId}:draft`
}

interface UseA3DraftStorageOptions<T> {
  moduleId: A3ModuleId
  legacyKey: string
  value: T
  onRestore: (stored: unknown) => void
  enabled?: boolean
}

export function useA3DraftStorage<T>({
  moduleId,
  legacyKey,
  value,
  onRestore,
  enabled = true,
}: UseA3DraftStorageOptions<T>) {
  const [storageKey, setStorageKey] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const restoreRef = useRef(onRestore)
  restoreRef.current = onRestore

  useEffect(() => {
    let active = true
    window.localStorage.removeItem(legacyKey)

    const restore = async () => {
      const {
        data: { user },
      } = await createClient().auth.getUser()
      if (!active || !user) return

      const scopedKey = createA3DraftStorageKey(user.id, moduleId)
      const stored = window.localStorage.getItem(scopedKey)
      if (stored) {
        try {
          restoreRef.current(JSON.parse(stored))
        } catch {
          window.localStorage.removeItem(scopedKey)
        }
      }

      if (active) {
        setStorageKey(scopedKey)
        setReady(true)
      }
    }

    void restore()
    return () => {
      active = false
    }
  }, [legacyKey, moduleId])

  useEffect(() => {
    if (!ready || !storageKey || !enabled) return
    window.localStorage.setItem(storageKey, JSON.stringify(value))
  }, [enabled, ready, storageKey, value])

  const clearDraft = useCallback(() => {
    if (storageKey) window.localStorage.removeItem(storageKey)
  }, [storageKey])

  return { clearDraft, ready }
}
