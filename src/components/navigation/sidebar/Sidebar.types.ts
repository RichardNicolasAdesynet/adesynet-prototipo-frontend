// src/components/navigation/sidebar/Sidebar.types.ts
import type { Usuario } from '../../../types/auth.types';

export interface SidebarProps {
  usuario: Usuario;
  onNavegacion: (ruta: string) => void;
  itemActivo?: string;
}