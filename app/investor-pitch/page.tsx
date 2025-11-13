import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Investor Pitch - Despega Tu Carrera | Professional Development Platform",
  description:
    "Investment opportunity: AI-powered professional development platform revolutionizing career growth in Latin America",
  robots: {
    index: false,
    follow: false,
  },
}

export default function InvestorPitch() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-7xl flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-purple-600 hover:text-purple-700">
            ← Back to Home
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Investor Pitch Sheet</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 rounded-3xl p-12 text-white mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="text-purple-100 text-sm font-semibold mb-2 uppercase tracking-wide">
              Investment Opportunity
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Despega Tu Carrera</h1>
            <p className="text-2xl text-purple-100 mb-6">
              Democratizing Professional Development in Latin America through AI
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <div className="text-sm text-purple-100">Launch Date</div>
                <div className="text-2xl font-bold">Q1 2026</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <div className="text-sm text-purple-100">Market</div>
                <div className="text-2xl font-bold">Chile (LATAM)</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <div className="text-sm text-purple-100">Stage</div>
                <div className="text-2xl font-bold">Pre-Launch</div>
              </div>
            </div>
          </div>
        </div>

        {/* The Problem */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
              <span className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl">🎯</span>
              The Problem
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-100">
                <h3 className="font-bold text-lg mb-3 text-gray-900">Limited Access</h3>
                <p className="text-gray-700">
                  Professional development tools are expensive and inaccessible to most Chilean professionals. Career
                  coaching costs $100-300+ per session.
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100">
                <h3 className="font-bold text-lg mb-3 text-gray-900">Fragmented Solutions</h3>
                <p className="text-gray-700">
                  Tests, books, and coaching are scattered across multiple platforms. No unified solution exists for
                  comprehensive career development.
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-red-50 rounded-xl p-6 border border-yellow-100">
                <h3 className="font-bold text-lg mb-3 text-gray-900">No Personalization</h3>
                <p className="text-gray-700">
                  Generic advice doesn't consider individual personalities, strengths, or local market conditions in
                  Chile and LATAM.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Solution */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 shadow-lg text-white">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm">
                ✨
              </span>
              Our Solution
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              An all-in-one AI-powered professional development platform that combines scientifically-validated
              assessments, world-class content, and personalized coaching - accessible to everyone.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-3">🧠</div>
                <h3 className="font-bold text-lg mb-2">Cerebro AI System</h3>
                <p className="text-purple-100 text-sm">
                  GPT-4 powered coach with semantic search across 120+ books and 100+ Chilean market resources
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold text-lg mb-2">6 Psychometric Tests</h3>
                <p className="text-purple-100 text-sm">
                  DISC, MBTI, Big Five, RIASEC, EQ, and Soft Skills assessments with AI-generated insights
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="font-bold text-lg mb-2">Professional Library</h3>
                <p className="text-purple-100 text-sm">
                  120+ full-text books on leadership, productivity, EQ, and career development
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Market Opportunity */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
              <span className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">📈</span>
              Market Opportunity
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-100">
                <h3 className="font-bold text-2xl mb-4 text-gray-900">Chile Market</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>9.5M+ professionals</strong> in Chilean workforce
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>$2.4B+</strong> professional development market size
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>73% internet penetration</strong> with growing digital adoption
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>High education rate</strong> - 60%+ university-educated
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-bold text-2xl mb-4 text-gray-900">LATAM Expansion</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>280M+ professionals</strong> across LATAM region
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>$65B+ market</strong> for professional training in LATAM
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>15% CAGR</strong> in e-learning and digital education
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Shared language & culture</strong> enables rapid expansion
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
              <h3 className="font-bold text-xl mb-3 text-gray-900">Growth Trends</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">AI-First</div>
                  <p className="text-sm text-gray-600">Gen Z & Millennials demand AI-powered solutions</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">Remote Work</div>
                  <p className="text-sm text-gray-600">Increased need for self-directed professional development</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">Skills Gap</div>
                  <p className="text-sm text-gray-600">Companies investing heavily in employee upskilling</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Business Model */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
              <span className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">💰</span>
              Business Model
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                <h3 className="font-bold text-xl mb-4 text-gray-900">Freemium (Launch)</h3>
                <div className="text-3xl font-bold text-purple-600 mb-2">$0</div>
                <ul className="space-y-2 text-gray-700 text-sm mb-4">
                  <li>✓ All 6 psychometric tests</li>
                  <li>✓ Full library access (120+ books)</li>
                  <li>✓ Basic AI coaching</li>
                  <li>✓ Results & insights</li>
                </ul>
                <p className="text-xs text-gray-600">Builds user base & gathers data for product-market fit</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-bold text-xl mb-4 text-gray-900">Premium Individual</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">$29/mo</div>
                <ul className="space-y-2 text-gray-700 text-sm mb-4">
                  <li>✓ Everything in Free</li>
                  <li>✓ Unlimited AI coaching sessions</li>
                  <li>✓ Advanced analytics & tracking</li>
                  <li>✓ Career path simulations</li>
                  <li>✓ Priority support</li>
                </ul>
                <p className="text-xs text-gray-600">Target: 5-10% conversion from free users</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-purple-50 rounded-xl p-6 border border-emerald-100">
                <h3 className="font-bold text-xl mb-4 text-gray-900">Enterprise (B2B)</h3>
                <div className="text-3xl font-bold text-emerald-600 mb-2">Custom</div>
                <ul className="space-y-2 text-gray-700 text-sm mb-4">
                  <li>✓ Team dashboards & analytics</li>
                  <li>✓ Bulk assessments</li>
                  <li>✓ White-label options</li>
                  <li>✓ Integration with HR systems</li>
                  <li>✓ Dedicated support</li>
                </ul>
                <p className="text-xs text-gray-600">Target large Chilean companies & HR consultancies</p>
              </div>
            </div>
          </div>
        </section>

        {/* Competitive Advantage */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
              <span className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">🚀</span>
              Competitive Advantage
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-5 border border-purple-100">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">🧠 Advanced AI Technology</h3>
                  <p className="text-gray-700 text-sm">
                    Proprietary Cerebro system with semantic search across 120+ books. Competitors offer basic chatbots
                    without personalized knowledge bases.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">🇨🇱 Chilean Market Expertise</h3>
                  <p className="text-gray-700 text-sm">
                    Built specifically for Chilean professionals with local job market data, INE statistics, and
                    ChileValora integration. Global competitors lack local context.
                  </p>
                </div>

                <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-100">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">📊 Complete Assessment Suite</h3>
                  <p className="text-gray-700 text-sm">
                    6 scientifically-validated tests in one platform. Competitors typically offer 1-2 tests, requiring
                    users to use multiple platforms.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-orange-50 rounded-lg p-5 border border-orange-100">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">💡 All-in-One Platform</h3>
                  <p className="text-gray-700 text-sm">
                    Tests + Library + AI Coaching in a single platform. Users currently need 3-4 different subscriptions
                    costing $100+ total monthly.
                  </p>
                </div>

                <div className="bg-pink-50 rounded-lg p-5 border border-pink-100">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">⚡ Modern Tech Stack</h3>
                  <p className="text-gray-700 text-sm">
                    Built with Next.js 15, React 19, PostgreSQL with pgvector. Competitors use outdated technology with
                    slower, less intelligent systems.
                  </p>
                </div>

                <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">🎯 Freemium Access</h3>
                  <p className="text-gray-700 text-sm">
                    Full access to core features for free. Competitors charge $50-300 upfront, limiting accessibility
                    and market penetration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Traction & Roadmap */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
              <span className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">📅</span>
              Development & Roadmap
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-green-600 pl-6 bg-green-50 py-4 rounded-r-xl">
                <h3 className="font-bold text-xl mb-2 text-gray-900">✅ Completed (Current State)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Full platform development complete - 185 database tables</li>
                  <li>• 6 psychometric tests with AI-powered analysis</li>
                  <li>• Cerebro AI system with semantic search operational</li>
                  <li>• 120+ books integrated with full-text access</li>
                  <li>• GDPR-compliant infrastructure</li>
                  <li>• 15+ administrative monitoring systems</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-600 pl-6 py-4">
                <h3 className="font-bold text-xl mb-2 text-gray-900">Q1 2026 - Official Launch</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Public platform release in Chile</li>
                  <li>• Marketing campaign & SEO optimization</li>
                  <li>• User acquisition: Target 1,000 users in 3 months</li>
                  <li>• Gather product-market fit data</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-600 pl-6 py-4">
                <h3 className="font-bold text-xl mb-2 text-gray-900">Q2-Q4 2026</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Launch Premium Individual tier ($29/mo)</li>
                  <li>• Mobile apps (iOS & Android)</li>
                  <li>• Enterprise B2B product development</li>
                  <li>• Begin conversations with major Chilean companies</li>
                  <li>• Target: 10,000 free users, 500 paid users</li>
                </ul>
              </div>

              <div className="border-l-4 border-emerald-600 pl-6 py-4">
                <h3 className="font-bold text-xl mb-2 text-gray-900">2027 - LATAM Expansion</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Expand to Argentina, Peru, Colombia, Mexico</li>
                  <li>• Multi-language support (Portuguese for Brazil)</li>
                  <li>• Enterprise contracts with Fortune 500 LATAM subsidiaries</li>
                  <li>• Target: 100,000 users, $2M ARR</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
              <span className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">👥</span>
              Team
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                <div className="w-20 h-20 bg-purple-200 rounded-full flex items-center justify-center text-3xl font-bold text-purple-700 mb-4">
                  JC
                </div>
                <h3 className="font-bold text-2xl mb-2 text-gray-900">Joaquin Covarrubias</h3>
                <div className="text-purple-600 font-semibold mb-3">Founder & CEO</div>
                <p className="text-gray-700 mb-4">
                  Visionary entrepreneur with deep understanding of the Chilean professional development market. Secured
                  initial funding and provided strategic direction for platform development.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    Business Strategy
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Market Research</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Fundraising</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-6 border border-blue-100">
                <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center text-3xl font-bold text-blue-700 mb-4">
                  TC
                </div>
                <h3 className="font-bold text-2xl mb-2 text-gray-900">Travis Comber</h3>
                <div className="text-blue-600 font-semibold mb-3">CTO & Lead Developer</div>
                <p className="text-gray-700 mb-4">
                  Fullstack developer who architected and built the entire platform from scratch. Expert in Next.js,
                  React, AI integration, and scalable system design. Responsible for all technical implementation.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Fullstack Development
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">AI Integration</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">System Architecture</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Ask */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white shadow-xl">
            <h2 className="text-4xl font-bold mb-6">Investment Opportunity</h2>
            <p className="text-xl text-purple-100 mb-8">
              We're seeking strategic investors to accelerate growth, expand our team, and scale across LATAM.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="font-bold text-2xl mb-2">Use of Funds</h3>
                <ul className="space-y-2 text-purple-100 text-sm">
                  <li>• Marketing & user acquisition (40%)</li>
                  <li>• Team expansion (30%)</li>
                  <li>• Product development (20%)</li>
                  <li>• Operations & infrastructure (10%)</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="font-bold text-2xl mb-2">12-Month Targets</h3>
                <ul className="space-y-2 text-purple-100 text-sm">
                  <li>• 25,000 registered users</li>
                  <li>• 2,000 paying subscribers</li>
                  <li>• 10 enterprise clients</li>
                  <li>• $500K ARR</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="font-bold text-2xl mb-2">Exit Strategy</h3>
                <ul className="space-y-2 text-purple-100 text-sm">
                  <li>• Acquisition by EdTech leader</li>
                  <li>• HR Tech acquisition target</li>
                  <li>• Potential strategic buyers: LinkedIn, Coursera, Udemy</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <h3 className="text-2xl font-bold mb-4">Why Invest Now?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <div className="font-bold mb-1">Fully Built Platform</div>
                    <div className="text-purple-100 text-sm">
                      No development risk - ready to launch and scale immediately
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <div className="font-bold mb-1">Large Addressable Market</div>
                    <div className="text-purple-100 text-sm">$65B+ LATAM market with 15% annual growth</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <div className="font-bold mb-1">Clear Monetization</div>
                    <div className="text-purple-100 text-sm">Proven freemium model with B2B enterprise opportunity</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <div className="font-bold mb-1">AI-First Advantage</div>
                    <div className="text-purple-100 text-sm">
                      Proprietary AI technology that competitors will take years to replicate
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center">
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Let's Talk</h2>
            <p className="text-xl text-gray-600 mb-8">
              Interested in learning more? We'd love to discuss this opportunity with you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:joaquin@despegatucarrera.cl"
                className="px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                Contact Joaquin (CEO)
              </a>
              <Link
                href="/whitepaper"
                className="px-8 py-4 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                View Technical Whitepaper
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 text-center text-gray-600 border-t border-gray-200">
        <p className="mb-2">
          <strong>Despega Tu Carrera</strong> - Democratizing Professional Development in LATAM
        </p>
        <p>Joaquin Covarrubias (Founder & CEO) • Travis Comber (CTO & Lead Developer)</p>
      </footer>
    </div>
  )
}
