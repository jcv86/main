'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Check, Sparkles } from 'lucide-react'

interface AvatarOption {
  id: string
  name: string
  description: string
  emoji: string
  color: string
}

interface AvatarPickerProps {
  type: 'user' | 'interviewer'
  value?: string
  onChange?: (avatarId: string) => void
  title?: string
  description?: string
}

export function AvatarPicker({
  type,
  value,
  onChange,
  title,
  description
}: AvatarPickerProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(value || '')
  const [avatars, setAvatars] = useState<AvatarOption[]>([])
  const [loading, setLoading] = useState(true)

  const userAvatars: AvatarOption[] = [
    { id: 'professional-1', name: 'Professional', description: 'Classic professional look', emoji: '👔', color: 'from-blue-500 to-blue-600' },
    { id: 'creative-1', name: 'Creative', description: 'Modern creative style', emoji: '🎨', color: 'from-purple-500 to-purple-600' },
    { id: 'tech-1', name: 'Tech', description: 'Tech-savvy appearance', emoji: '💻', color: 'from-green-500 to-green-600' },
    { id: 'business-1', name: 'Business', description: 'Corporate executive', emoji: '🏢', color: 'from-red-500 to-red-600' },
    { id: 'casual-1', name: 'Casual', description: 'Relaxed casual style', emoji: '😎', color: 'from-orange-500 to-orange-600' },
    { id: 'formal-1', name: 'Formal', description: 'Formal business attire', emoji: '🎩', color: 'from-slate-700 to-slate-900' },
  ]

  const interviewerAvatars: AvatarOption[] = [
    { id: 'interviewer-classic-1', name: 'Sofia', description: 'HR Specialist', emoji: '👩‍💼', color: 'from-purple-500 to-purple-600' },
    { id: 'interviewer-classic-2', name: 'Marco', description: 'Tech Lead', emoji: '👨‍💻', color: 'from-blue-500 to-blue-600' },
    { id: 'interviewer-classic-3', name: 'Elena', description: 'Executive', emoji: '👩‍💼', color: 'from-purple-500 to-indigo-600' },
    { id: 'interviewer-classic-4', name: 'David', description: 'Team Manager', emoji: '👨‍💼', color: 'from-green-500 to-emerald-600' },
    { id: 'interviewer-modern-1', name: 'Alex', description: 'Career Coach', emoji: '🧑‍🏫', color: 'from-red-500 to-rose-600' },
    { id: 'interviewer-modern-2', name: 'Jordan', description: 'Recruiter', emoji: '🎯', color: 'from-orange-500 to-yellow-600' },
  ]

  useEffect(() => {
    setAvatars(type === 'user' ? userAvatars : interviewerAvatars)
    if (!selectedAvatar) {
      setSelectedAvatar(type === 'user' ? 'professional-1' : 'interviewer-classic-1')
    }
    setLoading(false)
  }, [type])

  const selected = avatars.find(a => a.id === selectedAvatar)

  const handleSelect = (avatarId: string) => {
    setSelectedAvatar(avatarId)
    onChange?.(avatarId)
  }

  if (loading) return null

  return (
    <Card className="w-full border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          {title || (type === 'user' ? 'Elige tu Avatar' : 'Selecciona tu Entrevistador')}
        </CardTitle>
        <CardDescription>
          {description || (type === 'user' 
            ? 'Cómo deseas presentarte en las entrevistas' 
            : 'Elige quién te entrevistará')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Preview Section */}
        <div className="flex flex-col items-center justify-center py-8 px-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl mb-4 bg-gradient-to-br ${selected?.color} shadow-lg ring-4 ring-offset-2 ring-slate-200 dark:ring-slate-700 ring-offset-slate-50 dark:ring-offset-slate-900 transition-all duration-300`}>
            {selected?.emoji}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{selected?.name}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{selected?.description}</p>
        </div>

        {/* Avatar Gallery */}
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Opciones disponibles</p>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
            {avatars.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => handleSelect(avatar.id)}
                className={`relative group flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 ${
                  selectedAvatar === avatar.id
                    ? `bg-gradient-to-br ${avatar.color} text-white shadow-lg ring-2 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900`
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <div className="text-3xl">{avatar.emoji}</div>
                
                {selectedAvatar === avatar.id && (
                  <div className="absolute top-1 right-1 bg-white dark:bg-slate-900 rounded-full p-1">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                )}

                <span className="text-xs font-medium text-center leading-tight text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                  {avatar.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-[28px] border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            💡 Tu avatar {type === 'user' ? 'aparecerá en tus respuestas y feedback' : 'conducirá la entrevista y mostrará expresiones realistas'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
