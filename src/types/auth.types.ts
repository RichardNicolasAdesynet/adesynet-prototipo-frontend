export type RolUsuario = 'administrador' | 'tecnico' | 'desarrollador' | 'soporte' | 'usuario';

export interface Credenciales {
    usuario: string;
    password: string;
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

export interface AuthContextType extends AuthState {
    login: (credenciales: Credenciales) => Promise<LoginResponse>;
    logout: () => void;
}

export interface LoginResponse {
    exito: boolean;
    mensaje?: string;
    usuario?: Usuario;
    token?: string;
}