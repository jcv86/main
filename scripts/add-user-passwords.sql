-- Add password_hash column to users table to support email/password authentication
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Add unique constraint for email to prevent duplicates
ALTER TABLE public.users 
ADD CONSTRAINT users_email_unique UNIQUE(email);

-- Create index for faster email lookups during login
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Grant proper permissions
GRANT SELECT, UPDATE ON public.users TO authenticated;
GRANT SELECT, UPDATE ON public.users TO service_role;
