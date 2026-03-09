-- Disable RLS on media_files table temporarily for debugging
-- This will allow all uploads to work without RLS restrictions

ALTER TABLE media_files DISABLE ROW LEVEL SECURITY;

-- Alternative: If you want to keep RLS but with a simpler policy:
-- ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
-- 
-- DROP POLICY IF EXISTS "Allow authenticated to insert media" ON media_files;
-- DROP POLICY IF EXISTS "Allow authenticated to view media" ON media_files;
-- DROP POLICY IF EXISTS "Users can delete own media" ON media_files;
--
-- -- Very permissive policies for testing
-- CREATE POLICY "media_insert" ON media_files FOR INSERT WITH CHECK (true);
-- CREATE POLICY "media_select" ON media_files FOR SELECT USING (true);
-- CREATE POLICY "media_delete" ON media_files FOR DELETE USING (uploaded_by_id = auth.uid());
