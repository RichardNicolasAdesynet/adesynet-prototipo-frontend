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
        rol: usuario?.idRol,
        redirigiendoA: estaAutenticado
            ? (usuario?.idRol === 'ROL02' || usuario?.idRol === 'ROL03' ? '/admin' : '/dashboard')
            : '/login'
    });

    if (cargando) {
        return <div>Cargando...</div>;
    }

    // ✅ CORREGIDO: Función para verificar si es admin/gerente
    const esAdminOGerente = () => {
        return usuario && ['ROL02', 'ROL03'].includes(usuario.idRol);
    };

    // ✅ CORREGIDO: Función para verificar si es técnico/desarrollador/soporte
    const esTecnicoOUsuario = () => {
        return usuario && ['ROL01', 'ROL04', 'ROL05'].includes(usuario.idRol);
    };

    return (
        <Routes>
            {/* Ruta pública */}
            <Route
                path="/login"
                element={!estaAutenticado ? <Login /> : <Navigate to="/dashboard" replace />}
            />

            {/* Rutas de administración */}
            <Route
                path="/admin"
                element={
                    estaAutenticado && esAdminOGerente()
                        ? <AdminDashboard />
                        : <Navigate to="/dashboard" replace />
                }
            />

            <Route
                path='/admin/*'
                element={
                    estaAutenticado && esAdminOGerente()
                        ? <AdminDashboard />
                        : <Navigate to="/dashboard" replace />
                }
            />

            {/* Rutas de dashboard técnico */}
            <Route
                path="/dashboard"
                element={
                    estaAutenticado && esTecnicoOUsuario()
                        ? <TecnicoDashboard />
                        : <Navigate to="/admin" replace />
                }
            />

            {/* ✅ CORREGIDO: Ruta por defecto */}
            <Route
                path="/"
                element={
                    estaAutenticado
                        ? (esAdminOGerente()
                            ? <Navigate to="/admin" replace />
                            : <Navigate to="/dashboard" replace />)
                        : <Navigate to="/login" replace />
                }
            />

            {/* Ruta de fallback para URLs no encontradas */}
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
};