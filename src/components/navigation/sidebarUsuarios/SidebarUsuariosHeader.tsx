// components/navigation/sidebarUsuarios/SidebarUsuariosHeader.tsx
import React from 'react';

interface SidebarUsuariosHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const SidebarUsuariosHeader: React.FC<SidebarUsuariosHeaderProps> = ({ 
  isCollapsed, 
  onToggle 
}) => {
  return (
    <div className="p-6 border-b border-[#70455B]/20 relative">
      {!isCollapsed && (
        <div className="sidebar-logo transition-all duration-500">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#70455B] to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-[#70455B]/25 animate-float">
              <span className="text-white font-bold text-lg">U+</span>
            </div>
            <div>
              <h2 className="text-slate-800 font-bold text-lg leading-tight">ADESY NET</h2>
              <p className="text-[#70455B] text-xs">Panel Usuario</p>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`
          absolute -right-3 top-1/2 transform -translate-y-1/2
          w-6 h-6 bg-white rounded-full shadow-lg border border-slate-300
          flex items-center justify-center text-slate-600
          transition-all duration-300 hover:scale-110 hover:shadow-xl
          hover:bg-[#70455B]/10 hover:border-[#70455B]
          ${isCollapsed ? 'rotate-180' : ''}
        `}
        type="button"
        title={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
      >
        <span className="text-sm">←</span>
      </button>
    </div>
  );
};

export default SidebarUsuariosHeader;