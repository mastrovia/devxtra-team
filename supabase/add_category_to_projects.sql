-- Add category column to projects table
-- This migration adds a category field to distinguish between freelance and self projects

-- Add the category column with default value 'freelance'
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'freelance' 
CHECK (category IN ('freelance', 'self'));

-- Update existing projects to have 'freelance' category
UPDATE projects 
SET category = 'freelance' 
WHERE category IS NULL;

-- Add comment to document the column
COMMENT ON COLUMN projects.category IS 'Project category: freelance (client work) or self (internal/personal projects)';
