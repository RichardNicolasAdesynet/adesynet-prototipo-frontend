import React, { useState } from 'react';
import type { UsersTableProps } from '../../../../../types/admin.types';
import { UserAvatar } from '../../../../../components/shared/userAvatar';
import { ActionsDropdown } from '../../../../../components/shared/actionsDropdown';
import { TablePagination } from '../../../../../components/shared/tablePagination';

export const EnhancedUsersTable: React.FC<UsersTableProps> = ({
  usuarios,
  onEdit,
  onToggleStatus,
  loading = false
}) => {
  // Estado para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

  // Calcular datos paginados
  const totalRegistros = usuarios.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const inicio = (paginaActual - 1) * registrosPorPagina;
  const fin = inicio + registrosPorPagina;
  const usuariosPaginados = usuarios.slice(inicio, fin);

  const handleViewDetails = (usuario: any) => {
    console.log('Ver detalles:', usuario);
    // Aquí luego implementarás el modal de detalles
  };

  // const handleExport = (formato: 'excel' | 'pdf') => {
  //   console.log(`Exportando a ${formato}`);
  //   // Aquí luego implementarás la exportación real
  // };

  // Convertir UsuarioResumen a BaseEntity manteniendo todas las propiedades
  const convertirUsuarioABaseEntity = (usuario: any) => ({
    ...usuario,
    id: usuario.cdUsuario,
    nombre: usuario.nombreCompleto,
    estaActivo: usuario.estaActivo
  });

  if (loading) {
    return (
      <div className="table-loading">
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="table-empty">
        <p>No se encontraron usuarios</p>
      </div>
    );
  }

  return (
    <div className="enhanced-users-table">
      <div className="table-container">
        <table className="users-table">
          <thead className="table-header">
            <tr>
              <th>USUARIO</th>
              <th>ROL</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {usuariosPaginados.map(usuario => (
              <tr key={usuario.cdUsuario} className="table-row">
                <td className="user-cell">
                  <UserAvatar
                    nombre={usuario.nombreCompleto}
                    email={usuario.email}
                    size="sm"
                  />
                </td>
                <td className="role-cell">
                  <span className="role-badge">{usuario.rolNombre}</span>
                </td>
                <td className="status-cell">
                  <span className={`status-badge ${usuario.estaActivo ? 'active' : 'inactive'}`}>
                    {usuario.estaActivo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="actions-cell">
                  <ActionsDropdown
                    entidad={convertirUsuarioABaseEntity(usuario)}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                    onViewDetails={handleViewDetails}
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