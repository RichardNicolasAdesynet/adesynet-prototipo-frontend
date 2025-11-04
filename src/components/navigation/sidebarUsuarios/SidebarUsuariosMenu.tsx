// components/SidebarMenu.tsx
import React from 'react';
import type { MenuItem } from '../../../types/sidebarUsuarios';
import MenuItemComponent from './MenuItem';

interface SidebarUsuariosMenuProps {
  items: MenuItem[];
  activeItem: string;
  expandedItems: string[];
  isCollapsed: boolean;
  onItemClick: (itemId: string) => void;
  onToggleExpanded: (itemId: string) => void;
}

const SidebarUsuariosMenu: React.FC<SidebarUsuariosMenuProps> = ({
  items,
  activeItem,
  expandedItems,
  isCollapsed,
  onItemClick,
  onToggleExpanded
}) => {
  return (
    <nav className="flex-1 overflow-y-auto py-4 px-3">
      <div className="space-y-1">
        {items.map((item) => (
          <MenuItemComponent
            key={item.id}
            item={item}
            activeItem={activeItem}
            expandedItems={expandedItems}
            isCollapsed={isCollapsed}
            onItemClick={onItemClick}
            onToggleExpanded={onToggleExpanded}
            level={0}
          />
        ))}
      </div>
    </nav>
  );
};

export default SidebarUsuariosMenu;