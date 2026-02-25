export function validateEnvironment() {
  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ]

  const optionalVars = [
    "OPENAI_API_KEY",
    "VERCEL_ENV",
    "NEXT_PUBLIC_APP_URL",
  ]

  const missing: string[] = []
  const warnings: string[] = []

  // Check required variables
  for (const variable of requiredVars) {
    if (!process.env[variable]) {
      missing.push(variable)
    }
  }

  // Check optional variables
  for (const variable of optionalVars) {
    if (!process.env[variable]) {
      warnings.push(variable)
    }
  }

  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(", ")}`
    console.error(message)
    throw new Error(message)
  }

  if (warnings.length > 0) {
    console.warn(`Missing optional environment variables: ${warnings.join(", ")}`)
  }

  console.log("Environment validation passed")
}

// Validate on app startup
if (typeof window === "undefined") {
  // Server-side only
  validateEnvironment()
}
