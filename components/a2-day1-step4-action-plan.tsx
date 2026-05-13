'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckSquare, Plus, Trash2 } from 'lucide-react'

interface ActionItem {
  category: string
  description: string
}

interface Step4ActionPlanProps {
  onNext: (data: {
    applications: ActionItem[]
    networking: ActionItem[]
    learning: ActionItem[]
    personal: ActionItem[]
  }) => void
  onBack: () => void
  initialData?: {
    applications: ActionItem[]
    networking: ActionItem[]
    learning: ActionItem[]
    personal: ActionItem[]
  }
}

export function A2Day1Step4ActionPlan({ onNext, onBack, initialData }: Step4ActionPlanProps) {
  const [applications, setApplications] = useState<ActionItem[]>(initialData?.applications || [{ category: 'applications', description: '' }])
  const [networking, setNetworking] = useState<ActionItem[]>(initialData?.networking || [{ category: 'networking', description: '' }])
  const [learning, setLearning] = useState<ActionItem[]>(initialData?.learning || [{ category: 'learning', description: '' }])
  const [personal, setPersonal] = useState<ActionItem[]>(initialData?.personal || [{ category: 'personal', description: '' }])

  const handleAddItem = (category: string) => {
    switch (category) {
      case 'applications':
        setApplications([...applications, { category, description: '' }])
        break
      case 'networking':
        setNetworking([...networking, { category, description: '' }])
        break
      case 'learning':
        setLearning([...learning, { category, description: '' }])
        break
      case 'personal':
        setPersonal([...personal, { category, description: '' }])
        break
    }
  }

  const handleRemoveItem = (category: string, index: number) => {
    switch (category) {
      case 'applications':
        setApplications(applications.filter((_, i) => i !== index))
        break
      case 'networking':
        setNetworking(networking.filter((_, i) => i !== index))
        break
      case 'learning':
        setLearning(learning.filter((_, i) => i !== index))
        break
      case 'personal':
        setPersonal(personal.filter((_, i) => i !== index))
        break
    }
  }

  const handleUpdateDescription = (category: string, index: number, description: string) => {
    switch (category) {
      case 'applications':
        applications[index].description = description
        setApplications([...applications])
        break
      case 'networking':
        networking[index].description = description
        setNetworking([...networking])
        break
      case 'learning':
        learning[index].description = description
        setLearning([...learning])
        break
      case 'personal':
        personal[index].description = description
        setPersonal([...personal])
        break
    }
  }

  const handleNext = () => {
    onNext({
      applications: applications.filter(a => a.description.trim()),
      networking: networking.filter(a => a.description.trim()),
      learning: learning.filter(a => a.description.trim()),
      personal: personal.filter(a => a.description.trim()),
    })
  }

  const renderCategory = (title: string, icon: React.ReactNode, items: ActionItem[], categoryKey: string, color: string) => (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 font-semibold text-white">
        {icon}
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <Textarea
              placeholder="Describe this action item"
              value={item.description}
              onChange={(e) => handleUpdateDescription(categoryKey, idx, e.target.value)}
              rows={2}
              className="flex-1 bg-slate-900/50 border-slate-700 text-white"
            />
            <Button
              onClick={() => handleRemoveItem(categoryKey, idx)}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        onClick={() => handleAddItem(categoryKey)}
        variant="outline"
        size="sm"
        className="w-full text-white/60 hover:text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add {title} Action
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Create Your Action Plan</h2>
        <p className="text-white/60">Break down your goals into specific actions across 4 key areas.</p>
      </div>

      <div className="space-y-6">
        {renderCategory('Job Applications', <CheckSquare className="w-4 h-4 text-red-400" />, applications, 'applications', 'red')}
        {renderCategory('Networking & Outreach', <CheckSquare className="w-4 h-4 text-purple-400" />, networking, 'networking', 'purple')}
        {renderCategory('Learning & Development', <CheckSquare className="w-4 h-4 text-blue-400" />, learning, 'learning', 'blue')}
        {renderCategory('Personal Growth', <CheckSquare className="w-4 h-4 text-emerald-400" />, personal, 'personal', 'emerald')}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="flex-1 bg-cyan-600 hover:bg-cyan-700"
        >
          Continue to Submission
        </Button>
      </div>
    </div>
  )
}
