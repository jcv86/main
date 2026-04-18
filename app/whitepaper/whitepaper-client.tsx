"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

interface Stats {
  users: number
  testsCompleted: number
  booksAvailable: number
  satisfactionPercentage: number
}

export function WhitepaperClient() {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    testsCompleted: 0,
    booksAvailable: 0,
    satisfactionPercentage: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/whitepaper-stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] Error loading stats:", error)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-7xl flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-purple hover:text-purple">
            ← Volver a Inicio
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Technical Whitepaper</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Title Section */}
        <div className="bg-gradient-to-r from-purple to-blue rounded-2xl p-12 text-white mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Despega Tu Carrera Platform</h1>
          <p className="text-2xl mb-6 text-purple/10">Technical Whitepaper v1.0</p>
          <div className="flex flex-col gap-2 text-purple/10">
            <p className="text-lg">
              <strong className="text-white">Developed by:</strong> Travis Comber, Fullstack Developer
            </p>
            <p className="text-lg">
              <strong className="text-white">Project Owner & Funding:</strong> Joaquin Covarrubias
            </p>
            <p className="text-lg">
              <strong className="text-white">Publication Date:</strong> September 26, 2025
            </p>
            <p className="text-lg">
              <strong className="text-white">Launch Target:</strong> Q1 2026
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Executive Summary</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Despega Tu Carrera (DTC) is Chile's leading AI-powered professional development platform, designed to
            democratize access to career growth tools through cutting-edge technology and psychological assessment
            frameworks. The platform combines scientifically-validated psychometric assessments, an extensive
            professional library, and advanced AI coaching to provide personalized career guidance at scale.
          </p>

          <div className="bg-gradient-to-r from-purple/5 to-blue/5 rounded-xl p-8 border border-purple/10">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Platform Capabilities</h3>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Cerebro - Brain System */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-purple/20">
                <div className="text-3xl mb-3">🧠</div>
                <h4 className="text-xl font-bold mb-3 text-purple">Cerebro (Brain System)</h4>
                <p className="text-gray-700 mb-4 text-sm">
                  Advanced AI reasoning system powered by GPT-4 with semantic search capabilities
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-purple mt-1">•</span>
                    <span>pgvector semantic search across 120+ books</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple mt-1">•</span>
                    <span>100+ curated web resources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple mt-1">•</span>
                    <span>Contextual understanding of user profiles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple mt-1">•</span>
                    <span>Memory system for conversation continuity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple mt-1">•</span>
                    <span>~60% of queries answered via RAG</span>
                  </li>
                </ul>
              </div>

              {/* AI Coach */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-blue/20">
                <div className="text-3xl mb-3">💬</div>
                <h4 className="text-xl font-bold mb-3 text-blue">AI Coach</h4>
                <p className="text-gray-700 mb-4 text-sm">
                  Personalized career coaching powered by GPT-4 with deep psychological insights
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue mt-1">•</span>
                    <span>Career path recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue mt-1">•</span>
                    <span>Skill gap analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue mt-1">•</span>
                    <span>Development planning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue mt-1">•</span>
                    <span>Book recommendations based on profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue mt-1">•</span>
                    <span>Chilean job market insights</span>
                  </li>
                </ul>
              </div>

              {/* Psychometric Tests */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-green/20">
                <div className="text-3xl mb-3">📊</div>
                <h4 className="text-xl font-bold mb-3 text-green">6 Psychometric Tests</h4>
                <p className="text-gray-700 mb-4 text-sm">
                  Scientifically-validated assessments with AI-powered analysis
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green mt-1">•</span>
                    <span>DISC (Despega Cerebral)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green mt-1">•</span>
                    <span>MBTI (Mapa de Personalidad)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green mt-1">•</span>
                    <span>Big Five (5 Dimensiones)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green mt-1">•</span>
                    <span>RIASEC (Brújula Vocacional)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green mt-1">•</span>
                    <span>Emotional Intelligence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green mt-1">•</span>
                    <span>Soft Skills (Competencias Despega)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Additional Platform Features */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
                <h4 className="text-lg font-bold mb-3 text-orange-600">📚 Professional Library</h4>
                <p className="text-gray-700 text-sm">
                  120+ professional development books with full-text access, progress tracking, highlights, notes, and
                  intelligent recommendations
                </p>
              </div>

              <div className="bg-gradient-to-br from-red/5 to-purple-50 rounded-lg p-6 border border-red/20">
                <h4 className="text-lg font-bold mb-3 text-red">🎯 Personalized Insights</h4>
                <p className="text-gray-700 text-sm">
                  AI-generated career analysis, percentile rankings, radar charts, development plans, and tailored
                  recommendations based on complete psychometric profile
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Table of Contents</h2>
          <nav className="grid md:grid-cols-2 gap-4">
            {[
              "Technical Architecture",
              "Core Features",
              "Psychometric Assessment System",
              "AI Coaching System",
              "Professional Library",
              "Administrative Systems",
              "Database Architecture",
              "Security & Compliance",
              "Performance & Monitoring",
              "Future Roadmap",
            ].map((section, i) => (
              <a
                key={i}
                href={`#section-${i + 1}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple/5 transition-colors group"
              >
                <span className="w-8 h-8 bg-purple/10 rounded-full flex items-center justify-center text-purple font-semibold group-hover:bg-purple group-hover:text-white transition-colors">
                  {i + 1}
                </span>
                <span className="text-gray-700 group-hover:text-purple transition-colors">{section}</span>
              </a>
            ))}
          </nav>
        </section>

        {/* Section 1: Technical Architecture */}
        <section id="section-1" className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">1. Technical Architecture</h2>

          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Technology Stack</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue/5 to-purple-50 rounded-lg p-6 border border-blue/10">
              <h4 className="font-bold text-lg mb-3 text-gray-900">Frontend</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Next.js 15.2.4 (React 19)</li>
                <li>• TypeScript 5.x</li>
                <li>• Tailwind CSS 3.4</li>
                <li>• shadcn/ui components</li>
                <li>• SWR for data fetching</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green/5 to-blue/5 rounded-lg p-6 border border-emerald-100">
              <h4 className="font-bold text-lg mb-3 text-gray-900">Backend</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Node.js (Next.js API)</li>
                <li>• PostgreSQL (Supabase)</li>
                <li>• Supabase Auth</li>
                <li>• Vercel Blob Storage</li>
                <li>• OpenAI GPT-4</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple/5 to-pink-50 rounded-lg p-6 border border-purple/10">
              <h4 className="font-bold text-lg mb-3 text-gray-900">Infrastructure</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Vercel Edge Network</li>
                <li>• Supabase PostgreSQL</li>
                <li>• pgvector for AI search</li>
                <li>• Global CDN</li>
                <li>• Built-in analytics</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Architecture Patterns</h3>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-purple rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  <strong className="text-gray-900">Server-First Architecture:</strong> Leverages Next.js 15 server
                  components for optimal performance
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-purple rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  <strong className="text-gray-900">RESTful API Design:</strong> Organized routes by resource with
                  server actions for mutations
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-purple rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  <strong className="text-gray-900">Database Design:</strong> PostgreSQL with pgvector, Row Level
                  Security, and materialized views
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-purple rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  <strong className="text-gray-900">Edge Functions:</strong> Global low-latency responses via Vercel
                  Edge Network
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2: Core Features */}
        <section id="section-2" className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">2. Core Features</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-purple pl-6 py-2">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Landing Page & SEO</h3>
              <p className="text-gray-700">
                Fully optimized landing page with comprehensive meta tags, structured data (JSON-LD), and OpenGraph
                integration for maximum discoverability in the Chilean market.
              </p>
            </div>

            <div className="border-l-4 border-blue pl-6 py-2">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Authentication System</h3>
              <p className="text-gray-700">
                Secure authentication powered by Supabase with email/password, magic links, OAuth support, JWT sessions,
                and automatic token refresh.
              </p>
            </div>

            <div className="border-l-4 border-emerald-600 pl-6 py-2">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">User Dashboard</h3>
              <p className="text-gray-700">
                Personalized dashboard showing recent test results, reading progress, AI coaching conversations, and
                recommended next steps with comprehensive progress tracking.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Psychometric Assessment System */}
        <section id="section-3" className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">3. Psychometric Assessment System</h2>

          <p className="text-lg text-gray-700 mb-6">
            The platform offers 6 scientifically-validated psychometric assessments, each designed to provide unique
            insights into professional development:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: "Despega Cerebral (DISC)",
                description: "Understanding workplace behavior patterns and communication styles",
                dimensions: ["Dominance", "Influence", "Steadiness", "Conscientiousness"],
                color: "purple",
              },
              {
                name: "Mapa de Personalidad (MBTI)",
                description: "Identifying personality type and cognitive preferences",
                dimensions: ["16 personality types", "E/I, S/N, T/F, J/P dimensions", "Career alignment analysis"],
                color: "blue",
              },
              {
                name: "5 Dimensiones (Big Five)",
                description: "Measuring core personality dimensions with percentile rankings",
                dimensions: ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"],
                color: "emerald",
              },
              {
                name: "Brújula Vocacional (RIASEC)",
                description: "Vocational interest identification using Holland's theory",
                dimensions: ["Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"],
                color: "orange",
              },
              {
                name: "Inteligencia Emocional",
                description: "Assessing emotional intelligence competencies with detailed feedback",
                dimensions: ["Self-Awareness", "Self-Regulation", "Social Awareness", "Relationship Management"],
                color: "pink",
              },
              {
                name: "Competencias Despega",
                description: "Evaluating 15 professional soft skills critical for career success",
                dimensions: ["Leadership", "Communication", "Problem-solving", "Teamwork", "Adaptability"],
                color: "indigo",
              },
            ].map((test, i) => (
              <div key={i} className={`bg-${test.color}-50 rounded-lg p-6 border border-${test.color}-100`}>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{test.name}</h3>
                <p className="text-gray-700 mb-4">{test.description}</p>
                <div className="space-y-1">
                  {test.dimensions.map((dim, j) => (
                    <div key={j} className="text-sm text-gray-600">
                      • {dim}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-r from-purple/5 to-blue/5 rounded-lg p-6 border border-purple/10">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Results Visualization & Analysis</h3>
            <p className="text-gray-700 mb-4">
              Each assessment provides comprehensive results with AI-powered insights:
            </p>
            <ul className="grid md:grid-cols-2 gap-3">
              <li className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 bg-purple rounded-full"></span>
                Interactive radar & bar charts
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 bg-purple rounded-full"></span>
                Percentile rankings vs population
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 bg-purple rounded-full"></span>
                AI-generated detailed analysis
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 bg-purple rounded-full"></span>
                Personalized career recommendations
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 bg-purple rounded-full"></span>
                Customized development plans
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 bg-purple rounded-full"></span>
                PDF export capability
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 bg-purple rounded-full"></span>
                Strength & growth area identification
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 bg-purple rounded-full"></span>
                Historical tracking & comparison
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4: AI Coaching System */}
        <section id="section-4" className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">4. AI Coaching System</h2>

          <div className="bg-gradient-to-r from-blue to-purple-600 rounded-lg p-8 text-white mb-6">
            <h3 className="text-2xl font-bold mb-4">Cerebro AI (Brain System)</h3>
            <p className="text-lg text-blue/5 mb-4">
              Advanced AI reasoning system powered by GPT-4 with Retrieval-Augmented Generation (RAG)
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="font-semibold mb-2">Semantic Search</div>
                <div className="text-sm text-blue/10">pgvector search across 120+ professional books</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="font-semibold mb-2">Multi-source Knowledge</div>
                <div className="text-sm text-blue/10">Integrated with 100+ curated web resources</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="font-semibold mb-2">Contextual Understanding</div>
                <div className="text-sm text-blue/10">Analyzes complete psychometric profile & history</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="font-semibold mb-2">Memory System</div>
                <div className="text-sm text-blue/10">Remembers past conversations for continuity</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="font-semibold mb-2">RAG Coverage</div>
                <div className="text-sm text-blue/10">~60% of queries answered using semantic search</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="font-semibold mb-2">Adaptive Learning</div>
                <div className="text-sm text-blue/10">Improves recommendations based on feedback</div>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Coaching Capabilities</h3>
          <div className="space-y-4">
            {[
              {
                title: "Personalized Career Guidance",
                description:
                  "Career path recommendations based on psychometric profile, skill gap analysis, Chilean job market trends, industry insights, and salary expectations",
              },
              {
                title: "Development Planning",
                description:
                  "Customized development plans with book recommendations from the library, skill priorities based on assessment results, realistic timelines, and progress tracking",
              },
              {
                title: "Intelligent Book Recommendations",
                description:
                  "AI-powered suggestions based on career goals, complete psychometric profile, reading history, specific challenges, and identified growth areas",
              },
              {
                title: "Problem Solving & Support",
                description:
                  "Expert guidance for career transitions, leadership development, conflict resolution, work-life balance, interview preparation, and salary negotiation",
              },
              {
                title: "Profile-Based Insights",
                description:
                  "Leverages DISC, MBTI, Big Five, RIASEC, Emotional Intelligence, and Soft Skills results to provide deeply personalized and accurate recommendations",
              },
            ].map((feature, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h4 className="font-bold text-lg mb-2 text-gray-900">{feature.title}</h4>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gradient-to-br from-green/5 to-blue/5 rounded-lg p-6 border border-emerald-100">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Technical Implementation</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green mt-1">•</span>
                <span>
                  <strong>Vector Search:</strong> pgvector extension enables semantic search across all book content
                  with cosine similarity matching
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green mt-1">•</span>
                <span>
                  <strong>Embeddings:</strong> OpenAI text-embedding-3-small model generates 1536-dimension vectors for
                  semantic matching
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green mt-1">•</span>
                <span>
                  <strong>Context Building:</strong> Retrieves relevant book passages, web resources, and user profile
                  data to build comprehensive context
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green mt-1">•</span>
                <span>
                  <strong>Reasoning:</strong> GPT-4 synthesizes retrieved information with user context to provide
                  accurate, personalized guidance
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 5: Professional Library */}
        <section id="section-5" className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">5. Professional Library</h2>

          <p className="text-lg text-gray-700 mb-6">
            Full-text access to 120+ professional development books, making world-class content accessible to all
            Chilean professionals.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { category: "Leadership", count: "25+" },
              { category: "Productivity", count: "20+" },
              { category: "Emotional Intelligence", count: "15+" },
              { category: "Communication", count: "15+" },
              { category: "Personal Development", count: "20+" },
              { category: "Business & Strategy", count: "15+" },
              { category: "Career Development", count: "10+" },
            ].map((cat, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-blue/5 to-purple-50 rounded-lg p-4 border border-blue/10 text-center"
              >
                <div className="text-3xl font-bold text-purple mb-1">{cat.count}</div>
                <div className="text-gray-700 font-medium">{cat.category}</div>
              </div>
            ))}
          </div>

          <div className="bg-green/5 rounded-lg p-6 border border-emerald-100">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Reading Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Progress Tracking</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Automatic bookmarks</li>
                  <li>• Reading time calculation</li>
                  <li>• Chapter completion tracking</li>
                  <li>• Overall progress percentage</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Highlights & Notes</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Save favorite quotes</li>
                  <li>• Personal reflections</li>
                  <li>• Tag and categorize</li>
                  <li>• Share or keep private</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Administrative Systems */}
        <section id="section-6" className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">6. Administrative Systems</h2>

          <p className="text-lg text-gray-700 mb-6">
            Sophisticated administrative tools for monitoring, management, and optimization:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              "User Management",
              "Metrics Dashboard",
              "KPI Dashboard",
              "Platform Brain Management",
              "Prompt Management & A/B Testing",
              "Autopublish System",
              "Canary Deployments",
              "Coaching Analytics",
              "Executive Summary",
              "Cron Job Monitoring",
              "Severity Thresholds",
              "Content Licenses",
              "Data Retention",
              "DSAR Management",
              "Version History",
            ].map((system, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <span className="w-8 h-8 bg-purple/10 rounded-full flex items-center justify-center text-purple font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-gray-700 font-medium">{system}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Database Architecture */}
        <section id="section-7" className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">7. Database Architecture</h2>

          <div className="bg-gradient-to-r from-blue/5 to-purple-50 rounded-lg p-6 border border-blue/10 mb-6">
            <div className="text-4xl font-bold text-purple mb-2">185 Tables</div>
            <p className="text-gray-700">Comprehensive PostgreSQL database with pgvector for semantic search</p>
          </div>

          <h3 className="text-xl font-semibold mb-4 text-gray-800">Key Architectural Decisions</h3>
          <div className="space-y-3 mb-6">
            {[
              "Normalized Design: Minimizes data redundancy",
              "Semantic Search: pgvector extension for AI embeddings",
              "Row Level Security: Data protection at database level",
              "Materialized Views: Pre-computed aggregations for performance",
              "JSONB Fields: Flexible storage for dynamic data",
            ].map((decision, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <span className="w-2 h-2 bg-purple rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-gray-700">{decision}</span>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold mb-4 text-gray-800">Performance Optimizations</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green/5 rounded-lg p-5 border border-emerald-100">
              <h4 className="font-bold mb-3 text-gray-900">Indexes</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• ivfflat indexes for vector search</li>
                <li>• B-tree indexes for queries</li>
                <li>• Composite indexes for joins</li>
              </ul>
            </div>
            <div className="bg-blue/5 rounded-lg p-5 border border-blue/10">
              <h4 className="font-bold mb-3 text-gray-900">Materialized Views</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Pre-computed coaching analytics</li>
                <li>• Aggregated user metrics</li>
                <li>• Refreshed daily</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 8: Security & Compliance */}
        <section id="section-8" className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">8. Security & Compliance</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-red-50 rounded-lg p-6 border border-red-100">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Authentication & Authorization</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• JWT-based sessions</li>
                <li>• Role-Based Access Control (RBAC)</li>
                <li>• Permission system</li>
                <li>• Session expiry & refresh</li>
              </ul>
            </div>
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Data Protection</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Encryption at rest & in transit</li>
                <li>• Row Level Security (RLS)</li>
                <li>• Input sanitization</li>
                <li>• API rate limiting</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">GDPR Compliance</h3>
            <p className="text-green-100 mb-4">The platform is fully GDPR-compliant with:</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Right to Access (data download)",
                "Right to Erasure (complete deletion)",
                "Right to Rectification (data correction)",
                "Right to Portability (export)",
                "Privacy by Design",
                "Data Minimization",
                "Retention Policies",
                "Complete Audit Trails",
              ].map((right, i) => (
                <div key={i} className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-sm">{right}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 9: Performance & Monitoring */}
        <section id="section-9" className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">9. Performance & Monitoring</h2>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { metric: "Page Load", target: "< 2s", color: "purple" },
              { metric: "API Response", target: "< 500ms", color: "blue" },
              { metric: "Error Rate", target: "< 0.1%", color: "emerald" },
              { metric: "Database Query", target: "< 100ms", color: "orange" },
              { metric: "Uptime", target: "> 99.9%", color: "pink" },
              { metric: "Time to Interactive", target: "< 3s", color: "indigo" },
            ].map((perf, i) => (
              <div key={i} className={`bg-${perf.color}-50 rounded-lg p-4 border border-${perf.color}-100 text-center`}>
                <div className="text-sm text-gray-600 mb-1">{perf.metric}</div>
                <div className={`text-2xl font-bold text-${perf.color}-600`}>{perf.target}</div>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold mb-4 text-gray-800">Optimization Techniques</h3>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <ul className="grid md:grid-cols-2 gap-3">
              {[
                "Server-Side Rendering",
                "Code Splitting",
                "Image Optimization",
                "Database Indexing",
                "Multi-level Caching",
                "CDN Distribution",
              ].map((tech, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <span className="w-2 h-2 bg-purple rounded-full"></span>
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 10: Future Roadmap */}
        <section id="section-10" className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">10. Future Roadmap</h2>

          <div className="bg-gradient-to-r from-purple/10 to-blue/10 rounded-xl p-6 mb-8 border border-purple/20">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900">Official Platform Launch: Q1 2026</h3>
            </div>
            <p className="text-gray-700">
              The platform is scheduled for public release in Q1 2026 with all core features operational: 6 psychometric
              assessments, 120+ professional books, AI coaching system, and full GDPR compliance.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-purple pl-6">
              <h3 className="text-xl font-bold mb-3 text-gray-900">Q2 2026</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Native iOS and Android mobile applications</li>
                <li>• Voice conversations with AI coach for hands-free guidance</li>
                <li>• Professional networking features to connect with peers</li>
                <li>• Enhanced analytics dashboards with predictive insights</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue pl-6">
              <h3 className="text-xl font-bold mb-3 text-gray-900">Q3-Q4 2026</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Enterprise features: team dashboards, bulk assessments, comparative analytics</li>
                <li>• Marketplace for premium content and specialized courses</li>
                <li>• Multi-language support: English and Portuguese for LATAM expansion</li>
                <li>• Predictive analytics based on Chilean job market trends</li>
              </ul>
            </div>

            <div className="border-l-4 border-emerald-600 pl-6">
              <h3 className="text-xl font-bold mb-3 text-gray-900">2027 & Beyond</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Advanced AI features: career path simulation, skill gap predictions</li>
                <li>• Full career services: resume building, job matching with Chilean companies</li>
                <li>• Structured learning paths with professional certifications</li>
                <li>• Integration with major Chilean HR platforms and recruitment systems</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="bg-gradient-to-r from-purple to-blue rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Conclusion</h2>
          <p className="text-lg text-purple/10 mb-6 leading-relaxed">
            Despega Tu Carrera represents a significant advancement in democratizing professional development for
            Chilean professionals. By combining scientifically-validated psychometric assessments, comprehensive
            professional literature, and cutting-edge AI technology, the platform provides personalized guidance at a
            scale previously impossible.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Key Achievements</h3>
            <ul className="space-y-2 text-purple/10">
              <li>• Complete fullstack platform built from scratch with modern architecture</li>
              <li>• 6 scientifically-validated psychometric assessments with AI-powered analysis</li>
              <li>• Advanced Cerebro AI system with semantic search across 120+ books</li>
              <li>• 185-table PostgreSQL database with pgvector for semantic search</li>
              <li>• Full GDPR compliance with robust data protection and audit trails</li>
              <li>• 15+ administrative systems for monitoring and management</li>
              <li>• Server-first architecture leveraging Next.js 15 and React 19</li>
              <li>• Scheduled launch: Q1 2026</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Acknowledgments</h3>
            <p className="text-purple/10 mb-4">
              This platform was made possible through the vision and support of{" "}
              <strong className="text-white">Joaquin Covarrubias</strong>, who provided the funding, mentorship, and
              strategic guidance necessary to bring this ambitious project to life.
            </p>
            <p className="text-purple/10">
              As the fullstack developer, I, <strong className="text-white">Travis Comber</strong>, am proud to have
              architected and implemented this comprehensive platform from scratch, integrating cutting-edge
              technologies to create a seamless, powerful, and accessible tool for professional growth in Chile.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 border-t border-gray-200 pt-8">
          <p className="mb-2">
            <strong>Document Version:</strong> 1.0 | <strong>Published:</strong> September 26, 2025
          </p>
          <p className="mb-4">
            <strong>Developed by:</strong> Travis Comber, Fullstack Developer | <strong>Project Owner:</strong> Joaquin
            Covarrubias
          </p>
          <p className="mb-4">
            <strong>Launch Target:</strong> Q1 2026
          </p>
          <Link href="/" className="text-purple hover:text-purple font-medium">
            ← Volver a Despega Tu Carrera
          </Link>
        </footer>
      </main>
    </div>
  )
}
