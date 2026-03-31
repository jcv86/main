-- Add canonical flags to despega_user_profiles if they don't exist
-- Phase 1: Database Schema & Flags alignment

-- Add missing canonical flags
ALTER TABLE despega_user_profiles ADD COLUMN IF NOT EXISTS onboarding_conozcamonos_1_completed BOOLEAN DEFAULT false;
ALTER TABLE despega_user_profiles ADD COLUMN IF NOT EXISTS a1_cerebral_intro_seen BOOLEAN DEFAULT false;
ALTER TABLE despega_user_profiles ADD COLUMN IF NOT EXISTS a1_cerebral_completed BOOLEAN DEFAULT false;
ALTER TABLE despega_user_profiles ADD COLUMN IF NOT EXISTS a1_report_seen BOOLEAN DEFAULT false;
ALTER TABLE despega_user_profiles ADD COLUMN IF NOT EXISTS a2_intro_seen BOOLEAN DEFAULT false;
ALTER TABLE despega_user_profiles ADD COLUMN IF NOT EXISTS a2_route_generated BOOLEAN DEFAULT false;
ALTER TABLE despega_user_profiles ADD COLUMN IF NOT EXISTS a3_unlocked BOOLEAN DEFAULT false;
ALTER TABLE despega_user_profiles ADD COLUMN IF NOT EXISTS a4_unlocked BOOLEAN DEFAULT false;

-- Add timestamps for audit trail
ALTER TABLE despega_user_profiles ADD COLUMN IF NOT EXISTS onboarding_conozcamonos_1_completed_at TIMESTAMP;
ALTER TABLE despega_user_profiles ADD COLUMN IF NOT EXISTS a1_cerebral_intro_seen_at TIMESTAMP;
ALTER TABLE despega_user_profiles ADD COLUMN IF NOT EXISTS a1_cerebral_completed_at TIMESTAMP;
ALTER TABLE despega_user_profiles ADD COLUMN IF NOT EXISTS a1_report_seen_at TIMESTAMP;
ALTER TABLE despega_user_profiles ADD COLUMN IF NOT EXISTS a2_intro_seen_at TIMESTAMP;
ALTER TABLE despega_user_profiles ADD COLUMN IF NOT EXISTS a2_route_generated_at TIMESTAMP;
ALTER TABLE despega_user_profiles ADD COLUMN IF NOT EXISTS a3_unlocked_at TIMESTAMP;
ALTER TABLE despega_user_profiles ADD COLUMN IF NOT EXISTS a4_unlocked_at TIMESTAMP;

-- Data migration: map old flags to new canonical flags
UPDATE despega_user_profiles
SET onboarding_conozcamonos_1_completed = COALESCE(onboarding_completed, false),
    onboarding_conozcamonos_1_completed_at = CASE WHEN onboarding_completed THEN NOW() ELSE NULL END
WHERE onboarding_completed = true AND onboarding_conozcamonos_1_completed = false;

UPDATE despega_user_profiles
SET a1_cerebral_completed = COALESCE(onboarding_cerebral_completed, false),
    a1_cerebral_completed_at = CASE WHEN onboarding_cerebral_completed THEN NOW() ELSE NULL END
WHERE onboarding_cerebral_completed = true AND a1_cerebral_completed = false;

-- Add current_stage tracker for easier navigation
ALTER TABLE despega_user_profiles ADD COLUMN IF NOT EXISTS current_stage VARCHAR(50) DEFAULT 'conozcamonos-1';

-- Add progress tracking
ALTER TABLE despega_user_profiles ADD COLUMN IF NOT EXISTS progress_percentage INT DEFAULT 0;

COMMIT;
