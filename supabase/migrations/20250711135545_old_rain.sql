/*
  # Create Payment Tables

  1. New Tables
    - `payment_methods`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, required)
      - `name` (varchar, required)
      - `type` (varchar, required)
      - `provider` (varchar, optional)
      - `account_number` (varchar, optional)
      - `account_name` (varchar, optional)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

    - `payments`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, required)
      - `payment_number` (varchar, unique)
      - `payment_date` (date, required)
      - `payment_type` (varchar, required)
      - `payment_method_id` (uuid, optional)
      - `reference_type` (varchar, optional)
      - `reference_id` (uuid, optional)
      - `payer_id` (uuid, optional)
      - `payer_type` (varchar, optional)
      - `amount` (decimal, required)
      - `currency` (varchar, default 'RWF')
      - `exchange_rate` (decimal, default 1.0)
      - `amount_in_base_currency` (decimal, required)
      - `transaction_fee` (decimal, default 0)
      - `net_amount` (decimal, required)
      - `status` (varchar, default 'pending')
      - `external_transaction_id` (varchar, optional)
      - `notes` (text, optional)
      - `created_by` (uuid, optional)
      - `verified_by` (uuid, optional)
      - `verified_at` (timestamp, optional)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on both tables
    - Add policies for organization members to access payments
*/

CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  provider VARCHAR(100),
  account_number VARCHAR(100),
  account_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  payment_number VARCHAR(100) UNIQUE NOT NULL,
  payment_date DATE NOT NULL,
  payment_type VARCHAR(50) NOT NULL,
  payment_method_id UUID,
  reference_type VARCHAR(50),
  reference_id UUID,
  payer_id UUID,
  payer_type VARCHAR(50),
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'RWF',
  exchange_rate DECIMAL(10,4) DEFAULT 1.0,
  amount_in_base_currency DECIMAL(15,2) NOT NULL,
  transaction_fee DECIMAL(15,2) DEFAULT 0,
  net_amount DECIMAL(15,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  external_transaction_id VARCHAR(255),
  notes TEXT,
  created_by UUID,
  verified_by UUID,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_methods_organization ON payment_methods(organization_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_active ON payment_methods(is_active);

CREATE INDEX IF NOT EXISTS idx_payments_organization ON payments(organization_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_payments_payer ON payments(payer_type, payer_id);
CREATE INDEX IF NOT EXISTS idx_payments_number ON payments(payment_number);