-- Add travis@nuanu.com as admin
-- This script only adds the email to admin_emails table (no foreign key constraints)

INSERT INTO admin_emails (email, created_at, updated_at)
VALUES ('travis@nuanu.com', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Verify the admin was added
SELECT * FROM admin_emails WHERE email = 'travis@nuanu.com';
