import db from "./db.js";

async function test() {
  try {
    const res = await db.query("SELECT NOW() AS fecha");

    console.log("✅ CONEXIÓN OK");
    console.log(res.rows[0]);
  } catch (err) {
    console.error("❌ Código:", err.code);
    console.error("❌ Mensaje:", err.message);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
}

test();