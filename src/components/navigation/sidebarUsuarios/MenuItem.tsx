// components/MenuItem.tsx
import React from 'react';
import type { MenuItem } from '../../../types/sidebarUsuarios';

interface MenuItemProps {
  item: MenuItem;
  activeItem: string;
  expandedItems: string[];
  isCollapsed: boolean;
  onItemClick: (itemId: string) => void;
  onToggleExpanded: (itemId: string) => void;
  level: number;
}

const MenuItemComponent: React.FC<MenuItemProps> = ({
  item,
  activeItem,
  expandedItems,
  isCollapsed,
  onItemClick,
  onToggleExpanded,
  level
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.includes(item.id);
  const isActive = activeItem === item.id;

  const handleClick = () => {
    if (hasChildren) {
      onToggleExpanded(item.id);
    } else {
      onItemClick(item.id);
    }
  };

  return (
    <div className="relative">
        {/* Línea vertical conectiva - solo para niveles > 0 */}
      {level > 0 && (
        <div 
          className="absolute left-6 top-0 w-0.5 h-full bg-gray-600/30"
          style={{ 
            left: `${level * 16 + 12}px`,
            height: 'calc(100% - 8px)',
            top: '4px'
          }}
        />
      )}

      <button
        onClick={handleClick}
        className={`
          w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group relative
          ${isActive 
            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-l-4 border-blue-400 shadow-lg' 
            : 'hover:bg-gray-700/50 hover:border-l-4 hover:border-gray-500'
          }
          ${level > 0 ? 'ml-4' : ''}
        `}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {/* Punto conectivo para niveles > 0 */}
        {level > 0 && (
          <div 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-gray-400"
            style={{ left: `${level * 16 - 4}px` }}
          />
        )}
        
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <span className={`
            text-lg transition-transform duration-200 group-hover:scale-110 z-10 relative
            ${isActive ? 'text-blue-400' : 'text-gray-400'}
          `}>
            {item.icon}
          </span>
          
          {!isCollapsed && (
            <span className={`
              font-medium truncate transition-all duration-200 z-10 relative
              ${isActive ? 'text-white' : 'text-gray-300'}
            `}>
              {item.name}
            </span>
          )}
        </div>

        {!isCollapsed && (
          <div className="flex items-center space-x-2 ml-2 z-10 relative">
            {item.badge && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-6 text-center">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <span className={`
                transform transition-transform duration-200 text-gray-400
                ${isExpanded ? 'rotate-90' : ''}
              `}>
                ▶
              </span>
            )}
          </div>
        )}
      </button>

      {/* Children Items con líneas de conexión */}
      {hasChildren && isExpanded && !isCollapsed && (
        <div className="overflow-hidden relative">
          {/* Línea vertical principal para el grupo de children */}
          <div 
            className="absolute left-6 top-0 w-0.5 bg-gray-600/30"
            style={{ 
              left: `${level * 16 + 28}px`,
              height: '100%'
            }}
          />
          
          <div className="mt-1 space-y-1 animate-slideDown">
            {item.children!.map((child, index) => (
              <MenuItemComponent
                key={child.id}
                item={child}
                activeItem={activeItem}
                expandedItems={expandedItems}
                isCollapsed={isCollapsed}
                onItemClick={onItemClick}
                onToggleExpanded={onToggleExpanded}
                level={level + 1}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Indicador visual cuando está colapsado y tiene hijos */}
      {hasChildren && isCollapsed && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="w-2 h-2 rounded-full bg-blue-400/60"></div>
        </div>
      )}
    </div>
  );
};

export default MenuItemComponent;