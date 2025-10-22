import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth/useAuth';
import { Login } from '../components/auth';

import { AdminDashboard } from '../pages/adminDashboard/AdminDashboard';
import { TecnicoDashboard } from '../pages/tecnicoDashboard/TecnicoDashboard';

export const AppRouter: React.FC = () => {
    const { estaAutenticado, usuario } = useAuth();

    return (
        <Routes>
            {/* Ruta pública */}
            <Route 
                path="/login" 
                element={!estaAutenticado ? <Login /> : <Navigate to="/" />} 
            />
            
            {/* Rutas protegidas por rol */}
            <Route 
                path="/admin/*" 
                element={
                    estaAutenticado && usuario?.rol === 'administrador' 
                        ? <AdminDashboard /> 
                        : <Navigate to="/login" />
                } 
            />
            
            <Route 
                path="/dashboard" 
                element={
                    estaAutenticado && ['tecnico', 'desarrollador', 'soporte'].includes(usuario?.rol || '')
                        ? <TecnicoDashboard />
                        : <Navigate to="/login" />
                } 
            />
            
            {/* Ruta por defecto */}
            <Route 
                path="/" 
                element={
                    estaAutenticado 
                        ? <Navigate to={usuario?.rol === 'administrador' ? '/admin' : '/dashboard'} />
                        : <Navigate to="/login" />
                } 
            />
        </Routes>
    );
};