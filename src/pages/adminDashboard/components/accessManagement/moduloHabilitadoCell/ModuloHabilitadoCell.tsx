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
    <td className="modulo-habilitado-cell">
      <button
        onClick={handleToggle}
        className={`habilitado-toggle ${moduloHabilitado ? 'active' : 'inactive'}`}
        type="button"
        title={getTooltipText()}
      >
        <span className="habilitado-icon">
          {moduloHabilitado ? '✅' : '❌'}
        </span>
        <span className="habilitado-text">
          {moduloHabilitado ? 'Habilitado' : 'No Habilitado'}
        </span>
      </button>
    </td>
  );
};