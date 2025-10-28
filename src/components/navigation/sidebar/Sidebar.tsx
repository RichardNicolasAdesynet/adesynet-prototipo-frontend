import React from 'react';
import { SidebarItem } from './sidebarItem/SidebarItem';
import { sidebarItems } from '../../../data/sidebarData';
import type { SidebarProps } from './Sidebar.types';

export const Sidebar: React.FC<SidebarProps> = ({ 
  usuario, 
  onNavegacion, 
  itemActivo 
}) => {
  // ✅ CORREGIDO: Verificar permisos usando idRol y permisos reales
  const tienePermisos = (item: any): boolean => {
    if (!item.permisosRequeridos || item.permisosRequeridos.length === 0) {
      return true;
    }
    
    // Verificar si el usuario tiene al menos uno de los permisos requeridos
    return item.permisosRequeridos.some((permisoRequerido: string) =>
      usuario.permisos?.includes(permisoRequerido)
    );
  };

  const itemsFiltrados = sidebarItems.filter(tienePermisos);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="user-info">
          {/* ✅ CORREGIDO: Usar nombreCompleto en lugar de nombre */}
          <h3>{usuario.nombreCompleto}</h3>
          <span className="user-role">{usuario.rolNombre}</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {itemsFiltrados.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            estaActivo={itemActivo === item.id}
            estaColapsado={false}
            onClick={onNavegacion}
          />
        ))}
      </nav>
    </div>
  );

  // return (
  //   <aside className={`sidebar ${estaColapsado ? 'collapsed' : 'expanded'}`}>
  //     {/* Header del Sidebar */}
  //     <div className="sidebar-header">
  //       {!estaColapsado && (
  //         <div className="sidebar-logo">
  //           <h2>Sistema Soporte</h2>
  //         </div>
  //       )}

  //       <button
  //         onClick={toggleSidebar}
  //         className="sidebar-toggle"
  //         type="button"
  //         title={estaColapsado ? 'Expandir sidebar' : 'Colapsar sidebar'}
  //       >
  //         {estaColapsado ? '→' : '←'}
  //       </button>
  //     </div>

  //     {/* Lista de Navegación */}
  //     <nav className="sidebar-nav">
  //       <ul className="sidebar-items">
  //         {itemsFiltrados.map(item => (
  //           <SidebarItem
  //             key={item.id}
  //             item={item}
  //             estaActivo={itemActivo === item.id}
  //             estaColapsado={estaColapsado}
  //             onClick={(ruta) => handleItemClick(ruta, item.id)}
  //           />
  //         ))}
  //       </ul>
  //     </nav>

  //     {/* Footer del Sidebar */}
  //     <div className="sidebar-footer">
  //       {!estaColapsado && (
  //         <div className="user-info">
  //           <p className="user-name">{usuario.nombre}</p>
  //           <p className="user-role">{usuario.rol}</p>
  //         </div>
  //       )}
  //     </div>
  //   </aside>
  // );
};