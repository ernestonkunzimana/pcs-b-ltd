# I’ll help you by generating a clean, complete PostgreSQL database schema SQL file for the PCS-B-LTD platform based on your specification — applying proper data types, foreign keys, constraints, indices, cascading options, and security where necessary.

# Let’s output this as a plain .sql file you can run directly on your PostgreSQL instance. I’ll generate the code now.

schema_sql = """
-- PCS-B-LTD Complete Database Schema
-- Author: Ernest Nkunzimana
-- Date: 2025-07-11

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================
-- USERS AND ROLES
-- ====================

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE role_permissions (
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================
-- PROJECT MANAGEMENT
-- ====================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    start_date DATE,
    end_date DATE,
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'open',
    due_date DATE,
    evidence_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================
-- INVENTORY & STOCK
-- ====================

CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    unit_price NUMERIC(12, 2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
    quantity_change INTEGER NOT NULL,
    reason VARCHAR(255),
    moved_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================
-- TRANSACTIONS & FINANCIALS
-- ====================

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'RWF',
    type VARCHAR(50),
    payment_method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================
-- ESG METRICS
-- ====================

CREATE TABLE esg_metrics (
    id SERIAL PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    carbon_emissions NUMERIC(10, 2),
    jobs_created INTEGER,
    women_employed INTEGER,
    community_projects TEXT,
    reported_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================
-- AUDIT & SYSTEM LOGS
-- ====================

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(255),
    table_name VARCHAR(100),
    record_id UUID,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE system_logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(20),
    message TEXT,
    context JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================
-- FILE UPLOADS
-- ====================

CREATE TABLE uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(255),
    file_path VARCHAR(255),
    uploaded_by UUID REFERENCES users(id),
    related_project UUID REFERENCES projects(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================
-- API KEYS AND TOKENS
-- ====================

CREATE TABLE api_keys (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================
-- INDEXES
-- ====================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_manager_id ON projects(manager_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);

-- ====================
-- SAMPLE SECURITY POLICY (POSTGRES RLS EXAMPLE)
-- ====================

-- Enable Row Level Security (if needed)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Done.

"""

with open("/mnt/data/pcs_b_ltd_schema.sql", "w") as f:
    f.write(schema_sql)

"/mnt/data/pcs_b_ltd_schema.sql"
