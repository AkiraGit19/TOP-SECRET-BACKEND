import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import personasRoutes from "./routes/personas.js";
import { loadPersonas } from "./utils/persistence.js";

// Configurar variables de entorno
dotenv.config();


// Crear aplicación Express
const app = express();

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://top-secret-pi.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cargar datos iniciales al iniciar el servidor
try {
  loadPersonas();
  console.log("✅ Datos cargados correctamente");
} catch (error) {
  console.error("⚠️ Error al cargar datos iniciales:", error);
}

// Rutas
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API de Gestión de Caninas - Backend funcionando correctamente"
  });
});

app.use("/api/personas", personasRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada"
  });
});

// Manejo de errores global
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor"
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api/personas`);
});
