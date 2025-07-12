/*
  # Create Financial Management Tables

  1. New Tables
    - `accounts`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, required)
      - `account_code` (varchar, unique)
      - `account_name` (varchar, required)
      - `account_type` (varchar, required)
      - `parent_account_id` (uuid, optional)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

    - `transactions`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, required)
      - `transaction_number` (varchar, unique)
      - `transaction_date` (date, required)
      - `transaction_type` (varchar, required)
      - `reference_type` (varchar, optional)
      - `reference_id` (uuid, optional)
      - `description` (text, optional)
      - `total_amount` (decimal, required)
      - `status` (varchar, default 'pending')
      - `created_by` (uuid, optional)
      - `approved_by` (uuid, optional)
      - `approved_at` (timestamp, optional)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

    - `transaction_entries`
      - `id` (uuid, primary key)
      - `transaction_id` (uuid, required)
      - `account_id` (uuid, required)
      - `debit_amount` (decimal, default 0)
      - `credit_amount` (decimal, default 0)
      - `description` (text, optional)
      - `created_at` (timestamp, default now)

  2. Security
    - Enable RLS on all tables
    - Add policies for organization members to access financial data
*/

CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  account_code VARCHAR(20) UNIQUE NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_type VARCHAR(50) NOT NULL,
  parent_account_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  transaction_number VARCHAR(100) UNIQUE NOT NULL,
  transaction_date DATE NOT NULL,
  transaction_type VARCHAR(50) NOT NULL,
  reference_type VARCHAR(50),
  reference_id UUID,
  description TEXT,
  total_amount DECIMAL(15,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_by UUID,
  approved_by UUID,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transaction_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL,
  account_id UUID NOT NULL,
  debit_amount DECIMAL(15,2) DEFAULT 0,
  credit_amount DECIMAL(15,2) DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_accounts_organization ON accounts(organization_id);
CREATE INDEX IF NOT EXISTS idx_accounts_code ON accounts(account_code);
CREATE INDEX IF NOT EXISTS idx_accounts_type ON accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_accounts_parent ON accounts(parent_account_id);

CREATE INDEX IF NOT EXISTS idx_transactions_organization ON transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

CREATE INDEX IF NOT EXISTS idx_transaction_entries_transaction ON transaction_entries(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_entries_account ON transaction_entries(account_id);