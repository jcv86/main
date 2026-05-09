'use client'

import { Skill } from '@/app/despega/a3/data/mock-dashboard'

interface SkillsGridProps {
  skills: Skill[]
}

export function SkillsGrid({ skills }: SkillsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      {skills.map((skill) => (
        <div key={skill.id} className="space-y-2 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-white text-sm">{skill.name}</h4>
            <span className="text-xs font-mono text-training">{skill.value}%</span>
          </div>
          
          <p className="text-xs text-white/60">{skill.description}</p>
          
          {/* Mini progress bar */}
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-training to-training/60 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(skill.value, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
