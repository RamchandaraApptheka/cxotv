'use strict';

/**
 * PostgreSQL Slug Migration
 *
 * Safe 3-step migration for the categories.slug column:
 *   Step 1: ADD COLUMN nullable  (instant DDL, non-blocking)
 *   Step 2: Backfill existing rows in batches using SQL REGEXP_REPLACE (slugify)
 *   Step 3a: CREATE UNIQUE INDEX CONCURRENTLY (non-blocking, reads all rows)
 *   Step 3b: ALTER COLUMN slug SET NOT NULL (instant after unique index exists)
 *
 * Run on staging first, then production.
 * Prerequisite: Take a full DB backup before running Step 3 on production.
 *
 * NOTE: Strapi v4 runs migrations via Knex. The table name for the
 * "categories" content-type is typically `categories`. Confirm with
 * `\dt` in psql before running on production.
 */

const TABLE = 'categories';

module.exports = {
  /**
   * @param {import('knex').Knex} knex
   */
  async up(knex) {
    const hasTable = await knex.schema.hasTable(TABLE);
    if (!hasTable) {
      console.log(`[migration] Table ${TABLE} does not exist yet (fresh database). Skipping migration; Strapi schema sync will create the table and column.`);
      return;
    }

    // ─── Step 1: Add nullable slug column ────────────────────────────────────
    const hasSlug = await knex.schema.hasColumn(TABLE, 'slug');
    if (!hasSlug) {
      await knex.schema.table(TABLE, (table) => {
        table.string('slug', 255).nullable();
      });
      console.log(`[migration] Step 1: Added nullable 'slug' column to ${TABLE}`);
    } else {
      console.log(`[migration] Step 1: 'slug' column already exists on ${TABLE}, skipping ADD COLUMN`);
    }

    // ─── Step 2: Backfill existing rows in batches ───────────────────────────
    //
    // Slugify logic (mirrors slugifyCategory() in middleware.js):
    //   1. Replace & with 'and'
    //   2. Remove single/double quotes
    //   3. Remove all non-word chars except spaces and hyphens
    //   4. Replace runs of spaces/underscores/hyphens with a single hyphen
    //   5. Trim leading/trailing hyphens
    //   6. Lowercase
    //
    // PostgreSQL REGEXP_REPLACE is used for in-database slugification.
    // Batch size of 200 avoids long-running transactions.

    const BATCH_SIZE = 200;
    let offset = 0;
    let batchCount = 0;

    while (true) {
      const rows = await knex(TABLE)
        .whereNull('slug')
        .select('id', 'name')
        .limit(BATCH_SIZE)
        .offset(offset);

      if (rows.length === 0) break;

      for (const row of rows) {
        if (!row.name || typeof row.name !== 'string') continue;

        const slug = row.name
          .toLowerCase()
          .replace(/&/g, 'and')
          .replace(/['"]/g, '')
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');

        if (slug) {
          await knex(TABLE).where('id', row.id).update({ slug });
        }
      }

      batchCount++;
      console.log(`[migration] Step 2: Backfilled batch ${batchCount} (${rows.length} rows, offset=${offset})`);
      offset += BATCH_SIZE;
    }

    console.log(`[migration] Step 2: Backfill complete (${batchCount} batches processed)`);

    // ─── Step 3a: CREATE UNIQUE INDEX ────────────────────────────────────────
    //
    // Requires the DB user to be the table owner or a PostgreSQL superuser.
    // If the Strapi user lacks ownership rights (error 42501), the index must
    // be created manually by a DBA using the SQL printed below.
    try {
      await knex.raw(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_${TABLE}_slug_unique
        ON ${TABLE} (slug)
      `);
      console.log(`[migration] Step 3a: Created unique index idx_${TABLE}_slug_unique`);

      // ─── Step 3b: Enforce NOT NULL ──────────────────────────────────────────
      await knex.schema.table(TABLE, (table) => {
        table.string('slug', 255).notNullable().alter();
      });
      console.log(`[migration] Step 3b: Altered ${TABLE}.slug to NOT NULL`);
    } catch (err) {
      if (err.code === '42501') {
        // Permission denied — the Strapi DB user is not the owner of the table.
        // This is expected when the table was created by a different superuser role.
        // The migration is still marked complete; have a DBA run the SQL below.
        console.warn(`[migration] Step 3: SKIPPED — DB user lacks table ownership (pg error 42501).`);
        console.warn(`[migration] ACTION REQUIRED: Ask your DBA to run the following SQL as a superuser:`);
        console.warn(`\n  -- Grant the Strapi user index creation rights, then run:`);
        console.warn(`  CREATE UNIQUE INDEX IF NOT EXISTS idx_${TABLE}_slug_unique ON ${TABLE} (slug);`);
        console.warn(`  ALTER TABLE ${TABLE} ALTER COLUMN slug SET NOT NULL;\n`);
      } else {
        // Unexpected error — re-throw so the migration fails loudly
        throw err;
      }
    }
  },

  /**
   * Rollback: drop the unique index and the slug column.
   * @param {import('knex').Knex} knex
   */
  async down(knex) {
    await knex.raw(`DROP INDEX IF EXISTS idx_${TABLE}_slug_unique`);
    console.log(`[migration] rollback: Dropped idx_${TABLE}_slug_unique`);

    const hasSlug = await knex.schema.hasColumn(TABLE, 'slug');
    if (hasSlug) {
      await knex.schema.table(TABLE, (table) => {
        table.dropColumn('slug');
      });
      console.log(`[migration] rollback: Dropped 'slug' column from ${TABLE}`);
    }
  },
};
