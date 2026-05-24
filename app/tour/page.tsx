'use client';

import SiteTourVideo from '@/components/site-tour-video';

export default function TourPage() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
            120-Second Site Tour
          </h1>
          <p className="text-white/70 text-lg">
            Complete walkthrough of Despega Tu Carrera focusing on the A3 Training module and Interview Coaching
          </p>
        </div>

        {/* Video Player */}
        <SiteTourVideo />

        {/* Sections Overview */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Tour Sections</h2>
            <ul className="space-y-2 text-white/80">
              <li className="flex gap-2">
                <span className="text-[rgb(80,160,170)]">1.</span>
                <span><strong>Login & Authentication</strong> - Demo login flow</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[rgb(80,160,170)]">2.</span>
                <span><strong>Dashboard Overview</strong> - User readiness score (85/100)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[rgb(80,160,170)]">3.</span>
                <span><strong>A3 Training Module</strong> - Main entry point</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[rgb(80,160,170)]">4.</span>
                <span><strong>Training Routes</strong> - 10 modules, 3 months, 1,340 XP</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[rgb(80,160,170)]">5.</span>
                <span><strong>Coach Practice Room</strong> ⭐ Interactive interview coaching</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Key Features</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-[rgba(80,160,170,0.1)] border border-[rgba(80,160,170,0.2)]">
                <p className="text-[rgb(80,160,170)] font-bold mb-1">Interview Questions</p>
                <p className="text-white/80 text-sm">3 core questions with AI coaching feedback</p>
              </div>
              <div className="p-4 rounded-lg bg-[rgba(80,160,170,0.1)] border border-[rgba(80,160,170,0.2)]">
                <p className="text-[rgb(80,160,170)] font-bold mb-1">CV Builder Studio</p>
                <p className="text-white/80 text-sm">5 modules for ATS optimization & recruitment</p>
              </div>
              <div className="p-4 rounded-lg bg-[rgba(80,160,170,0.1)] border border-[rgba(80,160,170,0.2)]">
                <p className="text-[rgb(80,160,170)] font-bold mb-1">Gamification</p>
                <p className="text-white/80 text-sm">XP rewards, badges, and progress tracking</p>
              </div>
              <div className="p-4 rounded-lg bg-[rgba(80,160,170,0.1)] border border-[rgba(80,160,170,0.2)]">
                <p className="text-[rgb(80,160,170)] font-bold mb-1">AI Coach Integration</p>
                <p className="text-white/80 text-sm">Real-time feedback and improvement suggestions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Coaching Details */}
        <div className="bg-[rgba(80,160,170,0.05)] border border-[rgba(80,160,170,0.2)] rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Coach Practice Room - Interview Coaching</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-[rgb(80,160,170)] font-bold">Question 1</h3>
              <p className="text-white/80 text-sm">
                "Cuéntame sobre ti" (Tell me about yourself)
              </p>
              <p className="text-white/60 text-xs">Practice structure, relevance, duration, and specific details</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-[rgb(80,160,170)] font-bold">Question 2</h3>
              <p className="text-white/80 text-sm">
                "¿Por qué quieres trabajar aquí?" (Why work here?)
              </p>
              <p className="text-white/60 text-xs">Research, cultural fit, motivation alignment</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-[rgb(80,160,170)] font-bold">Question 3</h3>
              <p className="text-white/80 text-sm">
                "Cuéntame sobre una situación desafiante..." (Challenging situation)
              </p>
              <p className="text-white/60 text-xs">STAR method, problem-solving, impact demonstration</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-black/30 rounded border border-[rgba(80,160,170,0.1)]">
            <p className="text-white/70 text-sm">
              <strong>Practice Loop:</strong> Answer → Receive AI Feedback → Review Criteria → Improve & Re-answer → Continue
            </p>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-[rgba(80,160,170,0.05)] border border-[rgba(80,160,170,0.2)] rounded-lg p-4 text-center">
            <div className="text-2xl font-black text-[rgb(80,160,170)]">119s</div>
            <p className="text-white/70 text-sm mt-1">Tour Duration</p>
          </div>
          <div className="bg-[rgba(80,160,170,0.05)] border border-[rgba(80,160,170,0.2)] rounded-lg p-4 text-center">
            <div className="text-2xl font-black text-[rgb(80,160,170)]">15</div>
            <p className="text-white/70 text-sm mt-1">Key Sections</p>
          </div>
          <div className="bg-[rgba(80,160,170,0.05)] border border-[rgba(80,160,170,0.2)] rounded-lg p-4 text-center">
            <div className="text-2xl font-black text-[rgb(80,160,170)]">90</div>
            <p className="text-white/70 text-sm mt-1">Day Journey</p>
          </div>
          <div className="bg-[rgba(80,160,170,0.05)] border border-[rgba(80,160,170,0.2)] rounded-lg p-4 text-center">
            <div className="text-2xl font-black text-[rgb(80,160,170)]">100%</div>
            <p className="text-white/70 text-sm mt-1">Spanish</p>
          </div>
        </div>
      </div>
    </main>
  );
}
