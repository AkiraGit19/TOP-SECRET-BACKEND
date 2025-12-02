export interface Persona {
  id: string;
  nombres: string;
  apellidos: string;
  edad: number;
  distrito: string;
  instagram: string;
  universidad: string;
  historia: string;
  votosYala: number;
  votosNoYala: number;
}

export interface CreatePersonaDTO {
  nombres: string;
  apellidos: string;
  edad: number;
  distrito: string;
  instagram?: string;
  universidad?: string;
  historia: string;
  votosYala?: number;
  votosNoYala?: number;
}

export interface UpdatePersonaDTO extends Partial<CreatePersonaDTO> {}

export interface VoteDTO {
  vote: "yala" | "noyala";
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

