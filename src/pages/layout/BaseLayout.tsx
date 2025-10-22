import React from 'react';
import type { Usuario } from '../../types/auth.types';


interface BaseLayoutProps {
    usuario: Usuario;
    children: React.ReactNode;
    onLogout: () => void;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ 
    usuario, 
    children, 
    onLogout 
}) => {
    return (
        <div>
            <header>
                <div>
                    <h1>Sistema de Soporte TI</h1>
                    <div>
                        <span>Bienvenido, {usuario.nombre}</span>
                        <span>Rol: {usuario.rol}</span>
                        <button onClick={onLogout}>Cerrar Sesión</button>
                    </div>
                </div>
            </header>
            <main>
                {children}
            </main>
        </div>
    );
};