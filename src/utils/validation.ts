import type { Credenciales } from "../types/auth.types";


export const validarLogin = (credenciales: Credenciales): string | null => {
    if (!credenciales.idUsuario.trim()) {
        return 'El usuario es requerido';
    }

    if (!credenciales.claveUsuario.trim()) {
        return 'La contraseña es requerida';
    }

    if (credenciales.claveUsuario.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres';
    }

    return null;
};

export const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};