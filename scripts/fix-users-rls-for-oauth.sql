-- Temporarily allow NextAuth to create users in the users table
-- This script modifies RLS policies for the users table to allow NextAuth session creation

BEGIN;

-- Drop existing user insert policies
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create a new policy that allows NextAuth to insert users via the service role
CREATE POLICY "Service role can insert users" ON users
  FOR INSERT
  WITH CHECK (
    -- Allow service role or users inserting their own profile
    (SELECT auth.jwt() ->> 'role' IN ('service_role', 'authenticated'))
  );

-- Also need to allow service role to read/update
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (
    -- Users can view their own profile OR allow service role
    auth.uid() = id OR
    (SELECT auth.jwt() ->> 'role') = 'service_role'
  );

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (
    -- Users can update their own profile OR allow service role
    auth.uid() = id OR
    (SELECT auth.jwt() ->> 'role') = 'service_role'
  );

COMMIT;
