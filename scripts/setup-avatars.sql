-- Avatar Preferences Table
CREATE TABLE IF NOT EXISTS user_avatar_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_avatar_id TEXT NOT NULL DEFAULT 'professional-1',
  interviewer_avatar_id TEXT NOT NULL DEFAULT 'interviewer-classic-1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Available Avatars Lookup Table
CREATE TABLE IF NOT EXISTS available_avatars (
  id SERIAL PRIMARY KEY,
  avatar_type TEXT NOT NULL, -- 'user' or 'interviewer'
  avatar_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  color_ring TEXT, -- RGB value like "100, 200, 255"
  emoji_icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default user avatars
INSERT INTO available_avatars (avatar_type, avatar_id, name, description, color_ring, emoji_icon) VALUES
  ('user', 'professional-1', 'Professional', 'Classic professional look', '59, 130, 246', '👔'),
  ('user', 'creative-1', 'Creative', 'Modern creative style', '168, 85, 247', '🎨'),
  ('user', 'tech-1', 'Tech', 'Tech-savvy appearance', '34, 197, 94', '💻'),
  ('user', 'business-1', 'Business', 'Corporate executive', '239, 68, 68', '🏢'),
  ('user', 'casual-1', 'Casual', 'Relaxed casual style', '251, 146, 60', '😎'),
  ('user', 'formal-1', 'Formal', 'Formal business attire', '15, 23, 42', '🎩');

-- Insert default interviewer avatars
INSERT INTO available_avatars (avatar_type, avatar_id, name, description, color_ring, emoji_icon) VALUES
  ('interviewer', 'interviewer-classic-1', 'Sofia - HR Manager', 'Professional HR specialist', '139, 92, 246', '👩‍💼'),
  ('interviewer', 'interviewer-classic-2', 'Marco - Tech Lead', 'Technical interviewer', '59, 130, 246', '👨‍💻'),
  ('interviewer', 'interviewer-classic-3', 'Elena - Executive', 'Senior executive', '168, 85, 247', '👩‍💼'),
  ('interviewer', 'interviewer-classic-4', 'David - Manager', 'Team manager', '34, 197, 94', '👨‍💼'),
  ('interviewer', 'interviewer-modern-1', 'Alex - Coach', 'Career coach', '239, 68, 68', '🧑‍🏫'),
  ('interviewer', 'interviewer-modern-2', 'Jordan - Recruiter', 'Tech recruiter', '251, 146, 60', '🎯');

-- RLS Policies
ALTER TABLE user_avatar_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own avatar preferences"
  ON user_avatar_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own avatar preferences"
  ON user_avatar_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own avatar preferences"
  ON user_avatar_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow public read of available avatars
ALTER TABLE available_avatars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view available avatars"
  ON available_avatars
  FOR SELECT
  USING (true);
