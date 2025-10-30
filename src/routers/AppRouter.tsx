import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth/useAuth';
import { Login } from '../components/auth';
import { AdminDashboard } from '../pages/adminDashboard/AdminDashboard';
import { TecnicoDashboard } from '../pages/tecnicoDashboard/TecnicoDashboard';

export const AppRouter: React.FC = () => {
    const { estaAutenticado, usuario, cargando } = useAuth();
    if (cargando) {
        return (
            <>
                <div className="fixed inset-0 bg-black/80 text-white flex flex-col justify-center items-center z-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                    <div className="text-white text-xl font-semibold animate-pulse"> Cargando...</div>
                    <div className="text-gray-300 text-sm mt-2">Por favor espere</div>
                </div>
            </>
        );
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