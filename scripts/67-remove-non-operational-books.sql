-- Remove non-operational books: Inteligencia Emocional and Lean In
-- Also remove their related data (chapters, progress, bookmarks)

-- Delete user progress for these books
DELETE FROM public.user_book_progress 
WHERE book_id IN (
    '550e8400-e29b-41d4-a716-446655440004', -- Inteligencia Emocional
    '550e8400-e29b-41d4-a716-446655440005'  -- Lean In
);

-- Delete user bookmarks for these books
DELETE FROM public.user_book_bookmarks 
WHERE book_id IN (
    '550e8400-e29b-41d4-a716-446655440004', -- Inteligencia Emocional
    '550e8400-e29b-41d4-a716-446655440005'  -- Lean In
);

-- Delete chapters for these books
DELETE FROM public.library_book_chapters 
WHERE book_id IN (
    '550e8400-e29b-41d4-a716-446655440004', -- Inteligencia Emocional
    '550e8400-e29b-41d4-a716-446655440005'  -- Lean In
);

-- Delete the books themselves
DELETE FROM public.library_books 
WHERE id IN (
    '550e8400-e29b-41d4-a716-446655440004', -- Inteligencia Emocional
    '550e8400-e29b-41d4-a716-446655440005'  -- Lean In
);

-- Verify remaining books
SELECT id, title, author FROM public.library_books ORDER BY created_at;
