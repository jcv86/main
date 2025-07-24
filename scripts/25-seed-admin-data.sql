-- Insert demo users into profiles table
DO $$
BEGIN
    -- Insert demo users with ON CONFLICT to avoid duplicates
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role, status, created_at, updated_at, last_login)
    VALUES 
        (
            '11111111-1111-1111-1111-111111111111',
            'travis@nuanu.com',
            'Travis Nuanu',
            '/placeholder-user.jpg',
            'admin',
            'active',
            NOW() - INTERVAL '30 days',
            NOW(),
            NOW() - INTERVAL '1 hour'
        ),
        (
            '22222222-2222-2222-2222-222222222222',
            'sarah.johnson@example.com',
            'Sarah Johnson',
            '/placeholder-user.jpg',
            'moderator',
            'active',
            NOW() - INTERVAL '25 days',
            NOW(),
            NOW() - INTERVAL '2 hours'
        ),
        (
            '33333333-3333-3333-3333-333333333333',
            'mike.chen@example.com',
            'Mike Chen',
            '/placeholder-user.jpg',
            'user',
            'active',
            NOW() - INTERVAL '20 days',
            NOW(),
            NOW() - INTERVAL '3 hours'
        ),
        (
            '44444444-4444-4444-4444-444444444444',
            'emma.davis@example.com',
            'Emma Davis',
            '/placeholder-user.jpg',
            'user',
            'inactive',
            NOW() - INTERVAL '15 days',
            NOW(),
            NOW() - INTERVAL '5 days'
        ),
        (
            '55555555-5555-5555-5555-555555555555',
            'alex.rodriguez@example.com',
            'Alex Rodriguez',
            '/placeholder-user.jpg',
            'user',
            'suspended',
            NOW() - INTERVAL '10 days',
            NOW(),
            NOW() - INTERVAL '7 days'
        ),
        (
            '66666666-6666-6666-6666-666666666666',
            'demo@example.com',
            'Demo User',
            '/placeholder-user.jpg',
            'user',
            'active',
            NOW() - INTERVAL '5 days',
            NOW(),
            NOW() - INTERVAL '30 minutes'
        )
    ON CONFLICT (email) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        role = EXCLUDED.role,
        status = EXCLUDED.status,
        updated_at = NOW();

    RAISE NOTICE 'Demo users inserted/updated successfully';

    -- Insert demo user activities
    INSERT INTO public.user_activities (id, user_id, user_email, action, details, ip_address, user_agent, created_at)
    VALUES 
        (
            'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            '11111111-1111-1111-1111-111111111111',
            'travis@nuanu.com',
            'login',
            'Successful login',
            '192.168.1.100',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            NOW() - INTERVAL '1 hour'
        ),
        (
            'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            '22222222-2222-2222-2222-222222222222',
            'sarah.johnson@example.com',
            'login',
            'Successful login',
            '192.168.1.101',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            NOW() - INTERVAL '2 hours'
        ),
        (
            'cccccccc-cccc-cccc-cccc-cccccccccccc',
            '33333333-3333-3333-3333-333333333333',
            'mike.chen@example.com',
            'profile_update',
            'Updated profile information',
            '192.168.1.102',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
            NOW() - INTERVAL '3 hours'
        ),
        (
            'dddddddd-dddd-dddd-dddd-dddddddddddd',
            '44444444-4444-4444-4444-444444444444',
            'emma.davis@example.com',
            'logout',
            'User logged out',
            '192.168.1.103',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
            NOW() - INTERVAL '5 days'
        ),
        (
            'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
            '66666666-6666-6666-6666-666666666666',
            'demo@example.com',
            'login',
            'Successful login',
            '192.168.1.105',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            NOW() - INTERVAL '30 minutes'
        )
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Demo user activities inserted successfully';

    -- Insert demo admin actions
    INSERT INTO public.admin_actions (id, admin_id, admin_email, target_user_id, target_user_email, action, details, created_at)
    VALUES 
        (
            'ffffffff-ffff-ffff-ffff-ffffffffffff',
            '11111111-1111-1111-1111-111111111111',
            'travis@nuanu.com',
            '44444444-4444-4444-4444-444444444444',
            'emma.davis@example.com',
            'status_updated',
            '{"old_status": "active", "new_status": "inactive"}'::jsonb,
            NOW() - INTERVAL '2 days'
        ),
        (
            'gggggggg-gggg-gggg-gggg-gggggggggggg',
            '11111111-1111-1111-1111-111111111111',
            'travis@nuanu.com',
            '55555555-5555-5555-5555-555555555555',
            'alex.rodriguez@example.com',
            'status_updated',
            '{"old_status": "active", "new_status": "suspended"}'::jsonb,
            NOW() - INTERVAL '1 day'
        )
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Demo admin actions inserted successfully';

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error seeding demo data: %', SQLERRM;
END $$;

RAISE NOTICE 'Demo data seeding completed successfully!';
