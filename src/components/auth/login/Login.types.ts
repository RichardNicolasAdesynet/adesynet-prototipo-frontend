import type { Credenciales, Usuario } from "../../../types/auth.types";

export interface LoginFormProps {
    onSubmit: (credenciales: Credenciales) => Promise<void>;
    cargando: boolean;
}

export interface LoginHeaderProps {
    titulo: string;
    subtitulo: string;
}

export interface LoginProps {
    onLoginExitoso?: (usuario: Usuario) => void;
}