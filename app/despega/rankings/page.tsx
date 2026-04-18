"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ArrowLeft, Trophy, Medal, Award } from "lucide-react"

interface RankingEntry {
  user_id: string
  score_general: number
  score_pilar_a1: number
  score_pilar_a2: number
  score_aterrizaje: number
  score_base: number
  score_camino_persona: number
  score_camino_profesional: number
  rank_general: number
  profiles?: {
    full_name: string
    avatar_url: string
  }
}

const RANKING_TABS = [
  { id: "personal", name: "Mi Evolución", scoreKey: "score_general", type: "personal" },
  { id: "general", name: "Contexto Global (Opt-in)", scoreKey: "score_general", type: "global" },
  { id: "a1", name: "A1 Cerebral", scoreKey: "score_pilar_a1", type: "global" },
  { id: "a2", name: "A2 Rutas", scoreKey: "score_pilar_a2", type: "global" },
  { id: "aterrizaje", name: "Aterrizaje", scoreKey: "score_aterrizaje", type: "global" },
  { id: "base", name: "Base", scoreKey: "score_base", type: "global" },
  { id: "persona", name: "C. Persona", scoreKey: "score_camino_persona", type: "global" },
  { id: "profesional", name: "C. Profesional", scoreKey: "score_camino_profesional", type: "global" },
]

export default function RankingsPage() {
  const [loading, setLoading] = useState(true)
  const [rankings, setRankings] = useState<RankingEntry[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("personal")
  const [userHistory, setUserHistory] = useState<{ date: string; score: number }[]>([])
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setCurrentUserId(user.id)

      // Load personal history (self-comparison default)
      const { data: historyData } = await supabase
        .from("despega_user_progress_history")
        .select("date, score_general")
        .eq("user_id", user?.id)
        .order("date", { ascending: true })
        .limit(30)

      if (historyData) {
        setUserHistory(historyData.map((h: any) => ({ date: h.date, score: h.score_general })))
      }

      // Load global rankings
      const { data: rankingsData } = await supabase
        .from("despega_rankings")
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .order("score_general", { ascending: false })
        .limit(100)

      if (rankingsData) {
        setRankings(rankingsData as RankingEntry[])
      }

      setLoading(false)
    }

    loadData()
  }, [supabase])

  const getRankIcon = (position: number) => {
    if (position === 1) return <Trophy className="w-5 h-5 text-yellow-500" />
    if (position === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (position === 3) return <Award className="w-5 h-5 text-yellow" />
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-medium text-muted-foreground">#{position}</span>
  }

  const getSortedRankings = (scoreKey: string) => {
    return [...rankings].sort((a, b) => {
      const scoreA = a[scoreKey as keyof RankingEntry] as number || 0
      const scoreB = b[scoreKey as keyof RankingEntry] as number || 0
      return scoreB - scoreA
    })
  }

  const getCurrentUserRank = (scoreKey: string) => {
    const sorted = getSortedRankings(scoreKey)
    return sorted.findIndex(r => r.user_id === currentUserId) + 1
  }

  const getCurrentUserScore = (scoreKey: string) => {
    const user = rankings.find(r => r.user_id === currentUserId)
    return user ? (user[scoreKey as keyof RankingEntry] as number || 0) : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 to-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple/50" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-950 to-muted/90">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/despega" className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 mb-4 font-medium">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver al Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[28px] bg-gradient-to-br from-yellow-500 to-purple-600 flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Rankings Despega</h1>
              <p className="text-muted/30 font-medium">Compite y mejora junto a la comunidad</p>
            </div>
          </div>
        </div>

        {/* Your Position Card */}
        <Card className="mb-8 bg-gradient-to-r from-purple/50/10 to-muted/50/10 border-2 border-purple/50/30 dark:border-purple/40/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted/30 font-medium">Tu posición actual</p>
                <p className="text-4xl font-bold text-white">#{getCurrentUserRank(RANKING_TABS.find(t => t.id === activeTab)?.scoreKey || "score_general")}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted/30 font-medium">Puntos</p>
                <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue/40 bg-clip-text">
                  {getCurrentUserScore(RANKING_TABS.find(t => t.id === activeTab)?.scoreKey || "score_general")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rankings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex-wrap h-auto gap-1 bg-muted/50 p-1">
            {RANKING_TABS.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="text-xs md:text-sm flex-1 min-w-fit"
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {RANKING_TABS.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <Card>
                <CardHeader>
                  <CardTitle>Top 100 - {tab.name}</CardTitle>
                  <CardDescription>
                    Los mejores usuarios en {tab.name.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getSortedRankings(tab.scoreKey).map((entry, index) => {
                      const position = index + 1
                      const isCurrentUser = entry.user_id === currentUserId
                      const score = entry[tab.scoreKey as keyof RankingEntry] as number || 0

                      return (
                        <div 
                          key={entry.user_id}
                          className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                            isCurrentUser 
                              ? "bg-primary/10 border border-primary/20" 
                              : position <= 3 
                                ? "bg-muted/50" 
                                : "hover:bg-muted/30"
                          }`}
                        >
                          <div className="w-8 flex justify-center">
                            {getRankIcon(position)}
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={entry.profiles?.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback>
                              {entry.profiles?.full_name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${isCurrentUser ? "text-primary" : ""}`}>
                              {entry.profiles?.full_name || "Usuario Anónimo"}
                              {isCurrentUser && <Badge variant="outline" className="ml-2 text-xs">Tú</Badge>}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{score}</p>
                            <p className="text-xs text-muted-foreground">puntos</p>
                          </div>
                        </div>
                      )
                    })}

                    {rankings.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No hay usuarios en el ranking todavía.</p>
                        <p className="text-sm">¡Sé el primero en completar misiones!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
