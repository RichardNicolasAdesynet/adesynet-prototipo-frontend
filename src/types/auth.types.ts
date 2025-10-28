// src/types/auth.types.ts
export type RolUsuario = 'gerente' | 'administrador' | 'tecnico' | 'desarrollador' | 'soporte' | 'usuario';

export interface Credenciales {
  idUsuario: string;      // ← CAMBIAR de 'usuario' a 'idUsuario'
  claveUsuario: string;   // ← CAMBIAR de 'password' a 'claveUsuario'
}

// USUARIO CORREGIDO - coincide con respuesta real de login
export interface Usuario {
  idUsuario: string;           // ← CORREGIDO: de 'id' a 'idUsuario'
  nombreCompleto: string;      // ← CORREGIDO: de 'nombre' a 'nombreCompleto'
  email: string;
  idRol: string;               // ← CORREGIDO: de 'rol' a 'idRol'
  rolNombre: string;           // ← NUEVO: agregado
  permisos: string[];
  // ❌ ELIMINADO: 'departamento' (no existe en API)
}

export interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  estaAutenticado: boolean;
  cargando: boolean;
}

export interface LoginResult {
  exito: boolean;
  mensaje?: string;
  usuario?: Usuario;
  token?: string;
}

export interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  estaAutenticado: boolean;
  cargando: boolean;
  login: (credenciales: Credenciales) => Promise<LoginResult>;
  logout: () => void;
}