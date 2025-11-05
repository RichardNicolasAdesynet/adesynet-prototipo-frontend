// components/navigation/sidebarUsuarios/SidebarUsuariosMenu.tsx
import React from 'react';
import type { SidebarUsuariosMenuProps } from '../../../types/sidebarUsuarios';
import MenuItemComponent from './MenuItem';

const SidebarUsuariosMenu: React.FC<SidebarUsuariosMenuProps> = ({
  items,
  itemActivo, // ← CAMBIADO: activeItem → itemActivo
  expandedItems,
  isCollapsed,
  onItemClick,
  onToggleExpanded
}) => {
  return (
    <nav className="flex-1 p-4 overflow-y-auto">
      <div className="space-y-2">
        {items.map((item) => (
          <MenuItemComponent
            key={item.id}
            item={item}
            itemActivo={itemActivo} // ← CAMBIADO
            expandedItems={expandedItems}
            isCollapsed={isCollapsed}
            onItemClick={onItemClick}
            onToggleExpanded={onToggleExpanded}
            nivel={0} // ← CAMBIADO: level → nivel
          />
        ))}
      </div>
    </nav>
  );
};

export default SidebarUsuariosMenu;