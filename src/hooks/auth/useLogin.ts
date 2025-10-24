// src/hooks/auth/useLogin.ts - REEMPLAZAR COMPLETAMENTE
import { useState } from 'react';
import { useAuth } from './useAuth';
import type { Credenciales, LoginResult } from '../../types/auth.types';
import { validarLogin } from '../../utils/validation';

export const useLogin = () => {
    const [cargando, setCargando] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { login: authLogin } = useAuth(); // ← Usar el AuthContext real

    const login = async (credenciales: Credenciales): Promise<LoginResult> => {
        setCargando(true);
        setError(null);

        try {

            console.log('🔄 useLogin - Iniciando proceso...');
            // Validación del lado del cliente
            const erroresValidacion = validarLogin(credenciales);
            if (erroresValidacion) {
                throw new Error(erroresValidacion);
            }

            console.log('📞 useLogin - Llamando a authLogin...');
            // ✅ REEMPLAZADO: Usar el servicio real de autenticación
            const resultado = await authLogin(credenciales);
            console.log('✅ useLogin - Resultado recibido:', resultado);
            return resultado;
        } catch (err) {
             console.error('❌ useLogin - Error:', err);
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

// ✅ ELIMINADO: La función de simulación simularLoginAPI