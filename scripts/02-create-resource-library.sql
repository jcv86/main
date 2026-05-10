-- Create a2_resource_library table
CREATE TABLE a2_resource_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  resource_type TEXT NOT NULL,
  difficulty_level TEXT,
  estimated_time TEXT,
  language TEXT DEFAULT 'es',
  tags TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a2_task_resources table for mapping tasks to resources
CREATE TABLE a2_task_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES a2_resource_library(id) ON DELETE CASCADE,
  phase INTEGER NOT NULL,
  day INTEGER NOT NULL,
  task_title TEXT NOT NULL,
  recommended BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_resource_library_category ON a2_resource_library(category);
CREATE INDEX idx_resource_library_type ON a2_resource_library(resource_type);
CREATE INDEX idx_resource_library_active ON a2_resource_library(active);
CREATE INDEX idx_task_resources_phase_day ON a2_task_resources(phase, day);

-- Disable RLS initially (we'll enable it after seeding)
ALTER TABLE a2_resource_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_task_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resource_library (public read, admin write)
CREATE POLICY "Anyone can view active resources"
  ON a2_resource_library
  FOR SELECT
  USING (active = true);

-- RLS Policies for task_resources (public read)
CREATE POLICY "Anyone can view task resources"
  ON a2_task_resources
  FOR SELECT
  USING (true);
