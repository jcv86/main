'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { AssessmentDraft, AssessmentType } from '@/lib/assessment-drafts'
import { C1CompletionError, C1_EXPECTED_ACTOR_HEADER, isC1DraftRevision } from '@/lib/c1-completion'

export function useAssessmentDraft(type: AssessmentType, expectedUserId?: string | null) {
  const [draftError, setDraftError] = useState('')
  const [savingDraft, setSavingDraft] = useState(false)
  const operationEpoch = useRef(0)
  useEffect(() => {
    operationEpoch.current++
    setDraftError('')
    setSavingDraft(false)
    return () => { operationEpoch.current++ }
  }, [type, expectedUserId])

  const loadDraft = useCallback(async (): Promise<AssessmentDraft | null> => {
    const response = await fetch(`/api/assessments/drafts/${type}`, { cache: 'no-store', credentials: 'include' })
    if (!response.ok) throw new Error('No pudimos recuperar tu avance.')
    const result = await response.json()
    return result.draft ?? null
  }, [type])

  const saveDraft = useCallback(async (draft: Omit<AssessmentDraft, 'assessmentType'>) => {
    const epoch = operationEpoch.current
    setSavingDraft(true)
    setDraftError('')
    try {
      const response = await fetch(`/api/assessments/drafts/${type}`, { method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(type === 'c1' && expectedUserId ? { [C1_EXPECTED_ACTOR_HEADER]: expectedUserId } : {}) },
        credentials: 'include', body: JSON.stringify(draft) })
      const result = await response.json().catch(() => null)
      if (epoch !== operationEpoch.current) throw new C1CompletionError('session_changed')
      if (!response.ok) {
        if (type === 'c1' && response.status === 401) throw new C1CompletionError('authentication_required')
        if (type === 'c1' && response.status === 409 && result?.error === 'session_changed') throw new C1CompletionError('session_changed')
        throw new Error('No pudimos guardar tu avance.')
      }
      if (result?.saved !== true || !isC1DraftRevision(result.updatedAt)) throw new Error('No pudimos confirmar el guardado de tu avance. Intenta de nuevo.')
      return result.updatedAt as string
    } catch (error) {
      if (epoch === operationEpoch.current) setDraftError(error instanceof Error ? error.message : 'No pudimos guardar tu avance.')
      throw error
    } finally { if (epoch === operationEpoch.current) setSavingDraft(false) }
  }, [type, expectedUserId])

  const completeDraft = useCallback(async () => {
    const response = await fetch(`/api/assessments/drafts/${type}`, { method: 'POST', credentials: 'include',
      headers: type === 'c1' && expectedUserId ? { [C1_EXPECTED_ACTOR_HEADER]: expectedUserId } : {} })
    if (!response.ok) throw new Error('No pudimos cerrar el borrador.')
  }, [type, expectedUserId])

  return { loadDraft, saveDraft, completeDraft, draftError, savingDraft, clearDraftError: () => setDraftError('') }
}
