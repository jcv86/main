#!/usr/bin/env node

/**
 * Post-Deploy Smoke Check Script
 * Verifies critical health checks after deployment
 * Usage: node scripts/smoke-site-check.mjs
 */

const BASE_URL = "https://www.despegatucarrera.com"
const TIMEOUT = 10000 // 10 seconds

const checks = []

async function checkStatusCode(path) {
  const url = `${BASE_URL}${path}`
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
    })
    const status = response.status
    return status === 200
  } catch (error) {
    console.error(`[ERROR] Failed to check ${url}:`, error.message)
    return false
  }
}

async function checkHTML(path, searchText) {
  const url = `${BASE_URL}${path}`
  try {
    const response = await fetch(url)
    const html = await response.text()
    return !html.includes(searchText)
  } catch (error) {
    console.error(`[ERROR] Failed to fetch ${url}:`, error.message)
    return false
  }
}

async function checkMetaTag(path, tagName, attributeName, expectedValue) {
  const url = `${BASE_URL}${path}`
  try {
    const response = await fetch(url)
    const html = await response.text()
    const regex = new RegExp(
      `<${tagName}[^>]*${attributeName}="([^"]*)"[^>]*>`,
      "i"
    )
    const match = html.match(regex)
    if (!match) {
      console.error(`[ERROR] Meta tag not found in ${url}`)
      return false
    }
    const actual = match[1]
    return actual.includes(expectedValue)
  } catch (error) {
    console.error(`[ERROR] Failed to check ${url}:`, error.message)
    return false
  }
}

async function checkSitemapContains(urls) {
  const url = `${BASE_URL}/sitemap.xml`
  try {
    const response = await fetch(url)
    const xml = await response.text()
    return urls.every((url) => xml.includes(url))
  } catch (error) {
    console.error(`[ERROR] Failed to fetch sitemap:`, error.message)
    return false
  }
}

async function runChecks() {
  console.log("\n🔍 Starting Post-Deploy Smoke Checks...\n")

  // Check 1: Status Codes (200 OK)
  console.log("1️⃣  Checking HTTP Status Codes...")
  const criticalPaths = ["/", "/contact", "/como-funciona", "/para-empresas", "/auth/signin"]
  const statusChecks = await Promise.all(criticalPaths.map(checkStatusCode))
  const allStatus200 = statusChecks.every(Boolean)
  console.log(`   ${allStatus200 ? "✅ PASS" : "❌ FAIL"}: All critical paths return 200`)
  checks.push(allStatus200)

  // Check 2: No broken email-protection links
  console.log("\n2️⃣  Checking for broken email-protection links...")
  const noEmailProtectionLinks = await checkHTML("/", "/cdn-cgi/l/email-protection")
  console.log(`   ${noEmailProtectionLinks ? "✅ PASS" : "❌ FAIL"}: No /cdn-cgi/l/email-protection in home HTML`)
  checks.push(noEmailProtectionLinks)

  // Check 3: Canonical & OG URL Consistency
  console.log("\n3️⃣  Checking Canonical & OG URL Host Consistency...")
  const pagesToCheck = [
    { path: "/", name: "Home" },
    { path: "/contact", name: "Contact" },
    { path: "/como-funciona", name: "Como Funciona" },
    { path: "/para-empresas", name: "Para Empresas" },
  ]

  const hostChecks = await Promise.all(
    pagesToCheck.map(async (page) => {
      const canonicalOk = await checkMetaTag(page.path, "link", "rel", "canonical")
      const ogUrlOk = await checkMetaTag(page.path, "meta", "property", "og:url")
      const bothOk = canonicalOk && ogUrlOk
      if (!bothOk) {
        console.log(
          `   ⚠️  ${page.name}: canonical=${canonicalOk ? "✅" : "❌"}, og:url=${ogUrlOk ? "✅" : "❌"}`
        )
      }
      return bothOk
    })
  )
  const allHostsConsistent = hostChecks.every(Boolean)
  console.log(
    `   ${allHostsConsistent ? "✅ PASS" : "❌ FAIL"}: Canonical & OG URL hosts match on all pages`
  )
  checks.push(allHostsConsistent)

  // Check 4: Sitemap Contains New URLs
  console.log("\n4️⃣  Checking Sitemap Includes New Pages...")
  const newSitemapUrls = [
    `${BASE_URL}/contact`,
    `${BASE_URL}/como-funciona`,
    `${BASE_URL}/para-empresas`,
  ]
  const sitemapHasUrls = await checkSitemapContains(newSitemapUrls)
  console.log(`   ${sitemapHasUrls ? "✅ PASS" : "❌ FAIL"}: Sitemap contains all 3 new URLs`)
  checks.push(sitemapHasUrls)

  // Summary
  console.log("\n" + "=".repeat(60))
  const totalChecks = checks.length
  const passedChecks = checks.filter(Boolean).length
  const percentPass = Math.round((passedChecks / totalChecks) * 100)

  console.log(`\n📊 Results: ${passedChecks}/${totalChecks} checks passed (${percentPass}%)`)

  if (checks.every(Boolean)) {
    console.log("\n✅ All smoke checks PASSED! Ready for production.\n")
    process.exit(0)
  } else {
    console.log("\n❌ Some smoke checks FAILED! Review the issues above.\n")
    process.exit(1)
  }
}

// Run checks with timeout
setTimeout(() => {
  console.error("\n❌ Smoke checks timed out after 10 seconds!")
  process.exit(1)
}, TIMEOUT)

runChecks().catch((error) => {
  console.error("\n❌ Unexpected error:", error)
  process.exit(1)
})
