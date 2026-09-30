import fs from 'node:fs/promises';
import db from '../db/db.js';

async function run() {
  try {
    const seedSql = await fs.readFile(
      new URL('../services/seed.sql', import.meta.url),
      'utf8'
    );

    await db.query(seedSql);

    console.log('✅ Datos de ejemplo cargados');
  } catch (error) {
    console.error('❌ Error al cargar ejemplos:', error.message);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
}

run();