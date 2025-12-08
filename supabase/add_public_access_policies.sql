-- Add public (anonymous) read access policies
-- This allows the public website to display team and project data
-- without requiring authentication

-- Allow public read access to active team members
CREATE POLICY "Allow public read access to active team"
  ON team FOR SELECT
  TO anon
  USING (status = 'Active');

-- Allow public read access to completed, non-self projects
CREATE POLICY "Allow public read access to public projects"
  ON projects FOR SELECT
  TO anon
  USING (status = 'Completed' AND category != 'self');

-- Allow public read access to project_members (for showing team on projects)
CREATE POLICY "Allow public read access to project_members"
  ON project_members FOR SELECT
  TO anon
  USING (true);

-- Verify policies are created
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('team', 'projects', 'project_members')
ORDER BY tablename, policyname;
