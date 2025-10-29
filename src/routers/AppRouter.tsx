import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth/useAuth';
import { Login } from '../components/auth';
import { AdminDashboard } from '../pages/adminDashboard/AdminDashboard';
import { TecnicoDashboard } from '../pages/tecnicoDashboard/TecnicoDashboard';

export const AppRouter: React.FC = () => {
    const { estaAutenticado, usuario, cargando } = useAuth();

    // DEBUG: Ver qué datos tenemos
    console.log('🚀 AppRouter - Estado:', {
        estaAutenticado,
        usuario: usuario,
        rol: usuario?.rol,
        redirigiendoA: estaAutenticado
            ? (usuario?.rol === 'administrador' ? '/admin' : '/dashboard')
            : '/login'
    });
    if (cargando) {
        return <div>Cargando...</div>;
    }

    const esAdminOGerente = () => {
        return usuario && ['administrador', 'gerente'].includes(usuario.rol);
    }

    const esTecnicoOUsuario =() =>{
        return usuario && ['tecnico', 'desarrollador', 'soporte', 'supervisor'].includes(usuario.rol);
    }

    const getDefaultRoute = () => {
        if (!estaAutenticado) return '/login';
        if (esAdminOGerente()) return '/admin';
        if (esTecnicoOUsuario()) return '/dashboard';
        return '/login'; // Fallback
    }

    return (
        <Routes>
            {/* Ruta pública */}
            <Route
                path="/login"
                element={!estaAutenticado ? <Login /> : <Navigate to={getDefaultRoute()} replace />}
            />

            {/* Rutas protegidas por rol */}
            <Route
                path='/admin/*'
                element={
                    estaAutenticado && esAdminOGerente()
                        ? <AdminDashboard />
                        : <Navigate to="/login" replace />
                }
            />
            

            <Route
                path="/dashboard"
                element={
                    estaAutenticado && esTecnicoOUsuario()
                        ? <TecnicoDashboard />
                        : <Navigate to="/login" replace />
                }
            />

            {/* ✅ CORREGIDO: Ruta por defecto SIN bucle */}
            <Route
                path="/"
                element={<Navigate to={getDefaultRoute()} replace />
                }
            />

            {/* Ruta de fallback para URLs no encontradas */}
            <Route
                path="*"
                element={<Navigate to={getDefaultRoute()} replace />}
            />
        </Routes>
    );
};