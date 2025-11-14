// components/navigation/sidebarUsuarios/SidebarUsuarios.tsx
import React, { useState } from 'react';
import type { MenuItem, SidebarUsuariosProps } from '../../../types/sidebarUsuarios';
import SidebarHeader from './SidebarUsuariosHeader';
import CollapsedMenu from './CollapsedMenu';
import SidebarUsuariosFooter from './SidebarUsuariosFooter';
import SidebarUsuariosMenu from './SidebarUsuariosMenu';

const SidebarUsuarios: React.FC<SidebarUsuariosProps> = ({
  usuario,
  onNavegacion,
  itemActivo = 'dashboard',
  isCollapsed,
  onToggle,
  modulos = []
}) => {
  const [itemActivoInterno, setItemActivoInterno] = useState(itemActivo);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // ✅ FUNCIÓN PARA BUSCAR ITEM EN TODOS LOS NIVELES
  const encontrarItemPorId = (items: MenuItem[], itemId: string): MenuItem | null => {
    // Buscar en el nivel actual
    const itemEnNivelActual = items.find(item => item.id === itemId);
    if (itemEnNivelActual) return itemEnNivelActual;

    // Buscar recursivamente en los hijos
    for (const item of items) {
      if (item.hijos && item.hijos.length > 0) {
        const itemEnHijos = encontrarItemPorId(item.hijos, itemId);
        if (itemEnHijos) return itemEnHijos;
      }
    }

    return null;
  };

  // ✅ FUNCIÓN PARA OBTENER NIVEL DEL ITEM
  const obtenerNivelItem = (items: MenuItem[], itemId: string, nivelActual = 0): number => {
    const itemEnNivelActual = items.find(item => item.id === itemId);
    if (itemEnNivelActual) return nivelActual;

    for (const item of items) {
      if (item.hijos && item.hijos.length > 0) {
        const nivelEnHijos = obtenerNivelItem(item.hijos, itemId, nivelActual + 1);
        if (nivelEnHijos !== -1) return nivelEnHijos;
      }
    }

    return -1;
  };

  //********** */ ✅ FUNCIÓN DEBUG COMPLETA
  // const debugItemClick = (itemId: string, item: MenuItem | null, items: MenuItem[]) => {
  //   console.log('=== 🎯 DEBUG CLICK SIDEBAR ===');
  //   console.log('📌 Item ID clickeado:', itemId);

  //   if (item) {
  //     const tieneHijos = item.hijos && item.hijos.length > 0;
  //     const cantidadHijos = item.hijos?.length || 0;
  //     const nivel = obtenerNivelItem(items, itemId);

  //     console.log('📋 Item encontrado:', item.nombre);
  //     console.log('🏷️  ID:', item.id);
  //     console.log('📂 Nivel:', nivel);
  //     console.log('👶 Tiene hijos:', tieneHijos);
  //     console.log('🔢 Cantidad de hijos:', cantidadHijos);
  //     console.log('📍 Ruta:', item.ruta);

  //     if (tieneHijos && nivel === 0) {
  //       console.log('🎯 Acción: SE EXPANDE/CONTRAE (es padre con hijos)');
  //       console.log('📂 Hijos disponibles:', item.hijos?.map(h => `${h.nombre} [${h.id}]`).join(', '));
  //     } else if (nivel > 0) {
  //       console.log('🎯 Acción: REDIRIGIENDO A →', item.ruta);
  //       console.log('🚀 Navegación activada (es hijo)');
  //     } else if (!tieneHijos) {
  //       console.log('🎯 Acción: REDIRIGIENDO A →', item.ruta);
  //       console.log('🚀 Navegación activada (sin hijos)');
  //     }
  //   } else {
  //     console.log('❌ Item NO encontrado en la estructura');
  //     console.log('📊 Items disponibles en nivel 0:', items.map(m => `${m.nombre} [${m.id}]`).join(', '));
  //   }
  //   console.log('================================\n');
  // };


  // // Sincronizar itemActivo desde props
  // useEffect(() => {
  //   if (itemActivo) {
  //     setItemActivoInterno(itemActivo);
  //   }
  // }, [itemActivo]);

  // useEffect(() => {
  //   if (isCollapsed) {
  //     setExpandedItems([]);
  //   }
  // }, [isCollapsed]);

  const toggleExpanded = (itemId: string) => {
    if (isCollapsed) return;

    // console.log('=== 🔄 DEBUG EXPANSIÓN ===');
    // console.log('📌 Item ID:', itemId);
    // console.log('🎯 Acción:', expandedItems.includes(itemId) ? 'CONTRAER' : 'EXPANDIR');
    // console.log('=======================\n');

    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (itemId: string, ruta: string) => {
    setItemActivoInterno(itemId);
    onNavegacion(ruta); // ← Navegación real
  };
  return (
    <aside className={`
      flex flex-col 
      h-screen 
      bg-linear-to-b from-slate-50 to-blue-100/80
      backdrop-blur-xl border-r border-slate-200/60
      transition-all duration-500 ease-in-out
      ${isCollapsed ? 'w-20' : 'w-70'}
      z-30
      h-screen sticky top-0
      shadow-2xl
    `}>
      {/* Header */}
      <SidebarHeader
        isCollapsed={isCollapsed}
        onToggle={onToggle}
      />

      {/* Navegación */}
      {isCollapsed ? (
        <CollapsedMenu
          items={modulos}
          itemActivo={itemActivoInterno}
          onItemClick={(itemId) => {
            const item = encontrarItemPorId(modulos, itemId); // ← Usar función recursiva
            if (item) {
              const nivel = obtenerNivelItem(modulos, itemId);
              const tieneHijos = item.hijos && item.hijos.length > 0;
              
              if (nivel > 0 || !tieneHijos) {
                handleItemClick(itemId, item.ruta);
              }
            }
          }}
        />
      ) : (
        <SidebarUsuariosMenu
          items={modulos}
          itemActivo={itemActivoInterno}
          expandedItems={expandedItems}
          isCollapsed={isCollapsed}
          onItemClick={(itemId) => {
            const item = encontrarItemPorId(modulos, itemId); // ← Usar función recursiva
            //debugItemClick(itemId, item, modulos);
            if (item) {
              const nivel = obtenerNivelItem(modulos, itemId);
              const tieneHijos = item.hijos && item.hijos.length > 0;
              if (nivel > 0 || !tieneHijos) {
                handleItemClick(itemId, item.ruta);
              }
            }
          }}
          onToggleExpanded={toggleExpanded}
        />
      )}

      {/* Footer */}
      <SidebarUsuariosFooter
        isCollapsed={isCollapsed}
        usuario={usuario} // ← AGREGADO
      />
    </aside>
  );
};

export default SidebarUsuarios;