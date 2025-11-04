// components/SidebarHeader.tsx
import React from 'react';

interface SidebarUsuariosHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const SidebarUsuariosHeader: React.FC<SidebarUsuariosHeaderProps> = ({ isCollapsed, onToggle }) => {
  return (
    <div className="p-6 border-b border-gray-700/50">
      <div className="flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Gesis
              </h1>
              <p className="text-gray-400 text-xs">Admin Panel</p>
            </div>
          </div>
        )}
        
        <button
          onClick={onToggle}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-200 hover:scale-110"
        >
          <span className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
            {isCollapsed ? '➡️' : '⬅️'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default SidebarUsuariosHeader;