// components/navigation/sidebarUsuarios/SidebarUsuariosFooter.tsx
import React from 'react';
import type { Usuario } from '../../../types/auth.types';

interface SidebarUsuariosFooterProps {
  isCollapsed: boolean;
  usuario: Usuario; // ← AGREGADO
}

const SidebarUsuariosFooter: React.FC<SidebarUsuariosFooterProps> = ({ 
  isCollapsed, 
  usuario 
}) => {
  return (
    <div className="p-4 border-t border-[#70455B]/20">
      {!isCollapsed ? (
        <div className="animate-fade animate-ease-in">
          <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl backdrop-blur-sm border border-[#70455B]/20 shadow-sm hover:bg-[#70455B]/5 transition-colors duration-200">
            <div className="w-10 h-10 bg-gradient-to-r from-[#70455B] to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
              {usuario.nombre.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-800 font-medium text-sm truncate">
                {usuario.nombre}
              </p>
              <p className="text-[#70455B] text-xs capitalize truncate">
                {usuario.rol}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="w-10 h-10 bg-gradient-to-r from-[#70455B] to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
            {usuario.nombre.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarUsuariosFooter;