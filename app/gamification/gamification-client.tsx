"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GamificationProfileEnhanced } from "@/components/gamification-profile-enhanced"
import { Leaderboard } from "@/components/leaderboard"
import { ActivityTimeline } from "@/components/activity-timeline"
import { Trophy, TrendingUp, Flame } from "lucide-react"

export default function GamificationClient() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gamification Hub</h1>
        <p className="text-muted-foreground mt-2">
          Track your progress, earn rewards, and compete with other users
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Leaderboard</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-2">
            <span className="text-lg">ℹ️</span>
            <span className="hidden sm:inline">Info</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-6">
          <GamificationProfileEnhanced />
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6 mt-6">
          <Leaderboard />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6 mt-6">
          <ActivityTimeline limit={20} />
        </TabsContent>

        <TabsContent value="info" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-3">XP & Levels</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Earn XP by completing missions, interviews, and courses. Every level requires more XP than the last,
                  encouraging consistent engagement.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Complete A3 sessions: +150 XP</li>
                  <li>Perfect A3 session: +200 XP</li>
                  <li>Complete interview: +500 XP</li>
                  <li>Daily streak bonus: +50 XP/day</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-3">DTC Coins</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Earn DTC coins by achieving milestones and completing interviews. Spend them on premium tips and features.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Complete interview: +100 DTC</li>
                  <li>Perfect score bonus: +50 DTC</li>
                  <li>First interview: +250 DTC</li>
                  <li>Use on premium interview tips</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-3">Rankings & Tiers</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Compete globally and earn tier badges based on your ranking.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>🥇 Diamond</span><span>Top 10</span></div>
                  <div className="flex justify-between"><span>⭐ Platinum</span><span>Top 50</span></div>
                  <div className="flex justify-between"><span>🏆 Gold</span><span>Top 100</span></div>
                  <div className="flex justify-between"><span>🥈 Silver</span><span>Top 500</span></div>
                  <div className="flex justify-between"><span>🥉 Bronze</span><span>Top 1000</span></div>
                  <div className="flex justify-between"><span>📈 Rising</span><span>Growing member</span></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-3">Streaks & Achievements</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Build streaks by staying active daily and unlock achievements through milestones.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Maintain daily activity streaks</li>
                  <li>Unlock badges for milestones</li>
                  <li>Share your achievements</li>
                  <li>Compete on the leaderboard</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
