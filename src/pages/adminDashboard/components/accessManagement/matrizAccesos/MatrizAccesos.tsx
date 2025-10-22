import React from 'react';
import type { MatrizAccesosProps } from '../../../../../types/admin.types';
import { permisosConfig, tiposPermisoDisponibles } from '../../../../../data/accessManagementData';
import { PermisoCell } from '../permisoCell';
import { ModuloHabilitadoCell } from '../moduloHabilitadoCell';

export const MatrizAccesos: React.FC<MatrizAccesosProps> = ({
  roles,
  modulos,
  accesos,
  onPermisoChange,
  onModuloHabilitadoChange,
  loading = false
}) => {
  // Función para buscar acceso por rol y módulo
  const obtenerAcceso = (cdRol: string, cdModulo: string) => {
    return accesos.find(acceso => 
      acceso.cdRol === cdRol && acceso.cdModulo === cdModulo
    );
  };

  if (loading) {
    return (
      <div className="matriz-loading">
        <p>Cargando matriz de accesos...</p>
      </div>
    );
  }

  if (roles.length === 0 || modulos.length === 0) {
    return (
      <div className="matriz-empty">
        <p>No hay roles o módulos configurados</p>
      </div>
    );
  }

  return (
    <div className="matriz-accesos">
      <div className="matriz-container">
        <table className="matriz-table">
          <thead className="matriz-header">
            <tr>
              <th rowSpan={2} className="header-role">ROL</th>
              <th rowSpan={2} className="header-module">MÓDULO</th>
              <th rowSpan={2} className="header-enabled">HABILITADO</th>
              <th colSpan={tiposPermisoDisponibles.length} className="header-permissions">
                PERMISOS
              </th>
            </tr>
            <tr>
              {tiposPermisoDisponibles.map(tipoPermiso => (
                <th key={tipoPermiso} className="permiso-header">
                  <div className="permiso-header-content">
                    <span className="permiso-icon">
                      {permisosConfig[tipoPermiso].icono}
                    </span>
                    <span className="permiso-name">
                      {permisosConfig[tipoPermiso].nombre}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="matriz-body">
            {roles.map(rol => 
              modulos.map(modulo => {
                const acceso = obtenerAcceso(rol.cdRol, modulo.cdModulo);
                
                return (
                  <tr key={`${rol.cdRol}-${modulo.cdModulo}`} className="matriz-row">
                    <td className="role-cell">
                      <div className="role-info">
                        <div className="role-name">{rol.nombre}</div>
                        <div className="role-code">{rol.cdRol}</div>
                      </div>
                    </td>
                    <td className="module-cell">
                      <div className="module-info">
                        <div className="module-name">{modulo.dsModulo}</div>
                        <div className="module-code">{modulo.cdModulo}</div>
                      </div>
                    </td>
                    
                    <ModuloHabilitadoCell
                      rol={rol}
                      modulo={modulo}
                      acceso={acceso}
                      onChange={onModuloHabilitadoChange}
                    />
                    
                    {tiposPermisoDisponibles.map(tipoPermiso => (
                      <PermisoCell
                        key={tipoPermiso}
                        rol={rol}
                        modulo={modulo}
                        acceso={acceso}
                        tipoPermiso={tipoPermiso}
                        configPermiso={permisosConfig[tipoPermiso]}
                        onChange={onPermisoChange}
                      />
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      <div className="matriz-legend">
        <h4>Leyenda de Permisos:</h4>
        <div className="legend-items">
          {tiposPermisoDisponibles.map(tipoPermiso => (
            <div key={tipoPermiso} className="legend-item">
              <span className="legend-icon">{permisosConfig[tipoPermiso].icono}</span>
              <span className="legend-text">
                <strong>{permisosConfig[tipoPermiso].nombre}:</strong> 
                {permisosConfig[tipoPermiso].descripcion}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};