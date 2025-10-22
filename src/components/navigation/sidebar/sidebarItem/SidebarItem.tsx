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
    <li className="sidebar-item">
      <button
        onClick={handleClick}
        className={`sidebar-item-button ${estaActivo ? 'active' : ''} ${estaColapsado ? 'collapsed' : ''}`}
        type="button"
        title={item.nombre}
      >
        <span className="sidebar-item-icon">
          {item.icono}
        </span>
        
        {!estaColapsado && (
          <span className="sidebar-item-text">
            {item.nombre}
          </span>
        )}
      </button>
    </li>
  );
};