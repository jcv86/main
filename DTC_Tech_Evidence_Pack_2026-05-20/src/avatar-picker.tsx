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
    { id: 'professional-1', name: 'Professional', description: 'Classic professional look', emoji: '👔', color: 'bg-blue' },
    { id: 'creative-1', name: 'Creative', description: 'Modern creative style', emoji: '', color: 'bg-purple' },
    { id: 'tech-1', name: 'Tech', description: 'Tech-savvy appearance', emoji: '', color: 'bg-green' },
    { id: 'business-1', name: 'Business', description: 'Corporate executive', emoji: '🏢', color: 'bg-red' },
    { id: 'casual-1', name: 'Casual', description: 'Relaxed casual style', emoji: '😎', color: 'bg-orange' },
    { id: 'formal-1', name: 'Formal', description: 'Formal business attire', emoji: '🎩', color: 'bg-muted' },
  ]

  const interviewerAvatars: AvatarOption[] = [
    { id: 'interviewer-classic-1', name: 'Sofia', description: 'HR Specialist', emoji: '👩‍', color: 'bg-purple' },
    { id: 'interviewer-classic-2', name: 'Marco', description: 'Tech Lead', emoji: '👨‍', color: 'bg-blue' },
    { id: 'interviewer-classic-3', name: 'Elena', description: 'Executive', emoji: '👩‍', color: 'bg-purple' },
    { id: 'interviewer-classic-4', name: 'David', description: 'Team Manager', emoji: '👨‍', color: 'bg-green' },
    { id: 'interviewer-modern-1', name: 'Alex', description: 'Career Coach', emoji: '🧑‍🏫', color: 'bg-red' },
    { id: 'interviewer-modern-2', name: 'Jordan', description: 'Recruiter', emoji: '', color: 'bg-orange' },
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
    <Card className="w-full border-muted/20 dark:border-muted/80">
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
        <div className="flex flex-col items-center justify-center py-8 px-6 bg-background">
          <div className="w-32 h-32 rounded-full flex items-center justify-center text-6xl mb-4 bg-background">
            {selected?.emoji}
          </div>
          <h3 className="text-2xl font-bold text-muted/90 dark:text-white">{selected?.name}</h3>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1">{selected?.description}</p>
        </div>

        {/* Avatar Gallery */}
        <div>
          <p className="text-sm font-semibold text-muted-foreground dark:text-white/85 mb-3">Opciones disponibles</p>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
            {avatars.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => handleSelect(avatar.id)}
                className={`relative group flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 ${
                  selectedAvatar === avatar.id
                    ? `bg-background`
                    : 'bg-muted/10 dark:bg-transparent hover:bg-muted/20 dark:hover:bg-muted/70'
                }`}
              >
                <div className="text-3xl">{avatar.emoji}</div>
                
                {selectedAvatar === avatar.id && (
                  <div className="absolute top-1 right-1 bg-transparent rounded-full p-1">
                    <Check className="w-4 h-4 text-green" />
                  </div>
                )}

                <span className="text-xs font-medium text-center leading-tight text-muted-foreground dark:text-white/85 group-hover:text-muted/90 dark:group-hover:text-white">
                  {avatar.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="p-3 bg-blue/5 dark:bg-blue/30 rounded-[28px] border border-blue/20 dark:border-blue">
          <p className="text-xs text-blue dark:text-blue-300">
             Tu avatar {type === 'user' ? 'aparecerá en tus respuestas y feedback' : 'conducirá la entrevista y mostrará expresiones realistas'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
