'use client'

import { useEffect, useState } from 'react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { GamificationProfile } from '@/components/gamification-profile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function GamificationPage() {
  const { user, loading: authLoading } = useAuthRedirect()
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `/api/gamification/profile?userId=${user.id}`
        )
        const data = await response.json()

        if (response.ok) {
          setProfileData(data)
        }
      } catch (error) {
        console.error('Error fetching gamification profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user?.id])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-training/50" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-muted/5 py-12">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-training">Interview Mastery</h1>
            <p className="text-muted-foreground mt-2">Track your progress and unlock achievements</p>
          </div>
          <Link href="/despega/a3/dtc-shop">
            <Button className="rounded-[20px] bg-training hover:bg-training/90 text-white">Get Premium Tips</Button>
          </Link>
        </div>

        {/* Gamification Profile */}
        {profileData ? (
          <GamificationProfile
            userId={user?.id || ''}
            level={profileData.current_level || 'Bronze'}
            currentXp={profileData.current_xp || 0}
            totalXp={profileData.total_xp || 0}
            streak={profileData.interview_streak || 0}
            bestStreak={profileData.best_interview_streak || 0}
            interviewsCompleted={profileData.total_interviews_completed || 0}
            badges={profileData.badges || []}
            totalTipsEarned={profileData.total_tips_earned_free + profileData.total_tips_earned_premium || 0}
          />
        ) : (
          <Card className="rounded-[2px] border-2 border-training/40">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                Comenzar your first interview to unlock achievements and begin climbing the ranks!
              </p>
              <Link href="/despega/a3/simulaciones-estructurada">
                <Button className="mt-4">Comenzar Interview</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Free Tips:</strong> Get 3 free AI tips per interview
              </div>
              <div>
                <strong>Premium Tips:</strong> Unlock 3 more tips for 150 DTC points
              </div>
              <div>
                <strong>XP System:</strong> Earn XP to level up from Bronze to Diamond
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Earn DTC Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Complete Interviews:</strong> Earn free tips per interview
              </div>
              <div>
                <strong>Achievements:</strong> Unlock badges for milestones
              </div>
              <div>
                <strong>Streaks:</strong> Maintain daily interview streaks
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Level Rewards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Bronze:</strong> Comenzaring level
              </div>
              <div>
                <strong>Diamond:</strong> Unlock all premium features
              </div>
              <div>
                <strong>Leaderboards:</strong> Compete with other interviewees
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
