-- ============================================
-- Multi-Tenant Photo Album SaaS Database Schema
-- Run these commands in Supabase SQL Editor
-- ============================================

-- IMPORTANT: Disable RLS for development
-- Once tables are created, go to Authentication → Policies in Supabase and enable RLS per table

-- Create users table (mirrors auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id           uuid      PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at   timestamptz NOT NULL DEFAULT now(),
    subscription_status text NOT NULL DEFAULT 'free',
    plan_type    text      NOT NULL DEFAULT 'starter',
    storage_limit_mb int    NOT NULL DEFAULT 1024
);

ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Create event_albums table
CREATE TABLE IF NOT EXISTS public.event_albums (
    id                uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id          uuid      NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name              text      NOT NULL,
    public_code       text      NOT NULL UNIQUE,
    is_active         boolean   NOT NULL DEFAULT true,
    expiration_date   timestamptz,
    max_files_per_user int      NOT NULL DEFAULT 100,
    max_file_size_mb   int      NOT NULL DEFAULT 25,
    max_total_storage_mb int    NOT NULL DEFAULT 10240,
    created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.event_albums DISABLE ROW LEVEL SECURITY;

-- Create album_stats table
CREATE TABLE IF NOT EXISTS public.album_stats (
    album_id         uuid PRIMARY KEY REFERENCES public.event_albums(id) ON DELETE CASCADE,
    total_photos     int   NOT NULL DEFAULT 0,
    total_videos     int   NOT NULL DEFAULT 0,
    total_uploads    int   NOT NULL DEFAULT 0,
    total_storage_mb numeric(12,2) NOT NULL DEFAULT 0
);

ALTER TABLE public.album_stats DISABLE ROW LEVEL SECURITY;

-- Create media_files table
CREATE TABLE IF NOT EXISTS public.media_files (
    id              uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id        uuid      NOT NULL REFERENCES public.event_albums(id) ON DELETE CASCADE,
    owner_id        uuid      NOT NULL REFERENCES public.users(id),
    uploaded_by_id  uuid,
    uploaded_by_name text,
    file_url        text      NOT NULL,
    file_type       text      NOT NULL,
    file_size_mb    numeric(8,2) NOT NULL,
    created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.media_files DISABLE ROW LEVEL SECURITY;

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_event_albums_owner_id ON public.event_albums(owner_id);
CREATE INDEX IF NOT EXISTS idx_event_albums_public_code ON public.event_albums(public_code);
CREATE INDEX IF NOT EXISTS idx_media_files_album_id ON public.media_files(album_id);
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by_id ON public.media_files(uploaded_by_id);

-- ============================================
-- Auto-create user profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, created_at)
  VALUES (new.id, now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
