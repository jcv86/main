-- SCRIPT 015: Complete books 41-50 with detailed content
-- Books: Extreme Ownership, High Output Management, Leaders Eat Last, Multipliers, Radical Candor, 
--        The 4-Hour Workweek, The Effective Executive, The First 90 Days, The Goal, The Innovator's Dilemma

UPDATE knowledge_base SET 
  content = 'Extreme Ownership: How U.S. Navy SEALs Lead and Win by Jocko Willink and Leif Babin presents the leadership philosophy that leaders take complete responsibility for everything that happens on their team. Extreme ownership means there are no excuses, no blaming subordinates, no external factors. The Five Laws include: Belief in the Mission, Check the Ego, Cover and Move, Simple Plans Win, and Prioritize and Execute. In corporate world, extreme ownership means when your project fails, you own it. When your team underperforms, you examine your leadership first. This creates accountability culture that drives results. Key strategies include conducting After-Action Reviews to analyze what worked and what didnt. Research shows that when leaders take responsibility, team members develop stronger trust and psychological safety, performing better because the leader will support them rather than blame them.',
  category = 'leadership',
  difficulty_level = 'intermediate',
  estimated_read_time = 50,
  language = 'en'
  -- Removed malformed tags line that caused array syntax error
WHERE title = 'Extreme Ownership' AND (content IS NULL OR LENGTH(content) < 500);

UPDATE knowledge_base SET 
  content = 'High Output Management by Andy Grove focuses on measuring and maximizing the output of your organization. Output is not activity but results. A managers key responsibility is to increase the output of their team and organization through intelligent systems and focus. The Managerial Leverage Formula shows that a managers productivity equals the output of their organization divided by activities they personally engaged in. Managers who understand this stop trying to do everything and instead design systems that multiply team output. Critical concepts include meetings as high-leverage activities, training as ultimate leverage, and proper use of indicators and measurements. Matching management style to employee task-relevant maturity is essential: new employees need directive management, growing employees need participative management, and mature employees need delegative management.',
  category = 'management',
  difficulty_level = 'intermediate',
  estimated_read_time = 55,
  language = 'en'
WHERE title = 'High Output Management' AND (content IS NULL OR LENGTH(content) < 500);

UPDATE knowledge_base SET 
  content = 'Leaders Eat Last by Simon Sinek explores why great leaders prioritize their people and the neurobiological basis for trust and cooperation. In brain imaging studies, people exposed to high stress and uncertainty without psychological safety show significantly reduced cognitive capacity. They become reactive rather than strategic. Sinek introduces the concept of Circle of Safety where employees feel protected and can take risks. Inside the Circle, employees feel safe and collaborate. Outside, they become defensive. The leader must expand the circle to include everyone. Four neurochemicals drive human behavior: dopamine motivates goal achievement, cortisol triggers stress response, serotonin builds status and confidence, and oxytocin creates trust and bonding. Great leaders manage these neurochemicals by providing dopamine through clear wins, reducing cortisol through safety, building serotonin through recognition, and generating oxytocin through genuine care.',
  category = 'leadership',
  difficulty_level = 'intermediate',
  estimated_read_time = 50,
  language = 'en'
WHERE title = 'Leaders Eat Last' AND (content IS NULL OR LENGTH(content) < 500);

UPDATE knowledge_base SET 
  content = 'Multipliers by Liz Wiseman reveals how best leaders make everyone smarter while diminishers drain intelligence from their teams. Multipliers attract and retain top talent by creating environments where talented people want to work because they get growth opportunities, their work matters, they are treated as capable thinkers, and there is genuine career progression. The Five Disciplines include: Talent Magnet who attract top talent, Liberator who free people from fear, Challenger who stretch teams with ambitious goals, Debate Maker who encourage rigorous thinking, and Investor who develop people. Multipliers encourage intelligent failure, admit their own weaknesses, create psychological safety, and delegate authority not just tasks. They ask challenging What If questions and expect teams to rise to challenges. They provide rigorous feedback and coaching while celebrating learning and growth.',
  category = 'leadership',
  difficulty_level = 'intermediate',
  estimated_read_time = 50,
  language = 'en'
WHERE title = 'Multipliers' AND (content IS NULL OR LENGTH(content) < 500);

UPDATE knowledge_base SET 
  content = 'Radical Candor by Kim Scott is a framework for giving feedback that helps people grow while maintaining genuine care. The best feedback combines genuine care about the person with willingness to criticize directly. Without care, criticism feels like attack. Without directness, people do not know what to improve. The Four Quadrants of Leadership Communication are: Radical Candor with care and directness where people grow, Ruinous Empathy with care but no directness where performance stagnates, Obnoxious Aggression with directness but no care where people feel attacked, and Manipulative Insincerity with neither where deep distrust builds. The Feedback Protocol includes Humble Inquiry asking if open to feedback, Situation-Specific-Impact describing behavior and impact, Acknowledge the Dilemma recognizing how hard the feedback is, and Invite Response asking what they think. This builds trust while driving performance improvement.',
  category = 'communication',
  difficulty_level = 'intermediate',
  estimated_read_time = 45,
  language = 'en'
WHERE title = 'Radical Candor' AND (content IS NULL OR LENGTH(content) < 500);

UPDATE knowledge_base SET 
  content = 'The 4-Hour Workweek by Tim Ferriss is a guide to eliminating busywork, automating revenue, and designing a life of freedom. Instead of time management, Ferriss proposes life design deliberately structuring your life around what matters most. The 4-hour workweek is not literal but about creating leverage so income is not tied to hours. The DEAL Framework includes Definition of what freedom means, Elimination of non-high-impact activities, Automation of income generation, and Liberation to design your ideal lifestyle. Paretos Law shows 80% of results come from 20% of activities. Identify highest-leverage tasks and eliminate or automate everything else. Build systems so money comes in without constant effort through automated customer service, contractor teams, passive income, and email sequences. Batch your tasks into focused blocks rather than checking email all day.',
  category = 'productivity',
  difficulty_level = 'intermediate',
  estimated_read_time = 50,
  language = 'en'
WHERE title = 'The 4-Hour Workweek' AND (content IS NULL OR LENGTH(content) < 500);

UPDATE knowledge_base SET 
  content = 'The Effective Executive by Peter Drucker is the definitive guide to executive effectiveness, published in 1967 but more relevant today. Effectiveness is a habit and discipline, not a talent. Any executive can become more effective by following Drucker Five Practices. First, know where your time goes by tracking actual time use. Second, focus on outward contribution asking what is your contribution to organizational results. Third, build on your strengths rather than fixing weaknesses. Fourth, concentrate on the few things that truly matter with 3-5 critical objectives. Fifth, make effective decisions by defining the problem correctly, gathering information, making the decision, and implementing it. Effective executives identify what contribution only they can make and focus their energy there. They say no to good opportunities to say yes to great ones. They measure themselves by organizational results, not activity.',
  category = 'management',
  difficulty_level = 'intermediate',
  estimated_read_time = 55,
  language = 'en'
WHERE title = 'The Effective Executive' AND (content IS NULL OR LENGTH(content) < 500);

UPDATE knowledge_base SET 
  content = 'The First 90 Days by Michael Watkins is an essential playbook for making impact in your first three months in a new role. Research shows new leaders have roughly 90 days to make initial impact and establish credibility. The STAR Framework includes Situational Awareness to understand the business, Take Stock through listening tours, Align Expectations with stakeholders, and Accelerate with quick decisions and early wins. Do not jump into changes. First understand the business model, competitive landscape, culture, history, and political dynamics. Conduct listening tours meeting everyone individually and listening more than talking. Align expectations with your boss about success, your team about vision, peers about collaboration, and investors about strategy. Once aligned, make quick personnel decisions, prioritize top initiatives, build your leadership team, and create early wins. Avoid coming in with preconceived solutions or threat mindset.',
  category = 'leadership',
  difficulty_level = 'intermediate',
  estimated_read_time = 50,
  language = 'en'
WHERE title = 'The First 90 Days' AND (content IS NULL OR LENGTH(content) < 500);

UPDATE knowledge_base SET 
  content = 'The Goal by Eliyahu Goldratt is a novel about manufacturing management and the Theory of Constraints. Every system has at least one constraint or bottleneck that limits overall output. Maximize system output by identifying the constraint, exploiting it, subordinating everything else to support it, elevating the constraint, and repeating the cycle. Most managers try to improve everything equally which is inefficient. Focus investments on the constraint. A plant manager named Alex Rogo saves his failing plant by applying Theory of Constraints, discovering that walking the floor reveals the constraint and constraints move as you improve them. Local optimization often destroys global optimization. In software development, if code review is the bottleneck, improve code review. In sales, if lead conversion is the constraint, improve conversion. Continuing improvement requires systematic thinking.',
  category = 'business',
  difficulty_level = 'intermediate',
  estimated_read_time = 50,
  language = 'en'
WHERE title = 'The Goal' AND (content IS NULL OR LENGTH(content) < 500);

UPDATE knowledge_base SET 
  content = 'The Innovators Dilemma by Clayton Christensen explores why successful companies fail when facing disruptive innovation. Large established companies are good at sustaining innovation improving existing products for current customers. They struggle with disruptive innovation creating new products for new markets at lower prices. Disruptive technologies are initially inferior but improve rapidly while being cheaper and simpler. New companies with nothing to lose enter the market with disruptive tech. Established companies dismiss it because it does not satisfy current valuable customers. By the time established companies realize the threat, the disruptors have captured the market. Examples include how digital disrupted film, how personal computers disrupted mainframes, and how cloud disrupted enterprise software. Organizations must maintain separate business units for disruptive products because they require different cost structures, profit margins, and customer focus than established business units.',
  category = 'strategy',
  difficulty_level = 'intermediate',
  estimated_read_time = 50,
  language = 'en'
WHERE title = 'The Innovators Dilemma' AND (content IS NULL OR LENGTH(content) < 500);
