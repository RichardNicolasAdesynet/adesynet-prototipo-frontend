// components/SidebarFooter.tsx
import React, { useState } from 'react';

interface SidebarFooterProps {
  isCollapsed: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ isCollapsed }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  return (
    <div className="p-4 border-t border-gray-700/50 space-y-3">
      {/* Theme Toggle - Solo muestra ícono cuando está colapsado */}
      {isCollapsed ? (
        <button 
          className="w-12 h-12 flex items-center justify-center bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
          title={theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      ) : (
        <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
          <span className="text-sm text-gray-400">Tema</span>
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setTheme('light')}
              className={`px-3 py-1 rounded-md text-xs transition-all duration-200 ${
                theme === 'light' 
                  ? 'bg-white text-gray-900 shadow' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-3 py-1 rounded-md text-xs transition-all duration-200 ${
                theme === 'dark' 
                  ? 'bg-gray-600 text-white shadow' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Dark
            </button>
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 relative group`}>
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow">
          <span className="text-white text-sm font-bold">A</span>
        </div>
        
        {!isCollapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-gray-400 truncate">admin@gesis.com</p>
            </div>

            <button className="text-gray-400 hover:text-white transition-colors duration-200">
              ⚙️
            </button>
          </>
        )}

        {/* Tooltip para modo colapsado */}
        {isCollapsed && (
          <div className="absolute left-14 top-1/2 transform -translate-y-1/2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm py-2 px-3 rounded-lg shadow-xl whitespace-nowrap">
              Admin User
              <div className="text-xs text-gray-300">admin@gesis.com</div>
            </div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-1">
              <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Button */}
      {!isCollapsed ? (
        <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group">
          <span className="text-lg group-hover:scale-110 transition-transform">🚪</span>
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      ) : (
        <button 
          className="w-12 h-12 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 mx-auto"
          title="Cerrar Sesión"
        >
          <span className="text-lg">🚪</span>
        </button>
      )}
    </div>
  );
};

export default SidebarFooter;