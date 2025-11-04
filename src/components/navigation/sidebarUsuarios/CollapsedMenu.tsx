// components/CollapsedMenu.tsx (nuevo componente)
import React from 'react';
import type { MenuItem } from '../../../types/sidebarUsuarios';

interface CollapsedMenuProps {
  items: MenuItem[];
  activeItem: string;
  onItemClick: (itemId: string) => void;
}

const CollapsedMenu: React.FC<CollapsedMenuProps> = ({ 
  items, 
  activeItem, 
  onItemClick 
}) => {
  return (
    <nav className="flex-1 overflow-y-auto py-4 px-2">
      <div className="space-y-2">
        {items.map((item) => (
          <CollapsedMenuItem
            key={item.id}
            item={item}
            activeItem={activeItem}
            onItemClick={onItemClick}
          />
        ))}
      </div>
    </nav>
  );
};

const CollapsedMenuItem: React.FC<{
  item: MenuItem;
  activeItem: string;
  onItemClick: (itemId: string) => void;
}> = ({ item, activeItem, onItemClick }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeItem === item.id;

  return (
    <div className="relative">
      <button
        onClick={() => onItemClick(item.id)}
        className={`
          w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 group relative
          ${isActive 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg' 
            : 'bg-gray-800 hover:bg-gray-700'
          }
        `}
        title={item.name}
      >
        <span className={`
          text-lg transition-transform duration-200
          ${isActive ? 'text-white scale-110' : 'text-gray-400 group-hover:scale-110'}
        `}>
          {item.icon}
        </span>

        {/* Indicador de que tiene hijos */}
        {hasChildren && (
          <div className="absolute -top-1 -right-1">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
          </div>
        )}

        {/* Badge para notificaciones */}
        {item.badge && (
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              {item.badge > 9 ? '9+' : item.badge}
            </div>
          </div>
        )}
      </button>

      {/* Tooltip en hover */}
      <div className="absolute left-14 top-1/2 transform -translate-y-1/2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-900 text-white text-sm py-2 px-3 rounded-lg shadow-xl whitespace-nowrap">
          {item.name}
          {hasChildren && <span className="ml-2 text-xs">▶</span>}
        </div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-1">
          <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      </div>
    </div>
  );
};

export default CollapsedMenu;