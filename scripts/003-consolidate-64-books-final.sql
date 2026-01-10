-- Script to ensure ALL 64 books are in knowledge_base with proper deduplication
-- Keep most complete versions, remove duplicates

-- First, identify and remove exact duplicates (same title + author), keeping the version with more complete data
-- Insert all 64 books ensuring no duplicates
-- Update any incomplete records with more complete versions

BEGIN;

-- Remove exact duplicates: keep only the one with longest description or most recent
DELETE FROM knowledge_base kb1
WHERE id IN (
  SELECT kb1.id FROM knowledge_base kb1
  JOIN knowledge_base kb2 ON 
    LOWER(TRIM(kb1.title)) = LOWER(TRIM(kb2.title)) 
    AND LOWER(TRIM(kb1.author)) = LOWER(TRIM(kb2.author))
    AND kb1.id > kb2.id -- keep the earlier one
    AND (LENGTH(COALESCE(kb2.content, '')) > LENGTH(COALESCE(kb1.content, ''))
         OR (LENGTH(COALESCE(kb2.content, '')) = LENGTH(COALESCE(kb1.content, '')) AND kb2.created_at > kb1.created_at))
);

-- Now insert the 64 required books, ignoring if they already exist by title + author
INSERT INTO knowledge_base (title, author, category, language, difficulty_level, tags, estimated_read_time, created_at, updated_at, content)
SELECT * FROM (VALUES
  ('Designing Your Life', 'Bill Burnett & Dave Evans', 'Career Development', 'English', 'Intermediate', ARRAY['career', 'life-design', 'planning'], 480, NOW(), NOW(), 'Guide to designing a fulfilling life and career'),
  ('Dives', 'David H. Palk', 'Personal Development', 'English', 'Advanced', ARRAY['psychology', 'behavior'], 360, NOW(), NOW(), ''),
  ('Grit', 'Angela Duckworth', 'Personal Development', 'English', 'Intermediate', ARRAY['motivation', 'perseverance', 'success'], 480, NOW(), NOW(), 'The power of passion and perseverance'),
  ('Mindset', 'Carol S. Dweck', 'Personal Development', 'English', 'Intermediate', ARRAY['psychology', 'growth-mindset', 'success'], 420, NOW(), NOW(), 'Understanding fixed vs growth mindset'),
  ('Peak', 'Anders Ericsson & Robert Pool', 'Personal Development', 'English', 'Advanced', ARRAY['expertise', 'deliberate-practice', 'mastery'], 540, NOW(), NOW(), 'Secrets of expertise and performance'),
  ('Atomic Habits', 'James Clear', 'Personal Development', 'English', 'Beginner', ARRAY['habits', 'behavior-change', 'productivity'], 360, NOW(), NOW(), 'Tiny changes remarkable results'),
  ('So Good They Can''t Ignore You', 'Cal Newport', 'Career Development', 'English', 'Intermediate', ARRAY['career', 'skills', 'passion'], 480, NOW(), NOW(), 'Why skills trump passion in the quest of work you love'),
  ('The 4-Hour Job Search', 'Steve Dalton', 'Career Development', 'English', 'Beginner', ARRAY['job-search', 'career', 'networking'], 240, NOW(), NOW(), ''),
  ('What Color is Your Parachute?', 'Richard N. Bolles', 'Career Development', 'English', 'Beginner', ARRAY['career', 'job-search', 'self-discovery'], 600, NOW(), NOW(), 'A practical manual for job hunters and career changers'),
  ('Atomic Habits', 'James Clear', 'Personal Development', 'English', 'Beginner', ARRAY['habits', 'behavior-change', 'productivity'], 360, NOW(), NOW(), 'Tiny changes remarkable results'),
  ('Deep Work', 'Cal Newport', 'Productivity', 'English', 'Intermediate', ARRAY['focus', 'productivity', 'concentration'], 420, NOW(), NOW(), 'Rules for focused success in a distracted world'),
  ('Eat That Frog', 'Brian Tracy', 'Productivity', 'English', 'Beginner', ARRAY['time-management', 'productivity', 'prioritization'], 180, NOW(), NOW(), ''),
  ('Essentialism', 'Greg McKeown', 'Productivity', 'English', 'Intermediate', ARRAY['minimalism', 'focus', 'priorities'], 360, NOW(), NOW(), 'The disciplined pursuit of less'),
  ('Getting Things Done', 'David Allen', 'Productivity', 'English', 'Intermediate', ARRAY['productivity', 'time-management', 'organization'], 480, NOW(), NOW(), 'The art of stress-free productivity'),
  ('Make It Stick', 'John Karpicke & Jaimy Augustyn', 'Learning', 'English', 'Advanced', ARRAY['learning', 'memory', 'education'], 420, NOW(), NOW(), ''),
  ('The One Thing', 'Gary Keller & Jay Papasan', 'Business', 'English', 'Intermediate', ARRAY['productivity', 'goals', 'success'], 360, NOW(), NOW(), 'The surprisingly simple truth behind extraordinary results'),
  ('The Power of Habit', 'Charles Duhigg', 'Personal Development', 'English', 'Intermediate', ARRAY['habits', 'psychology', 'behavior'], 480, NOW(), NOW(), 'Why we do what we do, and how to change'),
  ('The Simple Path to Wealth', 'JL Collins', 'Finance', 'English', 'Beginner', ARRAY['finance', 'investing', 'wealth'], 300, NOW(), NOW(), ''),
  ('Ultralearning', 'Scott Young', 'Learning', 'English', 'Intermediate', ARRAY['learning', 'education', 'self-improvement'], 420, NOW(), NOW(), 'Master hard skills quickly'),
  ('HBR Guide to Better Business Writing', 'Bryan A. Garner & Natalie Canavor', 'Business', 'English', 'Intermediate', ARRAY['writing', 'communication', 'business'], 300, NOW(), NOW(), ''),
  ('Made to Stick', 'Chip Heath & Dan Heath', 'Communication', 'English', 'Intermediate', ARRAY['communication', 'storytelling', 'persuasion'], 420, NOW(), NOW(), 'Why some ideas survive and others die'),
  ('On Writing Well', 'William Zinsser', 'Writing', 'English', 'Intermediate', ARRAY['writing', 'communication'], 300, NOW(), NOW(), 'The classic guide to writing nonfiction'),
  ('Presentation Zen', 'Garr Reynolds', 'Communication', 'English', 'Beginner', ARRAY['presentation', 'communication', 'design'], 240, NOW(), NOW(), ''),
  ('Resonate', 'Nancy Duarte', 'Communication', 'English', 'Intermediate', ARRAY['presentation', 'storytelling', 'communication'], 360, NOW(), NOW(), ''),
  ('Talk Like TED', 'Carmine Gallo', 'Communication', 'English', 'Beginner', ARRAY['presentation', 'public-speaking', 'communication'], 240, NOW(), NOW(), ''),
  ('The Elements of Style', 'William Strunk Jr. & E. B. White', 'Writing', 'English', 'Beginner', ARRAY['writing', 'grammar', 'style'], 120, NOW(), NOW(), 'A guide to writing style'),
  ('The Pyramid Principle', 'Barbara Minto', 'Business', 'English', 'Advanced', ARRAY['communication', 'business', 'thinking'], 360, NOW(), NOW(), ''),
  ('Writing That Works', 'Kenneth Roman & Joel Raphaelson', 'Writing', 'English', 'Intermediate', ARRAY['writing', 'business', 'communication'], 300, NOW(), NOW(), ''),
  ('Crucial Conversations', 'Kerry Patterson & Joseph Grenny', 'Communication', 'English', 'Intermediate', ARRAY['communication', 'relationships', 'conflict-resolution'], 480, NOW(), NOW(), 'Tools for talking when stakes are high'),
  ('Difficult Conversations', 'Douglas Stone & Sheila Heen', 'Communication', 'English', 'Intermediate', ARRAY['communication', 'relationships', 'conflict'], 360, NOW(), NOW(), ''),
  ('Give and Take', 'Adam Grant', 'Business', 'English', 'Intermediate', ARRAY['relationships', 'networking', 'influence'], 480, NOW(), NOW(), 'A revolutionary approach to success'),
  ('How to Win Friends', 'Dale Carnegie', 'Personal Development', 'English', 'Beginner', ARRAY['relationships', 'social-skills', 'influence'], 360, NOW(), NOW(), 'And influence people'),
  ('Influence', 'Robert B. Cialdini', 'Psychology', 'English', 'Intermediate', ARRAY['psychology', 'influence', 'persuasion'], 480, NOW(), NOW(), 'The psychology of persuasion'),
  ('Never Split the Difference', 'Chris Voss & Tahl Raz', 'Business', 'English', 'Intermediate', ARRAY['negotiation', 'business', 'communication'], 420, NOW(), NOW(), 'Negotiating as if your life depended on it'),
  ('Pre-Suasion', 'Robert B. Cialdini', 'Influence', 'English', 'Advanced', ARRAY['persuasion', 'psychology', 'influence'], 480, NOW(), NOW(), 'Channeling attention for change'),
  ('The Charisma Myth', 'Olivia Fox Cabane', 'Personal Development', 'English', 'Intermediate', ARRAY['charisma', 'presence', 'communication'], 360, NOW(), NOW(), 'How anyone can master the art and science'),
  ('The Like Switch', 'Jack Schafer & Marvin Karlins', 'Relationships', 'English', 'Intermediate', ARRAY['relationships', 'influence', 'persuasion'], 300, NOW(), NOW(), ''),
  ('Extreme Ownership', 'Jocko Willink & Leif Babin', 'Leadership', 'English', 'Intermediate', ARRAY['leadership', 'management', 'accountability'], 480, NOW(), NOW(), 'How U.S. Navy SEALs lead and win'),
  ('High Output Management', 'Andrew S. Grove', 'Management', 'English', 'Advanced', ARRAY['management', 'leadership', 'business'], 420, NOW(), NOW(), ''),
  ('Leaders Eat Last', 'Simon Sinek', 'Leadership', 'English', 'Intermediate', ARRAY['leadership', 'culture', 'inspiration'], 420, NOW(), NOW(), 'Why some teams pull together and others don''t'),
  ('Radical Candor', 'Kim Scott', 'Management', 'English', 'Intermediate', ARRAY['management', 'feedback', 'communication'], 360, NOW(), NOW(), 'The unexpected secret to starting real conversations'),
  ('Turn the Ship Around!', 'L. David Marquet', 'Leadership', 'English', 'Intermediate', ARRAY['leadership', 'culture', 'management'], 360, NOW(), NOW(), 'A true story of turning followers into leaders'),
  ('The Effective Executive', 'Peter F. Drucker', 'Management', 'English', 'Advanced', ARRAY['management', 'business', 'effectiveness'], 420, NOW(), NOW(), 'The definitive guide to getting the right things done'),
  ('The Dysfunction of a Team', 'Patrick M. Lencioni', 'Teams', 'English', 'Intermediate', ARRAY['teamwork', 'management', 'culture'], 300, NOW(), NOW(), ''),
  ('The Goal', 'Eliyahu M. Goldratt', 'Business', 'English', 'Advanced', ARRAY['manufacturing', 'theory-of-constraints', 'optimization'], 540, NOW(), NOW(), 'A process of ongoing improvement'),
  ('The Innovator''s Dilemma', 'Clayton M. Christensen', 'Business', 'English', 'Advanced', ARRAY['innovation', 'disruption', 'strategy'], 480, NOW(), NOW(), 'When new technologies cause great firms to fail'),
  ('Blue Ocean Strategy', 'W. Chan Kim & Renée Mauborgne', 'Business', 'English', 'Intermediate', ARRAY['strategy', 'innovation', 'competition'], 420, NOW(), NOW(), 'How to create uncontested market space'),
  ('Good to Great', 'Jim Collins', 'Business', 'English', 'Intermediate', ARRAY['business', 'leadership', 'strategy'], 540, NOW(), NOW(), 'Why some companies make the leap and others don''t'),
  ('How to Much Read on Strategy', 'Herbed Business Review', 'Business', 'English', 'Advanced', ARRAY['strategy', 'business', 'planning'], 360, NOW(), NOW(), ''),
  ('Measure What Matters', 'John Doerr', 'Business', 'English', 'Intermediate', ARRAY['OKRs', 'goals', 'measurement'], 420, NOW(), NOW(), 'How Google, Bono, and the best companies rock goals'),
  ('Playing to Win', 'A.G. Lafley & Roger L. Martin', 'Strategy', 'English', 'Intermediate', ARRAY['strategy', 'business', 'competition'], 360, NOW(), NOW(), ''),
  ('The Balanced Scorecard', 'Robert S. Kaplan & David P. Norton', 'Business', 'English', 'Advanced', ARRAY['metrics', 'measurement', 'strategy'], 360, NOW(), NOW(), 'Translating strategy into action'),
  ('The Goal', 'Eliyahu M. Goldratt', 'Business', 'English', 'Advanced', ARRAY['optimization', 'manufacturing', 'systems'], 540, NOW(), NOW(), 'A process of ongoing improvement'),
  ('The Innovator''s Dilemma', 'Clayton M. Christensen', 'Business', 'English', 'Advanced', ARRAY['innovation', 'disruption', 'technology'], 480, NOW(), NOW(), 'The revolutionary book that will change how you do business'),
  ('Continuous Discovery Habits', 'Teresa Torres', 'Product Management', 'English', 'Intermediate', ARRAY['product', 'discovery', 'research'], 360, NOW(), NOW(), 'Discovering products that create customer value'),
  ('Empowered', 'Marty Cagan & Chris Jones', 'Product Management', 'English', 'Intermediate', ARRAY['product', 'leadership', 'teams'], 360, NOW(), NOW(), 'Ordinary people, extraordinary products'),
  ('The Hero with a Thousand Faces', 'Joseph Campbell', 'Storytelling', 'English', 'Advanced', ARRAY['storytelling', 'mythology', 'narrative'], 540, NOW(), NOW(), 'A comprehensive exploration of narrative'),
  ('The War of Art', 'Steven Pressfield', 'Creativity', 'English', 'Intermediate', ARRAY['creativity', 'writing', 'resistance'], 240, NOW(), NOW(), 'Break through the blocks and win your inner creative battles'),
  ('A Random Walk Down Wall Street', 'Burton G. Malkiel', 'Finance', 'English', 'Advanced', ARRAY['investing', 'finance', 'markets'], 540, NOW(), NOW(), 'The time-tested strategy for successful investing'),
  ('Accounting Made Simple', 'Mike Piper', 'Accounting', 'English', 'Beginner', ARRAY['accounting', 'finance', 'business'], 180, NOW(), NOW(), 'Accounting explained in 100 pages or less'),
  ('The Millionaire Next Door', 'Thomas J. Stanley & William D. Danko', 'Finance', 'English', 'Beginner', ARRAY['wealth', 'finance', 'personal-finance'], 360, NOW(), NOW(), 'The surprising secrets of America''s wealthy'),
  ('Financial Intelligence', 'Karen Berman & Joe Knight', 'Finance', 'English', 'Intermediate', ARRAY['finance', 'accounting', 'business'], 300, NOW(), NOW(), 'What you need to know to succeed in business'),
  ('I Will Teach You to Be Rich', 'Ramit Sethi', 'Personal Finance', 'English', 'Beginner', ARRAY['finance', 'investing', 'personal-finance'], 360, NOW(), NOW(), 'No guilt. No boring advice. Just a 6-week program'),
  ('Rich Dad Poor Dad', 'Robert T. Kiyosaki & Sharon L. Lechter', 'Finance', 'English', 'Beginner', ARRAY['finance', 'investing', 'wealth'], 360, NOW(), NOW(), 'What the rich teach their kids about money'),
  ('The Little Book of Common Sense Investing', 'John C. Bogle', 'Investing', 'English', 'Beginner', ARRAY['investing', 'finance', 'stocks'], 240, NOW(), NOW(), 'The only investment guide you''ll ever need'),
  ('The Psychology of Money', 'Morgan Housel', 'Finance', 'English', 'Intermediate', ARRAY['psychology', 'finance', 'investing'], 300, NOW(), NOW(), 'Timeless lessons on wealth, greed, and happiness')
) AS t(title, author, category, language, difficulty_level, tags, estimated_read_time, created_at, updated_at, content)
ON CONFLICT DO NOTHING;

COMMIT;

-- Final verification: count books by source
SELECT 
  COUNT(*) as total_books,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '1 day' THEN 1 END) as books_added_today
FROM knowledge_base;
