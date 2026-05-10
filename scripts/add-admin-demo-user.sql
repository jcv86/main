-- Add demo user to admin_emails table for development purposes
-- This grants admin access to all admin panels and functionality

INSERT INTO admin_emails (email, created_at, updated_at)
VALUES 
  ('demo@example.com', NOW(), NOW()),
  ('travis@nuanu.com', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Verify the admins were added
SELECT * FROM admin_emails WHERE email IN ('demo@example.com', 'travis@nuanu.com');
