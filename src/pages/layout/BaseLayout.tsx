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
        <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm sticky top-0 z-20">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-8 bg-linear-to-b from-cyan-500 to-purple-500 rounded-full"></div>
                            <h1 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">
                                Sistema de Soporte TI
                            </h1>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-slate-800">
                                    Bienvenido, <span className="text-cyan-600">{usuario.nombreCompleto}</span>
                                </p>
                                <p className="text-xs text-slate-500 capitalize">{usuario.rolNombre}</p>
                            </div>
                            
                            <div className="w-10 h-10 bg-linear-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg shadow-cyan-500/30">
                                {usuario.nombreCompleto.charAt(0).toUpperCase()}
                            </div>
                            
                            <button 
                                onClick={onLogout}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 border border-transparent hover:border-red-200 flex items-center space-x-2"
                            >
                                <span>🚪</span>
                                <span>Salir</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-transparent">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
    
    // return (
    //     <div>
    //         <header>
    //             <div>
    //                 <h1>Sistema de Soporte TI</h1>
    //                 <div>
    //                     <span>Bienvenido, {usuario.nombre}</span>
    //                     <span>Rol: {usuario.rol}</span>
    //                     <button onClick={onLogout}>Cerrar Sesión</button>
    //                 </div>
    //             </div>
    //         </header>
    //         <main>
    //             {children}
    //         </main>
    //     </div>
    // );
};