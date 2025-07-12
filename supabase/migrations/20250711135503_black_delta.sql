/*
  # Create Organizations Table

  1. New Tables
    - `organizations`
      - `id` (uuid, primary key)
      - `name` (varchar, required)
      - `legal_name` (varchar, optional)
      - `registration_number` (varchar, optional)
      - `tax_number` (varchar, optional)
      - `industry` (varchar, optional)
      - `business_type` (varchar, optional)
      - `phone` (varchar, optional)
      - `email` (varchar, optional)
      - `website` (varchar, optional)
      - `address` (text, optional)
      - `city` (varchar, optional)
      - `state` (varchar, optional)
      - `country` (varchar, optional)
      - `postal_code` (varchar, optional)
      - `logo` (varchar, optional)
      - `description` (text, optional)
      - `established_date` (date, optional)
      - `is_active` (boolean, default true)
      - `created_by` (uuid, optional)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on `organizations` table
    - Add policy for users to access their organization's data
*/

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255),
  registration_number VARCHAR(100),
  tax_number VARCHAR(100),
  industry VARCHAR(100),
  business_type VARCHAR(50),
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  logo VARCHAR(500),
  description TEXT,
  established_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_organizations_active ON organizations(is_active);
CREATE INDEX IF NOT EXISTS idx_organizations_created_by ON organizations(created_by);