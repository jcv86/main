-- NextAuth.js Tables for Supabase
-- Required for NextAuth v5 to work with Supabase

-- Create users table (if not already exists - our users table exists but needs auth fields)
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  email_confirmed_at timestamp with time zone,
  phone text UNIQUE,
  encrypted_password text,
  raw_app_meta_data jsonb,
  raw_user_meta_data jsonb,
  is_super_admin boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  last_sign_in_at timestamp with time zone,
  role text DEFAULT 'authenticated'
);

-- Create sessions table for NextAuth
CREATE TABLE IF NOT EXISTS next_auth.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires timestamp with time zone NOT NULL,
  session_token text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create accounts table for OAuth providers
CREATE TABLE IF NOT EXISTS next_auth.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_type text NOT NULL,
  provider_id text NOT NULL,
  provider_account_id text NOT NULL,
  refresh_token text,
  access_token text,
  access_token_expires timestamp with time zone,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(provider_id, provider_account_id)
);

-- Create verification tokens table
CREATE TABLE IF NOT EXISTS next_auth.verification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  token text NOT NULL UNIQUE,
  expires timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(identifier, token)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON next_auth.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_session_token ON next_auth.sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON next_auth.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_provider ON next_auth.accounts(provider_id, provider_account_id);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON next_auth.verification_tokens(token);

-- Enable RLS on new tables
ALTER TABLE next_auth.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_auth.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_auth.verification_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for sessions
CREATE POLICY "Users can view own sessions"
  ON next_auth.sessions
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can manage sessions"
  ON next_auth.sessions
  FOR ALL
  USING (true);

-- Create policies for accounts
CREATE POLICY "Users can view own accounts"
  ON next_auth.accounts
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can manage accounts"
  ON next_auth.accounts
  FOR ALL
  USING (true);

-- Create policies for verification tokens
CREATE POLICY "System can manage verification tokens"
  ON next_auth.verification_tokens
  FOR ALL
  USING (true);
