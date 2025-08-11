-- Fix user_book_progress table structure
-- Drop existing table if it exists with wrong structure
DROP TABLE IF EXISTS user_book_progress CASCADE;

-- Create user_book_progress table with correct structure
CREATE TABLE user_book_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  current_page INTEGER DEFAULT 0,
  total_pages INTEGER NOT NULL,
  progress_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN total_pages > 0 THEN ROUND((current_page::DECIMAL / total_pages::DECIMAL) * 100, 2)
      ELSE 0 
    END
  ) STORED,
  reading_time_minutes INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Create indexes for better performance
CREATE INDEX idx_user_book_progress_user_id ON user_book_progress(user_id);
CREATE INDEX idx_user_book_progress_book_id ON user_book_progress(book_id);
CREATE INDEX idx_user_book_progress_last_read ON user_book_progress(last_read_at DESC);

-- Enable RLS
ALTER TABLE user_book_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own book progress" ON user_book_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own book progress" ON user_book_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own book progress" ON user_book_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own book progress" ON user_book_progress
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_book_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_book_progress_updated_at
  BEFORE UPDATE ON user_book_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_user_book_progress_updated_at();
