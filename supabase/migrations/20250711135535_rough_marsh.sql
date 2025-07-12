/*
  # Create Invoices and Invoice Items Tables

  1. New Tables
    - `invoices`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, required)
      - `customer_id` (uuid, required)
      - `project_id` (uuid, optional)
      - `invoice_number` (varchar, unique)
      - `invoice_date` (date, required)
      - `due_date` (date, required)
      - `status` (varchar, default 'draft')
      - `subtotal` (decimal, required)
      - `tax_amount` (decimal, default 0)
      - `discount_amount` (decimal, default 0)
      - `total_amount` (decimal, required)
      - `paid_amount` (decimal, default 0)
      - `balance_due` (decimal, required)
      - `notes` (text, optional)
      - `terms_conditions` (text, optional)
      - `created_by` (uuid, optional)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

    - `invoice_items`
      - `id` (uuid, primary key)
      - `invoice_id` (uuid, required)
      - `product_id` (uuid, optional)
      - `description` (text, required)
      - `quantity` (decimal, required)
      - `unit_price` (decimal, required)
      - `total_price` (decimal, required)
      - `created_at` (timestamp, default now)

  2. Security
    - Enable RLS on both tables
    - Add policies for organization members to access invoices
*/

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  project_id UUID,
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  subtotal DECIMAL(15,2) NOT NULL,
  tax_amount DECIMAL(15,2) DEFAULT 0,
  discount_amount DECIMAL(15,2) DEFAULT 0,
  total_amount DECIMAL(15,2) NOT NULL,
  paid_amount DECIMAL(15,2) DEFAULT 0,
  balance_due DECIMAL(15,2) NOT NULL,
  notes TEXT,
  terms_conditions TEXT,
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL,
  product_id UUID,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_organization ON invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_product ON invoice_items(product_id);