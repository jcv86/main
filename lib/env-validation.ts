export function validateEnvironment() {
  // Only validate required variables
  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ]

  // Optional variables that enhance functionality but aren't required
  // Only warn about these in production
  const optionalVarsForProduction = [
    "OPENAI_API_KEY",
  ]

  const missing: string[] = []
  const isProduction = process.env.VERCEL_ENV === "production"

  // Check required variables
  for (const variable of requiredVars) {
    if (!process.env[variable]) {
      missing.push(variable)
    }
  }

  // Check optional variables only in production
  const missingOptional: string[] = []
  if (isProduction) {
    for (const variable of optionalVarsForProduction) {
      if (!process.env[variable]) {
        missingOptional.push(variable)
      }
    }
  }

  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(", ")}`
    console.error(message)
    throw new Error(message)
  }

  if (missingOptional.length > 0) {
    console.warn(
      `Missing optional environment variables in production: ${missingOptional.join(", ")}. App will work but some features may be limited.`
    )
  }

  const env = isProduction ? "production" : "development"
  console.log(`Environment validation passed (${env} mode)`)
}

// Validate on app startup (server-side only)
if (typeof window === "undefined") {
  validateEnvironment()
}
