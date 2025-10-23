import React from 'react';
import type { PermisoCellProps } from '../../../../../types/admin.types';

export const PermisoCell: React.FC<PermisoCellProps> = ({
  rol,
  modulo,
  acceso,
  tipoPermiso,
  configPermiso,
  onChange
}) => {
  const tienePermiso = acceso?.permisos?.some(permiso => permiso.tipoPermiso === tipoPermiso) || false;
  const moduloHabilitado = acceso?.moduloHabilitado ?? false;

  const handleToggle = () => {
    if (moduloHabilitado) {
      onChange(rol.cdRol, modulo.cdModulo, tipoPermiso, !tienePermiso);
    }
  };

  const getTooltipText = () => {
    if (!moduloHabilitado) {
      return 'Módulo no habilitado para este rol';
    }
    return tienePermiso 
      ? `Quitar permiso: ${configPermiso.descripcion}`
      : `Agregar permiso: ${configPermiso.descripcion}`;
  };

  return (
    <td className="p-2">
      <button
        onClick={handleToggle}
        disabled={!moduloHabilitado}
        className={`
          w-full
          p-3
          rounded-lg
          border-2
          transition-all duration-200
          flex flex-col items-center justify-center
          space-y-2
          ${tienePermiso 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100' 
            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }
          ${!moduloHabilitado 
            ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-100' 
            : 'cursor-pointer hover:scale-105'
          }
        `}
        type="button"
        title={getTooltipText()}
      >
        <span className="text-xl">
          {configPermiso.icono}
        </span>
        <span className="text-xs font-medium text-center leading-tight">
          {configPermiso.nombre}
        </span>
        <span className={`
          text-xs
          ${tienePermiso ? 'text-emerald-600' : 'text-slate-400'}
        `}>
          {tienePermiso ? '✓' : '✗'}
        </span>
      </button>
    </td>
  );
};