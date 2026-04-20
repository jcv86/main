'use client'

import { Resource } from '@/lib/supabase/resource-library'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Clock, Zap } from 'lucide-react'

interface ResourceCardProps {
  resource: Resource
}

// Get icon based on resource type
const getResourceIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    'Template': '📋',
    'Article': '📝',
    'Course': '🎓',
    'Video': '🎥',
    'Video Course': '🎬',
    'Tool': '🛠️',
    'Platform': '💼',
    'Report': '📊',
    'Database': '📚',
    'Certificate': '🏆',
  }
  return iconMap[type] || '🔗'
}

// Get difficulty level color
const getDifficultyColor = (level?: string) => {
  const colorMap: Record<string, string> = {
    'Beginner': 'bg-green-500/20 text-green-300 border-green-500/30',
    'Intermediate': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'Advanced': 'bg-red-500/20 text-red-300 border-red-500/30',
  }
  return colorMap[level || 'Beginner'] || 'bg-blue-500/20 text-blue-300 border-blue-500/30'
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const icon = getResourceIcon(resource.resource_type)

  return (
    <Card className="bg-muted/40 border-muted/60 hover:border-muted/80 transition overflow-hidden group">
      <div className="p-4 space-y-3">
        {/* Header with icon and type */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1">
            <span className="text-2xl flex-shrink-0">{icon}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-white text-sm leading-tight group-hover:text-blue-300 transition">
                {resource.title}
              </h3>
            </div>
          </div>
          <Badge variant="outline" className="text-xs flex-shrink-0">
            {resource.resource_type}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs text-white/70 line-clamp-2">
          {resource.description}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap gap-2">
          {resource.difficulty_level && (
            <Badge className={`text-xs border ${getDifficultyColor(resource.difficulty_level)}`}>
              <Zap className="w-3 h-3 mr-1" />
              {resource.difficulty_level}
            </Badge>
          )}
          {resource.estimated_time && (
            <Badge variant="outline" className="text-xs text-white/70">
              <Clock className="w-3 h-3 mr-1" />
              {resource.estimated_time}
            </Badge>
          )}
        </div>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {resource.tags.map(tag => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <Button
          asChild
          className="w-full mt-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xs h-8"
        >
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            Ir al recurso
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </Button>

        {/* Verified badge */}
        {resource.verified && (
          <div className="text-xs text-white/50 text-center">
            ✓ Verificado
          </div>
        )}
      </div>
    </Card>
  )
}
