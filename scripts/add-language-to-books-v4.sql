-- Add language column to knowledge_base table if it doesn't exist
ALTER TABLE knowledge_base ADD COLUMN IF NOT EXISTS language VARCHAR(20) DEFAULT 'español';

-- Update existing books with their language based on content
UPDATE knowledge_base SET language = 'english' WHERE 
  title ILIKE '%Deep%Work%' OR
  title ILIKE '%Atomic%Habits%' OR
  title ILIKE '%Good%Great%' OR
  title ILIKE '%Power%of%Habit%' OR
  title ILIKE '%Digital%Minimalism%' OR
  title ILIKE '%Thinking%Fast%Slow%' OR
  title ILIKE '%Grit%' OR
  title ILIKE '%Mindset%' OR
  title ILIKE '%Essentialism%' OR
  title ILIKE '%Start%Why%' OR
  title ILIKE '%The%Lean%Startup%' OR
  title ILIKE '%Never%Eat%Alone%' OR
  title ILIKE '%Emotional%Intelligence%' OR
  title ILIKE '%Crucial%Conversations%' OR
  title ILIKE '%Quiet%' OR
  title ILIKE '%The%Effective%Executive%' OR
  title ILIKE '%Getting%Things%Done%' OR
  title ILIKE '%Design%Thinking%' OR
  title ILIKE '%Innovation%' OR
  title ILIKE '%Creativity%';

-- Set remaining as Spanish
UPDATE knowledge_base SET language = 'español' WHERE language IS NULL;

-- Verify the update
SELECT language, COUNT(*) as count FROM knowledge_base GROUP BY language;
