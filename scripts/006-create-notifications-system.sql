-- Notifications table
CREATE TABLE IF NOT EXISTS despega_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'achievement', 'milestone', 'recommendation', 'coaching', 'alert'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url VARCHAR(500),
  milestone_type VARCHAR(100), -- 'a1_completed', 'achievement_unlock', etc.
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_id_exists FOREIGN KEY (user_id) REFERENCES despega_user_profiles(id)
);

-- Notification settings
CREATE TABLE IF NOT EXISTS despega_notification_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email_milestones BOOLEAN DEFAULT TRUE,
  email_recommendations BOOLEAN DEFAULT FALSE,
  email_weekly_summary BOOLEAN DEFAULT TRUE,
  in_app_all BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT FALSE,
  sms_critical BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_id_exists FOREIGN KEY (user_id) REFERENCES despega_user_profiles(id)
);

-- Notification log (for analytics)
CREATE TABLE IF NOT EXISTS despega_notification_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_id UUID NOT NULL REFERENCES despega_notifications(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delivery_status VARCHAR(50), -- 'sent', 'failed', 'bounced'
  channel VARCHAR(50), -- 'email', 'in_app', 'push', 'sms'
  error_message TEXT,
  CONSTRAINT user_id_exists FOREIGN KEY (user_id) REFERENCES despega_user_profiles(id)
);

-- Email campaigns (for bulk notifications)
CREATE TABLE IF NOT EXISTS despega_email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_name VARCHAR(255) NOT NULL,
  campaign_type VARCHAR(100), -- 'milestone', 'engagement', 'reactivation'
  target_segment VARCHAR(100), -- 'all', 'a1_completers', 'inactive_users'
  message_title VARCHAR(255) NOT NULL,
  message_body TEXT NOT NULL,
  action_url VARCHAR(500),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'scheduled', 'sent'
  total_recipients INT DEFAULT 0,
  sent_count INT DEFAULT 0,
  open_count INT DEFAULT 0,
  click_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security Policies
ALTER TABLE despega_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications"
  ON despega_notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON despega_notifications
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own notifications"
  ON despega_notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON despega_notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Notification settings RLS
ALTER TABLE despega_notification_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own settings"
  ON despega_notification_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON despega_notification_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON despega_notification_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_notifications_user_id ON despega_notifications(user_id);
CREATE INDEX idx_notifications_created_at ON despega_notifications(created_at DESC);
CREATE INDEX idx_notifications_read ON despega_notifications(read);
CREATE INDEX idx_notification_log_user_id ON despega_notification_log(user_id);
CREATE INDEX idx_notification_log_sent_at ON despega_notification_log(sent_at DESC);
CREATE INDEX idx_email_campaigns_status ON despega_email_campaigns(status);
