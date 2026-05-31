# 🚀 Despega Tu Carrera (DTC) — Career Development Platform

> **PROPRIETARY SOFTWARE**  
> © 2026 Despega Tu Carrera (DTC). All rights reserved.  
> **Unauthorized use, copying, distribution, or derivative work is strictly prohibited.**

---

## Overview

**Despega Tu Carrera** is an intelligent, AI-powered career transformation platform designed to accelerate professional development through a structured 90-day program. The platform combines personalized coaching, skill assessments, interview preparation, and strategic document development to help professionals reach their career goals.

### What Makes DTC Unique

- **Intelligent Context Memory**: Every interaction feeds into a unified memory system that understands the user's journey
- **Adaptive Learning**: Content and challenges adapt based on user performance and identified gaps
- **Multi-Agent AI Coaching**: Specialized AI agents (Coach, Sofia, Elena, Bruno) provide contextual guidance
- **Integrated Skill Development**: 4 pillars + 10 specialized modules cover all aspects of career growth
- **Evidence-Based Progression**: Smart unlock rules ensure users master fundamentals before advancing

---

## 🎯 Core Features

### 4 Pillars of Career Development

1. **C1 - Career Foundation** — Define your career goals and current situation
2. **A1 - Identity Audit** — Discover your strengths, weaknesses, and communication style
3. **C2 - Context Bridge** — Align career goals with market opportunities
4. **A2-A4 - Adaptive Modules** — 6 training modules + 4 interview simulation modules + document strategy

### Key Capabilities

- **AI-Powered Coaching**: Personalized guidance from specialized coach agents
- **Adaptive Curriculum**: Daily tasks generated based on user progress and learning patterns
- **Interview Simulation (A3)**: Three difficulty levels (Basic, Advanced, Pro) with real feedback
- **Strategic Documents (A4)**: CV, STAR stories, and evidence-based portfolios
- **Progress Analytics**: Real-time insights into user advancement and performance
- **Smart Unlock System**: Prevents users from advancing until they've mastered prerequisites

---

## 🏗️ Architecture

### Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Next.js API Routes, Server Actions, Edge Functions |
| **Database** | Supabase (PostgreSQL) with Row Level Security |
| **Authentication** | Supabase Auth with session management |
| **AI/LLM** | OpenAI API (GPT-4/GPT-4 Mini), AI SDK 6 |
| **Storage** | Vercel Blob for document storage |
| **Deployment** | Vercel Edge Network |

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js Frontend (Client)              │
│  Dashboard • Modules • A3 Interviews • A4 Documents     │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              DTC AgentOS (Backend)                      │
│  ├─ Command Registry (/dtc:* commands)                 │
│  ├─ Agent Registry (Coach, Sofia, Elena, Bruno)        │
│  ├─ Memory Manager (Contextual user data)              │
│  ├─ Context Builder (Unified context for AI)           │
│  ├─ Evaluation Engine (Module scoring & rubrics)       │
│  └─ Unlock Rules Engine (Smart prerequisites)          │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│            Supabase Database (PostgreSQL)                │
│  ├─ User Profiles & Progress                           │
│  ├─ Memory Items (semantic user knowledge)             │
│  ├─ Module State & Evaluations                         │
│  ├─ Interview Sessions & Answers                       │
│  ├─ Documents & Evidence                               │
│  └─ Analytics & Progress Metrics                       │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Project Structure

```
/
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── dtc-agentos/        # AgentOS command endpoints
│   │   ├── a3-interview/       # Interview simulation API
│   │   ├── a4-documents/       # Document management API
│   │   └── analytics/          # Analytics endpoints
│   ├── (dashboard)/            # Dashboard pages
│   ├── (auth)/                 # Authentication pages
│   └── layout.tsx              # Root layout
│
├── lib/
│   ├── dtc-agentos/           # Core AgentOS system
│   │   ├── registries/        # Command, Agent, Mode registries
│   │   ├── context/           # Context builder & memory
│   │   ├── evaluation/        # Rubrics & scoring
│   │   ├── unlock/            # Unlock rules engine
│   │   └── commands/          # DTC command implementations
│   ├── a3/                    # Interview simulation logic
│   ├── a4/                    # Document engine
│   ├── interviewer-agents.ts  # AI agent definitions
│   └── database/              # Supabase client & queries
│
├── components/
│   ├── dashboard/             # Dashboard components
│   ├── modules/               # Module-specific components
│   ├── a3/                    # Interview components
│   └── ui/                    # Reusable UI components
│
├── public/
│   ├── corfo-mvp/            # CORFO MVP presentation assets
│   └── dtc_mvp.html          # Static PDF generation page
│
├── scripts/
│   ├── seed-*.sql            # Database setup scripts
│   └── migrations/           # DB migrations
│
└── v0_plans/
    └── 02-BIG-COMPREHENSIVE-BUILD-PLAN.md  # Implementation guide
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm, npm, or yarn
- Supabase account (create at [supabase.com](https://supabase.com))
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jcv86/main.git
   cd main
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or: npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials:
   # - NEXT_PUBLIC_SUPABASE_URL
   # - NEXT_PUBLIC_SUPABASE_ANON_KEY
   # - SUPABASE_SERVICE_ROLE_KEY
   # - OPENAI_API_KEY
   # - NEXTAUTH_SECRET
   ```

4. **Set up the database**
   ```bash
   # Run migration scripts in scripts/ directory
   # Connect to Supabase and execute SQL files in order
   ```

5. **Start development server**
   ```bash
   pnpm run dev
   # Open http://localhost:3000
   ```

### Environment Variables

See `.env.example` for all required variables. Key variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://www.despegatucarrera.com

# AI
OPENAI_API_KEY=your-openai-key

# Application
NEXT_PUBLIC_APP_URL=https://www.despegatucarrera.com
```

---

## 📊 Database Schema

Key tables:

- `users` — User accounts and profiles
- `despega_user_profiles` — Career journey state
- `memory_items` — Semantic user knowledge base
- `dtc_days` — Daily progress tracking
- `a3_interview_sessions` — Interview simulation state
- `a3_session_attempts` — Interview answers & scoring
- `dtc_documents` — CV, STAR stories, portfolios
- `evaluations` — Module-level scoring
- `unlock_events` — Feature unlock tracking
- `agent_runs` — AI agent execution logs

---

## 🔧 Development

### Build

```bash
pnpm run build    # Production build
pnpm run dev      # Development with hot reload
pnpm run lint     # Check TypeScript & ESLint
```

### Database Migrations

```bash
# Connect to Supabase database
# Run scripts from scripts/ directory in this order:
# 1. setup-base-tables.sql
# 2. seed-travis-profile.sql
# 3. setup-a3-database.sql
# 4. setup-a4-database.sql
```

### Testing

```bash
pnpm run test     # Run test suite
```

---

## 📝 Key DTC Commands

The system uses a command-based architecture:

```typescript
// Profile capture (C1)
/dtc:c1-profile-capture

// Identity audit (A1)
/dtc:a1-identity-audit

// Context bridge (C2)
/dtc:c2-context-bridge

// Daily generation (A2)
/dtc:a2-generate-day

// Interview simulation (A3)
/dtc:a3-run-interview

// Document analysis (A4)
/dtc:a4-create-document

// Utility commands
/dtc:memory-update
/dtc:evaluate-answer
```

---

## 🤝 Contributing

**Note**: This is a proprietary project. External contributions are **not accepted**.

Internal development follows these guidelines:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test thoroughly
3. Commit with descriptive messages
4. Create a pull request to `main`
5. Require code review from DTC maintainers

---

## 📄 License

**PROPRIETARY SOFTWARE**

This project is proprietary software owned by **Despega Tu Carrera (DTC)**.

### What You Cannot Do
- ❌ Use the software without authorization
- ❌ Copy, clone, or fork the codebase
- ❌ Modify or create derivative works
- ❌ Distribute, sell, or sublicense
- ❌ Reverse engineer, decompile, or disassemble
- ❌ Remove copyright or license notices

### What is Prohibited
All code, architecture, algorithms, UI/UX design, content, documentation, database schemas, prompts, AI models, and strategies are proprietary to DTC. Unauthorized use may result in legal action.

### Legal Contact
For licensing inquiries or legal concerns:
📧 **legal@despegatucarrera.com**

See the [LICENSE](./LICENSE) file for the complete legal terms.

---

## 📞 Support

For issues, questions, or feedback:
- 📧 Email: support@despegatucarrera.com
- 🌐 Website: https://www.despegatucarrera.com

---

## 🎓 Project Status

- **Version**: 1.0.0-MVP
- **Status**: Production Ready
- **Last Updated**: May 2026
- **Build Status**: ✅ Production Build (0 errors)
- **Pages Generated**: 379/379 ✅

---

## 🏆 Acknowledgments

Built by the **Despega Tu Carrera Team** with cutting-edge AI integration for professional career transformation.

---

**Made with ❤️ by Despega Tu Carrera (DTC) — Transforming Careers, One Day at a Time.**
