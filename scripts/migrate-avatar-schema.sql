-- Migration: Update avatar_preferences to use profile photos instead of user avatars
-- Change: Replace user_avatar_id with user_avatar_url (for profile photo) and user_avatar_source

ALTER TABLE public.avatar_preferences 
ADD COLUMN IF NOT EXISTS user_avatar_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS user_avatar_source VARCHAR(20) DEFAULT 'profile'; -- 'profile' | 'camera' | 'google' | 'linkedin'

-- Keep user_avatar_id for backwards compatibility, but it's no longer used for user avatars
-- It will remain as a default column but won't be used in the new logic
