-- Setup RLS policies for coaching_metrics table
-- This allows inserts for testing without authentication

-- Enable RLS on the table (if not already enabled)
ALTER TABLE coaching_metrics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert for testing" ON coaching_metrics;
DROP POLICY IF EXISTS "Allow public select for testing" ON coaching_metrics;
DROP POLICY IF EXISTS "Allow public update for testing" ON coaching_metrics;

-- Create policy to allow anyone to insert (for testing purposes)
-- TODO: In production, restrict this to authenticated users only
CREATE POLICY "Allow public insert for testing"
ON coaching_metrics
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy to allow anyone to select their own metrics
CREATE POLICY "Allow public select for testing"
ON coaching_metrics
FOR SELECT
TO public
USING (true);

-- Create policy to allow anyone to update their own metrics
CREATE POLICY "Allow public update for testing"
ON coaching_metrics
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Note: These policies are permissive for testing
-- In production, you should restrict based on user_email matching auth.email()
-- Example production policy:
-- CREATE POLICY "Users can insert their own metrics"
-- ON coaching_metrics
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (user_email = auth.email());
