-- NextAuth.js Tables for Supabase (Public Schema)
-- Required for NextAuth v5 to work with Supabase
-- These tables store OAuth sessions, accounts, and tokens

-- Create sessions table for NextAuth
CREATE TABLE IF NOT EXISTS public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  expires timestamp with time zone NOT NULL,
  session_token text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create accounts table for OAuth providers
CREATE TABLE IF NOT EXISTS public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  provider text NOT NULL,
  provider_account_id text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  oauth_token_secret text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(provider, provider_account_id)
);

-- Create verification tokens table for email verification
CREATE TABLE IF NOT EXISTS public.verification_tokens (
  identifier text NOT NULL,
  token text NOT NULL UNIQUE,
  expires timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(identifier, token)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_session_token ON public.sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_provider ON public.accounts(provider, provider_account_id);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON public.verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_identifier ON public.verification_tokens(identifier);

-- Enable RLS on new tables
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for NextAuth to function
-- Note: NextAuth manages session lifecycle server-side, so we need permissive policies
CREATE POLICY "Allow authenticated users to view own sessions"
  ON public.sessions
  FOR SELECT
  USING (true);

CREATE POLICY "Allow all operations on sessions for NextAuth"
  ON public.sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view own accounts"
  ON public.accounts
  FOR SELECT
  USING (true);

CREATE POLICY "Allow all operations on accounts for NextAuth"
  ON public.accounts
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on verification tokens for NextAuth"
  ON public.verification_tokens
  FOR ALL
  USING (true)
  WITH CHECK (true);
