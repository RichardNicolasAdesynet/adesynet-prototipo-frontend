// components/navigation/sidebarUsuarios/CollapsedMenu.tsx
import React from 'react';
import type { CollapsedMenuProps, MenuItem } from '../../../types/sidebarUsuarios';

const CollapsedMenu: React.FC<CollapsedMenuProps> = ({
  items,
  itemActivo,
  onItemClick
}) => {
  return (
    <nav className="flex-1 p-2 overflow-y-auto overflow-x-hidden">
      <ul className="space-y-2">
        {items.map((item) => (
          <CollapsedMenuItem
            key={item.id}
            item={item}
            itemActivo={itemActivo}
            onItemClick={onItemClick}
          />
        ))}
      </ul>
    </nav>
  );
};

const CollapsedMenuItem: React.FC<{
  item: MenuItem;
  itemActivo: string;
  onItemClick: (itemId: string) => void;
}> = ({ item, itemActivo, onItemClick }) => {
  const tieneHijos = item.hijos && item.hijos.length > 0;
  const isActive = itemActivo === item.id;

  const handleClick = () => {
    if (!tieneHijos) {
      onItemClick(item.id);
    }
    // Si tiene hijos, no hacer nada en modo colapsado
    // O podrías implementar un tooltip con los subitems
  };

  return (
    <li className="relative">
      {/* Cambiar a div para consistencia */}
      <div
        onClick={handleClick}
        className={`
          w-full flex items-center justify-center p-3 rounded-xl
          transition-all duration-300 ease-out
          group relative overflow-hidden
          ${isActive
            ? 'bg-gradient-to-r from-[#70455B] to-purple-600 text-white shadow-lg'
            : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-800 border border-transparent hover:border-[#70455B]/30'
          }
          ${tieneHijos ? 'cursor-default' : 'cursor-pointer transform hover:scale-105 active:scale-95'}
        `}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !tieneHijos) {
            e.preventDefault();
            handleClick();
          }
        }}
        title={item.nombre}
      >
        {/* Efecto de fondo animado */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-[#70455B]/10 to-purple-500/10 
          transition-all duration-500
          ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}></div>

        <span className={`
          text-lg transition-transform duration-300 z-10
          ${isActive ? 'scale-110' : 'group-hover:scale-110'}
          ${isActive ? 'text-white' : 'text-[#70455B] group-hover:text-[#70455B]'}
        `}>
          {item.icono}
        </span>

        {/* Indicador de hijos */}
        {tieneHijos && (
          <div className="absolute -top-1 -right-1 z-20">
            <div className="w-2 h-2 rounded-full bg-[#70455B] animate-pulse"></div>
          </div>
        )}

        {/* Badge */}
        {item.badge && (
          <div className="absolute -top-1 -right-1 z-20">
            <div className="w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              {item.badge > 9 ? '9+' : item.badge}
            </div>
          </div>
        )}
      </div>

      {/* Tooltip */}
      {/* <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 whitespace-nowrap shadow-xl">
        {item.nombre}
        {tieneHijos && (
          <div className="text-xs text-gray-300 mt-1">
            Tiene {item.hijos?.length} subitems
          </div>
        )}
        <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-0 border-r-4 border-r-slate-800 border-t-transparent border-b-transparent"></div>
      </div> */}

      {/* Tooltip interno - NO se sale del contenedor */}
      <div className="absolute left-1/2 top-full mt-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 whitespace-nowrap shadow-xl transform -translate-x-1/2">
        {item.nombre}
        {tieneHijos && (
          <div className="text-xs text-gray-300 mt-1">
            Tiene {item.hijos?.length} subitems
          </div>
        )}
        <div className="absolute left-1/2 bottom-full transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-t-slate-800 border-l-transparent border-r-transparent"></div>
      </div>
    </li>
  );
};

export default CollapsedMenu;