// components/navigation/sidebarUsuarios/SidebarUsuarios.tsx
import React, { useState, useEffect } from 'react';
import type { MenuItem, SidebarProps } from '../../../types/sidebarUsuarios';
import SidebarHeader from './SidebarUsuariosHeader';
import SidebarMenu from './SidebarUsuariosMenu';
import CollapsedMenu from './CollapsedMenu';
import SidebarFooter from './SidebarUsuariosFooter';

const SidebarUsuarios: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(()=>{
    if(isCollapsed){
      setExpandedItems([]); 
    }
  },[isCollapsed]);

  // Datos de ejemplo - reemplaza con tus módulos reales
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: '📊',
      path: '/dashboard',
      isActive: true
    },
    {
      id: 'courses',
      name: 'Cursos',
      icon: '📚',
      path: '/courses',
      children: [
        {
          id: 'all-courses',
          name: 'Todos los Cursos',
          icon: '🎓',
          path: '/courses/all',
          badge: 12
        },
        {
          id: 'my-courses',
          name: 'Mis Cursos',
          icon: '⭐',
          path: '/courses/my',
          badge: 3
        },
        {
          id: '3d-animation',
          name: 'Animación 3D',
          icon: '🎬',
          path: '/courses/3d-animation'
        },
        {
          id: 'interaction-design',
          name: 'Diseño de Interacción',
          icon: '🎨',
          path: '/courses/interaction-design'
        }
      ]
    },
    {
      id: 'calendar',
      name: 'Calendario',
      icon: '📅',
      path: '/calendar',
      badge: 5
    },
    {
      id: 'chat',
      name: 'Chat',
      icon: '💬',
      path: '/chat',
      badge: 3
    },
    {
      id: 'support',
      name: 'Soporte',
      icon: '🔧',
      path: '/support',
      children: [
        {
          id: 'incidents',
          name: 'Incidencias',
          icon: '🚨',
          path: '/support/incidents'
        },
        {
          id: 'history',
          name: 'Histórico',
          icon: '📋',
          path: '/support/history'
        },
        {
          id: 'tracking',
          name: 'Seguimiento',
          icon: '👁️',
          path: '/support/tracking'
        }
      ]
    }
  ];

  const toggleExpanded = (itemId: string) => {
    if (isCollapsed) return;
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };
  
   const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    // Si el sidebar está colapsado y hacemos click, lo expandimos automáticamente?
    // O puedes quitar esta funcionalidad si prefieres
  };

  return (
    <div className={`
      flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white
      transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-20' : 'w-64'}
      shadow-2xl
    `}>
      {/* Header */}
      <SidebarHeader 
        isCollapsed={isCollapsed} 
        onToggle={onToggle} 
      />

      {/* Menu Navigation - Versión condicional */}
      {isCollapsed ? (
        <CollapsedMenu
          items={menuItems}
          activeItem={activeItem}
          onItemClick={setActiveItem}
        />
      ) : (
        <SidebarMenu
          items={menuItems}
          activeItem={activeItem}
          expandedItems={expandedItems}
          isCollapsed={isCollapsed}
          onItemClick={setActiveItem}
          onToggleExpanded={toggleExpanded}
        />
      )}

      {/* Footer */}
      <SidebarFooter isCollapsed={isCollapsed} />
    </div>
  );
};

export default SidebarUsuarios;