-- Create PostgreSQL schemas required by Rumbelo
-- Planes: auth | public | backoffice
--
--   psql $DATABASE_URL -f scripts/db/sql/create-schemas.sql

CREATE SCHEMA IF NOT EXISTS "auth";
CREATE SCHEMA IF NOT EXISTS "backoffice";
-- public already exists by default

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
