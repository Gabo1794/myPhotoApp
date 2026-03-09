-- ============================================
-- RLS Policies for Public Photo Album SaaS
-- Run these commands in Supabase SQL Editor
-- ============================================

-- EVENT_ALBUMS Policies
-- Policy 1: Only authenticated non-anonymous users can create albums
CREATE POLICY "Only permanent users can create albums"
ON event_albums AS RESTRICTIVE FOR INSERT
TO authenticated
WITH CHECK ((select (auth.jwt()->>'is_anonymous')::boolean) is false);

-- Policy 2: Both anonymous and authenticated users can view albums
CREATE POLICY "Anonymous and permanent users can view albums"
ON event_albums FOR SELECT
TO authenticated
USING (true);

-- MEDIA_FILES Policies
-- Policy 1: Anyone authenticated (including anonymous) can insert media
CREATE POLICY "Authenticated users can upload media"
ON media_files FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 2: Anyone authenticated can view media
CREATE POLICY "Authenticated users can view media"
ON media_files FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Users can delete their own uploads
CREATE POLICY "Users can delete own media"
ON media_files FOR DELETE
TO authenticated
USING (uploaded_by_id = auth.uid());

-- ALBUM_STATS Policies
-- Policy 1: Anyone authenticated can view stats
CREATE POLICY "Authenticated users can view album stats"
ON album_stats FOR SELECT
TO authenticated
USING (true);

-- USERS Policies (if needed)
-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
TO authenticated
USING (id = auth.uid());
