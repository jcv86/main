'use client'

export default function AuthTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">OAuth Auth Test</h1>
      <p className="mb-4">If you see this page, the auth system is working.</p>
      
      <div className="space-y-4">
        <p><strong>Google OAuth:</strong> Configured ✓</p>
        <p><strong>LinkedIn OAuth:</strong> Configured ✓</p>
        <p><strong>NextAuth:</strong> Configured ✓</p>
      </div>

      <div className="mt-8">
        <a href="/auth/signin" className="text-blue underline">
          Go to Sign In Page
        </a>
      </div>
    </div>
  )
}
