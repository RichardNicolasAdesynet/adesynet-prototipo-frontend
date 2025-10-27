// src/hooks/useSidebar.ts
import { useState, useCallback } from 'react';
import type { SidebarState } from '../types/navigation.types';

export const useSidebar = (initialState: Partial<SidebarState> = {}) => {
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    estaColapsado: initialState.estaColapsado || false,
    itemActivo: initialState.itemActivo || null
  });

  const toggleSidebar = useCallback(() => {
    setSidebarState(prev => ({
      ...prev,
      estaColapsado: !prev.estaColapsado
    }));
  }, []);

  const setItemActivo = useCallback((itemId: string | null) => {
    setSidebarState(prev => ({
      ...prev,
      itemActivo: itemId
    }));
  }, []);

  const colapsarSidebar = useCallback(() => {
    setSidebarState(prev => ({
      ...prev,
      estaColapsado: true
    }));
  }, []);

  const expandirSidebar = useCallback(() => {
    setSidebarState(prev => ({
      ...prev,
      estaColapsado: false
    }));
  }, []);

  return {
    ...sidebarState,
    toggleSidebar,
    setItemActivo,
    colapsarSidebar,
    expandirSidebar
  };
};