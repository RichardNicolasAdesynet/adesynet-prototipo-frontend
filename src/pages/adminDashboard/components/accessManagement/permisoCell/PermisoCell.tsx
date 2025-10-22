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
    <td className="permiso-cell">
      <button
        onClick={handleToggle}
        disabled={!moduloHabilitado}
        className={`permiso-toggle ${tienePermiso ? 'active' : 'inactive'} ${!moduloHabilitado ? 'disabled' : ''}`}
        type="button"
        title={getTooltipText()}
      >
        <span className="permiso-icon">
          {configPermiso.icono}
        </span>
        <span className="permiso-name">
          {configPermiso.nombre}
        </span>
        <span className="permiso-status">
          {tienePermiso ? '✓' : '✗'}
        </span>
      </button>
    </td>
  );
};