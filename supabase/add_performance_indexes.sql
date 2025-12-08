-- Indexes to optimize Supabase queries
-- Run this in Supabase SQL Editor to dramatically speed up queries

-- Index for projects table
CREATE INDEX IF NOT EXISTS idx_projects_status_category 
ON projects(status, category);

CREATE INDEX IF NOT EXISTS idx_projects_created_at 
ON projects(created_at DESC);

-- Index for team table  
CREATE INDEX IF NOT EXISTS idx_team_status 
ON team(status);

CREATE INDEX IF NOT EXISTS idx_team_name 
ON team(name);

-- Index for project_members junction table
CREATE INDEX IF NOT EXISTS idx_project_members_project_id 
ON project_members(project_id);

CREATE INDEX IF NOT EXISTS idx_project_members_member_id 
ON project_members(member_id);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_projects_status_created 
ON projects(status, created_at DESC) 
WHERE status = 'Completed';

-- Add comments for documentation
COMMENT ON INDEX idx_projects_status_category IS 'Speeds up filtering by status and category';
COMMENT ON INDEX idx_projects_created_at IS 'Speeds up ordering by created_at';
COMMENT ON INDEX idx_team_status IS 'Speeds up filtering active team members';
COMMENT ON INDEX idx_project_members_project_id IS 'Speeds up project->team lookups';
COMMENT ON INDEX idx_project_members_member_id IS 'Speeds up team->projects lookups';

-- Analyze tables to update statistics
ANALYZE projects;
ANALYZE team;
ANALYZE project_members;
