-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE (
    total_assessments BIGINT,
    completed_goals BIGINT,
    active_goals BIGINT,
    achievements_count BIGINT,
    personality_completed BOOLEAN,
    avg_skill_level NUMERIC,
    interview_sessions BIGINT,
    avg_interview_score NUMERIC,
    coaching_sessions BIGINT,
    job_recommendations BIGINT,
    bookmarked_jobs BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE((SELECT COUNT(*) FROM skills_assessments WHERE user_id = user_uuid), 0) as total_assessments,
        COALESCE((SELECT COUNT(*) FROM career_goals WHERE user_id = user_uuid AND status = 'completed'), 0) as completed_goals,
        COALESCE((SELECT COUNT(*) FROM career_goals WHERE user_id = user_uuid AND status = 'active'), 0) as active_goals,
        COALESCE((SELECT COUNT(*) FROM achievements WHERE user_id = user_uuid), 0) as achievements_count,
        COALESCE((SELECT COUNT(*) > 0 FROM personality_results WHERE user_id = user_uuid), FALSE) as personality_completed,
        COALESCE((SELECT AVG(level) FROM skills_assessments WHERE user_id = user_uuid), 0) as avg_skill_level,
        COALESCE((SELECT COUNT(*) FROM interview_sessions WHERE user_id = user_uuid), 0) as interview_sessions,
        COALESCE((SELECT AVG(score) FROM interview_sessions WHERE user_id = user_uuid AND score IS NOT NULL), 0) as avg_interview_score,
        COALESCE((SELECT COUNT(*) FROM coaching_sessions WHERE user_id = user_uuid), 0) as coaching_sessions,
        COALESCE((SELECT COUNT(*) FROM job_recommendations WHERE user_id = user_uuid), 0) as job_recommendations,
        COALESCE((SELECT COUNT(*) FROM job_recommendations WHERE user_id = user_uuid AND is_bookmarked = TRUE), 0) as bookmarked_jobs;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user progress summary
CREATE OR REPLACE FUNCTION get_user_progress_summary(user_uuid UUID)
RETURNS TABLE (
    personality_progress INTEGER,
    skills_progress INTEGER,
    goals_progress INTEGER,
    interview_progress INTEGER,
    coaching_progress INTEGER,
    overall_progress INTEGER
) AS $$
DECLARE
    personality_done BOOLEAN;
    skills_count INTEGER;
    goals_completed INTEGER;
    goals_total INTEGER;
    interview_count INTEGER;
    coaching_count INTEGER;
BEGIN
    -- Check personality completion
    SELECT COUNT(*) > 0 INTO personality_done FROM personality_results WHERE user_id = user_uuid;
    
    -- Count skills assessments
    SELECT COUNT(*) INTO skills_count FROM skills_assessments WHERE user_id = user_uuid;
    
    -- Count goals
    SELECT COUNT(*) INTO goals_completed FROM career_goals WHERE user_id = user_uuid AND status = 'completed';
    SELECT COUNT(*) INTO goals_total FROM career_goals WHERE user_id = user_uuid;
    
    -- Count interviews and coaching
    SELECT COUNT(*) INTO interview_count FROM interview_sessions WHERE user_id = user_uuid;
    SELECT COUNT(*) INTO coaching_count FROM coaching_sessions WHERE user_id = user_uuid;
    
    RETURN QUERY
    SELECT 
        CASE WHEN personality_done THEN 100 ELSE 0 END as personality_progress,
        LEAST(skills_count * 10, 100) as skills_progress,
        CASE WHEN goals_total > 0 THEN (goals_completed * 100 / goals_total) ELSE 0 END as goals_progress,
        LEAST(interview_count * 25, 100) as interview_progress,
        LEAST(coaching_count * 20, 100) as coaching_progress,
        (
            CASE WHEN personality_done THEN 100 ELSE 0 END +
            LEAST(skills_count * 10, 100) +
            CASE WHEN goals_total > 0 THEN (goals_completed * 100 / goals_total) ELSE 0 END +
            LEAST(interview_count * 25, 100) +
            LEAST(coaching_count * 20, 100)
        ) / 5 as overall_progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create achievement
CREATE OR REPLACE FUNCTION create_achievement(
    user_uuid UUID,
    achievement_title TEXT,
    achievement_description TEXT,
    achievement_category TEXT,
    achievement_icon TEXT DEFAULT 'trophy'
)
RETURNS UUID AS $$
DECLARE
    achievement_id UUID;
BEGIN
    -- Check if achievement already exists
    SELECT id INTO achievement_id 
    FROM achievements 
    WHERE user_id = user_uuid AND title = achievement_title;
    
    -- If not exists, create it
    IF achievement_id IS NULL THEN
        INSERT INTO achievements (user_id, title, description, category, icon)
        VALUES (user_uuid, achievement_title, achievement_description, achievement_category, achievement_icon)
        RETURNING id INTO achievement_id;
    END IF;
    
    RETURN achievement_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update goal progress
CREATE OR REPLACE FUNCTION update_goal_progress(
    goal_uuid UUID,
    new_progress INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE career_goals 
    SET progress = new_progress,
        status = CASE 
            WHEN new_progress >= 100 THEN 'completed'::goal_status
            ELSE status
        END,
        updated_at = NOW()
    WHERE id = goal_uuid;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_user_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_progress_summary(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_achievement(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_goal_progress(UUID, INTEGER) TO authenticated;
