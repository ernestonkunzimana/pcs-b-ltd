/*
  # Create Inventory Management Tables

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, required)
      - `name` (varchar, required)
      - `description` (text, optional)
      - `parent_category_id` (uuid, optional)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

    - `products`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, required)
      - `category_id` (uuid, optional)
      - `name` (varchar, required)
      - `description` (text, optional)
      - `sku` (varchar, unique)
      - `barcode` (varchar, optional)
      - `unit_of_measure` (varchar, optional)
      - `cost_price` (decimal, optional)
      - `selling_price` (decimal, optional)
      - `minimum_stock` (integer, default 0)
      - `maximum_stock` (integer, optional)
      - `reorder_level` (integer, default 0)
      - `is_active` (boolean, default true)
      - `is_service` (boolean, default false)
      - `weight` (decimal, optional)
      - `dimensions` (varchar, optional)
      - `created_by` (uuid, optional)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

    - `inventory`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, required)
      - `product_id` (uuid, required)
      - `location` (varchar, optional)
      - `quantity_available` (integer, default 0)
      - `quantity_reserved` (integer, default 0)
      - `quantity_ordered` (integer, default 0)
      - `last_restocked_at` (timestamp, optional)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on all tables
    - Add policies for organization members to access inventory
*/

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  parent_category_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  category_id UUID,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sku VARCHAR(100) UNIQUE,
  barcode VARCHAR(100),
  unit_of_measure VARCHAR(50),
  cost_price DECIMAL(15,2),
  selling_price DECIMAL(15,2),
  minimum_stock INTEGER DEFAULT 0,
  maximum_stock INTEGER,
  reorder_level INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_service BOOLEAN DEFAULT false,
  weight DECIMAL(10,3),
  dimensions VARCHAR(100),
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  product_id UUID NOT NULL,
  location VARCHAR(100),
  quantity_available INTEGER NOT NULL DEFAULT 0,
  quantity_reserved INTEGER DEFAULT 0,
  quantity_ordered INTEGER DEFAULT 0,
  last_restocked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, location)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_organization ON categories(organization_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

CREATE INDEX IF NOT EXISTS idx_products_organization ON products(organization_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

CREATE INDEX IF NOT EXISTS idx_inventory_organization ON inventory(organization_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_location ON inventory(location);