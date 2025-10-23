import React from 'react';
import type { SidebarItemProps } from '../../../../types/navigation.types';

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  estaActivo,
  estaColapsado,
  onClick
}) => {
  const handleClick = () => {
    onClick(item.ruta);
  };

  return (
    <li className="relative">
      <button
        onClick={handleClick}
        className={`
          w-full flex items-center space-x-3 p-3 rounded-xl
          transition-all duration-300 ease-out
          group relative overflow-hidden
          ${estaActivo 
            ? 'bg-gradient-to-r from-cyan-500/15 to-purple-500/15 text-cyan-700 shadow-lg shadow-cyan-500/10 border border-cyan-200/50' 
            : 'text-slate-600 hover:text-slate-800 hover:bg-white/80 border border-transparent hover:border-cyan-200/30'
          }
          ${estaColapsado ? 'justify-center' : ''}
          transform hover:scale-105 active:scale-95
        `}
        type="button"
        title={item.nombre}
      >
        {/* Efecto de fondo animado */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 
          transition-all duration-500
          ${estaActivo ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}></div>
        
        {/* Indicador activo */}
        {estaActivo && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-r-full shadow-lg shadow-cyan-400/50"></div>
        )}

        {/* Icono */}
        <span className={`
          text-lg transition-transform duration-300 z-10
          ${estaActivo ? 'scale-110' : 'group-hover:scale-110'}
          ${estaActivo ? 'text-cyan-600' : 'text-slate-500 group-hover:text-cyan-500'}
        `}>
          {item.icono}
        </span>
        
        {/* Texto */}
        {!estaColapsado && (
          <span className={`
            font-medium transition-all duration-300 z-10
            ${estaActivo ? 'text-cyan-700 font-semibold' : 'group-hover:text-slate-800'}
            ${estaActivo ? 'translate-x-0' : 'group-hover:translate-x-1'}
          `}>
            {item.nombre}
          </span>
        )}

        {/* Tooltip para modo colapsado */}
        {estaColapsado && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 whitespace-nowrap shadow-xl">
            {item.nombre}
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-0 border-r-4 border-r-slate-800 border-t-transparent border-b-transparent"></div>
          </div>
        )}
      </button>
    </li>
  );

  // return (
  //   <li className="sidebar-item">
  //     <button
  //       onClick={handleClick}
  //       className={`sidebar-item-button ${estaActivo ? 'active' : ''} ${estaColapsado ? 'collapsed' : ''}`}
  //       type="button"
  //       title={item.nombre}
  //     >
  //       <span className="sidebar-item-icon">
  //         {item.icono}
  //       </span>
        
  //       {!estaColapsado && (
  //         <span className="sidebar-item-text">
  //           {item.nombre}
  //         </span>
  //       )}
  //     </button>
  //   </li>
  // );
};