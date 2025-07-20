-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  phone VARCHAR(50),
  location VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personality assessments
CREATE TABLE IF NOT EXISTS personality_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assessment_type VARCHAR(50) DEFAULT 'MBTI',
  responses JSONB,
  results JSONB,
  personality_type VARCHAR(10),
  strengths TEXT[],
  growth_areas TEXT[],
  career_recommendations TEXT[],
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CV/Resume data
CREATE TABLE IF NOT EXISTS resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  template_name VARCHAR(50) DEFAULT 'modern',
  content JSONB,
  is_public BOOLEAN DEFAULT FALSE,
  public_url VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills assessments
CREATE TABLE IF NOT EXISTS skills_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_category VARCHAR(100),
  skill_name VARCHAR(100),
  assessment_type VARCHAR(50), -- 'technical', 'soft_skill'
  score INTEGER,
  max_score INTEGER,
  responses JSONB,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview sessions
CREATE TABLE IF NOT EXISTS interview_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  industry VARCHAR(100),
  position VARCHAR(100),
  questions JSONB,
  responses JSONB,
  feedback JSONB,
  overall_score INTEGER,
  duration_minutes INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career coaching conversations
CREATE TABLE IF NOT EXISTS coaching_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  messages JSONB,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(100), -- 'personality', 'skills', 'interview', 'cv'
  progress_data JSONB,
  goals JSONB,
  achievements TEXT[],
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job recommendations
CREATE TABLE IF NOT EXISTS job_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_title VARCHAR(255),
  company VARCHAR(255),
  location VARCHAR(255),
  description TEXT,
  requirements TEXT[],
  match_score INTEGER,
  source VARCHAR(100),
  external_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
