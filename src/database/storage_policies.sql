-- Storage policies for event-media bucket - permissive for anonymous users
-- Drop all existing policies first
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated read" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to upload to event-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read from event-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete own uploads" ON storage.objects;

-- Allow ALL authenticated users (including anonymous) to upload
CREATE POLICY "Allow authenticated upload"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'event-media' AND
    auth.role() = 'authenticated'
  );

-- Allow anyone to read/view files
CREATE POLICY "Allow public read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'event-media');

-- Allow authenticated users to delete their own files
CREATE POLICY "Allow delete own files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'event-media' AND
    owner = auth.uid()
  );
