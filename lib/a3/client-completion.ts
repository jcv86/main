'use client'

import type { A3ModuleId } from '@/lib/a3/module-catalog'

export interface A3CompletionValidation {
  passed: boolean
  score: number
  passScore: number
  errors: string[]
  strengths: string[]
}

export interface A3CompletionPayload {
  success?: boolean
  moduleId?: A3ModuleId
  moduleName?: string
  moduleNumber?: number
  isFirstCompletion?: boolean
  xpAwarded?: number
  totalXp?: number
  score?: number
  bestScore?: number
  routeCompleted?: boolean
  proUnlocked?: boolean
  validation?: A3CompletionValidation
  error?: string
}

export interface CompleteA3ModuleInput {
  moduleId: A3ModuleId
  moduleNumber: number
  responses: string[]
  deliverable: object
}

function errorMessage(payload: A3CompletionPayload): string {
  const firstError = Array.isArray(payload.validation?.errors)
    ? payload.validation?.errors.find(
        (error): error is string => typeof error === 'string' && error.trim().length > 0,
      )
    : null

  return firstError
    ? `${payload.error || 'El entrenamiento necesita ajustes.'} ${firstError}`
    : payload.error || 'No pudimos completar el entrenamiento.'
}

function completionEndpoint(moduleId: A3ModuleId): string {
  if (moduleId === 'risk-difficult-questions-lab') {
    return '/api/a3/module-completion/risk-difficult-questions-lab'
  }
  if (moduleId === 'basic-interview-mission') {
    return '/api/a3/module-completion/basic-interview-mission'
  }
  return '/api/a3/module-completion'
}

export async function completeA3Module(
  input: CompleteA3ModuleInput,
): Promise<A3CompletionPayload> {
  const response = await fetch(completionEndpoint(input.moduleId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  })

  const payload = (await response.json().catch(() => ({}))) as A3CompletionPayload
  if (!response.ok) throw new Error(errorMessage(payload))
  return payload
}
