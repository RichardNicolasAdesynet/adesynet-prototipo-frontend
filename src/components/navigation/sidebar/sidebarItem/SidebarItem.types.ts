import type { SidebarItem } from '../../../../types/navigation.types';

export interface SidebarItemProps {
  item: SidebarItem;
  estaActivo: boolean;
  estaColapsado: boolean;
  onClick: (ruta: string) => void;
}