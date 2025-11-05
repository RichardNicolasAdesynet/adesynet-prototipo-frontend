// components/navigation/sidebarUsuarios/MenuItem.tsx
import React from 'react';
import type { MenuItemProps } from '../../../types/sidebarUsuarios';

const MenuItemComponent: React.FC<MenuItemProps> = ({
  item,
  itemActivo,
  expandedItems,
  isCollapsed,
  onItemClick,
  onToggleExpanded,
  nivel
}) => {
  const tieneHijos = item.hijos && item.hijos.length > 0;
  const isExpanded = expandedItems.includes(item.id);
  const isActive = itemActivo === item.id;

  // ✅ LÓGICA CORREGIDA: 
  // - Nivel 0 con hijos: Expandir/contraer
  // - Nivel > 0 con hijos: Expandir/contraer  
  // - Sin hijos: Navegar (cualquier nivel)
  const puedeExpandir = tieneHijos;
  const puedeNavegar = !tieneHijos;

  const handleMainClick = () => {
    if (puedeExpandir) {
      // Si puede expandir (tiene hijos), expandir/contraer
      console.log(`🔧 MenuItem: ${item.nombre} - EXPANDIENDO/CONTRALLENDO (tiene ${item.hijos?.length} hijos)`);
      onToggleExpanded(item.id);
    } else if (puedeNavegar) {
      // Si puede navegar (no tiene hijos), navegar
      console.log(`🔧 MenuItem: ${item.nombre} - NAVEGANDO a ${item.ruta}`);
      onItemClick(item.id);
    }
  };


  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que se active el click del padre
    onToggleExpanded(item.id);
  };

  if (isCollapsed && nivel > 0) {
    return null;
  }


  return (
    <div className="relative">
      {/* Línea vertical conectiva - solo para niveles > 0 */}
      {nivel > 0 && (
        <div
          className="absolute left-6 top-0 w-0.5 h-full bg-[#70455B]/30"
          style={{
            left: `${nivel * 16 + 12}px`,
            height: 'calc(100% - 8px)',
            top: '4px'
          }}
        />
      )}

      {/* Contenedor principal */}
      <div
        onClick={handleMainClick}
        className={`
          w-full flex items-center justify-between p-3 rounded-xl 
          transition-all duration-300 ease-out
          group relative overflow-hidden
          ${isActive
            ? 'bg-gradient-to-r from-[#70455B]/15 to-purple-500/15 text-[#70455B] shadow-lg shadow-[#70455B]/10 border border-[#70455B]/30' 
            : 'text-slate-600 hover:text-slate-800 hover:bg-white/80 border border-transparent hover:border-[#70455B]/20'
          }
          ${nivel > 0 ? 'ml-4' : ''}
          ${puedeNavegar ? 'cursor-pointer hover:scale-105' : 'cursor-pointer'}
        `}
        style={{ paddingLeft: `${nivel * 16 + 12}px` }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleMainClick();
          }
        }}
      >
        {/* Efecto de fondo animado */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-[#70455B]/10 to-purple-500/10 
          transition-all duration-500
          ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}></div>

        {/* Indicador activo lateral */}
        {isActive && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#70455B] to-purple-500 rounded-r-full shadow-lg shadow-[#70455B]/50"></div>
        )}

        {/* Punto conectivo para niveles > 0 */}
        {nivel > 0 && (
          <div
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-[#70455B]/50 z-10"
            style={{ left: `${nivel * 16 - 4}px` }}
          />
        )}

        {/* Contenido principal */}
        <div className="flex items-center space-x-3 min-w-0 flex-1 z-10">
          <span className={`
            text-lg transition-transform duration-300 z-10
            ${isActive ? 'scale-110' : 'group-hover:scale-110'}
            ${isActive ? 'text-[#70455B]' : 'text-slate-500 group-hover:text-[#70455B]'}
          `}>
            {item.icono}
          </span>

          {!isCollapsed && (
            <span className={`
              font-medium transition-all duration-300 z-10 truncate
              ${isActive ? 'text-[#70455B] font-semibold' : 'group-hover:text-slate-800'}
              ${isActive ? 'translate-x-0' : 'group-hover:translate-x-1'}
            `}>
              {item.nombre}
              {tieneHijos && (
                <span className="text-xs text-gray-500 ml-2">
                  ({item.hijos?.length} hijo{item.hijos?.length !== 1 ? 's' : ''})
                </span>
              )}
            </span>
          )}
        </div>

        {/* Badge y botón de expansión - mostrar para CUALQUIER item con hijos */}
        {!isCollapsed && tieneHijos && (
          <div className="flex items-center space-x-2 ml-2 z-10">
            {item.badge && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-6 text-center">
                {item.badge}
              </span>
            )}
            <button
              onClick={handleExpandClick}
              className={`
                transform transition-transform duration-200 text-[#70455B] 
                hover:bg-[#70455B]/10 rounded p-1 w-6 h-6 flex items-center justify-center
                ${isExpanded ? 'rotate-90' : ''}
              `}
              type="button"
              title={isExpanded ? 'Contraer' : 'Expandir'}
              aria-label={isExpanded ? 'Contraer submenú' : 'Expandir submenú'}
            >
              <span className="text-xs">▶</span>
            </button>
          </div>
        )}

        {/* Para items sin hijos, solo mostrar badge */}
        {!isCollapsed && !tieneHijos && item.badge && (
          <div className="flex items-center space-x-2 ml-2 z-10">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-6 text-center">
              {item.badge}
            </span>
          </div>
        )}
      </div>

      {/* Children Items - Mostrar para CUALQUIER item con hijos que esté expandido */}
      {tieneHijos && isExpanded && !isCollapsed && (
        <div className="overflow-hidden relative">
          <div
            className="absolute left-6 top-0 w-0.5 bg-[#70455B]/30"
            style={{
              left: `${nivel * 16 + 28}px`,
              height: '100%'
            }}
          />

          <div className="mt-1 space-y-1 animate-slideDown">
            {item.hijos!.map((hijo) => (
              <MenuItemComponent
                key={hijo.id}
                item={hijo}
                itemActivo={itemActivo}
                expandedItems={expandedItems}
                isCollapsed={false}
                onItemClick={onItemClick}
                onToggleExpanded={onToggleExpanded}
                nivel={nivel + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItemComponent;