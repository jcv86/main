# Smart Interviewer Agent System

## Overview

The interview platform now features 6 unique expert interviewers, each with distinct personalities, expertise, and evaluation approaches. Each interviewer is powered by OpenAI's API to provide intelligent, contextual feedback tailored to their specialty.

---

## The 6 Expert Interviewers

### 1. **Sofia** - Senior Recruiter
**ID:** `interviewer-classic-1`
**Role:** Reclutadora Senior (10+ years)

**Expertise:**
- Talent Acquisition
- Cultural Fit Assessment
- Soft Skills Evaluation
- Communication Analysis

**Personality:** Empathetic, observant, seeks genuine motivations, values authenticity

**Evaluation Focus:**
- Cultural alignment
- Communication clarity
- Authenticity & honesty
- Growth mindset
- Values alignment

**Follow-up Strategy:** Deepens response analysis, seeks concrete examples, explores values and future vision

**Key Traits:**
- Warm but demanding
- Detects inconsistencies gently
- Values honest, constructive responses
- Assesses introspection and learning capacity

---

### 2. **Marco** - Senior Engineering Manager
**ID:** `interviewer-classic-2`
**Role:** Manager Senior de Ingeniería (12+ years)

**Expertise:**
- Technical Excellence
- Problem Solving
- Leadership & Team Dynamics
- Scalability & System Design

**Personality:** Direct, demanding, respects technical competence, seeks depth in thinking

**Evaluation Focus:**
- Technical depth & quality
- Complex problem-solving
- Architecture & scalability
- Practical experience
- Technical leadership

**Follow-up Strategy:** Challenges responses technically, requests implementation details, explores trade-offs

**Key Traits:**
- Direct and technical
- Won't accept superficial answers
- Values humility before unknowns
- Appreciates learning curiosity

---

### 3. **Elena** - VP Talent & Culture
**ID:** `interviewer-classic-3`
**Role:** VP de Talent & Culture (15+ years)

**Expertise:**
- Strategic Thinking
- Leadership Excellence
- Organizational Vision
- Team Dynamics & Culture

**Personality:** Strategic, insightful, seeks transformational leadership, values vision

**Evaluation Focus:**
- Strategic vision & thinking
- Transformational leadership
- Organizational impact
- Emotional intelligence
- Executive presence

**Follow-up Strategy:** Explores organizational impact, inquires about difficult decisions, analyzes strategic thinking

**Key Traits:**
- Insightful & strategic
- Seeks executive-potential candidates
- Values self-awareness
- Identifies high-growth potential

---

### 4. **David** - Tech Lead & Architect
**ID:** `interviewer-classic-4`
**Role:** Tech Lead y Arquitecto (11+ years)

**Expertise:**
- Code Quality
- Software Architecture
- Best Practices
- Innovation & Pragmatism
- Mentoring Capability

**Personality:** Pragmatic, passionate about excellence, natural mentor, respects passion

**Evaluation Focus:**
- Code quality standards
- Architectural thinking
- Best practices knowledge
- Innovation with pragmatism
- Mentoring ability

**Follow-up Strategy:** Questions technical decisions, explores trade-offs, seeks architectural understanding

**Key Traits:**
- Pragmatic but exacting
- Questions specific technical choices
- Continuous learning advocate
- Values improvement mindset

---

### 5. **Alex** - Product Manager
**ID:** `interviewer-modern-1`
**Role:** Product Manager (9+ years)

**Expertise:**
- Product Thinking
- User-Centric Design
- Analytics & Data
- Business Acumen
- Cross-team Collaboration

**Personality:** Curious, user-focused, data-driven, collaborative, innovative

**Evaluation Focus:**
- Product-oriented thinking
- User empathy
- Analytics mindset
- Business acumen
- Cross-functional collaboration

**Follow-up Strategy:** Explores user impact, questions metrics, investigates product trade-offs

**Key Traits:**
- Curious & asks "why" frequently
- Thinks in real user cases
- Values experimental mindset
- Results-oriented

---

### 6. **Jordan** - CEO Advisor & Consultant
**ID:** `interviewer-modern-2`
**Role:** CEO Advisor & Consultant (16+ years)

**Expertise:**
- Executive Coaching
- Strategic Planning
- Change Management
- Talent Development
- Business Strategy

**Personality:** Mentor, insightful, natural coach, seeks latent potential, brings out the best in people

**Evaluation Focus:**
- Unrealized leadership potential
- Entrepreneurial mindset
- Influence & impact
- Resilience & adaptability
- Self-awareness

**Follow-up Strategy:** Mentors through questions, explores limiting beliefs, challenges assumptions

**Key Traits:**
- Natural mentor seeking best in candidates
- Asks powerful reflection questions
- Values curiosity & humility
- Seeks growth hunger

---

## How It Works

### 1. **Interview Selection**
Users select an interviewer from the 6 options. Each selection changes:
- Avatar and appearance
- Personality in responses
- Type of questions asked
- Evaluation criteria
- Follow-up question strategy

### 2. **Question Generation**
When a user starts an interview with an interviewer:
- Questions are tailored to the interviewer's expertise
- Sofia focuses on soft skills & motivation
- Marco focuses on technical depth
- Elena focuses on strategic thinking
- David focuses on code quality & architecture
- Alex focuses on product thinking
- Jordan focuses on leadership potential

### 3. **Intelligent Feedback**
When a user submits their response:

**API Call:** `POST /api/interview/evaluator`

```json
{
  "interviewerId": "interviewer-classic-1",
  "question": "Tell me about yourself...",
  "userResponse": "I have 5 years of...",
  "questionCategory": "Introduction",
  "difficulty": "basico"
}
```

**Response:**
```json
{
  "success": true,
  "score": 78,
  "feedback": {
    "strengths": ["Clear structure", "Relevant examples", "Good energy"],
    "improvements": ["Go deeper on impact", "Reduce response time"],
    "staAnalysis": {
      "situation": "Well-framed context",
      "task": "Clear responsibilities",
      "action": "Specific actions mentioned",
      "result": "Demonstrated impact"
    },
    "interviewerObservation": "Sofia's observation about your response..."
  },
  "followUp": "Tell me more about why you chose this career..."
}
```

### 4. **Follow-up Questions**
Each interviewer generates contextual follow-ups based on:
- Their area of expertise
- The original response
- Their evaluation strategy
- Question difficulty level

---

## Technical Implementation

### System Architecture

```
User Interview Session
    ↓
Select Interviewer (Sofia/Marco/Elena/David/Alex/Jordan)
    ↓
Submit Response
    ↓
POST /api/interview/evaluator
    ↓
Interviewer Agent System (lib/interviewer-agents.ts)
    ↓
OpenAI API Call (gpt-4o-mini)
    ↓
Intelligent Feedback Generated
    ↓
Response Displayed with Interviewer Perspective
```

### Key Files

**1. `/lib/interviewer-agents.ts`** - Agent Definitions
- `INTERVIEWER_AGENTS` - Profile definitions for all 6 interviewers
- `generateInterviewerFeedback()` - OpenAI API integration
- `getInterviewerDescription()` - UI/display helper

**2. `/app/api/interview/evaluator/route.ts`** - API Endpoint
- Validates request parameters
- Routes to appropriate interviewer agent
- Calls OpenAI API with interviewer system prompt
- Returns structured JSON feedback

**3. `/components/conversational-interview-simulator.tsx`** - UI Integration
- Displays selected interviewer avatar
- Calls evaluator API on response submission
- Shows interviewer-specific feedback
- Updates follow-up questions

### OpenAI Integration

**Model:** `gpt-4o-mini` (cost-effective while maintaining quality)

**Parameters:**
- `temperature: 0.7` - Balance between consistency and creativity
- `max_tokens: 1000` - Sufficient for detailed feedback
- `system: "You are {InterviewerProfile}"` - Role-based prompting

**Prompt Structure:**
Each OpenAI call includes:
1. Full interviewer system prompt (personality & expertise)
2. Interview question
3. User's response
4. Category & difficulty level
5. Specific evaluation criteria
6. Request for JSON response format

**Response Format (Always JSON):**
```json
{
  "score": 60-100,
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2"],
  "staAnalysis": {
    "situation": "...",
    "task": "...",
    "action": "...",
    "result": "..."
  },
  "interviewerObservation": "...",
  "followUp": "..."
}
```

---

## Key Differences Between Interviewers

### Sofia (Recruiter)
- **Asks about:** Motivation, values, growth, culture fit
- **Cares about:** Honesty, authenticity, communication
- **Scores based on:** Soft skills, cultural alignment
- **Follow-ups are:** Warm but probing

### Marco (Engineering Manager)
- **Asks about:** Technical depth, architecture, trade-offs
- **Cares about:** Technical competence, system thinking
- **Scores based on:** Technical quality, problem-solving depth
- **Follow-ups are:** Challenging and specific

### Elena (VP Culture)
- **Asks about:** Strategy, impact, leadership vision
- **Cares about:** Executive presence, strategic thinking
- **Scores based on:** Leadership potential, organizational impact
- **Follow-ups are:** Strategic and reflective

### David (Tech Lead)
- **Asks about:** Code quality, architecture, best practices
- **Cares about:** Excellence, continuous learning
- **Scores based on:** Technical skills, innovation
- **Follow-ups are:** Practical and design-focused

### Alex (Product Manager)
- **Asks about:** User impact, metrics, product thinking
- **Cares about:** Data-driven decisions, user empathy
- **Scores based on:** Product thinking, business acumen
- **Follow-ups are:** Data and user-focused

### Jordan (CEO Advisor)
- **Asks about:** Leadership potential, resilience, growth
- **Cares about:** Self-awareness, entrepreneurial thinking
- **Scores based on:** Leadership potential, adaptability
- **Follow-ups are:** Coaching and reflective

---

## Features

✅ **Distinct Personalities** - Each interviewer has unique communication style
✅ **Expert Evaluation** - Specialized criteria based on role
✅ **Context-Aware Feedback** - Responses tailored to expertise area
✅ **Real-time AI** - OpenAI integration for intelligent responses
✅ **Follow-up Strategy** - Different follow-up approaches per interviewer
✅ **STAR Analysis** - Structured feedback for each response
✅ **Interviewer Observations** - Personal comments from each interviewer
✅ **Real Difficulty Assessment** - Scores 60-100 based on actual performance
✅ **Actionable Improvements** - Specific, role-based suggestions

---

## Environment Setup

Required:
```
OPENAI_API_KEY=sk-...
```

Optional (for premium features):
```
OPENAI_API_ORG_ID=org-...
```

---

## Usage Example

### 1. User Selects Interviewer
```typescript
selectedInterviewerId = 'interviewer-classic-1' // Sofia
```

### 2. User Answers Question
```
Question: "Tell me about a time you solved a complex problem"
Response: "I led a team to implement a microservices..."
```

### 3. System Calls API
```typescript
POST /api/interview/evaluator
{
  "interviewerId": "interviewer-classic-1",
  "question": "Tell me about a time...",
  "userResponse": "I led a team...",
  "questionCategory": "Problem-Solving",
  "difficulty": "intermedio"
}
```

### 4. Receives Expert Feedback
Sofia provides feedback focused on:
- Communication clarity
- Team collaboration
- Motivation clarity
- Growth demonstrated

---

## Performance & Cost

**API Calls:** 1 per user response
**Model:** gpt-4o-mini (cost-efficient)
**Response Time:** ~2-3 seconds per feedback
**Token Usage:** ~400-600 tokens per response
**Cost Estimate:** ~$0.01-0.02 per response

---

## Future Enhancements

1. **Interview History** - Track performance across interviewers
2. **Interviewer Preferences** - Learn user patterns
3. **Blind Interviewing** - Don't reveal scores until end
4. **Interview Comparison** - Compare same response to multiple interviewers
5. **Voice Integration** - Record video responses
6. **Custom Interviewers** - Users create their own expert profiles
7. **Multi-round Interviews** - Progressive difficulty levels

---

## Support

For issues with the smart interviewer system:
1. Check OPENAI_API_KEY is set
2. Verify interviewerId exists in INTERVIEWER_AGENTS
3. Check question & userResponse are non-empty
4. Review console logs for OpenAI API errors

