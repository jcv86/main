'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Linkedin, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'
import { syncLinkedInProfile, getLinkedInProfile } from '@/lib/linkedin/sync-profile'

interface LinkedInProfileData {
  first_name: string
  last_name: string
  headline: string
  profile_image_url: string
  linkedin_url: string
  skills: Array<{ name: string; endorsements: number }>
  experience: Array<{
    company: string
    title: string
    startDate: string
    endDate: string
    description: string
  }>
  last_synced_at: string
}

export function LinkedInProfileCard() {
  const [profile, setProfile] = useState<LinkedInProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const data = await getLinkedInProfile()
      setProfile(data)
    } catch (err) {
      console.error('[v0] Error loading LinkedIn profile:', err)
      setError('Error loading LinkedIn profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    try {
      setSyncing(true)
      setError(null)
      await syncLinkedInProfile()
      await loadProfile()
    } catch (err) {
      console.error('[v0] Error syncing LinkedIn:', err)
      setError('Failed to sync LinkedIn profile. Make sure you\'ve connected your LinkedIn account.')
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-slate-600">Loading LinkedIn profile...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Linkedin className="w-5 h-5 text-blue-600" />
            LinkedIn Profile
          </CardTitle>
          <Button
            onClick={handleSync}
            disabled={syncing}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-800 rounded-lg flex gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {!profile ? (
          <div className="text-center py-6">
            <p className="text-slate-600 mb-4">No LinkedIn profile synced yet</p>
            <Button onClick={handleSync} className="bg-blue-600 hover:bg-blue-700">
              <Linkedin className="w-4 h-4 mr-2" />
              Connect LinkedIn
            </Button>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="flex gap-4">
              {profile.profile_image_url && (
                <img
                  src={profile.profile_image_url}
                  alt={`${profile.first_name} ${profile.last_name}`}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h3 className="font-bold text-lg">
                  {profile.first_name} {profile.last_name}
                </h3>
                <p className="text-sm text-slate-600">{profile.headline}</p>
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                >
                  View on LinkedIn →
                </a>
              </div>
            </div>

            {/* Skills Section */}
            {profile.skills && profile.skills.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Skills ({profile.skills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.slice(0, 10).map((skill) => (
                    <Badge key={skill.name} variant="secondary" className="text-xs">
                      {skill.name}
                      {skill.endorsements > 0 && (
                        <span className="ml-1 text-gray-500">+{skill.endorsements}</span>
                      )}
                    </Badge>
                  ))}
                  {profile.skills.length > 10 && (
                    <Badge variant="outline" className="text-xs">
                      +{profile.skills.length - 10} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {profile.experience && profile.experience.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Experience</h4>
                <div className="space-y-2">
                  {profile.experience.slice(0, 3).map((exp, idx) => (
                    <div key={idx} className="text-sm">
                      <p className="font-medium">{exp.title}</p>
                      <p className="text-xs text-slate-600">
                        {exp.company} • {exp.startDate} - {exp.endDate}
                      </p>
                    </div>
                  ))}
                  {profile.experience.length > 3 && (
                    <p className="text-xs text-slate-500 mt-2">
                      +{profile.experience.length - 3} more positions
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Last Synced */}
            <div className="text-xs text-slate-500 pt-2 border-t">
              Last synced: {new Date(profile.last_synced_at).toLocaleDateString()}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
