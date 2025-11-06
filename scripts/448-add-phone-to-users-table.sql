-- Add phone number column to users table for WhatsApp functionality
-- Check if column exists first to avoid errors

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'whatsapp_phone'
  ) THEN
    ALTER TABLE users ADD COLUMN whatsapp_phone VARCHAR(20);
  END IF;
END $$;

-- Update travis@nuanu.com with phone number
UPDATE users 
SET whatsapp_phone = '+56940946660'
WHERE email = 'travis@nuanu.com';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_whatsapp_phone ON users(whatsapp_phone);
