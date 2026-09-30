import fs from 'node:fs/promises';
import db from './src/db/db.js';

async function initDb() {
  try {
    const setupPath = new URL(
      './src/services/setup.sql',
      import.meta.url
    );

    const setupSql = await fs.readFile(setupPath, 'utf8');

    await db.query(setupSql);

    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar:', error.message);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
}

initDb();