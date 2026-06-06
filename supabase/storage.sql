-- Supabase Storage bucket for experience images
-- Run in Supabase SQL Editor

INSERT INTO storage.buckets (id, name, public)
VALUES ('experiences', 'experiences', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read experience images"
ON storage.objects FOR SELECT
USING (bucket_id = 'experiences');

CREATE POLICY "Service upload experience images"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'experiences');

CREATE POLICY "Service delete experience images"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'experiences');
