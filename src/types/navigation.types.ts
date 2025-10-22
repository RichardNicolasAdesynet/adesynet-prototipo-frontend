import type { Usuario } from './auth.types';

export interface SidebarItem {
  id: string;
  nombre: string;
  icono: string;
  ruta: string;
  modulo?: string;
  permisosRequeridos?: string[];
  subItems?: SidebarItem[];
}

export interface SidebarState {
  estaColapsado: boolean;
  itemActivo: string | null;
}

export interface SidebarProps {
  usuario: Usuario;
  onNavegacion: (ruta: string) => void;
  itemActivo?: string;
}

export interface SidebarItemProps {
  item: SidebarItem;
  estaActivo: boolean;
  estaColapsado: boolean;
  onClick: (ruta: string) => void;
}