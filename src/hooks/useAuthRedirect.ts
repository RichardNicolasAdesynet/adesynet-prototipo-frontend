import { useEffect } from 'react';
import { useAuth } from './auth/useAuth';
import type { RolUsuario } from '../types/auth.types';
import { useNavigate } from 'react-router-dom';



export const useAuthRedirect = () => {
    const { usuario, estaAutenticado } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (estaAutenticado && usuario) {
            const rutasPorRol: Record<RolUsuario, string> = {
                administrador: '/admin',
                tecnico: '/dashboard',
                desarrollador: '/dashboard',
                soporte: '/dashboard',
                usuario: '/incidencias',
                gerente: '/admin'
            };

            const rutaDestino = rutasPorRol[usuario.rol];
            navigate(rutaDestino);
        }
    }, [estaAutenticado, usuario, navigate]);
};