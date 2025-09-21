import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function GET() {
  try {
    const { data: books, error } = await supabase
      .from("knowledge_base")
      .select("*")
      .order("read_count", { ascending: false })

    if (error) {
      console.error("Error fetching books:", error)

      // Return fallback data if database fails
      const fallbackBooks = [
        {
          id: 1,
          title: "Deep Work: Rules for Focused Success in a Distracted World",
          author: "Cal Newport",
          category: "Productivity",
          content: `Deep work is professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit. These efforts create new value, improve your skill, and are hard to replicate.

**The Deep Work Hypothesis:**
The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy. As a consequence, the few who cultivate this skill, and then make it the core of their working life, will thrive.

**Deep Work Rules:**

1. **Work Deeply**: Transform deep work from an aspiration into a regular practice through the development of routines and rituals.

2. **Embrace Boredom**: The ability to concentrate intensely is a skill that must be trained. Efforts to deepen your focus will struggle if you don't simultaneously wean your mind from a dependence on distraction.

3. **Quit Social Media**: Network tools are distracting us from work that requires unbroken concentration, while simultaneously degrading our capacity to remain focused.

4. **Drain the Shallows**: Identify and minimize the shallow work in your schedule to make room for deep work.

**Practical Strategies:**

- **Philosophies of Deep Work**: Choose between monastic, bimodal, rhythmic, or journalistic approaches
- **Ritualize**: Create specific routines around when, where, and how you work deeply
- **Make Grand Gestures**: Leverage radical changes to your environment to support deep work
- **Don't Work Alone**: Use collaboration strategically to push your deep work to new levels
- **Execute Like a Business**: Apply the 4 Disciplines of Execution to your deep work practice

**The Four Disciplines:**
1. Focus on the Wildly Important
2. Act on Lead Measures
3. Keep a Compelling Scoreboard  
4. Create a Cadence of Accountability

**Benefits:**
- Produce better results in less time
- Experience the satisfaction that comes from craftsmanship
- Develop skills that are increasingly rare and valuable
- Create work that matters in an increasingly competitive economy

Deep work is not just a productivity strategy—it's a philosophy that can transform both your work and your life, leading to greater satisfaction, better results, and a more meaningful career.`,
          tags: ["productivity", "focus", "concentration", "deep work", "distraction"],
          slug: "deep-work-focused-success",
          read_count: 1247,
          created_at: "2024-01-15T00:00:00Z",
          updated_at: "2024-01-20T00:00:00Z",
        },
        {
          id: 2,
          title: "Atomic Habits: An Easy & Proven Way to Build Good Habits",
          author: "James Clear",
          category: "Personal Development",
          content: `Changes that seem small and unimportant at first will compound into remarkable results if you are willing to stick with them for years. This is the power of atomic habits—tiny changes that deliver remarkable results.

**The Four Laws of Behavior Change:**

**1st Law: Make It Obvious**
- Use implementation intentions: "I will [BEHAVIOR] at [TIME] in [LOCATION]"
- Use habit stacking: "After [CURRENT HABIT], I will [NEW HABIT]"
- Design your environment to make good habits obvious
- Use visual cues to trigger desired behaviors

**2nd Law: Make It Attractive**
- Use temptation bundling: pair actions you want to do with actions you need to do
- Join a culture where your desired behavior is normal
- Create a motivation ritual before difficult habits
- Highlight the benefits of avoiding bad habits

**3rd Law: Make It Easy**
- Reduce friction for good habits and increase friction for bad habits
- Use the Two-Minute Rule: scale habits down until they take less than two minutes
- Prepare your environment to make future actions easier
- Use technology to automate good habits

**4th Law: Make It Satisfying**
- Use reinforcement: give yourself immediate rewards for good habits
- Make "doing nothing" enjoyable for habits you want to avoid
- Use a habit tracker to visualize progress
- Never miss twice: get back on track quickly after mistakes

**Key Concepts:**

**Systems vs. Goals:**
- Goals are about the results you want to achieve
- Systems are about the processes that lead to those results
- Focus on systems, not goals, for lasting change

**Identity-Based Habits:**
- Every action is a vote for the type of person you wish to become
- Focus on who you want to be, not what you want to achieve
- Ask: "What would a healthy person do?" or "What would an organized person do?"

**The Plateau of Latent Potential:**
- Habits often appear to make no difference until you cross a critical threshold
- Breakthrough moments are often the result of many previous actions
- Be patient with the process—results will compound over time

**Practical Applications:**

**For Building Good Habits:**
1. Start with habits so small they seem trivial
2. Stack new habits onto existing routines
3. Design your environment for success
4. Track your progress visually
5. Celebrate small wins immediately

**For Breaking Bad Habits:**
1. Make them invisible (remove cues)
2. Make them unattractive (focus on downsides)
3. Make them difficult (increase friction)
4. Make them unsatisfying (create accountability)

**Advanced Tactics:**
- Use habit stacking to build routines
- Create implementation intentions for specific scenarios
- Use environment design to support desired behaviors
- Apply the Goldilocks Rule: work on challenges of just manageable difficulty

The secret to getting results that last is to never stop making improvements. It's remarkable what you can build if you just don't stop.`,
          tags: ["habits", "behavior change", "self-improvement", "systems", "identity"],
          slug: "atomic-habits-build-good",
          read_count: 2156,
          created_at: "2024-01-10T00:00:00Z",
          updated_at: "2024-01-18T00:00:00Z",
        },
        {
          id: 3,
          title: "The Lean Startup: How Today's Entrepreneurs Use Continuous Innovation",
          author: "Eric Ries",
          category: "Entrepreneurship",
          content: `The Lean Startup methodology is a scientific approach to creating and managing successful startups in an age when companies need to innovate more than ever. It's about learning what your customers really want and learning it quickly.

**Core Principles:**

**Build-Measure-Learn Loop:**
The fundamental activity of a startup is to turn ideas into products, measure how customers respond, and then learn whether to pivot or persevere. All successful startup processes should be geared to accelerate this feedback loop.

**Minimum Viable Product (MVP):**
The MVP is that version of a new product that allows a team to collect the maximum amount of validated learning about customers with the least effort. It's not necessarily the smallest product imaginable; it's simply the fastest way to get through the Build-Measure-Learn feedback loop.

**Validated Learning:**
Validated learning is the process of demonstrating empirically that a team has discovered valuable truths about a startup's present and future business prospects. It's more concrete, accurate, and faster than market forecasting or classical business planning.

**Innovation Accounting:**
A way of evaluating progress when all the metrics typically used in an established company (revenue, customers, ROI, market share) are effectively zero. It focuses on learning milestones instead of traditional milestones.

**The Five Principles:**

1. **Entrepreneurs are everywhere**: Entrepreneurship is a kind of management, and it works in companies of all sizes, even very large enterprises, in any sector or industry.

2. **Entrepreneurship is management**: A startup is an institution, not just a product, and so it requires a new kind of management specifically geared to its context of extreme uncertainty.

3. **Validated learning**: Startups exist not just to make stuff, make money, or serve customers. They exist to learn how to build a sustainable business.

4. **Build-Measure-Learn**: The fundamental activity of a startup is to turn ideas into products, measure how customers respond, and learn whether to pivot or persevere.

5. **Innovation accounting**: To improve entrepreneurial outcomes and hold innovators accountable, we need to focus on the boring stuff: how to measure progress, how to set up milestones, and how to prioritize work.

**Key Concepts:**

**Pivot vs. Persevere:**
A pivot is a structured course correction designed to test a new fundamental hypothesis about the product, strategy, and engine of growth. Types of pivots include:
- Zoom-in pivot: A single feature becomes the whole product
- Zoom-out pivot: The whole product becomes a single feature
- Customer segment pivot: The product hypothesis is confirmed but for a different customer
- Customer need pivot: The target customer has a problem worth solving, just not the one originally anticipated

**Engines of Growth:**
- **Sticky Engine**: Focuses on attracting and retaining customers for the long term
- **Viral Engine**: Depends on person-to-person transmission as a necessary consequence of normal product use
- **Paid Engine**: Uses advertising or sales to acquire customers

**Practical Implementation:**

**Getting Started:**
1. Identify your leap-of-faith assumptions
2. Build an MVP to test these assumptions
3. Establish baseline metrics
4. Tune the engine from baseline toward ideal

**Measuring Progress:**
- Use cohort analysis to understand customer behavior
- Focus on actionable metrics, not vanity metrics
- Implement split-testing (A/B testing) for product decisions
- Create learning milestones, not just product milestones

**Building the Right Product:**
- Start with a clear value hypothesis and growth hypothesis
- Use customer development to validate assumptions
- Implement continuous deployment for rapid iteration
- Focus on sustainable growth, not just growth

**Organizational Learning:**
- Create cross-functional teams with clear accountability
- Implement innovation accounting to measure progress
- Use the "Five Whys" technique for root cause analysis
- Build adaptive organizations that can pivot when necessary

The Lean Startup approach helps entrepreneurs and innovators reduce waste, increase their odds of success, and build products that customers actually want. It's not just for startups—these principles can be applied in organizations of any size to drive innovation and growth.`,
          tags: ["entrepreneurship", "startup", "innovation", "lean", "mvp", "pivot"],
          slug: "lean-startup-continuous-innovation",
          read_count: 892,
          created_at: "2024-01-05T00:00:00Z",
          updated_at: "2024-01-15T00:00:00Z",
        },
        {
          id: 4,
          title: "Crucial Conversations: Tools for Talking When Stakes Are High",
          author: "Kerry Patterson, Joseph Grenny, Ron McMillan, Al Switzler",
          category: "Communication",
          content: `Crucial conversations are discussions between two or more people where stakes are high, opinions vary, and emotions run strong. These conversations can have a huge impact on your career, your happiness, and your life.

**What Makes a Conversation Crucial:**
- Opinions vary: People have different views about the topic
- Stakes are high: The outcome matters and could impact lives significantly  
- Emotions run strong: People care deeply about the topic and may become emotional

**The Power of Dialogue:**
When people feel safe to share their meaning—even when it's controversial, uncomfortable, or at odds with yours—you're in dialogue. The free flow of meaning between people is the key to successful crucial conversations.

**Start with Heart:**
Before you open your mouth, you need to know what you really want—for yourself, for others, and for the relationship. Ask yourself:
- What do I really want for myself?
- What do I really want for others?
- What do I really want for the relationship?
- How would I behave if I really wanted these results?

**Learn to Look:**
Learn to look for safety problems and silence or violence:

**Silence:** When people feel unsafe, they withdraw from conversation through:
- Masking: Understating or selectively showing true opinions
- Avoiding: Steering completely away from sensitive subjects
- Withdrawing: Pulling out of the conversation entirely

**Violence:** When people feel unsafe, they try to force meaning through:
- Controlling: Coercing others to your way of thinking
- Labeling: Putting a label on people or ideas to dismiss them
- Attacking: Speaking in ways that tear down others

**Make It Safe:**
When you notice safety is at risk, step out of the conversation and rebuild safety by:

**Apologizing:** When you've made a mistake that has hurt others
**Contrasting:** When others misunderstand your purpose or intent
**Creating Mutual Purpose:** When you're at cross-purposes

**STATE Your Path:**
When you have a tough message to share, or when you're so convinced of your own rightness that you may push too hard, remember to STATE:

- **Share** your facts: Start with the least controversial, most persuasive elements
- **Tell** your story: Explain what you're beginning to conclude
- **Ask** for others' paths: Encourage others to share their facts, stories, and feelings
- **Talk** tentatively: State your story as a story—don't disguise it as fact
- **Encourage** testing: Make it safe for others to express differing or opposing views

**Explore Others' Paths:**
When others are in silence or violence, help them feel safe to share their meaning:

**Ask:** Start with an attitude of curiosity and patience
**Mirror:** Acknowledge the emotions people are feeling
**Paraphrase:** Restate what you've heard to show you understand
**Prime:** If others continue to hold back, take your best guess at what they may be thinking or feeling

**Move to Action:**
Turn your successful crucial conversations into results and relationships:

**Decide How to Decide:**
- Command: Decisions made without involving others
- Consult: Input is gathered from others before deciding
- Vote: An agreed-upon percentage swings the decision
- Consensus: Everyone comes to an agreement and then supports the final decision

**Finish Clearly:**
- Who does what by when?
- How will you follow up?
- Document the details and follow up

**Common Crucial Conversations:**

**At Work:**
- Giving negative feedback to a colleague
- Discussing problems with your boss
- Addressing team performance issues
- Negotiating salary or promotions

**At Home:**
- Talking with a spouse about relationship problems
- Discussing household responsibilities
- Addressing issues with children's behavior
- Having financial discussions

**Practical Tips:**

1. **Prepare mentally:** Before the conversation, get your heart right and clarify what you really want
2. **Create safety first:** People won't share honestly if they don't feel safe
3. **Listen with curiosity:** Seek to understand before seeking to be understood
4. **Speak persuasively, not abrasively:** Share your view in a way that invites dialogue
5. **Agree on next steps:** End with clear commitments about who will do what by when

**Master Your Stories:**
The stories we tell ourselves about what's happening drive our emotions and actions. Learn to:
- Separate facts from stories
- Challenge your assumptions
- Tell the most respectful story possible
- Take responsibility for your role in problems

Mastering crucial conversations is one of the most important skills you can develop. It will improve your relationships, increase your influence, and help you achieve better results in every area of your life.`,
          tags: ["communication", "difficult conversations", "dialogue", "conflict resolution", "leadership"],
          slug: "crucial-conversations-high-stakes",
          read_count: 1543,
          created_at: "2024-01-12T00:00:00Z",
          updated_at: "2024-01-22T00:00:00Z",
        },
        {
          id: 5,
          title: "The First 90 Days: Proven Strategies for Getting Up to Speed Faster",
          author: "Michael Watkins",
          category: "Leadership",
          content: `The first 90 days in a new leadership role are critical. The actions you take during this period will largely determine whether you succeed or fail in your new position. This book provides a systematic approach for leaders at all levels to accelerate their transitions.

**The Transition Timeline:**

**Before Day One: Prepare Yourself**
- Get oriented to the business situation
- Begin building key relationships
- Clarify expectations with your new boss
- Secure early wins to build credibility

**First 30 Days: Learn and Listen**
- Assess the situation you're inheriting
- Build relationships with key stakeholders  
- Understand the culture and politics
- Identify quick wins and potential pitfalls

**Days 30-60: Develop Your Strategy**
- Complete your situational assessment
- Begin making necessary changes
- Build your team and align resources
- Communicate your vision and priorities

**Days 60-90: Execute and Establish Momentum**
- Implement your strategic initiatives
- Measure progress and adjust course
- Solidify key relationships
- Plan for the next phase of your leadership

**The STARS Model:**

Diagnose the business situation you're entering:

**Startup:** Assembling the capabilities to get a new business, product, or project off the ground

**Turnaround:** Saving a business or project that's in serious trouble

**Accelerated Growth:** Managing rapid expansion of a successful business or project

**Realignment:** Revitalizing a previously successful business or project that's encountering problems

**Sustaining Success:** Preserving the vitality of a successful business or project and taking it to the next level

**Key Strategies by Situation:**

**For Startups:**
- Build systems and structures from scratch
- Attract and develop talent
- Create a strong culture
- Focus on speed and flexibility

**For Turnarounds:**
- Make tough decisions quickly
- Focus on the vital few priorities
- Communicate urgency effectively
- Stabilize the situation before growing

**For Accelerated Growth:**
- Build scalable systems and processes
- Develop leadership capability
- Maintain quality while growing fast
- Manage cash flow carefully

**For Realignments:**
- Diagnose root causes of problems
- Challenge existing assumptions
- Revitalize the organization
- Balance change with stability

**For Sustaining Success:**
- Identify improvement opportunities
- Avoid complacency
- Develop next-generation leaders
- Continue to innovate

**Building Your Team:**

**Assess Inherited Team Members:**
- Keep: High performers who fit the new direction
- Develop: People with potential who need support
- Move: Good people who don't fit current needs
- Replace: Poor performers or poor fits

**Key Principles:**
- Make people decisions early but not too early
- Focus on the vital few positions first
- Be systematic in your evaluation process
- Balance continuity with necessary change

**Creating Coalitions:**

**Identify Key Stakeholders:**
- Supporters: People who agree with your goals and have influence
- Opponents: People who disagree with your goals and have influence  
- Fence-sitters: People who are undecided but have influence

**Influence Strategies:**
- Build coalitions of supporters
- Neutralize or convert opponents
- Win over fence-sitters
- Isolate those who can't be converted

**Securing Early Wins:**

**Types of Early Wins:**
- Business results that create value
- Behavioral changes that improve performance
- Learning that reduces uncertainty
- Relationship building that creates support

**Guidelines for Early Wins:**
- Focus on a few promising opportunities
- Get wins that matter to your boss
- Get wins in the right ways
- Take STARS situation into account

**Common Transition Traps:**

1. **Sticking with what you know:** Trying to do the same things that made you successful in your previous role

2. **Falling prey to the "action imperative":** Feeling pressure to do something, anything, rather than taking time to understand the situation

3. **Setting unrealistic expectations:** Promising too much too soon to your new boss or team

4. **Attempting to do too much:** Trying to change everything at once instead of focusing on vital priorities

5. **Coming in with "the answer":** Assuming you know what needs to be done without taking time to learn

6. **Engaging in the wrong type of learning:** Focusing on technical learning when you need cultural and political learning

7. **Neglecting horizontal relationships:** Focusing only on your boss and direct reports while ignoring peers and other stakeholders

**Accelerating Your Learning:**

**Learning Agenda Questions:**
- What are the biggest challenges the organization is facing?
- Why is the organization facing these challenges?
- What are the most promising unexploited opportunities?
- What would need to change for the organization to exploit these opportunities?
- What is the culture of the organization?
- Who are the key players and how do they interact?

**Learning Methods:**
- Structured conversations with key stakeholders
- Review of key documents and data
- Direct observation of operations
- Immersion in the culture
- Pilot projects and experiments

**Managing Your Boss:**

**Five Conversations with Your New Boss:**

1. **The situational diagnosis conversation:** How does your boss see the STARS situation?

2. **The expectations conversation:** What does your boss expect you to accomplish?

3. **The style conversation:** How does your boss like to work?

4. **The resources conversation:** What resources will you have available?

5. **The personal development conversation:** How can your boss help you develop?

**Ongoing Relationship Management:**
- Don't surprise your boss
- Over-communicate early, then adjust
- Ask for advice and input
- Clarify decision-making authority
- Agree on how you'll work together

The first 90 days set the trajectory for your entire tenure in a role. By following a systematic approach to transition, you can accelerate your learning, build key relationships, and establish the foundation for long-term success.`,
          tags: ["leadership", "transition", "new role", "90 days", "management", "strategy"],
          slug: "first-90-days-leadership-transition",
          read_count: 967,
          created_at: "2024-01-08T00:00:00Z",
          updated_at: "2024-01-25T00:00:00Z",
        },
      ]

      return NextResponse.json(fallbackBooks)
    }

    return NextResponse.json(books || [])
  } catch (error) {
    console.error("API Error:", error)

    // Return fallback data on any error
    const fallbackBooks = [
      {
        id: 1,
        title: "Deep Work: Rules for Focused Success in a Distracted World",
        author: "Cal Newport",
        category: "Productivity",
        content:
          "Deep work is professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit...",
        tags: ["productivity", "focus", "concentration"],
        slug: "deep-work-focused-success",
        read_count: 1247,
        created_at: "2024-01-15T00:00:00Z",
        updated_at: "2024-01-20T00:00:00Z",
      },
    ]

    return NextResponse.json(fallbackBooks)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, category, content, author, tags, slug } = body

    const { data, error } = await supabase
      .from("knowledge_base")
      .insert([
        {
          title,
          category,
          content,
          author,
          tags,
          slug,
          read_count: 0,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating book:", error)
      return NextResponse.json({ error: "Failed to create book" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
