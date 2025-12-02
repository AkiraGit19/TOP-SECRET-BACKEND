import { pool } from "../config/database.js";
import { Persona } from "../types/Persona.js";

/**
 * Inicializa la base de datos creando la tabla si no existe
 */
export async function initDatabase(): Promise<void> {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS personas (
      id UUID PRIMARY KEY,
      nombres VARCHAR(255) NOT NULL,
      apellidos VARCHAR(255) NOT NULL,
      edad INTEGER NOT NULL,
      distrito VARCHAR(255) NOT NULL,
      instagram VARCHAR(255),
      universidad VARCHAR(255),
      historia TEXT NOT NULL,
      "votosYala" INTEGER DEFAULT 0,
      "votosNoYala" INTEGER DEFAULT 0
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log("✅ Tabla 'personas' verificada/creada correctamente");
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
  }
}

/**
 * Obtener todas las personas de la base de datos
 */
export async function getAllPersonasFromDB(): Promise<Persona[]> {
  try {
    const result = await pool.query('SELECT * FROM personas');
    return result.rows;
  } catch (error) {
    console.error("Error al obtener personas:", error);
    throw error;
  }
}

/**
 * Obtener una persona por ID
 */
export async function getPersonaByIdFromDB(id: string): Promise<Persona | null> {
  try {
    const result = await pool.query('SELECT * FROM personas WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error al obtener persona por ID:", error);
    throw error;
  }
}

/**
 * Crear una nueva persona
 */
export async function createPersonaInDB(persona: Persona): Promise<Persona> {
  const query = `
    INSERT INTO personas (id, nombres, apellidos, edad, distrito, instagram, universidad, historia, "votosYala", "votosNoYala")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;
  const values = [
    persona.id,
    persona.nombres,
    persona.apellidos,
    persona.edad,
    persona.distrito,
    persona.instagram,
    persona.universidad,
    persona.historia,
    persona.votosYala,
    persona.votosNoYala
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error al crear persona:", error);
    throw error;
  }
}

/**
 * Actualizar una persona
 */
export async function updatePersonaInDB(persona: Persona): Promise<Persona> {
  const query = `
    UPDATE personas
    SET nombres = $2, apellidos = $3, edad = $4, distrito = $5, instagram = $6, universidad = $7, historia = $8, "votosYala" = $9, "votosNoYala" = $10
    WHERE id = $1
    RETURNING *;
  `;
  const values = [
    persona.id,
    persona.nombres,
    persona.apellidos,
    persona.edad,
    persona.distrito,
    persona.instagram,
    persona.universidad,
    persona.historia,
    persona.votosYala,
    persona.votosNoYala
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error al actualizar persona:", error);
    throw error;
  }
}

/**
 * Eliminar una persona
 */
export async function deletePersonaFromDB(id: string): Promise<void> {
  try {
    await pool.query('DELETE FROM personas WHERE id = $1', [id]);
  } catch (error) {
    console.error("Error al eliminar persona:", error);
    throw error;
  }
}

/**
 * Buscar personas con filtros
 */
export async function searchPersonasInDB(search?: string, distrito?: string, universidad?: string): Promise<Persona[]> {
  let query = 'SELECT * FROM personas WHERE 1=1';
  const values: any[] = [];
  let paramCount = 1;

  if (search) {
    query += ` AND (LOWER(nombres) LIKE $${paramCount} OR LOWER(apellidos) LIKE $${paramCount})`;
    values.push(`%${search.toLowerCase()}%`);
    paramCount++;
  }

  if (distrito) {
    query += ` AND distrito = $${paramCount}`;
    values.push(distrito);
    paramCount++;
  }

  if (universidad) {
    query += ` AND universidad = $${paramCount}`;
    values.push(universidad);
    paramCount++;
  }

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error al buscar personas:", error);
    throw error;
  }
}
