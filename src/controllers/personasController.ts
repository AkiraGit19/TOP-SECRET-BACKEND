
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Persona, CreatePersonaDTO, UpdatePersonaDTO, VoteDTO, ApiResponse } from "../types/Persona.js";
import {
  getAllPersonasFromDB,
  getPersonaByIdFromDB,
  createPersonaInDB,
  updatePersonaInDB,
  deletePersonaFromDB,
  searchPersonasInDB
} from "../utils/persistence.js";
import { validateCreatePersona, validateUpdatePersona, validateVote } from "../utils/validation.js";

/**
 * Obtener todas las personas
 */
export const getAllPersonas = async (req: Request, res: Response): Promise<void> => {
  try {
    const personas = await getAllPersonasFromDB();
    const response: ApiResponse<Persona[]> = {
      success: true,
      data: personas
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Error al obtener las personas"
    };
    res.status(500).json(response);
  }
};

/**
 * Obtener una persona por ID
 */
export const getPersonaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ success: false, message: "ID requerido" });
      return;
    }
    const persona = await getPersonaByIdFromDB(id);

    if (!persona) {
      const response: ApiResponse = {
        success: false,
        message: "Persona no encontrada"
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<Persona> = {
      success: true,
      data: persona
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Error al obtener la persona"
    };
    res.status(500).json(response);
  }
};

/**
 * Crear una nueva persona
 */
export const createPersona = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: CreatePersonaDTO = req.body;
    const validation = validateCreatePersona(data);

    if (!validation.isValid) {
      const response: ApiResponse = {
        success: false,
        message: validation.errors.join(", ")
      };
      res.status(400).json(response);
      return;
    }

    const newPersona: Persona = {
      id: uuidv4(),
      nombres: data.nombres.trim(),
      apellidos: data.apellidos.trim(),
      edad: data.edad,
      distrito: data.distrito.trim(),
      instagram: data.instagram?.trim() || "",
      universidad: data.universidad?.trim() || "",
      historia: data.historia.trim(),
      votosYala: data.votosYala ?? 0,
      votosNoYala: data.votosNoYala ?? 0
    };

    const createdPersona = await createPersonaInDB(newPersona);

    const response: ApiResponse<Persona> = {
      success: true,
      data: createdPersona
    };
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Error al crear la persona"
    };
    res.status(500).json(response);
  }
};

/**
 * Actualizar una persona existente
 */
export const updatePersona = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ success: false, message: "ID requerido" });
      return;
    }
    const data: UpdatePersonaDTO = req.body;
    const validation = validateUpdatePersona(data);

    if (!validation.isValid) {
      const response: ApiResponse = {
        success: false,
        message: validation.errors.join(", ")
      };
      res.status(400).json(response);
      return;
    }

    const existingPersona = await getPersonaByIdFromDB(id);

    if (!existingPersona) {
      const response: ApiResponse = {
        success: false,
        message: "Persona no encontrada"
      };
      res.status(404).json(response);
      return;
    }

    const updatedPersona: Persona = {
      id: existingPersona.id,
      nombres: data.nombres !== undefined ? data.nombres.trim() : existingPersona.nombres,
      apellidos: data.apellidos !== undefined ? data.apellidos.trim() : existingPersona.apellidos,
      edad: data.edad !== undefined ? data.edad : existingPersona.edad,
      distrito: data.distrito !== undefined ? data.distrito.trim() : existingPersona.distrito,
      instagram: data.instagram !== undefined ? data.instagram.trim() : existingPersona.instagram,
      universidad: data.universidad !== undefined ? data.universidad.trim() : existingPersona.universidad,
      historia: data.historia !== undefined ? data.historia.trim() : existingPersona.historia,
      votosYala: existingPersona.votosYala,
      votosNoYala: existingPersona.votosNoYala
    };

    const savedPersona = await updatePersonaInDB(updatedPersona);

    const response: ApiResponse<Persona> = {
      success: true,
      data: savedPersona
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Error al actualizar la persona"
    };
    res.status(500).json(response);
  }
};

/**
 * Eliminar una persona
 */
export const deletePersona = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ success: false, message: "ID requerido" });
      return;
    }
    const existingPersona = await getPersonaByIdFromDB(id);

    if (!existingPersona) {
      const response: ApiResponse = {
        success: false,
        message: "Persona no encontrada"
      };
      res.status(404).json(response);
      return;
    }

    await deletePersonaFromDB(id);

    const response: ApiResponse = {
      success: true,
      message: "Persona eliminada correctamente"
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Error al eliminar la persona"
    };
    res.status(500).json(response);
  }
};

/**
 * Votar por una persona
 */
export const votePersona = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ success: false, message: "ID requerido" });
      return;
    }
    const data: VoteDTO = req.body;
    const validation = validateVote(data);

    if (!validation.isValid) {
      const response: ApiResponse = {
        success: false,
        message: validation.errors.join(", ")
      };
      res.status(400).json(response);
      return;
    }

    const persona = await getPersonaByIdFromDB(id);

    if (!persona) {
      const response: ApiResponse = {
        success: false,
        message: "Persona no encontrada"
      };
      res.status(404).json(response);
      return;
    }

    if (data.vote === "yala") {
      persona.votosYala += 1;
    } else {
      persona.votosNoYala += 1;
    }

    const updatedPersona = await updatePersonaInDB(persona);

    const response: ApiResponse<Persona> = {
      success: true,
      data: updatedPersona
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Error al votar"
    };
    res.status(500).json(response);
  }
};

/**
 * Buscar personas con filtros (opcional)
 */
export const searchPersonas = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, distrito, universidad } = req.query;

    const personas = await searchPersonasInDB(
      typeof search === "string" ? search : undefined,
      typeof distrito === "string" ? distrito : undefined,
      typeof universidad === "string" ? universidad : undefined
    );

    const response: ApiResponse<Persona[]> = {
      success: true,
      data: personas
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Error al buscar personas"
    };
    res.status(500).json(response);
  }
};
