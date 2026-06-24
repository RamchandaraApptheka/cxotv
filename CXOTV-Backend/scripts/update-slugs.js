'use strict';

/**
 * Slug Update Script for CXOTV Database
 *
 * Connects directly to PostgreSQL and:
 *   1. Ensures categories.slug column exists (adds if missing)
 *   2. Backfills category slugs from category names
 *   3. Backfills news slugs from news titles (if any are NULL)
 *   4. Creates unique indexes on slug columns
 *   5. Sets NOT NULL constraints
 *
 * Usage:
 *   node scripts/update-slugs.js
 *
 * Environment (optional — uses Docker defaults):
 *   DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD
 */

const { Client } = require('pg');

// ── Database config (Docker defaults) ────────────────────────────────────────
const DB_CONFIG = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  database: process.env.DATABASE_NAME || 'devcxotvdb',
  user: process.env.DATABASE_USERNAME || 'devcxotvdbusr',
  password: process.env.DATABASE_PASSWORD || 'Bjt*bh7%tiKr&4^te45',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

// ── Slugify function (matches Strapi uid behavior) ──────────────────────────
function slugify(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/['"]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── Ensure column exists ─────────────────────────────────────────────────────
async function ensureColumn(client, table, column, type = 'VARCHAR(255)') {
  const check = await client.query(`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = $1 AND column_name = $2
    )
  `, [table, column]);

  if (!check.rows[0].exists) {
    await client.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
    console.log(`  ✓ Added column ${table}.${column}`);
    return true;
  }
  console.log(`  ✓ Column ${table}.${column} already exists`);
  return false;
}

// ── Backfill slugs in batches ────────────────────────────────────────────────
async function backfillSlugs(client, table, nameColumn, slugColumn, batchSize = 200) {
  let offset = 0;
  let total = 0;

  while (true) {
    const rows = await client.query(`
      SELECT id, ${nameColumn} FROM ${table}
      WHERE (${slugColumn} IS NULL OR ${slugColumn} = '')
        AND ${nameColumn} IS NOT NULL
      ORDER BY id
      LIMIT $1 OFFSET $2
    `, [batchSize, offset]);

    if (rows.rows.length === 0) break;

    for (const row of rows.rows) {
      const slug = slugify(row[nameColumn]);
      if (slug) {
        // Check for slug conflicts — append numeric suffix if needed
        let finalSlug = slug;
        let suffix = 1;
        while (true) {
          const conflict = await client.query(`
            SELECT id FROM ${table} WHERE ${slugColumn} = $1 AND id != $2
          `, [finalSlug, row.id]);

          if (conflict.rows.length === 0) break;
          suffix++;
          finalSlug = `${slug}-${suffix}`;
        }

        await client.query(`
          UPDATE ${table} SET ${slugColumn} = $1 WHERE id = $2
        `, [finalSlug, row.id]);
        total++;
      }
    }

    offset += batchSize;
    console.log(`  ... batch: ${rows.rows.length} rows (total: ${total})`);
  }

  return total;
}

// ── Create unique index ──────────────────────────────────────────────────────
async function createUniqueIndex(client, table, column) {
  const indexName = `idx_${table}_${column}_unique`;
  try {
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS ${indexName} ON ${table} (${column})
    `);
    console.log(`  ✓ Created unique index ${indexName}`);
  } catch (err) {
    if (err.code === '42501') {
      console.log(`  ⚠ Skipped index (permission denied) — run manually as superuser:`);
      console.log(`    CREATE UNIQUE INDEX IF NOT EXISTS ${indexName} ON ${table} (${column});`);
    } else {
      throw err;
    }
  }
}

// ── Set NOT NULL ─────────────────────────────────────────────────────────────
async function setNotNull(client, table, column) {
  try {
    await client.query(`ALTER TABLE ${table} ALTER COLUMN ${column} SET NOT NULL`);
    console.log(`  ✓ Set ${table}.${column} NOT NULL`);
  } catch (err) {
    if (err.code === '42501') {
      console.log(`  ⚠ Skipped NOT NULL (permission denied) — run manually:`);
      console.log(`    ALTER TABLE ${table} ALTER COLUMN ${column} SET NOT NULL;`);
    } else if (err.code === '23502') {
      console.log(`  ⚠ Skipped NOT NULL — some rows still have NULL slugs`);
    } else {
      throw err;
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  CXOTV Slug Update Script');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  Database: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}`);
  console.log('');

  const client = new Client(DB_CONFIG);

  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    // ── Categories ──────────────────────────────────────────────────────────
    console.log('─── Categories ───────────────────────────────────────');
    await ensureColumn(client, 'categories', 'slug');
    const catCount = await backfillSlugs(client, 'categories', 'name', 'slug');
    console.log(`  ✓ Backfilled ${catCount} category slugs`);
    await createUniqueIndex(client, 'categories', 'slug');
    await setNotNull(client, 'categories', 'slug');

    // Show results
    const cats = await client.query('SELECT id, name, slug FROM categories ORDER BY id');
    console.log(`\n  Categories (${cats.rows.length}):`);
    for (const c of cats.rows) {
      console.log(`    ${c.id}. ${c.name} → ${c.slug}`);
    }

    // ── News ────────────────────────────────────────────────────────────────
    console.log('\n─── News ─────────────────────────────────────────────');
    await ensureColumn(client, 'news', 'slug');

    // Check if any news slugs are NULL
    const nullSlugs = await client.query('SELECT COUNT(*) FROM news WHERE slug IS NULL OR slug = \'\'');
    const nullCount = parseInt(nullSlugs.rows[0].count, 10);

    if (nullCount > 0) {
      const newsCount = await backfillSlugs(client, 'news', 'title', 'slug');
      console.log(`  ✓ Backfilled ${newsCount} news slugs`);
    } else {
      console.log('  ✓ All news already have slugs');
    }

    await createUniqueIndex(client, 'news', 'slug');
    await setNotNull(client, 'news', 'slug');

    // ── Subcategories ───────────────────────────────────────────────────────
    console.log('\n─── Subcategories ────────────────────────────────────');
    const hasSubcat = await client.query(`
      SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subcategories' AND column_name = 'slug')
    `);

    if (hasSubcat.rows[0].exists) {
      const subNullSlugs = await client.query('SELECT COUNT(*) FROM subcategories WHERE slug IS NULL OR slug = \'\'');
      const subNullCount = parseInt(subNullSlugs.rows[0].count, 10);
      if (subNullCount > 0) {
        const subCount = await backfillSlugs(client, 'subcategories', 'name', 'slug');
        console.log(`  ✓ Backfilled ${subCount} subcategory slugs`);
      } else {
        console.log('  ✓ All subcategories already have slugs');
      }
    } else {
      console.log('  ⚠ No slug column on subcategories — skipping');
    }

    // ── Tags ────────────────────────────────────────────────────────────────
    console.log('\n─── Tags ─────────────────────────────────────────────');
    const hasTagSlug = await client.query(`
      SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tags' AND column_name = 'slug')
    `);

    if (hasTagSlug.rows[0].exists) {
      const tagNullSlugs = await client.query('SELECT COUNT(*) FROM tags WHERE slug IS NULL OR slug = \'\'');
      const tagNullCount = parseInt(tagNullSlugs.rows[0].count, 10);
      if (tagNullCount > 0) {
        const tagCount = await backfillSlugs(client, 'tags', 'name', 'slug');
        console.log(`  ✓ Backfilled ${tagCount} tag slugs`);
      } else {
        console.log('  ✓ All tags already have slugs');
      }
    } else {
      console.log('  ⚠ No slug column on tags — skipping');
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  Done. All slugs updated.');
    console.log('═══════════════════════════════════════════════════════');

  } catch (err) {
    console.error('\n✗ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
