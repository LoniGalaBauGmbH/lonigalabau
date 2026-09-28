-- Create configurator-images bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('configurator-images', 'configurator-images', true) ON CONFLICT (id) DO NOTHING;

-- RLS policies for configurator-images
CREATE POLICY "anyone uploads configurator images" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id='configurator-images');
CREATE POLICY "public reads configurator images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id='configurator-images');
