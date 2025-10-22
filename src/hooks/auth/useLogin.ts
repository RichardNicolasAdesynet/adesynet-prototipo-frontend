import { useState } from 'react';
import type { Credenciales, LoginResponse } from '../../types/auth.types';
import { validarLogin } from '../../utils/validation';


export const useLogin = () => {
    const [cargando, setCargando] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (credenciales: Credenciales): Promise<LoginResponse> => {
        setCargando(true);
        setError(null);

        try {
            // Validación del lado del cliente
            const erroresValidacion = validarLogin(credenciales);
            if (erroresValidacion) {
                throw new Error(erroresValidacion);
            }

            // Simulamos la llamada a la API (luego la reemplazarás)
            const respuesta = await simularLoginAPI(credenciales);
            
            return {
                exito: true,
                usuario: respuesta.usuario,
                token: respuesta.token
            };
        } catch (err) {
            const mensajeError = err instanceof Error ? err.message : 'Error de autenticación';
            setError(mensajeError);
            
            return {
                exito: false,
                mensaje: mensajeError
            };
        } finally {
            setCargando(false);
        }
    };

    return {
        login,
        cargando,
        error,
        setError
    };
};

// Simulación temporal (luego la reemplazas con tu API real)
const simularLoginAPI = (credenciales: Credenciales): Promise<{ usuario: any; token: string }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (credenciales.usuario === 'admin' && credenciales.password === 'password') {
                resolve({
                    usuario: {
                        id: '1',
                        nombre: 'Administrador',
                        email: 'admin@soporte.com',
                        rol: 'administrador' as const,
                        departamento: 'TI'
                    },
                    token: 'token-simulado-123'
                });
            } else {
                reject(new Error('Credenciales inválidas'));
            }
        }, 1500);
    });
};