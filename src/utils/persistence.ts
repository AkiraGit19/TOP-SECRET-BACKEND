import * as fs from "fs";
import * as path from "path";
import { Persona } from "../types/Persona";
import { personas as initialData } from "../data/personas";

// Ruta del archivo JSON de datos (relativa al directorio del proyecto)
const DATA_FILE_PATH = path.join(process.cwd(), "src/data/personas.json");

/**
 * Carga las personas desde el archivo JSON o retorna los datos iniciales
 */
export function loadPersonas(): Persona[] {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      const data = JSON.parse(fileContent);
      return Array.isArray(data) ? data : initialData;
    }
    // Si no existe el archivo, crear con datos iniciales
    savePersonas(initialData);
    return initialData;
  } catch (error) {
    console.error("Error al cargar personas:", error);
    return initialData;
  }
}

/**
 * Guarda las personas en el archivo JSON
 */
export function savePersonas(personas: Persona[]): void {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(personas, null, 2), "utf-8");
  } catch (error) {
    console.error("Error al guardar personas:", error);
    throw new Error("No se pudo guardar los datos");
  }
}

