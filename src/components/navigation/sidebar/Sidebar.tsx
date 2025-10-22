import React from 'react';
import type { SidebarProps } from '../../../types/navigation.types';
import { sidebarItems } from '../../../data/sidebarData';
import { SidebarItem } from './sidebarItem/SidebarItem';
import { useSidebar } from '../../../hooks/useSidebar';

export const Sidebar: React.FC<SidebarProps> = ({
  usuario,
  onNavegacion,
  itemActivo
}) => {
  const {
    estaColapsado,
    toggleSidebar,
    setItemActivo
  } = useSidebar({ itemActivo });

  const handleItemClick = (ruta: string, itemId: string) => {
    setItemActivo(itemId);
    onNavegacion(ruta);
  };

  const tienePermisos = (item: any): boolean => {
    if (!item.permisosRequeridos || item.permisosRequeridos.length === 0) {
      return true;
    }
    
    // Aquí luego integrarás con los permisos reales del usuario
    // Por ahora, todos los usuarios admin tienen acceso
    return usuario.rol === 'administrador';
  };

  const itemsFiltrados = sidebarItems.filter(tienePermisos);

  return (
    <aside className={`sidebar ${estaColapsado ? 'collapsed' : 'expanded'}`}>
      {/* Header del Sidebar */}
      <div className="sidebar-header">
        {!estaColapsado && (
          <div className="sidebar-logo">
            <h2>Sistema Soporte</h2>
          </div>
        )}
        
        <button
          onClick={toggleSidebar}
          className="sidebar-toggle"
          type="button"
          title={estaColapsado ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {estaColapsado ? '→' : '←'}
        </button>
      </div>

      {/* Lista de Navegación */}
      <nav className="sidebar-nav">
        <ul className="sidebar-items">
          {itemsFiltrados.map(item => (
            <SidebarItem
              key={item.id}
              item={item}
              estaActivo={itemActivo === item.id}
              estaColapsado={estaColapsado}
              onClick={(ruta) => handleItemClick(ruta, item.id)}
            />
          ))}
        </ul>
      </nav>

      {/* Footer del Sidebar */}
      <div className="sidebar-footer">
        {!estaColapsado && (
          <div className="user-info">
            <p className="user-name">{usuario.nombre}</p>
            <p className="user-role">{usuario.rol}</p>
          </div>
        )}
      </div>
    </aside>
  );
};