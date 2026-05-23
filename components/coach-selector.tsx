"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, FileText, MessageSquare, TrendingUp, RefreshCw } from "lucide-react"
import { PROMPT_CATEGORIES, type PromptCategoryId } from "@/lib/ai/prompt-categories"

interface CoachSelectorProps {
  onSelect: (categoryId: PromptCategoryId) => void
}

export function CoachSelector({ onSelect }: CoachSelectorProps) {
  const categories = [
    {
      id: "autoconocimiento_proposito" as PromptCategoryId,
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-[rgba(80,160,170,0.5)]/10",
      borderColor: "hover:border-pink-300",
      coach: "Sofía",
    },
    {
      id: "cv_linkedin_marca" as PromptCategoryId,
      icon: FileText,
      color: "text-blue",
      bgColor: "bg-blue/10",
      borderColor: "hover:border-blue/30",
      coach: "Dani",
    },
    {
      id: "entrevistas_comunicacion" as PromptCategoryId,
      icon: MessageSquare,
      color: "text-purple",
      bgColor: "bg-purple/10",
      borderColor: "hover:border-purple/30",
      coach: "Sofía & Dani",
    },
    {
      id: "crecimiento_salarial" as PromptCategoryId,
      icon: TrendingUp,
      color: "text-green",
      bgColor: "bg-green/10",
      borderColor: "hover:border-green/30",
      coach: "Sofía & Dani",
    },
    {
      id: "reinvencion_transicion" as PromptCategoryId,
      icon: RefreshCw,
      color: "text-orange",
      bgColor: "bg-orange/10",
      borderColor: "hover:border-orange/30",
      coach: "Sofía & Dani",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">¿En qué te puedo ayudar?</h2>
        <p className="text-sm text-muted-foreground">Selecciona el área donde necesitas orientación</p>
      </div>

      <div className="space-y-3">
        {categories.map((category) => {
          const categoryData = PROMPT_CATEGORIES[category.id]
          const Icon = category.icon

          return (
            <Card
              key={category.id}
              className={`border-2 ${category.borderColor} transition-colors cursor-pointer`}
              onClick={() => onSelect(category.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full ${category.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${category.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{categoryData.name}</CardTitle>
                    <CardDescription className="text-xs">{category.coach}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{categoryData.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default CoachSelector
