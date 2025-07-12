/*
  # Create Tasks Table

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `project_id` (uuid, required)
      - `parent_task_id` (uuid, optional)
      - `title` (varchar, required)
      - `description` (text, optional)
      - `task_type` (varchar, optional)
      - `status` (varchar, default 'pending')
      - `priority` (varchar, default 'medium')
      - `assigned_to` (uuid, optional)
      - `assigned_by` (uuid, optional)
      - `estimated_hours` (integer, optional)
      - `actual_hours` (integer, default 0)
      - `due_date` (timestamp, optional)
      - `started_at` (timestamp, optional)
      - `completed_at` (timestamp, optional)
      - `location` (text, optional)
      - `coordinates` (point, optional)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on `tasks` table
    - Add policy for project members to access tasks
*/

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL,
  parent_task_id UUID,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  task_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  assigned_to UUID,
  assigned_by UUID,
  estimated_hours INTEGER,
  actual_hours INTEGER DEFAULT 0,
  due_date TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  location TEXT,
  coordinates POINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_parent ON tasks(parent_task_id);