import React, { useState, useEffect } from 'react';
import { userService } from '../../../../services/api/userService';
import { useAlert } from '../../../../context/AlertContext';
import { EnhancedUsersTable } from './enhancedUsersTable/EnhancedUsersTable';
import { UsersFilters } from './usersFilters/UsersFilters';
import type { UsersManagementProps } from './UsersManagement.types';
import type { UsuarioResumen } from '../../../../types/admin.types';
import { UserForm } from './userForm';


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
  // ✅ AGREGAR: Estados para el modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<UsuarioResumen | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // ✅ SOLO lógica principal - los subcomponentes ya existen
  useEffect(() => {
    cargarUsuarios();
  }, [filters]);

  // ✅ AGREGAR: Manejo de formulario
  const manejarCrearUsuario = () => {
    setUsuarioEditando(null);
    setIsEditMode(false);
    setIsFormOpen(true);
    onUsuarioCreate(); // Llamar al callback prop
  };

  // ✅ CORREGIDO: Agregar la función faltante
  const manejarFiltrosChange = (nuevosFiltros: any) => {
    setFilters(nuevosFiltros);
    onFiltersChange(nuevosFiltros);
  };

  const manejarEditarUsuario = (usuario: UsuarioResumen) => {
    setUsuarioEditando(usuario);
    setIsEditMode(true);
    setIsFormOpen(true);
    onUsuarioEdit(usuario); // Llamar al callback prop
  };

  const manejarEnviarFormulario = async (formData: any) => {
    try {
      if (isEditMode && usuarioEditando) {
        await userService.updateUsuario(usuarioEditando.cdUsuario, formData);
        showAlert('success', 'Éxito', 'Usuario actualizado correctamente');
      } else {
        await userService.createUsuario(formData);
        showAlert('success', 'Éxito', 'Usuario creado correctamente');
      }

      setIsFormOpen(false);
      cargarUsuarios(); // Recargar lista
    } catch (error) {
      console.error('Error guardando usuario:', error);
      showAlert('error', 'Error', 'No se pudo guardar el usuario');
    }
  };

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
        <button onClick={manejarCrearUsuario} className="btn-primary">
          Crear Usuario
        </button>
      </div>

      {/* ✅ CORREGIDO: Ahora manejarFiltrosChange existe */}
      <UsersFilters 
        roles={roles}
        filters={filters}
        onFiltersChange={manejarFiltrosChange}
      />

      <EnhancedUsersTable
        usuarios={usuarios}
        onEdit={manejarEditarUsuario}
        onToggleStatus={manejarToggleStatus}
        loading={loading}
      />

      {/* Modal de Formulario */}
      <UserForm
        usuario={usuarioEditando as any}
        roles={roles}
        isOpen={isFormOpen}
        isEditing={isEditMode}
        onSubmit={manejarEnviarFormulario}
        onCancel={() => setIsFormOpen(false)}
        loading={loading}
      />
    </div>
  );
};