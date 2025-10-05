-- Database initialization script for EcoLedger
-- This script sets up the initial database schema and data

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('NGO', 'ADMIN', 'COMPANY');
CREATE TYPE project_status AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'VERIFIED');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_ngo_id ON projects(ngo_id);
CREATE INDEX IF NOT EXISTS idx_projects_verification_date ON projects(verification_date);
CREATE INDEX IF NOT EXISTS idx_verification_logs_project_id ON verification_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_carbon_credits_project_id ON carbon_credits(project_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON system_logs(timestamp);

-- Insert default admin user
INSERT INTO users (id, username, email, password_hash, role, wallet_address, created_at)
VALUES (
    uuid_generate_v4(),
    'admin',
    'admin@ecoledger.com',
    '$2b$12$LQv3c1yqBwfmvkD.eiY.au2kK2vRQfZdjrczN1LWLwZzq.YSo5Bce', -- password: 'admin123'
    'ADMIN',
    '0x1234567890abcdef1234567890abcdef12345678',
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert sample NGO users
INSERT INTO users (id, username, email, password_hash, role, organization_name, wallet_address, created_at)
VALUES 
(
    uuid_generate_v4(),
    'mangrove_trust',
    'contact@mangrovetrust.org',
    '$2b$12$LQv3c1yqBwfmvkD.eiY.au2kK2vRQfZdjrczN1LWLwZzq.YSo5Bce', -- password: 'ngo123'
    'NGO',
    'Mangrove Trust Foundation',
    '0x2345678901bcdef2345678901bcdef2345678901',
    NOW()
),
(
    uuid_generate_v4(),
    'green_earth',
    'info@greenearth.org',
    '$2b$12$LQv3c1yqBwfmvkD.eiY.au2kK2vRQfZdjrczN1LWLwZzq.YSo5Bce', -- password: 'ngo123'
    'NGO',
    'Green Earth Foundation',
    '0x3456789012cdef3456789012cdef3456789012c',
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert sample company users
INSERT INTO users (id, username, email, password_hash, role, organization_name, wallet_address, created_at)
VALUES 
(
    uuid_generate_v4(),
    'eco_corp',
    'sustainability@ecocorp.com',
    '$2b$12$LQv3c1yqBwfmvkD.eiY.au2kK2vRQfZdjrczN1LWLwZzq.YSo5Bce', -- password: 'company123'
    'COMPANY',
    'EcoCorp Industries',
    '0x4567890123def4567890123def4567890123def4',
    NOW()
),
(
    uuid_generate_v4(),
    'carbon_neutral',
    'credits@carbonneutral.com',
    '$2b$12$LQv3c1yqBwfmvkD.eiY.au2kK2vRQfZdjrczN1LWLwZzq.YSo5Bce', -- password: 'company123'
    'COMPANY',
    'Carbon Neutral Solutions',
    '0x5678901234ef5678901234ef5678901234ef567',
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply timestamp triggers to relevant tables
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_projects_modtime BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_carbon_credits_modtime BEFORE UPDATE ON carbon_credits FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_transactions_modtime BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_modified_column();