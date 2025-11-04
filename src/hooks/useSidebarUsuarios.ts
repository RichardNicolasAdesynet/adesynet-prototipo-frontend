// hooks/useSidebarUsuarios.ts
import { useState } from 'react';

export const useSidebarUsuarios = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return {
    isCollapsed,
    toggleSidebar,
    setIsCollapsed
  };
};