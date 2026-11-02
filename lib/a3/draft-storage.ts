'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { A3ModuleId } from '@/lib/a3/module-catalog'

const A3_DRAFT_PREFIX = 'dtc:a3'

/** A late save acknowledgement may only remove the exact draft it submitted. */
export function removeA3DraftIfUnchanged(storage: Pick<Storage, 'getItem' | 'removeItem'>, key: string, expectedValue?: unknown): boolean {
  if (expectedValue !== undefined && storage.getItem(key) !== JSON.stringify(expectedValue)) return false
  storage.removeItem(key)
  return true
}

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
  onReset?: () => void
  enabled?: boolean
}

export function useA3DraftStorage<T>({
  moduleId,
  legacyKey,
  value,
  onRestore,
  onReset,
  enabled = true,
}: UseA3DraftStorageOptions<T>) {
  const [storageKey, setStorageKey] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [ownerId, setOwnerId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [authRevision, setAuthRevision] = useState(0)
  const restoreRef = useRef(onRestore)
  restoreRef.current = onRestore
  const resetRef = useRef(onReset)
  resetRef.current = onReset
  const initialValue = useRef(value)
  const owner = useRef<string | null>(null)
  const scope = useRef<string | null>(null)
  const identityGeneration = useRef(0)

  useEffect(() => {
    const { data: { subscription } } = createClient().auth.onAuthStateChange((event, session) => {
      if (event !== 'SIGNED_OUT' && (session?.user.id ?? null) === owner.current) return
      identityGeneration.current++
      owner.current = null
      scope.current = null
      setOwnerId(null); setStorageKey(null); setReady(false)
      if (resetRef.current) resetRef.current()
      else restoreRef.current(initialValue.current)
      setAuthRevision(version => version + 1)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    let active = true
    const requestedGeneration = identityGeneration.current
    setReady(false); setError(null)
    try { window.localStorage.removeItem(legacyKey) } catch { /* Account save remains available. */ }

    const restore = async () => {
      try {
        const {
          data: { user }, error: authError,
        } = await createClient().auth.getUser()
        if (authError) throw authError
        if (!active || !user) return
        if (requestedGeneration !== identityGeneration.current) return

        const scopedKey = createA3DraftStorageKey(user.id, moduleId)
        if (scope.current && scope.current !== scopedKey) {
          if (resetRef.current) resetRef.current()
          else restoreRef.current(initialValue.current)
        }
        scope.current = scopedKey
        let stored: string | null = null
        try { stored = window.localStorage.getItem(scopedKey) }
        catch { setError('No pudimos leer el borrador de este dispositivo. Puedes continuar y guardar en tu cuenta.') }
        if (stored) {
          try {
            restoreRef.current(JSON.parse(stored))
          } catch {
            setError('El borrador de este dispositivo no tiene un formato compatible. Revisa tus respuestas antes de continuar.')
            try { window.localStorage.removeItem(scopedKey) } catch { /* No invalid data is restored. */ }
          }
        }

        if (active) {
          owner.current = user.id
          setOwnerId(user.id)
          setStorageKey(scopedKey)
          setReady(true)
        }
      } catch {
        if (active && requestedGeneration === identityGeneration.current) setError('No pudimos verificar tu sesión para recuperar el borrador. Vuelve a intentarlo.')
      }
    }

    void restore()
    return () => {
      active = false
    }
  }, [legacyKey, moduleId, authRevision])

  useEffect(() => {
    if (!ready || !storageKey || !enabled) return
    try { window.localStorage.setItem(storageKey, JSON.stringify(value)) }
    catch { setError('No pudimos guardar el borrador en este dispositivo. Conserva tu texto hasta guardarlo en tu cuenta.') }
  }, [enabled, ready, storageKey, value])

  const clearDraft = useCallback((expectedValue?: T) => {
    if (!storageKey) return false
    try { return removeA3DraftIfUnchanged(window.localStorage, storageKey, expectedValue) }
    catch { return false }
  }, [storageKey])

  const retry = useCallback(() => setAuthRevision(version => version + 1), [])
  return { clearDraft, ready, ownerId, error, retry }
}
