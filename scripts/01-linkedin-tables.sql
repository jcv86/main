-- LinkedIn Integration - User Profiles
CREATE TABLE IF NOT EXISTS linkedin_user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  linkedin_id TEXT UNIQUE,
  profile_url TEXT,
  headline TEXT,
  summary TEXT,
  location TEXT,
  profile_picture_url TEXT,
  
  -- Core data
  skills JSONB, -- Array of skill objects: {name, endorsements, proficiency}
  experience JSONB, -- Career history
  education JSONB,
  certifications JSONB,
  
  -- Sync metadata
  last_synced_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT, -- 'synced', 'pending', 'error'
  sync_error_message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LinkedIn Market Job Listings (Public data)
CREATE TABLE IF NOT EXISTS linkedin_market_job_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_title TEXT NOT NULL,
  company_name TEXT,
  location TEXT,
  job_level TEXT, -- Entry, Mid, Senior, Executive
  industry TEXT,
  required_skills JSONB, -- Array of skills this job requires
  salary_range TEXT,
  
  -- Market insights
  demand_level TEXT, -- High, Medium, Low
  trending BOOLEAN DEFAULT FALSE,
  frequency_posted INTEGER, -- How often this role is posted
  
  -- Source
  source TEXT, -- 'linkedin_api', 'github_jobs', 'indeed'
  external_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Job Market Insights
CREATE TABLE IF NOT EXISTS user_job_market_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Skills analysis
  user_skills JSONB, -- Current skills from LinkedIn
  market_demanded_skills JSONB, -- Top 10 skills the market wants
  skill_gaps JSONB, -- What's missing
  
  -- Job market position
  matching_jobs_count INTEGER,
  top_matching_jobs JSONB, -- Top 5 job listings that match
  match_percentage INTEGER, -- 0-100
  
  -- Market trends
  trending_roles JSONB, -- Array of trending job titles
  trending_skills JSONB, -- Top emerging skills
  salary_benchmarks JSONB, -- By role, location, experience
  
  -- Personalization
  recommended_training_focus JSONB, -- Based on gaps
  estimated_market_demand_3_months TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE linkedin_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_market_job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_job_market_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own LinkedIn profile"
  ON linkedin_user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own LinkedIn profile"
  ON linkedin_user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own LinkedIn profile"
  ON linkedin_user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view job listings"
  ON linkedin_market_job_listings FOR SELECT
  USING (true);

CREATE POLICY "Users can view own market insights"
  ON user_job_market_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own market insights"
  ON user_job_market_insights FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own market insights"
  ON user_job_market_insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_linkedin_user_profiles_user_id ON linkedin_user_profiles(user_id);
CREATE INDEX idx_linkedin_market_jobs_skills ON linkedin_market_job_listings USING GIN (required_skills);
CREATE INDEX idx_linkedin_market_jobs_trending ON linkedin_market_job_listings(trending);
CREATE INDEX idx_user_insights_user_id ON user_job_market_insights(user_id);
