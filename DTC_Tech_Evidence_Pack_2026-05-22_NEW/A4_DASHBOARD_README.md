# A4 Dashboard - Strategic Learning Platform

## Overview

The A4 Dashboard is a comprehensive learning and engagement platform built into the Despega application. It combines strategic market analysis, news curation, gamification, and learning resources into a single, cohesive experience.

## Key Features

### 1. Radar Estratégico (Strategic Radar)
- **Daily Thesis Analysis** with 7-layer framework:
  - Strategic thesis statement
  - Delta estratégico
  - Market energy levels
  - Narrative tension & rhythm
  - Market consensus scoring
- **Weak Signal Detection** - emerging patterns that could activate
- **News Mapping** - linking current news to strategic themes

### 2. Noticias Feed (News Center)
- **Searchable News Catalog** with full-text search
- **Category Filtering** for targeted reading
- **Engagement Tracking** - read, save, share tracking
- **Points System** - users earn points for engagement
- **Pagination** for manageable browsing

### 3. Gamified Tests
- **Interactive Quizzes** with multiple-choice questions
- **Real-time Scoring** with immediate feedback
- **Difficulty Levels** - Basic, Intermediate, Advanced
- **Completion Tracking** with historical scores
- **Point Rewards** - users earn points for completion

### 4. Pruebas (Case Studies)
- **Real-world Examples** from multiple industries
- **5-layer Case Analysis:**
  - Challenge description
  - Strategic approach
  - Results achieved
  - Key learnings
  - Related thesis connections
- **Completion Tracking** and progress percentage
- **Difficulty and Category Filtering**

### 5. Biblioteca (Learning Library)
- **Verified Resources** - curated and quality-checked
- **Multiple Formats** - articles, books, videos, tools
- **Category Organization** for easy discovery
- **Resource Saving** for personal collection
- **Direct Links** to external resources

### 6. Mi Progreso (Progress Tracking)
- **Engagement Dashboard** showing:
  - Articles read
  - Articles shared
  - Tests completed
  - Average test scores
  - Resources saved
  - Reading streaks
- **Weekly Summary** with daily point breakdown
- **Visual Progress Indicators**

### 7. Insignias (Badges & Points)
- **10 Badge Types:**
  - Lector Principiante (first read)
  - Lector Ávido (5 articles)
  - Experto Lector (10 articles)
  - Estudiante (first test)
  - Académico (5 tests)
  - Perfeccionista (100% score)
  - Consistencia (7-day streak)
  - Maestría (30-day streak)
  - Mariposa Social (5 shares)
  - Centro de Conocimiento (10 saved)

- **Points System:**
  - Read article: +1 point
  - Share article: +2 points
  - Complete test: +5-10 points
  - Save resource: +1 point
  - 7-day streak: +50 points
  - 30-day streak: +200 points

- **Global Leaderboard** showing top users
- **Points History** with detailed log

### 8. Perfil Personalizado (Personalization)
- **DISC Profile** showing personality pattern
- **Personalized Feed Sources** based on profile
- **Content Preferences** configuration
- **Pattern Interpretation** and recommendations

## Database Schema

### Core Tables
- `a4_tesis_del_dia` - Daily strategic thesis
- `a4_noticias` - News articles
- `a4_weak_signals` - Emerging signals
- `a4_gamified_tests` - Quiz definitions
- `biblioteca` - Learning resources

### Engagement Tables
- `a4_user_test_completions` - Quiz history
- `a4_news_engagement` - Reading/sharing tracking
- `a4_user_saved_resources` - Bookmarked resources
- `a4_points_history` - Complete points ledger
- `a4_user_badges` - Earned achievements

### User Tables
- `a4_module_progress` - Course completion
- `a4_personalized_feeds` - Custom feeds
- `a1_disc_assessment` - Personality profiles

## Admin Dashboard

The admin dashboard provides:

### Analytics Section
- User statistics and trends
- Engagement metrics by content type
- Badge distribution analysis
- Points distribution tracking

### Content Management
- **Tesis Manager** - Create/edit daily thesis
- **Noticias Manager** - Curate and link news
- **Tests Manager** - Create/manage quizzes
- **Biblioteca Manager** - Verify resources
- **Users Management** - Monitor user activity

## File Structure

```
app/
├── a4-dashboard/
│   └── page.tsx              # Main dashboard (7 tabs)
└── admin/
    └── page.tsx              # Admin dashboard

components/
├── radar-estrategico.tsx      # Radar section
├── noticias-feed.tsx          # News center
├── gamified-tests.tsx         # Quiz system
├── pruebas-tab.tsx            # Case studies
├── biblioteca.tsx             # Learning library
├── engagement-dashboard.tsx   # Progress tracking
├── personalization-profile.tsx# User profile
├── points-badges-system.tsx   # Achievements
└── admin/
    ├── index.tsx              # Admin components
    ├── admin-analytics.tsx     # Analytics view
    └── protected-admin-route.tsx # Access control

lib/supabase/
└── a4-queries.ts             # All database queries

scripts/
├── 01-a4-core-tables.sql     # Schema setup
├── 02-a4-engagement-tables.sql
├── 03-a4-rls-policies.sql
└── 04-a4-seed-data.sql
```

## User Journey

1. **Authentication** - User logs in via Auth0/NextAuth
2. **Dashboard Entry** - Lands on Radar Estratégico tab
3. **Engagement Choices:**
   - Read strategic analysis
   - Browse curated news
   - Complete quizzes
   - Study case examples
   - Access learning resources
4. **Engagement Tracking** - Points and badges awarded automatically
5. **Progress Visibility** - See stats on Mi Progreso tab
6. **Leaderboard** - Compete on global rankings

## Personalization Features

- **DISC-based Content Curation** - Different narratives for different personalities
- **Recommendation Engine** - Based on reading history
- **Custom Feeds** - User-configurable content sources
- **Learning Paths** - Progressive difficulty progression

## Security

- **Row Level Security (RLS)** on all user tables
- **Authentication Required** for engagement tracking
- **Admin Email Whitelist** for admin access
- **User Data Isolation** - users only see their own data
- **Public Content** - strategic analysis available to all

## Performance Optimizations

- **Server-side Rendering** for initial page load
- **Client-side Queries** with SWR for real-time updates
- **Index Optimization** on frequently queried columns
- **Pagination** to limit data transfer
- **Lazy Loading** of images and resources

## Future Enhancements

1. **Real-time Notifications** - Badge achievements, streak milestones
2. **Social Features** - Follow users, share insights
3. **Advanced Analytics** - User cohort analysis, retention metrics
4. **AI Recommendations** - Smart content suggestions
5. **Mobile App** - Native iOS/Android experience
6. **API Endpoints** - Third-party integrations
7. **Content Syndication** - RSS feeds, webhooks
8. **Certification Program** - Completion certificates

## Support

For issues or questions about the A4 Dashboard:
1. Check DEPLOYMENT.md for setup guide
2. Review database schema in scripts/
3. Check component files for implementation details
4. Review a4-queries.ts for query documentation
