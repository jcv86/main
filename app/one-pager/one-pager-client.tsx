"use client"

import Link from "next/link"

export default function OnePagerClient() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - Print-friendly */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8 no-print">
        <div className="container mx-auto px-4 max-w-5xl flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold hover:text-purple-100">
            ← Back to Home
          </Link>
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
          >
            📄 Print / Download PDF
          </button>
        </div>
      </header>

      {/* Main Content - Single Page */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white">
          {/* Header Section */}
          <div className="border-b-4 border-purple-600 pb-6 mb-6">
            <h1 className="text-5xl font-bold mb-2 text-gray-900">Despega Tu Carrera</h1>
            <p className="text-2xl text-purple-600 font-semibold mb-4">
              AI-Powered Professional Development Platform for Latin America
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-700">Launch:</span>
                <span className="text-gray-600">Q1 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-700">Market:</span>
                <span className="text-gray-600">Chile → LATAM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-700">Founder:</span>
                <span className="text-gray-600">Joaquin Covarrubias</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-700">CTO:</span>
                <span className="text-gray-600">Travis Comber</span>
              </div>
            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* The Problem */}
              <section>
                <h2 className="text-xl font-bold mb-3 text-gray-900 border-l-4 border-red-500 pl-3">The Problem</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    • <strong>Expensive:</strong> Career coaching costs $100-300/session, inaccessible to most Chilean
                    professionals
                  </li>
                  <li>
                    • <strong>Fragmented:</strong> Tests, books, and coaching scattered across multiple platforms
                  </li>
                  <li>
                    • <strong>Generic:</strong> No personalization based on individual personality or local market
                    conditions
                  </li>
                </ul>
              </section>

              {/* The Solution */}
              <section>
                <h2 className="text-xl font-bold mb-3 text-gray-900 border-l-4 border-purple-500 pl-3">Our Solution</h2>
                <p className="text-sm text-gray-700 mb-3">
                  All-in-one AI-powered platform combining scientifically-validated assessments, world-class content,
                  and personalized coaching - accessible to everyone.
                </p>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div>
                      <div className="text-2xl mb-1">🧠</div>
                      <div className="font-bold text-gray-900">Cerebro AI</div>
                      <div className="text-gray-600">GPT-4 Coach</div>
                    </div>
                    <div>
                      <div className="text-2xl mb-1">📊</div>
                      <div className="font-bold text-gray-900">6 Tests</div>
                      <div className="text-gray-600">Psychometric</div>
                    </div>
                    <div>
                      <div className="text-2xl mb-1">📚</div>
                      <div className="font-bold text-gray-900">120+ Books</div>
                      <div className="text-gray-600">Professional</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Key Features */}
              <section>
                <h2 className="text-xl font-bold mb-3 text-gray-900 border-l-4 border-blue-500 pl-3">Core Features</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    • <strong>Cerebro AI System:</strong> Semantic search across 120+ books + 100+ Chilean resources
                  </li>
                  <li>
                    • <strong>6 Psychometric Tests:</strong> DISC, MBTI, Big Five, RIASEC, EQ, Soft Skills
                  </li>
                  <li>
                    • <strong>Professional Library:</strong> Full-text access to leadership, productivity, EQ books
                  </li>
                  <li>
                    • <strong>AI-Powered Insights:</strong> Personalized career analysis & development plans
                  </li>
                  <li>
                    • <strong>Chilean Market Data:</strong> INE statistics, ChileValora, LinkedIn trends
                  </li>
                </ul>
              </section>

              {/* Technology Stack */}
              <section>
                <h2 className="text-xl font-bold mb-3 text-gray-900 border-l-4 border-emerald-500 pl-3">Technology</h2>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 rounded p-2 border border-gray-200">
                    <div className="font-bold text-gray-900 mb-1">Frontend</div>
                    <div className="text-gray-600">Next.js 15, React 19, TypeScript, Tailwind</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2 border border-gray-200">
                    <div className="font-bold text-gray-900 mb-1">Backend</div>
                    <div className="text-gray-600">Node.js, PostgreSQL, Supabase</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2 border border-gray-200">
                    <div className="font-bold text-gray-900 mb-1">AI</div>
                    <div className="text-gray-600">OpenAI GPT-4, pgvector search</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2 border border-gray-200">
                    <div className="font-bold text-gray-900 mb-1">Infrastructure</div>
                    <div className="text-gray-600">Vercel Edge, Global CDN</div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Market Opportunity */}
              <section>
                <h2 className="text-xl font-bold mb-3 text-gray-900 border-l-4 border-emerald-500 pl-3">
                  Market Opportunity
                </h2>
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100 mb-3">
                  <div className="text-center mb-3">
                    <div className="text-3xl font-bold text-emerald-600">$65B+</div>
                    <div className="text-xs text-gray-600">LATAM Professional Development Market</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-700">
                    <div>
                      <strong>Chile:</strong> 9.5M+ professionals
                    </div>
                    <div>
                      <strong>LATAM:</strong> 280M+ professionals
                    </div>
                    <div>
                      <strong>Growth:</strong> 15% CAGR
                    </div>
                    <div>
                      <strong>Digital:</strong> 73% penetration
                    </div>
                  </div>
                </div>
              </section>

              {/* Business Model */}
              <section>
                <h2 className="text-xl font-bold mb-3 text-gray-900 border-l-4 border-blue-500 pl-3">Business Model</h2>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-purple-50 rounded p-3 border border-purple-100">
                    <div className="font-bold text-gray-900 mb-1">Freemium</div>
                    <div className="text-2xl font-bold text-purple-600 mb-1">$0</div>
                    <div className="text-gray-600">All tests + library + basic AI</div>
                  </div>
                  <div className="bg-blue-50 rounded p-3 border border-blue-100">
                    <div className="font-bold text-gray-900 mb-1">Premium</div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">$29/mo</div>
                    <div className="text-gray-600">Unlimited AI + advanced analytics</div>
                  </div>
                  <div className="bg-emerald-50 rounded p-3 border border-emerald-100">
                    <div className="font-bold text-gray-900 mb-1">Enterprise</div>
                    <div className="text-2xl font-bold text-emerald-600 mb-1">Custom</div>
                    <div className="text-gray-600">Team dashboards + HR integration</div>
                  </div>
                </div>
              </section>

              {/* Competitive Advantage */}
              <section>
                <h2 className="text-xl font-bold mb-3 text-gray-900 border-l-4 border-orange-500 pl-3">
                  Why Choose Us?
                </h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    • <strong>All-in-One:</strong> Tests + Library + AI Coaching (competitors require 3-4 subscriptions)
                  </li>
                  <li>
                    • <strong>Advanced AI:</strong> Proprietary Cerebro system with semantic search
                  </li>
                  <li>
                    • <strong>Chilean Expertise:</strong> Built specifically for local market with INE/ChileValora data
                  </li>
                  <li>
                    • <strong>Complete Suite:</strong> 6 psychometric tests vs competitors' 1-2 tests
                  </li>
                  <li>
                    • <strong>Accessible:</strong> Freemium model vs $50-300 upfront fees
                  </li>
                  <li>
                    • <strong>Modern Tech:</strong> Next.js 15 + React 19 + AI-first architecture
                  </li>
                </ul>
              </section>

              {/* Roadmap */}
              <section>
                <h2 className="text-xl font-bold mb-3 text-gray-900 border-l-4 border-purple-500 pl-3">Roadmap</h2>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-purple-600 min-w-[80px]">Q1 2026:</span>
                    <span className="text-gray-700">Public launch, 1K users in 3 months</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 min-w-[80px]">Q2-Q4 2026:</span>
                    <span className="text-gray-700">Premium tier, mobile apps, enterprise B2B, 10K users</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600 min-w-[80px]">2027:</span>
                    <span className="text-gray-700">LATAM expansion (ARG, PER, COL, MEX), 100K users, $2M ARR</span>
                  </div>
                </div>
              </section>

              {/* Metrics */}
              <section>
                <h2 className="text-xl font-bold mb-3 text-gray-900 border-l-4 border-blue-500 pl-3">
                  Platform Metrics
                </h2>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 rounded p-2 border border-gray-200">
                    <div className="font-bold text-gray-900">185 Database Tables</div>
                    <div className="text-gray-600">Comprehensive data architecture</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2 border border-gray-200">
                    <div className="font-bold text-gray-900">~60% RAG Coverage</div>
                    <div className="text-gray-600">Semantic search queries</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2 border border-gray-200">
                    <div className="font-bold text-gray-900">GDPR Compliant</div>
                    <div className="text-gray-600">Full data protection</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2 border border-gray-200">
                    <div className="font-bold text-gray-900">15+ Admin Systems</div>
                    <div className="text-gray-600">Complete monitoring</div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Bottom Section - Full Width */}
          <div className="border-t-2 border-gray-200 pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Team */}
              <section>
                <h2 className="text-lg font-bold mb-3 text-gray-900">Team</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-bold text-gray-900">Joaquin Covarrubias</div>
                    <div className="text-purple-600 text-xs">Founder & CEO</div>
                    <div className="text-gray-600 text-xs">Business strategy, market research, funding</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Travis Comber</div>
                    <div className="text-blue-600 text-xs">CTO & Lead Developer</div>
                    <div className="text-gray-600 text-xs">Full platform development from scratch</div>
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-lg font-bold mb-3 text-gray-900">Contact</h2>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>
                    <strong>Email:</strong> joaquin@despegatucarrera.cl
                  </div>
                  <div>
                    <strong>Website:</strong> despegatucarrera.cl
                  </div>
                  <div>
                    <strong>Location:</strong> Santiago, Chile
                  </div>
                  <div className="text-xs text-gray-600 mt-3">
                    For investor inquiries, technical whitepaper, or product demo, please contact Joaquin Covarrubias.
                  </div>
                </div>
              </section>

              {/* Key Stats Summary */}
              <section>
                <h2 className="text-lg font-bold mb-3 text-gray-900">Quick Stats</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Status:</span>
                    <span className="font-bold text-green-600">✓ Complete</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Launch Target:</span>
                    <span className="font-bold text-purple-600">Q1 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target Market:</span>
                    <span className="font-bold text-gray-900">9.5M+ pros</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue Model:</span>
                    <span className="font-bold text-gray-900">B2C + B2B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">12-Month Goal:</span>
                    <span className="font-bold text-emerald-600">$500K ARR</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-600">
            <p>
              <strong>Despega Tu Carrera</strong> - Democratizing Professional Development in Latin America
            </p>
            <p className="mt-1">© 2026 Despega Tu Carrera. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
