/**
 * Gamification System Verification Script
 * Tests all gamification APIs and components
 */

const ENDPOINTS = {
  global: '/api/gamification/global',
  rankings: '/api/gamification/rankings',
  a2Progress: '/api/gamification/a2-progress',
  claimReward: '/api/gamification/claim-reward',
  activityTimeline: '/api/gamification/activity-timeline',
  profileEnhancement: '/api/user/profile-enhancement',
  dtcWallet: '/api/dtc/wallet',
  recalculateRankings: '/api/gamification/recalculate-rankings',
}

interface TestResult {
  endpoint: string
  method: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  duration: number
}

const results: TestResult[] = []

async function testEndpoint(name: string, endpoint: string, method: string = 'GET', body?: any) {
  const start = Date.now()
  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const duration = Date.now() - start
    const data = await response.json()

    const result: TestResult = {
      endpoint: name,
      method,
      duration,
      status: response.ok ? 'pass' : 'fail',
      message: response.ok ? 'Success' : `HTTP ${response.status}: ${data.error || 'Unknown error'}`,
    }

    results.push(result)
    return result
  } catch (error) {
    const duration = Date.now() - start
    results.push({
      endpoint: name,
      method,
      duration,
      status: 'fail',
      message: `Network error: ${error instanceof Error ? error.message : 'Unknown'}`,
    })
  }
}

async function runTests() {
  console.log('🎮 Gamification System Test Suite')
  console.log('================================\n')

  // Test GET endpoints
  console.log('Testing GET endpoints...')
  await testEndpoint('Global Stats', ENDPOINTS.global)
  await testEndpoint('Rankings', ENDPOINTS.rankings + '?limit=10')
  await testEndpoint('A2 Progress', ENDPOINTS.a2Progress)
  await testEndpoint('Activity Timeline', ENDPOINTS.activityTimeline + '?limit=20')
  await testEndpoint('Profile Enhancement', ENDPOINTS.profileEnhancement)
  await testEndpoint('DTC Wallet', ENDPOINTS.dtcWallet)

  // Test POST endpoints (these should fail without auth, but we can verify they exist)
  console.log('\nTesting POST endpoints...')
  await testEndpoint('Claim Reward', ENDPOINTS.claimReward, 'POST', {
    routeId: 'test',
    xpAmount: 100,
    dtcAmount: 50,
  })
  await testEndpoint('Recalculate Rankings', ENDPOINTS.recalculateRankings, 'POST', {})

  // Print summary
  console.log('\n📊 Test Summary')
  console.log('===============')
  const passed = results.filter((r) => r.status === 'pass').length
  const failed = results.filter((r) => r.status === 'fail').length
  const warnings = results.filter((r) => r.status === 'warning').length

  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`⚠️  Warnings: ${warnings}`)
  console.log(`⏱️  Average Response Time: ${Math.round(results.reduce((a, b) => a + b.duration, 0) / results.length)}ms\n`)

  // Detailed results
  console.log('📋 Detailed Results')
  console.log('==================')
  results.forEach((result) => {
    const icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌'
    console.log(`${icon} ${result.endpoint} (${result.method})`)
    console.log(`   ${result.message} (${result.duration}ms)`)
  })

  console.log('\n✨ Test suite completed!')
}

// Export for use in other files
export { testEndpoint, runTests, ENDPOINTS }

// Run if executed directly
if (require.main === module) {
  runTests().catch(console.error)
}
