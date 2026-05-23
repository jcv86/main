import { Metadata } from 'next'
import { JobMatchingResults } from './job-matching-results'

export const metadata: Metadata = {
  title: 'Job Matching - A4 Aterrizaje | Despega Tu Carrera',
  description: 'Intelligent job matching based on your skills, experience, and profile.',
}

export default function JobMatchingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-900">Job Matching</h1>
            <p className="text-lg text-slate-600">
              Find jobs that match your skills, experience, and career goals
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Info Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
            <p className="text-sm text-slate-600">Match accuracy powered by AI analysis of your profile</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">Smart</div>
            <p className="text-sm text-slate-600">Algorithm learns from your skills, tests, and experience</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">Real-time</div>
            <p className="text-sm text-slate-600">Updated daily with latest job openings in your field</p>
          </div>
        </div>

        {/* Main Content */}
        <JobMatchingResults />
      </div>
    </main>
  )
}
