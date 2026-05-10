interface Interview0Status {
  environment_check?: { passed: boolean; score: number }
  presence_check?: { passed: boolean; score: number }
  audio_check?: { passed: boolean; score: number }
  preparation_check?: { passed: boolean; score: number }
  interview_0_completed?: boolean
  interview_0_score?: number
  interview_0_status?: 'not_started' | 'in_progress' | 'completed'
}

export async function saveInterview0Status(data: Interview0Status) {
  try {
    const response = await fetch('/api/interview-0/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to save')
    }

    console.log('[v0] Interview 0 status saved')
    return await response.json()
  } catch (err) {
    console.error('[v0] Failed to save interview 0 status:', err)
    throw err
  }
}

export async function getInterview0Status() {
  try {
    const response = await fetch('/api/interview-0/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Failed to get interview 0 status')
    }

    const data = await response.json()
    return data || null
  } catch (err) {
    console.error('[v0] Failed to get interview 0 status:', err)
    return null
  }
}

export async function completeInterview0(finalScore: number) {
  try {
    const response = await fetch('/api/interview-0/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ finalScore }),
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to complete')
    }

    console.log('[v0] Interview 0 completed')
    return await response.json()
  } catch (err) {
    console.error('[v0] Failed to complete interview 0:', err)
    throw err
  }
}
