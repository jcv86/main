'use client'

import { Card } from '@/components/ui/card'
import { MessageCircle } from 'lucide-react'

export function CoachSidebar() {
  return (
    <div className="fixed right-4 bottom-4 w-80 z-40">
      <Card className="p-4 bg-blue-50">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">Tu Coach</h3>
        </div>
        <p className="text-sm text-gray-600">Tu progreso aparecerá aquí</p>
      </Card>
    </div>
  )
}
