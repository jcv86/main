-- Fix Supabase Security Advisor warnings: Function Search Path Mutable
-- This script adds proper search_path configuration to all functions that lack it
-- search_path should be set to 'public' to prevent SQL injection vulnerabilities

-- Update function: update_notifications_updated_at
ALTER FUNCTION public.update_notifications_updated_at() 
SET search_path = 'public';

-- Update function: update_coaching_metrics_updated_at
ALTER FUNCTION public.update_coaching_metrics_updated_at() 
SET search_path = 'public';

-- Update function: update_reading_stats
ALTER FUNCTION public.update_reading_stats() 
SET search_path = 'public';

-- Update function: update_session_insights_count
ALTER FUNCTION public.update_session_insights_count() 
SET search_path = 'public';

-- Update function: clean_old_coaching_conversations
ALTER FUNCTION public.clean_old_coaching_conversations() 
SET search_path = 'public';

-- Update function: update_search_vector
ALTER FUNCTION public.update_search_vector() 
SET search_path = 'public';

-- Update function: update_progress_percentage
ALTER FUNCTION public.update_progress_percentage() 
SET search_path = 'public';

-- Update function: update_user_book_progress_updated_
ALTER FUNCTION public.update_user_book_progress_updated_() 
SET search_path = 'public';

-- Update function: update_user_book_bookmarks_updated
ALTER FUNCTION public.update_user_book_bookmarks_updated() 
SET search_path = 'public';

-- Update function: calculate_engagement_score
ALTER FUNCTION public.calculate_engagement_score() 
SET search_path = 'public';

-- Update function: update_updated_at_column
ALTER FUNCTION public.update_updated_at_column() 
SET search_path = 'public';

-- Update function: update_application_status
ALTER FUNCTION public.update_application_status() 
SET search_path = 'public';

-- Update function: get_application_details
ALTER FUNCTION public.get_application_details() 
SET search_path = 'public';
