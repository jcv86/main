-- Add travis@nuanu.com to admin_emails table
-- This is sufficient to grant admin access
INSERT INTO admin_emails (email, created_at, updated_at)
VALUES ('travis@nuanu.com', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Verify the admin was added
SELECT * FROM admin_emails WHERE email = 'travis@nuanu.com';
