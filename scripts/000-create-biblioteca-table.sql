-- Create biblioteca table for Chilean public resources and books
-- This table stores all library content including books and public data sources

CREATE TABLE IF NOT EXISTS public.biblioteca (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    category VARCHAR(100),
    description TEXT,
    url TEXT,
    estimated_read_time INTEGER,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    language VARCHAR(10) DEFAULT 'es',
    source_type VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    relevance_score NUMERIC(3,2) DEFAULT 0.0,
    pages INTEGER,
    published_year INTEGER,
    cover_url TEXT,
    rating NUMERIC(3,2),
    difficulty VARCHAR(50),
    is_recommended BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    key_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_biblioteca_category ON public.biblioteca(category);
CREATE INDEX IF NOT EXISTS idx_biblioteca_source_type ON public.biblioteca(source_type);
CREATE INDEX IF NOT EXISTS idx_biblioteca_tags ON public.biblioteca USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_biblioteca_relevance ON public.biblioteca(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_biblioteca_created_at ON public.biblioteca(created_at DESC);

-- Enable RLS
ALTER TABLE public.biblioteca ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "biblioteca_readable_by_all" ON public.biblioteca 
    FOR SELECT USING (true);

CREATE POLICY "biblioteca_insertable_by_auth" ON public.biblioteca 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "biblioteca_updateable_by_auth" ON public.biblioteca 
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT SELECT ON public.biblioteca TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.biblioteca TO authenticated;
