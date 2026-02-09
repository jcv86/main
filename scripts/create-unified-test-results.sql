-- Create unified_test_results table for storing all test results
CREATE TABLE IF NOT EXISTS public.unified_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR NOT NULL,
  test_type VARCHAR NOT NULL,
  test_results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_unified_test_results_user_email ON public.unified_test_results(user_email);
CREATE INDEX IF NOT EXISTS idx_unified_test_results_test_type ON public.unified_test_results(test_type);
CREATE INDEX IF NOT EXISTS idx_unified_test_results_created_at ON public.unified_test_results(created_at DESC);

-- Enable RLS
ALTER TABLE public.unified_test_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own test results" ON public.unified_test_results
  FOR SELECT USING (
    user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "System can insert test results" ON public.unified_test_results
  FOR INSERT WITH CHECK (true);

GRANT SELECT, INSERT ON public.unified_test_results TO authenticated;
