-- Fix RLS policies for media_files table
-- This allows authenticated users (including anonymous) to insert media

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated to insert" ON media_files;
DROP POLICY IF EXISTS "Allow authenticated users to view media" ON media_files;
DROP POLICY IF EXISTS "Users can delete own media" ON media_files;

-- Enable RLS if not already enabled
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow all authenticated users (including anonymous) to INSERT
CREATE POLICY "Allow authenticated to insert media"
  ON media_files
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy 2: Allow all authenticated users (including anonymous) to SELECT/VIEW
CREATE POLICY "Allow authenticated to view media"
  ON media_files
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 3: Allow users to DELETE only their own uploads
CREATE POLICY "Users can delete own media"
  ON media_files
  FOR DELETE
  TO authenticated
  USING (uploaded_by_id = auth.uid());
