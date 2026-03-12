-- Temporarily disable RLS on all tables to test OAuth
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_tokens DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN ('users', 'accounts', 'sessions', 'verification_tokens');
