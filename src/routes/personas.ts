import { Router } from "express";
import {
  getAllPersonas,
  getPersonaById,
  createPersona,
  updatePersona,
  deletePersona,
  votePersona,
  searchPersonas
} from "../controllers/personasController.js";

const router = Router();

// Rutas principales
router.get("/", getAllPersonas);
router.get("/search", searchPersonas);
router.get("/:id", getPersonaById);
router.post("/", createPersona);
router.put("/:id", updatePersona);
router.delete("/:id", deletePersona);
router.post("/:id/vote", votePersona);

export default router;

