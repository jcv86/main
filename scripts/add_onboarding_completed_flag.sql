-- Add onboarding_cerebral_completed flag to despega_user_profiles
ALTER TABLE despega_user_profiles 
ADD COLUMN IF NOT EXISTS onboarding_cerebral_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_cerebral_completed_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_despega_user_profiles_onboarding_completed 
ON despega_user_profiles(user_id, onboarding_cerebral_completed);
