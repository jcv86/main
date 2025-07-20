-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE personality_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_data ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Career goals policies
CREATE POLICY "Users can view own career goals" ON career_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own career goals" ON career_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own career goals" ON career_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own career goals" ON career_goals FOR DELETE USING (auth.uid() = user_id);

-- Skills assessments policies
CREATE POLICY "Users can view own skills assessments" ON skills_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own skills assessments" ON skills_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own skills assessments" ON skills_assessments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own skills assessments" ON skills_assessments FOR DELETE USING (auth.uid() = user_id);

-- Personality results policies
CREATE POLICY "Users can view own personality results" ON personality_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own personality results" ON personality_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own personality results" ON personality_results FOR UPDATE USING (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Users can view own achievements" ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Interview sessions policies
CREATE POLICY "Users can view own interview sessions" ON interview_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interview sessions" ON interview_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interview sessions" ON interview_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Coaching sessions policies
CREATE POLICY "Users can view own coaching sessions" ON coaching_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coaching sessions" ON coaching_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own coaching sessions" ON coaching_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Job recommendations policies
CREATE POLICY "Users can view own job recommendations" ON job_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own job recommendations" ON job_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own job recommendations" ON job_recommendations FOR UPDATE USING (auth.uid() = user_id);

-- CV data policies
CREATE POLICY "Users can view own CV data" ON cv_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own CV data" ON cv_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own CV data" ON cv_data FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own CV data" ON cv_data FOR DELETE USING (auth.uid() = user_id);
