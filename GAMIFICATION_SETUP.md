# Interview Gamification System - Complete Setup Guide

## Overview

This comprehensive gamification system transforms interview practice into an engaging, Duolingo-style experience with:
- **15+ minute interviews** with 8-10 enhanced questions per level
- **Free AI Tips**: 3 per interview using OpenAI
- **Premium Tips**: 3 more for 150 DTC points (inspired by Duolingo)
- **XP Progression**: Bronze → Silver → Gold → Platinum → Diamond levels
- **Streaks & Badges**: Daily streak tracking and achievement system
- **DTC Shop**: Purchase points for premium features

## Database Setup

### Step 1: Execute SQL Migrations

Run these SQL scripts in order in your Supabase SQL editor:

```bash
1. scripts/01-gamification-schema.sql   - Creates all gamification tables
2. scripts/02-enhanced-interview-questions.sql - Adds 10+ enhanced questions
```

### Step 2: Verify Tables Created

You should see these new tables in Supabase:
- `user_dtc_balance` - User DTC point balances
- `dtc_transactions` - Transaction history
- `interview_tips_usage` - Tips used per interview
- `interview_session_gamification` - Session tracking with XP/streaks
- `user_gamification_profile` - User level, badges, achievements
- `dtc_purchases` - Stripe purchase history

## Environment Variables

Ensure these are set in your Vercel project:

```
OPENAI_API_KEY=sk_...              # For AI tip generation
NEXT_PUBLIC_SUPABASE_URL=...       # Already configured
SUPABASE_SERVICE_ROLE_KEY=...      # Already configured
```

## API Endpoints

### Interview Tips - Generate AI Coaching
**POST** `/api/interview/generate-ai-tip`
```json
{
  "userId": "user-id",
  "questionText": "Tell me about yourself",
  "userResponse": "I am...",
  "questionContext": "Role: Engineer",
  "difficulty": "intermedio",
  "isPremium": false,
  "sessionId": "session-123"
}
```

### DTC Balance Management
**GET** `/api/gamification/dtc-balance?userId=user-id`
**POST** `/api/gamification/dtc-balance`
```json
{
  "userId": "user-id",
  "action": "earn|spend",
  "amount": 150,
  "description": "Premium tip purchase"
}
```

### Interview Tracking
**POST** `/api/gamification/track-interview`
```json
{
  "userId": "user-id",
  "sessionId": "session-123",
  "interviewType": "Estructurada",
  "difficultyLevel": "intermedio",
  "totalQuestions": 8,
  "timeSpentMinutes": 20,
  "overallScore": 85,
  "tipsFreeUsed": 2,
  "tipsPremiumUsed": 1,
  "dtcSpentThisSession": 150
}
```

### DTC Purchase (Stripe Ready)
**POST** `/api/gamification/dtc-purchase`
```json
{
  "userId": "user-id",
  "packageId": "basic",
  "dtcAmount": 700,
  "price": 14.99
}
```

### Gamification Profile
**GET** `/api/gamification/profile?userId=user-id`

## Components

### Interview Tips
**Path:** `components/interview-tips.tsx`
- Displays free (3) and premium tips (3 for 150 DTC)
- AI-powered coaching using OpenAI
- Real-time balance updates

### DTC Shop
**Path:** `components/dtc-shop.tsx`
- 4 package tiers (Starter, Basic, Pro, Elite)
- Bonus points for larger purchases
- FAQ and value proposition

### Gamification Profile
**Path:** `components/gamification-profile.tsx`
- Level progression (Bronze → Diamond)
- XP tracking and next-level visualization
- Badges and achievements
- Streak counter with motivation

## Pages

- `/despega/a3/gamification` - Gamification dashboard & profile
- `/despega/a3/dtc-shop` - DTC points store

## Question Enhancements

All 10+ questions now include:
```json
{
  "tips_available": 3,
  "time_limit_seconds": 120,
  "difficulty_score": 4,
  "duration_minutes": 3,
  "key_points": ["Structure", "Content", "Delivery"],
  "common_mistakes": ["Too vague", "Rambling"],
  "follow_ups": ["Why this approach?"],
  "success_indicators": ["Clear answer", "Evidence-based"]
}
```

## Gamification Mechanics

### XP System
- Base: 100 XP per interview
- Score bonus: Score/2 XP
- Time bonus: 50 XP for 15+ min interviews
- Total per interview: 150-300 XP

### Levels
- **Bronze**: 0-500 XP
- **Silver**: 500-1,500 XP
- **Gold**: 1,500-3,500 XP
- **Platinum**: 3,500-7,000 XP
- **Diamond**: 7,000+ XP

### Badges (10+ total)
- First Interview
- Interview Starter (5 complete)
- Interview Master (10 complete)
- Interview Legend (25 complete)
- Week Warrior (7-day streak)
- Monthly Master (30-day streak)
- Perfect Score (90+ score)
- Bronze/Silver/Gold Graduate (level completions)

### DTC Points
- **Free Earning**: 3 tips per interview
- **Purchase**: $4.99-$59.99 packages
- **Use**: 150 DTC = 3 premium tips
- **Bonus**: 16-25% bonus on larger packages

## Stripe Integration (Optional)

To add real Stripe payments:

1. Install Stripe
```bash
pnpm add stripe @stripe/stripe-js
```

2. Update `/api/gamification/dtc-purchase/route.ts` with Stripe logic

3. Create Stripe checkout session in route handler

4. Add webhook for payment confirmation

## Free vs Premium Tips Comparison

| Feature | Free Tips | Premium Tips |
|---------|-----------|-------------|
| Per Interview | 3 | 3 (150 DTC) |
| AI Power | Advanced | Advanced+ |
| Techniques | Fundamental | Advanced |
| Response Quality | Good | Excellent |
| Confidence Score | 0.7-0.8 | 0.85-0.95 |

## Usage Flow

1. **User starts interview** → Gets setup with 3 free tips
2. **During interview** → Can request free tips in real-time
3. **Free tips exhausted** → Can purchase premium (150 DTC)
4. **After interview** → XP and streak tracked automatically
5. **Level up** → Unlock new badges and achievements
6. **Browse profile** → See level, badges, stats
7. **Visit shop** → Purchase DTC points for future interviews

## Testing

Without database migrations:
```bash
# These will fail until migrations run
curl -X POST http://localhost:3000/api/interview/generate-ai-tip \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","questionText":"Hi","isPremium":false}'
```

With migrations:
```bash
# Will successfully create and track gamification data
# Check Supabase dashboard for records
```

## Notes

- DTC purchase API is ready for Stripe integration
- All AI tips use OpenAI GPT-4 by default
- Interview time must be 15+ minutes for time bonus
- Streaks reset if no interview in 24 hours
- Badges are cumulative and never lost
- All data has proper RLS policies for security

## Next Steps

1. Run SQL migrations in Supabase
2. Test API endpoints with sample requests
3. Verify AI tips generate correctly
4. Connect Stripe for real payments
5. Monitor gamification metrics on dashboard
