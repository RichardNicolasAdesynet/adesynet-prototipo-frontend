import React, { useState } from 'react';
import type { RolesTableProps } from '../../../../../types/admin.types';
import { ActionsDropdown } from '../../../../../components/shared/actionsDropdown';
import { TablePagination } from '../../../../../components/shared/tablePagination';

export const EnhancedRolesTable: React.FC<RolesTableProps> = ({
  roles,
  onEdit,
  onToggleStatus,
  loading = false
}) => {
  // Estado para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

  // Calcular datos paginados
  const totalRegistros = roles.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const inicio = (paginaActual - 1) * registrosPorPagina;
  const fin = inicio + registrosPorPagina;
  const rolesPaginados = roles.slice(inicio, fin);

  const handleViewDetails = (rol: any) => {
    console.log('Ver detalles del rol:', rol);
    // Aquí luego implementarás el modal de detalles
  };

  // Convertir RolResumen a BaseEntity manteniendo todas las propiedades
  const convertirRolABaseEntity = (rol: any) => ({
    ...rol,
    id: rol.cdRol,
    nombre: rol.nombre,
    estaActivo: rol.activo
  });

  const customActions = [
    {
      label: 'Gestionar Permisos',
      icono: '🔐',
      onClick: (rol: any) => console.log('Gestionar permisos de:', rol.nombre),
      peligroso: false
    }
  ];

  if (loading) {
    return (
      <div className="table-loading">
        <p>Cargando roles...</p>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="table-empty">
        <p>No se encontraron roles</p>
      </div>
    );
  }

  return (
    <div className="enhanced-roles-table">
      <div className="table-container">
        <table className="roles-table">
          <thead className="table-header">
            <tr>
              <th>CÓDIGO</th>
              <th>NOMBRE</th>
              <th>DESCRIPCIÓN</th>
              <th>USUARIOS</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {rolesPaginados.map(rol => (
              <tr key={rol.cdRol} className="table-row">
                <td className="code-cell">
                  <span className="role-code">{rol.cdRol}</span>
                </td>
                <td className="name-cell">
                  <div className="role-name-info">
                    <div className="role-name">{rol.nombre}</div>
                  </div>
                </td>
                <td className="description-cell">
                  <div className="role-description">
                    {rol.descripcion}
                  </div>
                </td>
                <td className="users-cell">
                  <span className="users-count">
                    {rol.cantidadUsuarios || 0} usuarios
                  </span>
                </td>
                <td className="status-cell">
                  <span className={`status-badge ${rol.activo ? 'active' : 'inactive'}`}>
                    {rol.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="actions-cell">
                  <ActionsDropdown
                    entidad={convertirRolABaseEntity(rol)}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                    onViewDetails={handleViewDetails}
                    customActions={customActions}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        totalRegistros={totalRegistros}
        registrosPorPagina={registrosPorPagina}
        onPaginaChange={setPaginaActual}
        onRegistrosPorPaginaChange={setRegistrosPorPagina}
      />
    </div>
  );
};