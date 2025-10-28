// src/hooks/useAuthRedirect.ts
import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = () => {
    const { usuario, estaAutenticado } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (estaAutenticado && usuario) {
            // ✅ CORREGIDO: Mapear idRol a rutas internas
            const getRutaPorRol = (idRol: string): string => {
                const rutasPorRol: Record<string, string> = {
                    'ROL01': '/admin',        // desarrollador
                    'ROL02': '/admin',        // gerente
                    'ROL03': '/admin',        // administrador
                    'ROL04': '/dashboard',    // supervisor
                    'ROL05': '/dashboard'     // tecnico
                };
                return rutasPorRol[idRol] || '/dashboard';
            };

            const rutaDestino = getRutaPorRol(usuario.idRol);
            console.log('🔄 useAuthRedirect - Redirigiendo a:', rutaDestino, 'para rol:', usuario.idRol);
            navigate(rutaDestino);
        }
    }, [estaAutenticado, usuario, navigate]);
};