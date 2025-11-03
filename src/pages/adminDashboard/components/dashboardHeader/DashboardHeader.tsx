import React from 'react';
import type { DashboardHeaderProps } from '../../../../types/admin.types';
import { StatsCard } from '../statsCard';

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  stats,
  onRefresh,
  cargando = false
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

   // Datos de variación simulados (en un caso real vendrían de la API)
  const variaciones = {
    usuarios: 15, // +12%
    roles: -2,    // -2%
    modulos: 5,   // +5%
    actividad: 8  // +8%
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Principal */}
      <div className="
        flex flex-col sm:flex-row
        items-start sm:items-center
        justify-between
        gap-4
      ">
        <div className="flex-1 min-w-0">
          <h1 className="
            text-3xl sm:text-4xl
            font-bold
            bg-gradient-to-r from-slate-800 to-purple-700
            bg-clip-text text-transparent
          ">
            Dashboard de Administración
          </h1>
          
          <p className="
            text-slate-600
            mt-2
            flex flex-col sm:flex-row sm:items-center
            gap-2
          ">
            <span>Resumen general del sistema de soporte TI</span>
            
            {ultimaActualizacion && (
              <span className="
                inline-flex items-center
                px-3 py-1
                bg-slate-100
                text-slate-700
                rounded-full
                text-sm
                border border-slate-200
              ">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                Actualizado: {new Date(ultimaActualizacion).toLocaleString()}
              </span>
            )}
          </p>
        </div>
        
        {onRefresh && (
          <button 
            onClick={onRefresh}
            disabled={cargando}
            className="
              px-6 py-3
              bg-white
              border border-slate-300
              text-slate-700
              rounded-xl
              font-medium
              shadow-lg
              hover:shadow-xl
              hover:bg-slate-50
              hover:border-slate-400
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
              flex items-center space-x-2
              group
            "
            type="button"
          >
            {cargando ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin"></div>
                <span>Actualizando...</span>
              </>
            ) : (
              <>
                <span className="text-lg group-hover:rotate-180 transition-transform duration-500">🔄</span>
                <span>Actualizar Datos</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Grid de Stats Cards */}
      <div className="
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
        gap-6
      ">
        <StatsCard
          titulo="Total Usuarios"
          valor={totalUsuarios}
          subtitulo={`${usuariosActivos} activos`}
          variacion={variaciones.usuarios}
          tipo="primary"
          icono="👥"
        />
        
        <StatsCard
          titulo="Roles del Sistema"
          valor={totalRoles}
          subtitulo="Configurados"
          variacion={variaciones.roles}
          tipo="info"
          icono="🎭"
        />
        
        <StatsCard
          titulo="Módulos"
          valor={totalModulos}
          subtitulo="Disponibles"
          variacion={variaciones.modulos}
          tipo="success"
          icono="📦"
        />
        
        <StatsCard
          titulo="Tasa de Actividad"
          valor={`${porcentajeActivos}%`}
          subtitulo={`${usuariosInactivos} inactivos`}
          variacion={variaciones.actividad}
          tipo={porcentajeActivos > 80 ? 'success' : porcentajeActivos > 60 ? 'warning' : 'danger'}
          icono="✅"
        />
      </div>
    </div>
  );  
};