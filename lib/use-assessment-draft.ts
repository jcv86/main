'use client'

import { useCallback, useState } from 'react'
import type { AssessmentDraft, AssessmentType } from '@/lib/assessment-drafts'

export function useAssessmentDraft(type: AssessmentType) {
  const [draftError, setDraftError] = useState('')
  const [savingDraft, setSavingDraft] = useState(false)

  const loadDraft = useCallback(async (): Promise<AssessmentDraft | null> => {
    const response = await fetch(`/api/assessments/drafts/${type}`, { cache: 'no-store', credentials: 'include' })
    if (!response.ok) throw new Error('No pudimos recuperar tu avance.')
    const result = await response.json()
    return result.draft ?? null
  }, [type])

  const saveDraft = useCallback(async (draft: Omit<AssessmentDraft, 'assessmentType'>) => {
    setSavingDraft(true)
    setDraftError('')
    try {
      const response = await fetch(`/api/assessments/drafts/${type}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(draft) })
      if (!response.ok) throw new Error('No pudimos guardar tu avance.')
    } catch (error) {
      setDraftError(error instanceof Error ? error.message : 'No pudimos guardar tu avance.')
      throw error
    } finally { setSavingDraft(false) }
  }, [type])

  const completeDraft = useCallback(async () => {
    const response = await fetch(`/api/assessments/drafts/${type}`, { method: 'POST', credentials: 'include' })
    if (!response.ok) throw new Error('No pudimos cerrar el borrador.')
  }, [type])

  return { loadDraft, saveDraft, completeDraft, draftError, savingDraft, clearDraftError: () => setDraftError('') }
}
