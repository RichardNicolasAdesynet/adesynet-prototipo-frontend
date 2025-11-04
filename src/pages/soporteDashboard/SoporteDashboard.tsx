import React from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { BaseLayout } from "../layout/BaseLayout";
import { useSidebarUsuarios } from "../../hooks/useSidebarUsuarios";
import SidebarUsuarios from "../../components/navigation/sidebarUsuarios/sidebarUsuarios";

export const SoporteDashboard: React.FC = () => {
    const {usuario, logout} = useAuth();
    const { isCollapsed, toggleSidebar } = useSidebarUsuarios();

    if (!usuario) {
    return <div>Error: No se encontró información del usuario</div>;
  }
  return (
    <div className="flex-1 flex flex-col min-w-0">
        <SidebarUsuarios isCollapsed={isCollapsed} onToggle={toggleSidebar} />
        <BaseLayout usuario={usuario} onLogout={logout}>
             SoporteDashboard
        </BaseLayout>
    </div>
  )
}
