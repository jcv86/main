export interface TestResult {
  testType: string
  testName?: string
  results: any
  score?: number
  durationMinutes?: number
  completedAt?: string
}

export interface SaveTestResultResponse {
  success: boolean
  savedToDatabase: boolean
  savedToLocalStorage: boolean
  error?: string
}

/**
 * Save test result to Supabase database (REQUIRED)
 * localStorage is only used as temporary cache
 * Returns detailed status so UI can show appropriate errors
 */
export async function saveTestResult(testResult: TestResult): Promise<SaveTestResultResponse> {
  console.log('[v0] Attempting to save test result to DATABASE (REQUIRED):', testResult.testType)
  
  try {
    localStorage.setItem(
      `${testResult.testType}_results`,
      JSON.stringify({
        ...testResult,
        completedAt: testResult.completedAt || new Date().toISOString(),
      })
    )
    console.log('[v0] ✓ Test result cached in localStorage (temporary)')
  } catch (localError) {
    console.error('[v0] Failed to cache in localStorage:', localError)
  }

  try {
    const response = await fetch('/api/save-test-result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        testType: testResult.testType,
        testName: testResult.testName || testResult.testType,
        results: testResult.results,
        score: testResult.score || 0,
        durationMinutes: testResult.durationMinutes || 0,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[v0] ❌ FAILED to save to DATABASE:', error)
      
      return {
        success: false,
        savedToDatabase: false,
        savedToLocalStorage: true,
        error: error.error || 'Failed to save to database'
      }
    }

    const data = await response.json()
    console.log('[v0] ✓✓✓ Test result SAVED TO DATABASE successfully')
    
    return {
      success: true,
      savedToDatabase: true,
      savedToLocalStorage: true
    }
  } catch (error: any) {
    console.error('[v0] ❌ Error saving test result to DATABASE:', error)
    
    return {
      success: false,
      savedToDatabase: false,
      savedToLocalStorage: true,
      error: error.message || 'Network error saving to database'
    }
  }
}

/**
 * Load test result from Supabase database
 * Falls back to localStorage ONLY if database is unavailable
 */
export async function loadTestResult(testType: string): Promise<any | null> {
  try {
    console.log('[v0] Loading test result from DATABASE:', testType)
    
    const response = await fetch(`/api/test-results?testType=${testType}`, {
      credentials: 'include',
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success && result.data && result.data.length > 0) {
        console.log('[v0] ✓ Test result loaded from DATABASE')
        return result.data[0]
      }
    }

    console.log('[v0] No result in database, checking localStorage cache...')
    const localData = localStorage.getItem(`${testType}_results`)
    if (localData) {
      console.log('[v0] ⚠️ Using cached localStorage data (not from database)')
      return JSON.parse(localData)
    }
    
    console.log('[v0] No test result found anywhere')
    return null
  } catch (error) {
    console.error('[v0] Error loading test result:', error)
    
    const localData = localStorage.getItem(`${testType}_results`)
    if (localData) {
      console.log('[v0] ⚠️ Using cached localStorage data (database unavailable)')
      return JSON.parse(localData)
    }
    
    return null
  }
}

/**
 * Migrate test result from localStorage to Supabase
 */
export async function migrateTestFromLocalStorage(testType: string): Promise<boolean> {
  try {
    const localData = localStorage.getItem(`${testType}_results`)
    if (!localData) {
      console.log('[v0] No local data to migrate for:', testType)
      return false
    }

    const testData = JSON.parse(localData)
    const result = await saveTestResult({
      testType,
      results: testData,
    })

    if (result.success && result.savedToDatabase) {
      console.log('[v0] ✓ Successfully migrated test to DATABASE:', testType)
      // Clear localStorage after successful migration
      localStorage.removeItem(`${testType}_results`)
      return true
    } else {
      console.error('[v0] ❌ Failed to migrate test to database:', result.error)
      return false
    }
  } catch (error) {
    console.error('[v0] Error migrating test from localStorage:', error)
    return false
  }
}
