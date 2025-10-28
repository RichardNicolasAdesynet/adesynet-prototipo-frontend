import React, { useState, useEffect } from 'react';
import { userService } from '../../../../services/api/userService';
import { useAlert } from '../../../../context/AlertContext';
import { EnhancedUsersTable } from './enhancedUsersTable/EnhancedUsersTable';
import { UsersFilters } from './usersFilters/UsersFilters';
import type { UsersManagementProps } from './UsersManagement.types';
import type { UsuarioResumen } from '../../../../types/admin.types';


export const UsersManagement: React.FC<UsersManagementProps> = ({
  roles,
  onUsuarioEdit,
  onUsuarioCreate,
  onFiltersChange,
  loading = false
}) => {
  const [usuarios, setUsuarios] = useState<UsuarioResumen[]>([]);
  const [filters, setFilters] = useState({});
  const { showAlert } = useAlert();

  // ✅ SOLO lógica principal - los subcomponentes ya existen
  useEffect(() => {
    cargarUsuarios();
  }, [filters]);

  const cargarUsuarios = async () => {
    try {
      const usuariosData = await userService.getUsuariosList(filters);
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      showAlert('error', 'Error', 'No se pudieron cargar los usuarios');
    }
  };

  const manejarToggleStatus = async (cdUsuario: string, nuevoEstado: boolean) => {
    try {
      if (nuevoEstado) {
        await userService.desbloquearUsuario(cdUsuario);
      } else {
        await userService.bloquearUsuario(cdUsuario, 'Bloqueado por administrador');
      }
      
      cargarUsuarios();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      showAlert('error', 'Error', 'No se pudo cambiar el estado del usuario');
    }
  };

  return (
    <div className="users-management">
      <div className="page-header">
        <h1>Gestión de Usuarios</h1>
        <button onClick={onUsuarioCreate} className="btn-primary">
          Crear Usuario
        </button>
      </div>

      {/* ✅ USAR COMPONENTES EXISTENTES */}
      <UsersFilters 
        roles={roles}
        filters={filters}
        onFiltersChange={(nuevosFiltros) => {
          setFilters(nuevosFiltros);
          onFiltersChange(nuevosFiltros);
        }}
      />

      <EnhancedUsersTable
        usuarios={usuarios}
        onEdit={onUsuarioEdit}
        onToggleStatus={manejarToggleStatus}
        loading={loading}
      />
    </div>
  );
};