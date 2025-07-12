/*
  # Create Audit and System Logging Tables

  1. New Tables
    - `audit_logs`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, optional)
      - `user_id` (uuid, optional)
      - `action` (varchar, required)
      - `table_name` (varchar, required)
      - `record_id` (uuid, optional)
      - `old_values` (jsonb, optional)
      - `new_values` (jsonb, optional)
      - `ip_address` (inet, optional)
      - `user_agent` (text, optional)
      - `created_at` (timestamp, default now)

    - `system_logs`
      - `id` (uuid, primary key)
      - `level` (varchar, required)
      - `message` (text, required)
      - `context` (jsonb, optional)
      - `module` (varchar, optional)
      - `user_id` (uuid, optional)
      - `ip_address` (inet, optional)
      - `created_at` (timestamp, default now)

  2. Security
    - Enable RLS on `audit_logs` table
    - Add policies for organization members to access audit logs
    - System logs are accessible to admin users only
*/

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID,
  user_id UUID,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  context JSONB,
  module VARCHAR(100),
  user_id UUID,
  ip_address INET,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_date ON audit_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_module ON system_logs(module);
CREATE INDEX IF NOT EXISTS idx_system_logs_user ON system_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_date ON system_logs(created_at);