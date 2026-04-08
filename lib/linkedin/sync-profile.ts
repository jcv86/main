'use server'

import { createClient } from '@/lib/supabase/server'

interface LinkedInProfile {
  id: string
  localizedFirstName: string
  localizedLastName: string
  profilePicture?: {
    displayImage?: string
  }
  vanityName?: string
  headline?: string
}

interface LinkedInExperience {
  id: string
  companyName: string
  title: string
  startedOn: { year: number; month: number }
  endedOn?: { year: number; month: number }
  description?: string
}

interface LinkedInSkill {
  name: string
  endorsementCount?: number
}

/**
 * Sync LinkedIn profile data to Supabase
 * This uses the LinkedIn API access token from user's account
 */
export async function syncLinkedInProfile() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const supabase = await createClient()

    // Get user's LinkedIn access token from accounts table
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('access_token, provider_account_id')
      .eq('user_id', user.id)
      .eq('provider', 'linkedin')
      .single()

    if (accountError || !account?.access_token) {
      throw new Error('LinkedIn account not connected. Please connect your LinkedIn first.')
    }

    console.log('[v0] Syncing LinkedIn profile for user:', user.id)

    // Fetch user's LinkedIn profile
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${account.access_token}`,
        'LinkedIn-Version': '202404',
      },
    })

    if (!profileResponse.ok) {
      throw new Error(`LinkedIn API error: ${profileResponse.statusText}`)
    }

    const linkedInProfile: LinkedInProfile = await profileResponse.json()

    // Fetch user's experience
    const experienceResponse = await fetch(
      'https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,vanityName,headline,profilePicture(displayImage),experience)',
      {
        headers: {
          Authorization: `Bearer ${account.access_token}`,
          'LinkedIn-Version': '202404',
        },
      }
    )

    const fullProfile = await experienceResponse.json()

    // Fetch user's skills
    const skillsResponse = await fetch('https://api.linkedin.com/v2/me?projection=(skills)', {
      headers: {
        Authorization: `Bearer ${account.access_token}`,
        'LinkedIn-Version': '202404',
      },
    })

    const skillsData = await skillsResponse.json()

    // Extract and structure data
    const firstName = linkedInProfile.localizedFirstName
    const lastName = linkedInProfile.localizedLastName
    const headline = fullProfile.headline
    const profileImageUrl = fullProfile.profilePicture?.displayImage
    const linkedinUrl = `https://linkedin.com/in/${fullProfile.vanityName}` || `https://linkedin.com/in/${account.provider_account_id}`

    // Extract skills
    const skills = skillsData.skills?.map((skill: LinkedInSkill) => ({
      name: skill.name,
      endorsements: skill.endorsementCount || 0,
    })) || []

    // Extract experience
    const experience = fullProfile.experience?.map((exp: LinkedInExperience) => ({
      company: exp.companyName,
      title: exp.title,
      startDate: exp.startedOn ? `${exp.startedOn.year}-${String(exp.startedOn.month).padStart(2, '0')}` : null,
      endDate: exp.endedOn ? `${exp.endedOn.year}-${String(exp.endedOn.month).padStart(2, '0')}` : 'Present',
      description: exp.description,
    })) || []

    // Store in linkedin_user_profiles table
    const { error: upsertError } = await supabase
      .from('linkedin_user_profiles')
      .upsert(
        {
          user_id: user.id,
          linkedin_id: account.provider_account_id,
          first_name: firstName,
          last_name: lastName,
          headline,
          profile_image_url: profileImageUrl,
          linkedin_url: linkedinUrl,
          skills: skills,
          experience: experience,
          last_synced_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

    if (upsertError) {
      throw upsertError
    }

    console.log('[v0] LinkedIn profile synced successfully for user:', user.id)

    return {
      success: true,
      profile: {
        name: `${firstName} ${lastName}`,
        headline,
        skills: skills.length,
        experience: experience.length,
      },
    }
  } catch (error) {
    console.error('[v0] Error syncing LinkedIn profile:', error)
    throw error
  }
}

/**
 * Get synced LinkedIn profile from database
 */
export async function getLinkedInProfile() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('linkedin_user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      return null
    }

    return data
  } catch (error) {
    console.error('[v0] Error fetching LinkedIn profile:', error)
    return null
  }
}
