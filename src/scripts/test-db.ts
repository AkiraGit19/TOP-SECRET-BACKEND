import { initDatabase } from "../utils/persistence.js";
import { pool } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

async function test() {
    try {
        console.log("🔌 Conectando a la base de datos...");
        await initDatabase();

        console.log("📝 Creando persona de prueba...");
        const id = uuidv4();
        const query = `
      INSERT INTO personas (id, nombres, apellidos, edad, distrito, instagram, universidad, historia, "votosYala", "votosNoYala")
      VALUES ($1, 'Test', 'User', 25, 'Lima', '@test', 'UTEC', 'Historia de prueba', 0, 0)
      RETURNING *;
    `;
        const res = await pool.query(query, [id]);
        console.log("✅ Persona creada:", res.rows[0]);

        console.log("🔍 Buscando persona...");
        const searchResults = await pool.query("SELECT * FROM personas WHERE nombres = 'Test'");
        console.log(`✅ Encontrados ${searchResults.rows.length} resultados`);

        console.log("🗑️ Eliminando persona de prueba...");
        await pool.query('DELETE FROM personas WHERE id = $1', [id]);
        console.log("✅ Persona eliminada");

        console.log("🎉 Test completado exitosamente");
    } catch (error) {
        console.error("❌ Error en el test:", error);
    } finally {
        await pool.end();
    }
}

test();
