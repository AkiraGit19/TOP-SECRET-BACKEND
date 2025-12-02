import { CreatePersonaDTO, UpdatePersonaDTO, VoteDTO } from "../types/Persona";

/**
 * Valida los datos para crear una persona
 */
export function validateCreatePersona(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.nombres || typeof data.nombres !== "string" || data.nombres.trim().length === 0) {
    errors.push("El campo 'nombres' es requerido");
  }

  if (!data.apellidos || typeof data.apellidos !== "string" || data.apellidos.trim().length === 0) {
    errors.push("El campo 'apellidos' es requerido");
  }

  if (data.edad === undefined || data.edad === null) {
    errors.push("El campo 'edad' es requerido");
  } else if (typeof data.edad !== "number" || data.edad < 0 || !Number.isInteger(data.edad)) {
    errors.push("El campo 'edad' debe ser un número entero positivo");
  }

  if (!data.distrito || typeof data.distrito !== "string" || data.distrito.trim().length === 0) {
    errors.push("El campo 'distrito' es requerido");
  }

  if (!data.historia || typeof data.historia !== "string" || data.historia.trim().length === 0) {
    errors.push("El campo 'historia' es requerido");
  }

  if (data.instagram !== undefined && typeof data.instagram !== "string") {
    errors.push("El campo 'instagram' debe ser una cadena de texto");
  }

  if (data.universidad !== undefined && typeof data.universidad !== "string") {
    errors.push("El campo 'universidad' debe ser una cadena de texto");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida los datos para actualizar una persona
 */
export function validateUpdatePersona(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (data.nombres !== undefined && (typeof data.nombres !== "string" || data.nombres.trim().length === 0)) {
    errors.push("El campo 'nombres' debe ser una cadena de texto no vacía");
  }

  if (data.apellidos !== undefined && (typeof data.apellidos !== "string" || data.apellidos.trim().length === 0)) {
    errors.push("El campo 'apellidos' debe ser una cadena de texto no vacía");
  }

  if (data.edad !== undefined && (typeof data.edad !== "number" || data.edad < 0 || !Number.isInteger(data.edad))) {
    errors.push("El campo 'edad' debe ser un número entero positivo");
  }

  if (data.distrito !== undefined && (typeof data.distrito !== "string" || data.distrito.trim().length === 0)) {
    errors.push("El campo 'distrito' debe ser una cadena de texto no vacía");
  }

  if (data.historia !== undefined && (typeof data.historia !== "string" || data.historia.trim().length === 0)) {
    errors.push("El campo 'historia' debe ser una cadena de texto no vacía");
  }

  if (data.instagram !== undefined && typeof data.instagram !== "string") {
    errors.push("El campo 'instagram' debe ser una cadena de texto");
  }

  if (data.universidad !== undefined && typeof data.universidad !== "string") {
    errors.push("El campo 'universidad' debe ser una cadena de texto");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida el voto
 */
export function validateVote(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.vote || typeof data.vote !== "string") {
    errors.push("El campo 'vote' es requerido y debe ser una cadena de texto");
  } else if (data.vote !== "yala" && data.vote !== "noyala") {
    errors.push("El campo 'vote' debe ser 'yala' o 'noyala'");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

