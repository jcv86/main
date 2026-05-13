import { NextResponse } from "next/server"

export async function GET() {
  const envVars = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "✓ SET" : "✗ MISSING",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "✓ SET" : "✗ MISSING",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✓ SET" : "✗ MISSING",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "✗ MISSING",
    LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID ? "✓ SET" : "✗ MISSING",
    LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET ? "✓ SET" : "✗ MISSING",
  }

  return NextResponse.json({
    status: "Environment Variables Check",
    ...envVars,
    timestamp: new Date().toISOString(),
  })
}
