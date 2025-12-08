    -- Create storage buckets for file uploads

    -- Create avatars bucket for team member profile photos
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('avatars', 'avatars', true)
    ON CONFLICT (id) DO NOTHING;

    -- Create project-images bucket for project photos
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('project-images', 'project-images', true)
    ON CONFLICT (id) DO NOTHING;

    -- Set up storage policies

    -- Allow authenticated users to upload avatars
    CREATE POLICY "Allow authenticated uploads to avatars"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'avatars');

    -- Allow public read access to avatars
    CREATE POLICY "Allow public read access to avatars"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'avatars');

    -- Allow authenticated users to delete their uploads
    CREATE POLICY "Allow authenticated delete avatars"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'avatars');

    -- Allow authenticated users to upload project images
    CREATE POLICY "Allow authenticated uploads to project-images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'project-images');

    -- Allow public read access to project images
    CREATE POLICY "Allow public read access to project-images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'project-images');

    -- Allow authenticated users to delete project images
    CREATE POLICY "Allow authenticated delete project-images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'project-images');
