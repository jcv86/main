-- Migration script to add calendar columns to existing tables
-- This safely adds columns without dropping existing data

-- Add columns to user_activities if they don't exist
DO $$ 
BEGIN
  -- Add start_time if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_activities' AND column_name = 'start_time'
  ) THEN
    ALTER TABLE user_activities ADD COLUMN start_time TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Add end_time if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_activities' AND column_name = 'end_time'
  ) THEN
    ALTER TABLE user_activities ADD COLUMN end_time TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Add activity_type if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_activities' AND column_name = 'activity_type'
  ) THEN
    ALTER TABLE user_activities ADD COLUMN activity_type VARCHAR(50);
  END IF;

  -- Add title if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_activities' AND column_name = 'title'
  ) THEN
    ALTER TABLE user_activities ADD COLUMN title VARCHAR(255);
  END IF;

  -- Add description if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_activities' AND column_name = 'description'
  ) THEN
    ALTER TABLE user_activities ADD COLUMN description TEXT;
  END IF;

  -- Add location if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_activities' AND column_name = 'location'
  ) THEN
    ALTER TABLE user_activities ADD COLUMN location VARCHAR(255);
  END IF;

  -- Add reminder_enabled if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_activities' AND column_name = 'reminder_enabled'
  ) THEN
    ALTER TABLE user_activities ADD COLUMN reminder_enabled BOOLEAN DEFAULT true;
  END IF;

  -- Add reminder_minutes_before if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_activities' AND column_name = 'reminder_minutes_before'
  ) THEN
    ALTER TABLE user_activities ADD COLUMN reminder_minutes_before INTEGER DEFAULT 30;
  END IF;

  -- Add status if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_activities' AND column_name = 'status'
  ) THEN
    ALTER TABLE user_activities ADD COLUMN status VARCHAR(20) DEFAULT 'scheduled';
  END IF;

  -- Add metadata if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_activities' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE user_activities ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Create activity_reminders table if it doesn't exist
CREATE TABLE IF NOT EXISTS activity_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  reminder_time TIMESTAMP WITH TIME ZONE NOT NULL,
  message TEXT NOT NULL,
  sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivery_status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create whatsapp_config table if it doesn't exist
CREATE TABLE IF NOT EXISTS whatsapp_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  whatsapp_enabled BOOLEAN DEFAULT true,
  reminder_enabled BOOLEAN DEFAULT true,
  motivation_enabled BOOLEAN DEFAULT true,
  insights_enabled BOOLEAN DEFAULT true,
  preferred_time TIME DEFAULT '09:00:00',
  timezone VARCHAR(50) DEFAULT 'America/Santiago',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_activities_user_email ON user_activities(user_email);
CREATE INDEX IF NOT EXISTS idx_user_activities_start_time ON user_activities(start_time);
CREATE INDEX IF NOT EXISTS idx_user_activities_activity_type ON user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_reminders_user_email ON activity_reminders(user_email);
CREATE INDEX IF NOT EXISTS idx_activity_reminders_reminder_time ON activity_reminders(reminder_time);
CREATE INDEX IF NOT EXISTS idx_activity_reminders_sent ON activity_reminders(sent);

-- Removed sample data insertion to avoid NOT NULL constraint violations
