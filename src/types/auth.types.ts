// src/types/auth.types.ts
export type RolUsuario = 'gerente' | 'administrador' | 'tecnico' | 'desarrollador' | 'soporte' | 'usuario';

export interface Credenciales {
  idUsuario: string;      // ← CAMBIAR de 'usuario' a 'idUsuario'
  claveUsuario: string;   // ← CAMBIAR de 'password' a 'claveUsuario'
}

export interface Usuario {
    id: string;
    nombre: string;
    email: string;
    rol: RolUsuario;  // ← CAMBIÓ de string a RolUsuario
    departamento: string;
    permisos: string[];
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
  login: (credenciales: Credenciales) => Promise<LoginResult>; // ← ACTUALIZAR
  logout: () => void;
}