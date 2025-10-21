import React, { createContext, useState, type ReactNode } from 'react';
import type { AuthContextType, Credenciales, Usuario } from '../types/auth.types';


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState({
        usuario: null,
        token: null,
        estaAutenticado: false,
        cargando: false
    });

    const login = async (credenciales: Credenciales) => {
        // Implementación real irá aquí
        console.log('Login llamado con:', credenciales);
        return { exito: false, mensaje: 'No implementado' };
    };

    const logout = () => {
        setAuthState({
            usuario: null,
            token: null,
            estaAutenticado: false,
            cargando: false
        });
    };

    const value: AuthContextType = {
        ...authState,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};