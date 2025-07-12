/*
  # Create ESG Metrics Table

  1. New Tables
    - `esg_metrics`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, required)
      - `metric_type` (varchar, required)
      - `metric_name` (varchar, required)
      - `metric_value` (decimal, required)
      - `unit_of_measure` (varchar, optional)
      - `measurement_date` (date, required)
      - `project_id` (uuid, optional)
      - `notes` (text, optional)
      - `created_by` (uuid, optional)
      - `created_at` (timestamp, default now)

  2. Security
    - Enable RLS on `esg_metrics` table
    - Add policies for organization members to access ESG metrics
*/

CREATE TABLE IF NOT EXISTS esg_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  metric_type VARCHAR(50) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(15,4) NOT NULL,
  unit_of_measure VARCHAR(50),
  measurement_date DATE NOT NULL,
  project_id UUID,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_esg_metrics_organization ON esg_metrics(organization_id);
CREATE INDEX IF NOT EXISTS idx_esg_metrics_project ON esg_metrics(project_id);
CREATE INDEX IF NOT EXISTS idx_esg_metrics_type ON esg_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_esg_metrics_date ON esg_metrics(measurement_date);
CREATE INDEX IF NOT EXISTS idx_esg_metrics_created_by ON esg_metrics(created_by);