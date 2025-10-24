// src/types/api.types.ts
export interface ApiResponse<T = any> {
  data: T;
  isSuccess: boolean;
  message: string;
  errors: string[] | null;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  totalRecords: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Interfaces específicas para Auth
export interface LoginRequest {
  idUsuario: string;
  claveUsuario: string;
}

export interface LoginResponse {
  token: string;
  expires: string;
  idUsuario: string;
  nombreCompleto: string;
  idRol: string;
  rolNombre: string;
  email: string;
  permisos: string[];
}

export interface UserInfo {
  idUsuario: string;
  nombreCompleto: string;
  idRol: string;
  rolNombre: string;
  email: string;
  permisos: string[];
}