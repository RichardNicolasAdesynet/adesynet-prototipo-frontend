import React from 'react';

export interface AccessManagementTableProps {
  roles: any[];
  accesos: any[];
  modulos: any[];
  onRoleClick: (rol: any) => void;
  loading?: boolean;
}

export const AccessManagementTable: React.FC<AccessManagementTableProps> = ({
  roles,
  accesos,
  modulos,
  onRoleClick,
  loading = false
}) => {
  // Función para obtener módulos de un rol
  const obtenerModulosDelRol = (cdRol: string) => {
    return accesos
      .filter(acceso => acceso.cdRol === cdRol && acceso.moduloHabilitado)
      .map(acceso => acceso.moduloNombre);
  };

  // Función para contar módulos habilitados
  const contarModulosHabilitados = (cdRol: string) => {
    return accesos.filter(acceso => 
      acceso.cdRol === cdRol && acceso.moduloHabilitado
    ).length;
  };

  // Función para contar usuarios del rol (de los mocks)
  const contarUsuariosDelRol = (cdRol: string) => {
    const usuariosPorRol: Record<string, number> = {
      'ROL01': 3,
      'ROL02': 1,
      'ROL03': 2,
      'ROL04': 4,
      'ROL05': 8
    };
    return usuariosPorRol[cdRol] || 0;
  };

  // Función para formatear la lista de módulos
  const formatearModulos = (modulosList: string[]) => {
    if (modulosList.length <= 3) {
      return modulosList.join(', ');
    }
    return `${modulosList.slice(0, 3).join(', ')}... +${modulosList.length - 3} más`;
  };

  if (loading) {
    return (
      <div className="table-loading">
        <p>Cargando roles y accesos...</p>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="table-empty">
        <p>No hay roles configurados en el sistema</p>
      </div>
    );
  }

  return (
    <div className="access-management-table">
      <div className="table-container">
        <table className="management-table">
          <thead className="table-header">
            <tr>
              <th className="role-header">ROL</th>
              <th className="modules-header">MÓDULOS ASIGNADOS</th>
              <th className="users-header">USUARIOS</th>
              <th className="access-header">ACCESOS</th>
              <th className="status-header">ESTADO</th>
              <th className="actions-header">ACCIÓN</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {roles.map(rol => {
              const modulosDelRol = obtenerModulosDelRol(rol.cdRol);
              const modulosHabilitados = contarModulosHabilitados(rol.cdRol);
              const totalUsuarios = contarUsuariosDelRol(rol.cdRol);
              const porcentajeAcceso = modulos.length > 0 
                ? Math.round((modulosHabilitados / modulos.length) * 100) 
                : 0;

              return (
                <tr key={rol.cdRol} className="table-row">
                  <td className="role-cell">
                    <div className="role-info">
                      <div className="role-icon">🎭</div>
                      <div className="role-details">
                        <div className="role-name">{rol.nombre}</div>
                        <div className="role-code">{rol.cdRol}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="modules-cell">
                    <div className="modules-list">
                      {modulosDelRol.length > 0 ? (
                        <>
                          <span className="modules-text">
                            {formatearModulos(modulosDelRol)}
                          </span>
                          <span className="modules-count">
                            ({modulosDelRol.length} módulos)
                          </span>
                        </>
                      ) : (
                        <span className="no-modules">Sin módulos asignados</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="users-cell">
                    <div className="users-info">
                      <span className="users-icon">👥</span>
                      <span className="users-count">{totalUsuarios}</span>
                      <span className="users-label">usuarios</span>
                    </div>
                  </td>
                  
                  <td className="access-cell">
                    <div className="access-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${porcentajeAcceso}%` }}
                        ></div>
                      </div>
                      <div className="access-text">
                        {modulosHabilitados}/{modulos.length} módulos ({porcentajeAcceso}%)
                      </div>
                    </div>
                  </td>
                  
                  <td className="status-cell">
                    <span className={`status-badge ${rol.activo ? 'active' : 'inactive'}`}>
                      {rol.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  
                  <td className="actions-cell">
                    <button
                      onClick={() => onRoleClick(rol)}
                      className="manage-button"
                      type="button"
                    >
                      ⚙️ Gestionar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};