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

    return (
        <Routes>
            {/* Ruta pública */}
            <Route
                path="/login"
                element={!estaAutenticado ? <Login /> : <Navigate to="/dashboard" replace />}
            />

            <Route
                path="/admin"
                element={
                    estaAutenticado && ['administrador', 'gerente'].includes(usuario?.rol || '')
                        ? <AdminDashboard />
                        : <Navigate to="/dashboard" replace />
                }
            />

            {/* Rutas protegidas por rol */}
            <Route
                path='/admin/*'
                element={
                    estaAutenticado && ['administrador', 'gerente'].includes(usuario?.rol || '')
                        ? <AdminDashboard />
                        : <Navigate to="/dashboard" replace />
                }
            />

            <Route
                path="/dashboard"
                element={
                    estaAutenticado && ['tecnico', 'desarrollador', 'soporte', 'supervisor'].includes(usuario?.rol || '')
                        ? <TecnicoDashboard />
                        : <Navigate to="/admin/*" replace />
                }
            />

            {/* ✅ CORREGIDO: Ruta por defecto SIN bucle */}
            <Route
                path="/"
                element={
                    estaAutenticado
                        ? (['administrador', 'gerente'].includes(usuario?.rol || '')
                            ? <Navigate to="/admin" replace />
                            : <Navigate to="/dashboard" replace />)
                        : <Navigate to="/login" replace />
                }
            />

            {/* <Route
                path="/"
                element={<Navigate to="/admin" replace />}
            /> */}

            {/* Ruta de fallback para URLs no encontradas */}
            <Route
                path="*"
                element={<Navigate to="/admin" replace />}
            />
        </Routes>
    );
};