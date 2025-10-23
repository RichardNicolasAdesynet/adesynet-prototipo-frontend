import React from 'react';
import type { ModuloHabilitadoCellProps } from '../../../../../types/admin.types';

export const ModuloHabilitadoCell: React.FC<ModuloHabilitadoCellProps> = ({
  rol,
  modulo,
  acceso,
  onChange
}) => {
  const moduloHabilitado = acceso?.moduloHabilitado ?? false;

  const handleToggle = () => {
    onChange(rol.cdRol, modulo.cdModulo, !moduloHabilitado);
  };

  const getTooltipText = () => {
    return moduloHabilitado 
      ? 'Deshabilitar módulo para este rol (quitará todos los permisos)'
      : 'Habilitar módulo para este rol';
  };

  return (
    <td className="p-2">
      <button
        onClick={handleToggle}
        className={`
          w-full
          p-3
          rounded-lg
          border-2
          transition-all duration-200
          flex flex-col items-center justify-center
          space-y-2
          cursor-pointer
          hover:scale-105
          ${moduloHabilitado 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100' 
            : 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100'
          }
        `}
        type="button"
        title={getTooltipText()}
      >
        <span className="text-xl">
          {moduloHabilitado ? '✅' : '❌'}
        </span>
        <span className="text-xs font-medium text-center leading-tight">
          {moduloHabilitado ? 'Habilitado' : 'No Habilitado'}
        </span>
        <span className="text-xs opacity-70">
          {moduloHabilitado ? 'Click para deshabilitar' : 'Click para habilitar'}
        </span>
      </button>
    </td>
  );
};