-- ============================================================
-- Docker init script — runs ONCE on first container start
-- Creates the Strapi app user and grants full ownership
-- ============================================================

-- 1. Create app user (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'devcxotvdbusr') THEN
    CREATE USER devcxotvdbusr WITH PASSWORD 'Bjt*bh7%tiKr&4^te45';
  END IF;
END
$$;

-- 2. Grant connection and usage
GRANT CONNECT ON DATABASE devcxotvdb TO devcxotvdbusr;
GRANT USAGE ON SCHEMA public TO devcxotvdbusr;

-- 3. Grant full privileges on all existing objects (if any)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO devcxotvdbusr;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO devcxotvdbusr;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO devcxotvdbusr;

-- 4. Default privileges for future objects created by postgres
-- (so any table Strapi creates via postgres is immediately accessible)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO devcxotvdbusr;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO devcxotvdbusr;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO devcxotvdbusr;

-- 5. Make devcxotvdbusr the owner of the public schema
-- This is the key: allows CREATE TABLE, CREATE INDEX, ALTER TABLE
ALTER SCHEMA public OWNER TO devcxotvdbusr;

-- 6. Allow devcxotvdbusr to create objects in the schema
GRANT CREATE ON SCHEMA public TO devcxotvdbusr;
