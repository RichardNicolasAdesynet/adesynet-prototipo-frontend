// src/types/sidebarUsuarios.ts
import type { Usuario } from "./auth.types";

export interface MenuItem {
  id: string;
  nombre: string; // Cambié name → nombre para consistencia
  icono: string;  // Cambié icon → icono
  ruta: string;   // Cambié path → ruta
  modulo?: string;
  permisosRequeridos?: string[];
  badge?: number;
  hijos?: MenuItem[]; // Cambié children → hijos
}

export interface SidebarUsuariosProps {
  usuario: Usuario; // ← AGREGADO: Para permisos
  onNavegacion: (ruta: string) => void; // ← AGREGADO: Para navegación
  itemActivo?: string; // ← AGREGADO: Item activo desde props
  isCollapsed: boolean;
  onToggle: () => void;
  modulos?: MenuItem[]; // ← AGREGADO: Módulos dinámicos
}

// Mantener interfaces existentes pero actualizar nombres
export interface CollapsedMenuProps {
  items: MenuItem[];
  itemActivo: string; // Cambié activeItem → itemActivo
  onItemClick: (itemId: string) => void;
}

export interface SidebarUsuariosMenuProps {
  items: MenuItem[];
  itemActivo: string;
  expandedItems: string[];
  isCollapsed: boolean;
  onItemClick: (itemId: string) => void;
  onToggleExpanded: (itemId: string) => void;
}

export interface MenuItemProps {
  item: MenuItem;
  itemActivo: string;
  expandedItems: string[];
  isCollapsed: boolean;
  onItemClick: (itemId: string) => void;
  onToggleExpanded: (itemId: string) => void;
  nivel: number; // Cambié level → nivel
}