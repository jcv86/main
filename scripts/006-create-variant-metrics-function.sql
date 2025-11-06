-- Create function to get metrics for a specific variant
CREATE OR REPLACE FUNCTION get_variant_metrics(variant_id UUID)
RETURNS TABLE (
  total_sessions BIGINT,
  avg_satisfaction NUMERIC,
  action_completion_rate NUMERIC,
  avg_engagement NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT cm.session_id)::BIGINT as total_sessions,
    AVG(cm.satisfaction_rating)::NUMERIC as avg_satisfaction,
    (COUNT(CASE WHEN cm.action_completed THEN 1 END)::NUMERIC / 
     NULLIF(COUNT(*)::NUMERIC, 0)) as action_completion_rate,
    AVG(cm.message_count)::NUMERIC as avg_engagement
  FROM coaching_metrics cm
  INNER JOIN prompt_user_assignments pua ON pua.session_id = cm.session_id
  WHERE pua.version_id = variant_id;
END;
$$ LANGUAGE plpgsql;
