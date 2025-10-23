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
    <aside className={`
      flex flex-col 
      bg-gradient-to-b from-slate-50 to-blue-50/80
      backdrop-blur-xl border-r border-slate-200/60
      shadow-xl
      transition-all duration-500 ease-in-out
      ${estaColapsado ? 'w-20' : 'w-64'}
      relative z-30
      h-screen sticky top-0
    `}>
      {/* Header del Sidebar */}
      <div className="p-6 border-b border-slate-200/60 relative">
        {!estaColapsado && (
          <div className="sidebar-logo transition-all duration-500">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-400/25 animate-float">
                <span className="text-white font-bold text-lg">A+</span>
              </div>
              <div>
                <h2 className="text-slate-800 font-bold text-lg leading-tight">ADES+ NET</h2>
                <p className="text-cyan-600 text-xs">Sistema Soporte TI</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`
            absolute -right-3 top-1/2 transform -translate-y-1/2
            w-6 h-6 bg-white rounded-full shadow-lg border border-slate-300
            flex items-center justify-center text-slate-600
            transition-all duration-300 hover:scale-110 hover:shadow-xl
            hover:bg-cyan-50 hover:border-cyan-300
            ${estaColapsado ? 'rotate-180' : ''}
          `}
          type="button"
          title={estaColapsado ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          <span className="text-sm">←</span>
        </button>
      </div>

      {/* Lista de Navegación */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {itemsFiltrados.map((item, index) => (
            <div 
              key={item.id}
              className="transform transition-all duration-500"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <SidebarItem
                item={item}
                estaActivo={itemActivo === item.id}
                estaColapsado={estaColapsado}
                onClick={(ruta) => handleItemClick(ruta, item.id)}
              />
            </div>
          ))}
        </ul>
      </nav>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-slate-200/60">
        {!estaColapsado ? (
          <div className="user-info animate-fade-in">
            <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl backdrop-blur-sm border border-slate-200/60 shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                {usuario.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 font-medium text-sm truncate">
                  {usuario.nombre}
                </p>
                <p className="text-cyan-600 text-xs capitalize truncate">
                  {usuario.rol}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
              {usuario.nombre.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </aside>
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