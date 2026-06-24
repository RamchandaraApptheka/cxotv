-- ============================================================
-- CXOTV Database Ownership Fix
-- Run this script as the 'postgres' superuser on devcxotvdb
-- Connects: psql -h 3.6.229.109 -U postgres -d devcxotvdb
-- ============================================================

-- Why: All 42 tables in devcxotvdb are owned by 'postgres'
-- but the Strapi app user is 'devcxotvdbusr'.
-- PostgreSQL requires table ownership to ALTER TABLE, CREATE INDEX,
-- or DROP CONSTRAINT — all of which Strapi does on startup for schema sync.
-- Until this is fixed, Strapi CANNOT start successfully.

-- ── OPTION A (Preferred): Single command — reassign everything ──────────────
-- This is the cleanest approach. Reassigns all objects postgres owns
-- in devcxotvdb to devcxotvdbusr in one statement.

REASSIGN OWNED BY postgres TO devcxotvdbusr;

-- ── OPTION B (If REASSIGN is not allowed): Table-by-table ALTER ─────────────
-- Use this if the postgres user on this server is not the DB owner
-- (e.g. AWS RDS where 'postgres' is not a true superuser).

ALTER TABLE public.admin_permissions                         OWNER TO devcxotvdbusr;
ALTER TABLE public.admin_permissions_role_links              OWNER TO devcxotvdbusr;
ALTER TABLE public.admin_roles                               OWNER TO devcxotvdbusr;
ALTER TABLE public.admin_users                               OWNER TO devcxotvdbusr;
ALTER TABLE public.admin_users_roles_links                   OWNER TO devcxotvdbusr;
ALTER TABLE public.categories                                OWNER TO devcxotvdbusr;
ALTER TABLE public.categories_localizations_links            OWNER TO devcxotvdbusr;
ALTER TABLE public.components_dropdown_gallaries             OWNER TO devcxotvdbusr;
ALTER TABLE public.components_labels_brand_galleries         OWNER TO devcxotvdbusr;
ALTER TABLE public.costom_ads                                OWNER TO devcxotvdbusr;
ALTER TABLE public.files                                     OWNER TO devcxotvdbusr;
ALTER TABLE public.files_folder_links                        OWNER TO devcxotvdbusr;
ALTER TABLE public.files_related_morphs                      OWNER TO devcxotvdbusr;
ALTER TABLE public.i18n_locale                               OWNER TO devcxotvdbusr;
ALTER TABLE public.navbars                                   OWNER TO devcxotvdbusr;
ALTER TABLE public.navbars_components                        OWNER TO devcxotvdbusr;
ALTER TABLE public.news                                      OWNER TO devcxotvdbusr;
ALTER TABLE public.news_categories_links                     OWNER TO devcxotvdbusr;
ALTER TABLE public.news_latters                              OWNER TO devcxotvdbusr;
ALTER TABLE public.news_subcategories_links                  OWNER TO devcxotvdbusr;
ALTER TABLE public.news_tags_links                           OWNER TO devcxotvdbusr;
ALTER TABLE public.shortss                                   OWNER TO devcxotvdbusr;
ALTER TABLE public.social_media_links                        OWNER TO devcxotvdbusr;
ALTER TABLE public.strapi_api_token_permissions              OWNER TO devcxotvdbusr;
ALTER TABLE public.strapi_api_token_permissions_token_links  OWNER TO devcxotvdbusr;
ALTER TABLE public.strapi_api_tokens                         OWNER TO devcxotvdbusr;
ALTER TABLE public.strapi_core_store_settings                OWNER TO devcxotvdbusr;
ALTER TABLE public.strapi_database_schema                    OWNER TO devcxotvdbusr;
ALTER TABLE public.strapi_transfer_token_permissions         OWNER TO devcxotvdbusr;
ALTER TABLE public.strapi_transfer_token_permissions_token_links OWNER TO devcxotvdbusr;
ALTER TABLE public.strapi_transfer_tokens                    OWNER TO devcxotvdbusr;
ALTER TABLE public.strapi_webhooks                           OWNER TO devcxotvdbusr;
ALTER TABLE public.subcategories                             OWNER TO devcxotvdbusr;
ALTER TABLE public.subcategories_category_links              OWNER TO devcxotvdbusr;
ALTER TABLE public.tags                                      OWNER TO devcxotvdbusr;
ALTER TABLE public.up_permissions                            OWNER TO devcxotvdbusr;
ALTER TABLE public.up_permissions_role_links                 OWNER TO devcxotvdbusr;
ALTER TABLE public.up_roles                                  OWNER TO devcxotvdbusr;
ALTER TABLE public.up_users                                  OWNER TO devcxotvdbusr;
ALTER TABLE public.up_users_role_links                       OWNER TO devcxotvdbusr;
ALTER TABLE public.upload_folders                            OWNER TO devcxotvdbusr;
ALTER TABLE public.upload_folders_parent_links               OWNER TO devcxotvdbusr;

-- ── Sequences (auto-increment IDs) ──────────────────────────────────────────
-- Also transfer sequences so INSERT operations keep working
ALTER SEQUENCE public.admin_permissions_id_seq                         OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.admin_roles_id_seq                               OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.admin_users_id_seq                               OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.categories_id_seq                                OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.files_id_seq                                     OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.i18n_locale_id_seq                               OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.navbars_id_seq                                   OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.navbars_components_id_seq                        OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.news_id_seq                                      OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.news_latters_id_seq                              OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.shortss_id_seq                                   OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.social_media_links_id_seq                        OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.strapi_api_tokens_id_seq                         OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.strapi_api_token_permissions_id_seq              OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.strapi_transfer_tokens_id_seq                    OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.strapi_transfer_token_permissions_id_seq         OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.strapi_webhooks_id_seq                           OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.subcategories_id_seq                             OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.tags_id_seq                                      OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.up_permissions_id_seq                            OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.up_roles_id_seq                                  OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.up_users_id_seq                                  OWNER TO devcxotvdbusr;
ALTER SEQUENCE public.upload_folders_id_seq                            OWNER TO devcxotvdbusr;

-- ── Default privileges (future tables created by devcxotvdbusr) ─────────────
ALTER DEFAULT PRIVILEGES FOR ROLE devcxotvdbusr IN SCHEMA public
  GRANT ALL ON TABLES TO devcxotvdbusr;

ALTER DEFAULT PRIVILEGES FOR ROLE devcxotvdbusr IN SCHEMA public
  GRANT ALL ON SEQUENCES TO devcxotvdbusr;

-- ── Post-migration manual steps (after Strapi starts successfully) ───────────
-- These need to be run AFTER the ownership fix above:

-- 1. Category slug unique index (our custom migration — skipped due to permissions)
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug_unique ON public.categories (slug);
ALTER TABLE public.categories ALTER COLUMN slug SET NOT NULL;

-- ── Verification ─────────────────────────────────────────────────────────────
-- Run this after to confirm all tables are now owned by devcxotvdbusr:
SELECT tablename, tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tableowner, tablename;
-- Expected: all rows should show tableowner = 'devcxotvdbusr'
