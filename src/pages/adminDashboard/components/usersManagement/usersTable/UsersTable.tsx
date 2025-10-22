import React from 'react';
import type { UsersTableProps, UsuarioResumen } from '../../../../../types/admin.types';

export const UsersTable: React.FC<UsersTableProps> = ({
  usuarios,
  onEdit,
  onToggleStatus,
  loading = false
}) => {
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

  const handleStatusToggle = (usuario: UsuarioResumen) => {
    const nuevoEstado = !usuario.estaActivo;
    onToggleStatus(usuario.cdUsuario, nuevoEstado);
  };

  return (
    <div className="users-table-container">
      <table className="users-table">
        <thead className="table-header">
          <tr>
            <th>Código</th>
            <th>Usuario</th>
            <th>Nombre Completo</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {usuarios.map(usuario => (
            <tr key={usuario.cdUsuario} className="table-row">
              <td className="code-cell">{usuario.cdUsuario}</td>
              <td className="user-cell">{usuario.dsUsuario}</td>
              <td className="name-cell">{usuario.nombreCompleto}</td>
              <td className="email-cell">{usuario.email || 'N/A'}</td>
              <td className="role-cell">
                <span className="role-badge">{usuario.rolNombre}</span>
              </td>
              <td className="status-cell">
                <span className={`status-badge ${usuario.estaActivo ? 'active' : 'inactive'}`}>
                  {usuario.estaActivo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="actions-cell">
                <button
                  onClick={() => onEdit(usuario)}
                  className="edit-button"
                  type="button"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleStatusToggle(usuario)}
                  className={`status-toggle-button ${usuario.estaActivo ? 'deactivate' : 'activate'}`}
                  type="button"
                >
                  {usuario.estaActivo ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};