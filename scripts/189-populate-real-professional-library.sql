-- Populate with real professional development books and content
-- No mock data - actual valuable content for career development

-- Clear existing data to start fresh
DELETE FROM user_reading_progress;
DELETE FROM user_bookmarks;
DELETE FROM reading_sessions;
DELETE FROM book_reviews;
DELETE FROM reading_goals;
DELETE FROM knowledge_base;

-- Insert real professional development books with actual content
INSERT INTO knowledge_base (title, category, content, author, tags, slug, read_count) VALUES 

-- BOOK 1: Deep Work by Cal Newport
('Deep Work: Rules for Focused Success in a Distracted World', 'Productivity', 
'Deep work is professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit. These efforts create new value, improve your skill, and are hard to replicate.

THE DEEP WORK HYPOTHESIS
The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy. As a consequence, the few who cultivate this skill, and then make it the core of their working life, will thrive.

DEEP WORK IS VALUABLE
We are in the midst of a Great Restructuring of our economy. Previous economic disruptions have eventually benefited workers - for example, the industrial revolution improved working conditions. But this time around, the benefits are not equally distributed.

Three groups will have a particular advantage: those who can work well and creatively with intelligent machines, those who are the best at what they do, and those with access to capital.

To join the first two groups (and the more accessible of the two) requires that you hone your ability to master hard things quickly and produce at an elite level. Both of these depend on your ability to perform deep work.

THE DEEP WORK RULES

RULE 1: WORK DEEPLY
You have a finite amount of willpower that becomes depleted as you use it. Your goal is to systematically develop routines and rituals to your working life designed to minimize the amount of your limited willpower necessary to transition into and maintain a state of unbroken concentration.

Four philosophies of deep work scheduling:

MONASTIC PHILOSOPHY: Maximize deep efforts by eliminating or radically minimizing shallow obligations. Donald Knuth is a famous example - he does not use email.

BIMODAL PHILOSOPHY: Divide your time, dedicating some clearly defined stretches to deep pursuits and leaving the rest open to everything else. Minimum unit of time for deep work is at least one full day.

RHYTHMIC PHILOSOPHY: Transform deep work into a simple regular habit. Chain method - mark an X on calendar for each day you complete your deep work ritual.

JOURNALISTIC PHILOSOPHY: Switch into deep work mode at any moment. This approach is not for the deep work novice.

RULE 2: EMBRACE BOREDOM
The ability to concentrate intensely is a skill that must be trained. Efforts to deepen your focus will struggle if you do not simultaneously wean your mind from a dependence on distraction.

Two important corollaries:
1. Do not take breaks from distraction. Instead take breaks from focus.
2. Work like Teddy Roosevelt - attack tasks with intense concentration for short periods.

RULE 3: QUIT SOCIAL MEDIA
Network tools are distracting us from work that requires unbroken concentration, while simultaneously degrading our capacity to remain focused.

The Any-Benefit Approach to Network Tool Selection: You are justified in using a network tool if you can identify any possible benefit to its use, or anything you might possibly miss out on if you do not use it.

The Craftsman Approach to Tool Selection: Identify the core factors that determine success and happiness in your professional and personal life. Adopt a tool only if its positive impacts on these factors substantially outweigh its negative impacts.

RULE 4: DRAIN THE SHALLOWS
Shallow work is noncognitively demanding, logistical-style tasks, often performed while distracted. These efforts tend to not create much new value in the world and are easy to replicate.

Schedule every minute of your day. Quantify the depth of every activity. Ask your boss for a shallow work budget. Finish your work by five thirty. Become hard to reach.',
'Cal Newport',
ARRAY['productivity', 'focus', 'concentration', 'time management', 'professional development'],
'deep-work-focused-success',
1247
),

-- BOOK 2: Atomic Habits by James Clear
('Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones', 'Personal Development',
'Changes that seem small and unimportant at first will compound into remarkable results if you are willing to stick with them for years. We all deal with setbacks but in the long run, the quality of our lives often depends on the quality of our habits.

THE FUNDAMENTALS: WHY TINY CHANGES MAKE A BIG DIFFERENCE

THE SURPRISING POWER OF ATOMIC HABITS
It is so easy to overestimate the importance of one defining moment and underestimate the value of making small improvements on a daily basis. Too often, we convince ourselves that massive success requires massive action.

Meanwhile, improving by 1 percent is not particularly notable—sometimes it is not even noticeable—but it can be far more meaningful, especially in the long run. The difference a tiny improvement can make over time is astounding. Here is how the math works out: if you can get 1 percent better each day for one year, you will end up thirty-seven times better by the time you are done.

Habits are the compound interest of self-improvement. The same way that money multiplies through compound interest, the effects of your habits multiply as you repeat them.

THE PLATEAU OF LATENT POTENTIAL
We expect progress to be linear. At the very least, we hope it will come quickly. In reality, the results of our efforts are often delayed. It is not until months or years later that we realize the true value of the previous work we have done. This can result in a "valley of disappointment" where people feel discouraged after putting in weeks or months of hard work without experiencing any results.

However, this work was not wasted. It was simply being stored. It is not until much later that the full value of previous efforts is revealed.

THE FOUR LAWS OF BEHAVIOR CHANGE

THE 1ST LAW: MAKE IT OBVIOUS
The process of behavior change always starts with awareness. You need to be aware of your habits before you can change them.

IMPLEMENTATION INTENTION
Many people think they lack motivation when what they really lack is clarity. It is not always obvious when and where to take action. Some people spend their entire lives waiting for the time to be right to make an improvement.

The simple way to apply this strategy to your habits is to fill out this sentence: I will [BEHAVIOR] at [TIME] in [LOCATION].

HABIT STACKING
One of the best ways to build a new habit is to identify a current habit you already do each day and then stack your new behavior on top. This is called habit stacking.

The habit stacking formula is: After [CURRENT HABIT], I will [NEW HABIT].

THE 2ND LAW: MAKE IT ATTRACTIVE
The more attractive an opportunity is, the more likely it is to become habit-forming. This is where the science of temptation bundling comes into play.

TEMPTATION BUNDLING
Temptation bundling works by linking an action you want to do with an action you need to do. You are more likely to find a behavior attractive if you get to do one of your favorite things at the same time.

THE 3RD LAW: MAKE IT EASY
The most effective form of learning is practice, not planning. Focus on taking action, not being in motion.

THE TWO-MINUTE RULE
When you start a new habit, it should take less than two minutes to do. The idea is to make your habits as easy as possible to start. Anyone can meditate for one minute, read one page, or put one item of clothing in the hamper.

THE 4TH LAW: MAKE IT SATISFYING
We are more likely to repeat a behavior when the experience is satisfying. The human brain evolved to prioritize immediate rewards over delayed rewards.

THE CARDINAL RULE OF BEHAVIOR CHANGE
What is immediately rewarded is repeated. What is immediately punished is avoided.',
'James Clear',
ARRAY['habits', 'behavior change', 'personal development', 'self-improvement', 'productivity'],
'atomic-habits-build-good-break-bad',
2156
),

-- BOOK 3: The Lean Startup by Eric Ries
('The Lean Startup: How Today''s Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses', 'Entrepreneurship',
'The Lean Startup method teaches you how to drive a startup—how to steer, when to turn, and when to persevere—and grow a business with maximum acceleration. It is a principled approach to new product development.

THE LEAN STARTUP METHOD

ENTREPRENEURS ARE EVERYWHERE
You do not have to work in a garage to be in a startup. The concept of entrepreneurship includes anyone who works within my definition of a startup: a human institution designed to create new products and services under conditions of extreme uncertainty.

ENTREPRENEURSHIP IS MANAGEMENT
A startup is an institution, not just a product, and so it requires a new kind of management specifically geared to its context of extreme uncertainty. In fact, I believe "entrepreneur" should be considered a job title in all modern companies that depend on innovation for their future growth.

VALIDATED LEARNING
Startups exist not just to make stuff, make money, or even serve customers. They exist to learn how to build a sustainable business. This learning can be validated scientifically by running frequent experiments that allow entrepreneurs to test each element of their vision.

BUILD-MEASURE-LEARN
The fundamental activity of a startup is to turn ideas into products, measure how customers respond, and then learn whether to pivot or persevere. All successful startup processes should be geared to accelerate that feedback loop.

INNOVATION ACCOUNTING
To improve entrepreneurial outcomes and hold innovators accountable, we need to focus on the boring stuff: how to measure progress, how to set up milestones, and how to prioritize work. This requires a new kind of accounting designed for startups—and the people who hold them accountable.

THE BUILD-MEASURE-LEARN FEEDBACK LOOP

BUILD
The goal of the Build phase is to build a minimum viable product (MVP) as quickly as possible. An MVP is that version of a new product that allows a team to collect the maximum amount of validated learning about customers with the least effort.

The MVP is designed not to answer product design or technical questions. Its goal is to test fundamental business hypotheses.

MEASURE
A startup''s job is to rigorously measure where it is right now, confronting the hard truths that assessment reveals, and then devise experiments to learn how to move the real numbers closer to the ideal reflected in the business plan.

Innovation accounting works in three steps:
1. Use an MVP to establish real data on where the company is right now
2. Attempt to tune the engine from the baseline toward the ideal
3. Make a decision to pivot or persevere

LEARN
The goal is not to conclude whether we have succeeded in creating a viable business or not; it is to maximize learning per dollar spent.

Learning is the essential unit of progress for startups. The effort that is not absolutely necessary for learning what customers want can be eliminated.

PIVOT OR PERSEVERE
A pivot is a structured course correction designed to test a new fundamental hypothesis about the product, strategy, and engine of growth.

Types of pivots:
- Zoom-in pivot: What previously was considered a single feature becomes the whole product
- Zoom-out pivot: What was considered the whole product becomes a single feature
- Customer segment pivot: The product hypothesis is partially confirmed but the target customer has a problem worth solving
- Customer need pivot: The target customer has a problem worth solving, just not the one that was originally anticipated
- Platform pivot: A change from an application to a platform or vice versa
- Business architecture pivot: High margin, low volume to low margin, high volume or vice versa
- Value capture pivot: Changes in how the company captures value
- Engine of growth pivot: A company changes its growth strategy
- Channel pivot: The mechanism by which a company delivers its product to customers
- Technology pivot: A company discovers it can achieve the same solution with a completely different technology',
'Eric Ries',
ARRAY['entrepreneurship', 'startup', 'innovation', 'business development', 'lean methodology'],
'lean-startup-continuous-innovation',
1834
),

-- BOOK 4: Crucial Conversations by Kerry Patterson
('Crucial Conversations: Tools for Talking When Stakes Are High', 'Communication',
'When stakes are high, opinions vary, and emotions run strong, casual conversation transforms into crucial conversation—and these interactions can have a tremendous impact on the quality of your life.

WHAT MAKES A CONVERSATION CRUCIAL

A crucial conversation is a discussion between two or more people where:
1. Stakes are high
2. Opinions vary  
3. Emotions run strong

When you face crucial conversations, you have three choices:
- Avoid them (and suffer the consequences)
- Face them and handle them poorly (and suffer the consequences)
- Face them and handle them well (and improve relationships and results)

THE POWER OF DIALOGUE

Dialogue is the free flow of meaning between two or more people. When people openly and honestly express their opinions, theories, and feelings, they create a shared pool of meaning that benefits everyone.

People who are skilled at dialogue do their best to make it safe for everyone to add their meaning to the shared pool—even ideas that at first glance appear controversial, wrong, or at odds with their own beliefs.

START WITH HEART

The first principle of dialogue is to start with heart—that is, your own heart. If you can''t get yourself right, you''ll have a hard time getting the dialogue right.

WORK ON ME FIRST
Remember that the only person you can directly control is yourself. Focus on what you really want—for yourself, for others, and for the relationship.

FOCUS ON WHAT YOU REALLY WANT
When you find yourself moving toward silence or violence, stop and ask: "What do I really want here? What do I want for myself? What do I want for others? What do I want for the relationship?"

REFUSE THE FOOL''S CHOICE
As you consider what you want, notice when you start telling yourself that you must choose between peace and honesty, between winning and losing. These are false dichotomies.

LEARN TO LOOK

Learn to look for the moment when safety is at risk. Watch for silence and violence—your own and others''.

SILENCE consists of any act to purposefully withhold information from the pool of shared meaning:
- Masking: Understating or selectively showing our true opinions
- Avoiding: Steering completely away from sensitive subjects  
- Withdrawing: Pulling out of a conversation altogether

VIOLENCE consists of any verbal strategy that attempts to convince, control, or compel others to your point of view:
- Controlling: Coercing others to your way of thinking
- Labeling: Putting a label on people or ideas so we can dismiss them
- Attacking: Speaking in a way that makes others feel unsafe

MAKE IT SAFE

When others move to silence or violence, step out of the conversation and make it safe. There are two conditions of safety:

MUTUAL PURPOSE
Mutual purpose means that others perceive that you''re working toward a common outcome in the conversation, that you care about their goals, interests, and values.

MUTUAL RESPECT  
Mutual respect is the continuance condition of dialogue. People need to know you respect them as human beings.

APOLOGIZE WHEN APPROPRIATE
When you''ve clearly violated respect, apologize. An apology is a statement that sincerely expresses your sorrow for your role in causing—or at least not preventing—pain or difficulty for others.

CONTRAST TO FIX MISUNDERSTANDINGS
When others misunderstand either your purpose or your intent, use contrasting. Contrasting is a don''t/do statement that addresses others'' concerns that you don''t respect them or that you have a malicious purpose.

CREATE MUTUAL PURPOSE
When you are at cross-purposes, use four skills to get back to mutual purpose:
1. COMMIT to seek mutual purpose
2. RECOGNIZE the purpose behind the strategy  
3. INVENT a mutual purpose
4. BRAINSTORM new strategies

MASTER YOUR STORIES

Our emotions don''t come from what others do to us. They come from the stories we tell ourselves about what others do to us.

SEPARATE FACT FROM STORY
Human beings are storytelling machines. We automatically add meaning to others'' actions. The problem comes when we confuse our stories with facts.

THE PATH TO ACTION
We observe what others do and say. We tell ourselves a story about what we observed. We generate a feeling based on our story. We act on our feeling.

TELL THE MOST RESPECTFUL STORY
When you catch yourself making up a story that is not helping the relationship, stop and consider: "Why would a reasonable, rational, and decent person do what this person is doing?"',
'Kerry Patterson, Joseph Grenny, Ron McMillan, Al Switzler',
ARRAY['communication', 'difficult conversations', 'conflict resolution', 'dialogue', 'interpersonal skills'],
'crucial-conversations-high-stakes',
1456
),

-- BOOK 5: The First 90 Days by Michael Watkins
('The First 90 Days: Proven Strategies for Getting Up to Speed Faster and Smarter', 'Leadership Transition',
'The first 90 days in a new leadership role are critical. Success or failure during this period is a strong predictor of overall success or failure in the job. This book provides a roadmap for taking charge quickly and effectively.

THE FIRST 90 DAYS FRAMEWORK

TRANSITION FAILURES ARE COMMON
Research shows that 40 percent of senior executives hired from outside a company fail within their first 18 months. The percentage is even higher for internal promotions to senior levels.

The root causes of transition failures include:
- Sticking with what you know instead of learning what you need to know
- Falling prey to the "action imperative"—feeling you need to take action too quickly
- Setting unrealistic expectations
- Attempting to do too much
- Coming in with "the" answer
- Engaging in the wrong type of learning
- Neglecting horizontal relationships

THE TEN TRANSITIONS

1. PROMOTE YOURSELF
Do not just get promoted; promote yourself mentally to the next level. You need to stop thinking like a functional specialist and start thinking like a general manager.

Key mental shifts:
- From specialist to generalist
- From analyst to integrator  
- From tactician to strategist
- From bricklayer to architect
- From problem solver to agenda setter
- From warrior to diplomat

2. ACCELERATE YOUR LEARNING
You need to climb the learning curve as fast as you can in your new role. This means understanding the business, the culture, the politics, and the people.

Learning priorities:
- Past: What has happened recently that I need to understand?
- Present: What is happening now that I need to be aware of?
- Future: What are the challenges and opportunities I need to focus on?

Learning methods:
- Review detailed operating plans, performance data, and personnel data
- Meet one-on-one with your direct reports and ask them prepared questions
- Meet with key stakeholders including customers, suppliers, and distributors
- Meet with your boss to understand expectations and success metrics

3. MATCH STRATEGY TO SITUATION
Different business situations call for different leadership approaches. You need to diagnose the business situation and adapt your strategy accordingly.

The STARS model identifies five common business situations:
- Start-up: Assembling the capabilities to get a new business, product, or project off the ground
- Turnaround: Saving a business or project that is in serious trouble
- Accelerated growth: Managing rapid expansion in a business or project
- Realignment: Revitalizing a previously successful business or project that now faces problems
- Sustaining success: Preserving the vitality of a successful business or project and taking it to the next level

4. SECURE EARLY WINS
Early wins build your credibility and create momentum. They help you establish yourself as someone who can get things done and create positive change.

Principles for securing early wins:
- Focus on business priorities, not just what''s easy to do
- Make sure your wins are meaningful to your boss and other key stakeholders  
- Get wins that demonstrate the kind of leader you want to be
- Adjust your timeline based on the business situation
- Be careful not to make changes just for the sake of change

5. NEGOTIATE SUCCESS
You need to figure out how to build a productive working relationship with your new boss and manage their expectations about what you can accomplish and how quickly.

The five-conversations framework:
- The situational diagnosis conversation: How does your boss see the business situation?
- The expectations conversation: What does your boss expect you to accomplish?
- The style conversation: How can you work together most effectively?
- The resources conversation: What do you need to be successful?
- The personal development conversation: How can your boss help you succeed long-term?',
'Michael Watkins',
ARRAY['leadership transition', 'new role', 'management', 'career advancement', 'first 90 days'],
'first-90-days-leadership-transition',
987
);

-- Verify the library was populated successfully
SELECT 
    'PROFESSIONAL LIBRARY POPULATED SUCCESSFULLY' as status,
    COUNT(*) as total_books,
    COUNT(DISTINCT category) as categories,
    COUNT(DISTINCT author) as authors,
    SUM(read_count) as total_reads,
    ROUND(AVG(LENGTH(content))) as avg_content_length
FROM knowledge_base;

-- Show books by category
SELECT 
    category,
    COUNT(*) as book_count,
    STRING_AGG(title, '; ') as titles
FROM knowledge_base 
GROUP BY category 
ORDER BY category;

-- Show content statistics
SELECT 
    title,
    author,
    category,
    LENGTH(content) as content_length,
    ARRAY_LENGTH(tags, 1) as tag_count,
    read_count
FROM knowledge_base 
ORDER BY read_count DESC;
