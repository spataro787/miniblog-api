import 'dotenv/config';
import fs from 'node:fs/promises';
import pg from 'pg';

const { Pool } = pg;

async function run() {
  if (!process.env.DATABASE_URL) {
    throw new Error('Falta DATABASE_URL en el .env');
  }

  const databaseUrl = new URL(process.env.DATABASE_URL);
  const databaseName = decodeURIComponent(
    databaseUrl.pathname.slice(1)
  );

  if (!databaseName) {
    throw new Error('DATABASE_URL debe incluir el nombre de la base');
  }

  // Este script está preparado para PostgreSQL local.
  const adminUrl = new URL(databaseUrl.href);
  adminUrl.pathname = '/postgres';

  const adminPool = new Pool({
    connectionString: adminUrl.href,
    connectionTimeoutMillis: 10000,
  });

  try {
    const exists = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [databaseName]
    );

    if (exists.rowCount === 0) {
      const safeName = databaseName.replace(/"/g, '""');

      await adminPool.query(`CREATE DATABASE "${safeName}"`);
      console.log('✅ Base de datos creada');
    } else {
      console.log('✅ La base de datos ya existe');
    }
  } finally {
    await adminPool.end();
  }

  const databasePool = new Pool({
    connectionString: databaseUrl.href,
    connectionTimeoutMillis: 10000,
  });

  try {
    const setupSql = await fs.readFile(
      new URL('../services/setup.sql', import.meta.url),
      'utf8'
    );

    const seedSql = await fs.readFile(
      new URL('../services/seed.sql', import.meta.url),
      'utf8'
    );

    await databasePool.query(setupSql);
    console.log('✅ Estructura preparada');

    await databasePool.query(seedSql);
    console.log('✅ Datos de ejemplo cargados');
  } finally {
    await databasePool.end();
  }
}

run().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exitCode = 1;
});