export interface Interview0Status {
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
    console.log('[v0] Attempting to save interview-0 status with data:', JSON.stringify(data))
    
    const response = await fetch('/api/interview-0/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    })

    console.log('[v0] Save response status:', response.status)

    if (!response.ok) {
      let errorData: any = { error: 'Unknown error' }
      try {
        errorData = await response.json()
      } catch (parseErr) {
        console.warn('[v0] Could not parse error response as JSON')
        const text = await response.text()
        errorData = { error: text || `HTTP ${response.status}` }
      }
      
      console.error('[v0] Save failed:', {
        status: response.status,
        errorData,
        timestamp: new Date().toISOString(),
        sentData: data
      })
      
      const errorMessage = errorData.details || errorData.message || errorData.error || `HTTP ${response.status}`
      throw new Error(errorMessage)
    }

    const result = await response.json()
    console.log('[v0] Interview 0 status saved successfully:', { 
      timestamp: new Date().toISOString(),
      dataFields: Object.keys(data)
    })
    return result
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error('[v0] Failed to save interview 0 status:', {
      error: errorMessage,
      dataKeys: Object.keys(data),
      timestamp: new Date().toISOString(),
    })
    // Fail gracefully but notify caller
    throw new Error(`A3 Save Error: ${errorMessage}`)
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
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('[v0] Complete failed with status', response.status, errorData)
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    const result = await response.json()
    console.log('[v0] Interview 0 completed successfully:', { finalScore, timestamp: new Date().toISOString() })
    return result
  } catch (err) {
    console.error('[v0] Failed to complete interview 0:', {
      error: err instanceof Error ? err.message : String(err),
      finalScore,
      timestamp: new Date().toISOString(),
    })
    throw err
  }
}
