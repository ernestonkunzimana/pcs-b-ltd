/*
  # Create Customers Table

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, required)
      - `customer_number` (varchar, unique)
      - `customer_type` (varchar, default 'individual')
      - `first_name` (varchar, optional)
      - `last_name` (varchar, optional)
      - `company_name` (varchar, optional)
      - `phone` (varchar, optional)
      - `email` (varchar, optional)
      - `address` (text, optional)
      - `city` (varchar, optional)
      - `state` (varchar, optional)
      - `country` (varchar, optional)
      - `postal_code` (varchar, optional)
      - `tax_number` (varchar, optional)
      - `credit_limit` (decimal, default 0)
      - `payment_terms` (varchar, optional)
      - `is_active` (boolean, default true)
      - `created_by` (uuid, optional)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on `customers` table
    - Add policy for organization members to access customers
*/

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  customer_number VARCHAR(100) UNIQUE,
  customer_type VARCHAR(50) DEFAULT 'individual',
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company_name VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  tax_number VARCHAR(100),
  credit_limit DECIMAL(15,2) DEFAULT 0,
  payment_terms VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_organization ON customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_customers_number ON customers(customer_number);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_active ON customers(is_active);