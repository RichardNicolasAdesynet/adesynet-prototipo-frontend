//src/types/sidebarUsuarios.ts
export interface MenuItem {
  id: string;
  name: string;
  icon: string;
  path: string;
  badge?: number;
  isActive?: boolean;
  children?: MenuItem[];
}

export interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}