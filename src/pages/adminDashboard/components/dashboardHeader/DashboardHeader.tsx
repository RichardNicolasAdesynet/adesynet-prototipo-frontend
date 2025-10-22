import React from 'react';
import type { DashboardHeaderProps } from '../../../../types/admin.types';
import { StatsCard } from '../statsCard';

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  stats,
  onRefresh
}) => {
  const {
    totalUsuarios,
    totalRoles,
    totalModulos,
    usuariosActivos,
    usuariosInactivos,
    ultimaActualizacion
  } = stats;

  const porcentajeActivos = totalUsuarios > 0 
    ? Math.round((usuariosActivos / totalUsuarios) * 100) 
    : 0;

  return (
    <div className="dashboard-header">
      <div className="header-content">
        <div className="header-title-section">
          <h1 className="title">Dashboard de Administración</h1>
          <p className="subtitle">
            Resumen general del sistema de soporte
            {ultimaActualizacion && (
              <span className="update-time">
                Actualizado: {new Date(ultimaActualizacion).toLocaleString()}
              </span>
            )}
          </p>
        </div>
        
        {onRefresh && (
          <button 
            onClick={onRefresh}
            className="refresh-button"
            type="button"
          >
            🔄 Actualizar
          </button>
        )}
      </div>

      <div className="stats-grid">
        <StatsCard
          titulo="Total Usuarios"
          valor={totalUsuarios}
          subtitulo={`${usuariosActivos} activos`}
          tipo="primary"
          icono="👥"
        />
        
        <StatsCard
          titulo="Roles del Sistema"
          valor={totalRoles}
          subtitulo="Configurados"
          tipo="info"
          icono="🎭"
        />
        
        <StatsCard
          titulo="Módulos"
          valor={totalModulos}
          subtitulo="Disponibles"
          tipo="success"
          icono="📦"
        />
        
        <StatsCard
          titulo="Usuarios Activos"
          valor={`${porcentajeActivos}%`}
          subtitulo={`${usuariosInactivos} inactivos`}
          tipo={porcentajeActivos > 80 ? 'success' : 'warning'}
          icono="✅"
        />
      </div>
    </div>
  );
};