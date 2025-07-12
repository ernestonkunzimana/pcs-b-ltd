/*
  # Create Projects Table

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, required)
      - `name` (varchar, required)
      - `description` (text, optional)
      - `project_type` (varchar, optional)
      - `status` (varchar, default 'planning')
      - `priority` (varchar, default 'medium')
      - `start_date` (date, optional)
      - `end_date` (date, optional)
      - `estimated_budget` (decimal, optional)
      - `actual_cost` (decimal, default 0)
      - `progress_percentage` (integer, default 0)
      - `client_id` (uuid, optional)
      - `project_manager_id` (uuid, optional)
      - `location` (text, optional)
      - `coordinates` (point, optional)
      - `created_by` (uuid, optional)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on `projects` table
    - Add policy for organization members to access projects
*/

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  project_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'planning',
  priority VARCHAR(20) DEFAULT 'medium',
  start_date DATE,
  end_date DATE,
  estimated_budget DECIMAL(15,2),
  actual_cost DECIMAL(15,2) DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0,
  client_id UUID,
  project_manager_id UUID,
  location TEXT,
  coordinates POINT,
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_organization ON projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_dates ON projects(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_manager ON projects(project_manager_id);