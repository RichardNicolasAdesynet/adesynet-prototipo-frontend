import React, { useState, useMemo, useEffect } from 'react';
import type { UsersManagementProps, UsuarioFilters, UsuarioFormData } from '../../../../types/admin.types';
import { UsersFilters } from './usersFilters';
import { EnhancedUsersTable } from './enhancedUsersTable';
import { UserForm } from './userForm';
import { ExportButton } from '../../../../components/shared/exportButton';
import { userService } from '../../../../services/api/userService';

export const UsersManagement: React.FC<UsersManagementProps> = ({
  roles,
  onUsuarioEdit,
  onUsuarioCreate,
  onUsuarioToggleStatus,
  onFiltersChange,
  loading = false
}) => {
  const [filters, setFilters] = useState<UsuarioFilters>({});
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingUsuario, setEditingUsuario] = useState<UsuarioFormData | undefined>();
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  // ✅ NUEVO: Estado para usuarios reales
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [usuariosLoading, setUsuariosLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ NUEVO: Cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

  // ✅ NUEVO: Función para cargar usuarios desde API
  const cargarUsuarios = async () => {
    try {
      setUsuariosLoading(true);
      setError(null);
      console.log('🔄 Cargando usuarios desde API...');

      const usuariosReales = await userService.getUsuariosList();
      console.log('✅ Usuarios cargados:', usuariosReales);

      setUsuarios(usuariosReales);
    } catch (err) {
      console.error('❌ Error cargando usuarios:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setUsuariosLoading(false);
    }
  };

  // Filtrar usuarios basado en los filtros
  const filteredUsuarios = useMemo(() => {
    return usuarios.filter(usuario => {
      // Filtro por término de búsqueda
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch =
          usuario.dsUsuario.toLowerCase().includes(searchLower) ||
          usuario.nombreCompleto.toLowerCase().includes(searchLower) ||
          (usuario.email && usuario.email.toLowerCase().includes(searchLower)) ||
          usuario.cdUsuario.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Filtro por rol
      if (filters.cdRol && usuario.cdRol !== filters.cdRol) {
        return false;
      }

      // Filtro por estado
      if (filters.estaActivo !== undefined && usuario.estaActivo !== filters.estaActivo) {
        return false;
      }

      return true;
    });
  }, [usuarios, filters]);

  const handleExport = async (formato: 'excel' | 'pdf') => {
    setExportLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Exportando ${usuarios.length} usuarios a ${formato}`);
      // Aquí integrarías la exportación real cuando esté disponible
    } catch (err) {
      console.error('Error en exportación:', err);
    } finally {
      setExportLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: UsuarioFilters) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCreateUser = () => {
    setEditingUsuario(undefined);
    setIsFormOpen(true);
    onUsuarioCreate();
  };

  const handleEditUser = (usuario: any) => {
    // ✅ ACTUALIZADO: Usar datos reales del usuario
    const formData: UsuarioFormData = {
      cdUsuario: usuario.cdUsuario,
      dsUsuario: usuario.dsUsuario,
      nombre: usuario.nombreCompleto.split(' ')[0] || '',
      apellidoP: usuario.nombreCompleto.split(' ')[1] || '',
      apellidoM: usuario.nombreCompleto.split(' ')[2] || '',
      dni: usuario.dni || '',
      email: usuario.email || '',
      cdRol: usuario.cdRol,
      estaActivo: usuario.estaActivo
    };
    setEditingUsuario(formData);
    setIsFormOpen(true);
    onUsuarioEdit(usuario);
  };

  // ✅ ACTUALIZADO: Manejar envío del formulario con API real
  const handleFormSubmit = async (formData: UsuarioFormData) => {
    setFormLoading(true);
    try {
      console.log('🔄 Enviando datos del usuario:', formData);

      if (formData.cdUsuario && editingUsuario) {
        // Actualizar usuario existente
        await userService.updateUsuario(formData.cdUsuario, {
          dsUsuario: formData.dsUsuario,
          nombre: formData.nombre,
          apellidoP: formData.apellidoP,
          apellidoM: formData.apellidoM || '',
          dni: formData.dni,
          email: formData.email,
          cdRol: formData.cdRol
        });
        console.log('✅ Usuario actualizado exitosamente');
      } else {
        // Crear nuevo usuario
        await userService.createUsuario({
          dsUsuario: formData.dsUsuario,
          claveUsuario: formData.claveUsuario || 'password123', // Contraseña temporal
          nombre: formData.nombre,
          apellidoP: formData.apellidoP,
          apellidoM: formData.apellidoM || '',
          dni: formData.dni,
          email: formData.email,
          cdRol: formData.cdRol
        });
        console.log('✅ Usuario creado exitosamente');
      }

      // Recargar la lista de usuarios
      await cargarUsuarios();

      setFormLoading(false);
      setIsFormOpen(false);
    } catch (err) {
      console.error('❌ Error guardando usuario:', err);
      setFormLoading(false);
      // Aquí podrías mostrar un mensaje de error al usuario
      alert(err instanceof Error ? err.message : 'Error al guardar usuario');
    }
  };

  // ✅ ACTUALIZADO: Manejar cambio de estado con API real
  const handleUsuarioToggleStatus = async (cdUsuario: string, nuevoEstado: boolean) => {
    try {
      setUsuariosLoading(true);
      console.log(`🔄 Cambiando estado del usuario ${cdUsuario} a ${nuevoEstado}`);

      if (nuevoEstado) {
        // Activar/Desbloquear usuario
        await userService.desbloquearUsuario(cdUsuario);
      } else {
        // Desactivar/Bloquear usuario  
        await userService.bloquearUsuario(cdUsuario, "Desactivado por el administrador");
      }

      console.log('✅ Estado cambiado exitosamente');

      // Recargar usuarios para reflejar el cambio
      await cargarUsuarios();

      onUsuarioToggleStatus(cdUsuario, nuevoEstado);
    } catch (err) {
      console.error('❌ Error cambiando estado:', err);
      setUsuariosLoading(false);
      alert(err instanceof Error ? err.message : 'Error al cambiar estado del usuario');
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingUsuario(undefined);
  };

  const isEditing = !!editingUsuario;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Principal */}
      <div className="
        flex flex-col sm:flex-row
        items-start sm:items-center
        justify-between
        gap-4
        p-6
        bg-gradient-to-r from-cyan-50/50 to-blue-50/30
        rounded-2xl
        border border-cyan-200/40
      ">
        <div className="flex-1 min-w-0">
          <h2 className="
            text-2xl sm:text-3xl
            font-bold
            bg-gradient-to-r from-cyan-700 to-blue-700
            bg-clip-text text-transparent
          ">
            Gestión de Usuarios
          </h2>
          <p className="text-slate-600 mt-1">
            Administra los usuarios del sistema de soporte TI
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <ExportButton
            onExport={handleExport}
            loading={exportLoading}
          />

          <button
            onClick={handleCreateUser}
            className="
              px-6 py-3
              bg-gradient-to-r from-cyan-500 to-blue-600
              hover:from-cyan-600 hover:to-blue-700
              text-white font-medium
              rounded-xl
              shadow-lg shadow-cyan-500/25
              hover:shadow-xl hover:shadow-cyan-500/35
              transition-all duration-300
              transform hover:scale-105
              flex items-center space-x-2
              whitespace-nowrap
            "
            type="button"
          >
            <span className="text-lg">+</span>
            <span>Crear Usuario</span>
          </button>
        </div>
      </div>

      {/* ✅ NUEVO: Mostrar error si existe */}
      {error && (
        <div className="error-message">
          ❌ Error: {error}
          <button onClick={cargarUsuarios} className="retry-button">
            Reintentar
          </button>
        </div>
      )}

      {/* Filtros */}
      <UsersFilters
        roles={roles}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Resumen */}
      <div className="
        px-4 py-3
        bg-cyan-50/50
        border border-cyan-200/40
        rounded-xl
        text-sm text-cyan-700
      ">
        <p>
          Mostrando <span className="font-semibold">{filteredUsuarios.length}</span> de{' '}
          <span className="font-semibold">{usuarios.length}</span> usuarios
          {filters.searchTerm && (
            <> para "<span className="font-semibold">{filters.searchTerm}</span>"</>
          )}
        </p>
      </div>

      {/* Tabla */}
      <EnhancedUsersTable
        usuarios={filteredUsuarios}
        onEdit={handleEditUser}
        onToggleStatus={handleUsuarioToggleStatus}
        loading={usuariosLoading || loading}
      />

      {/* Modal de Formulario */}
      <UserForm
        usuario={editingUsuario}
        roles={roles}
        isOpen={isFormOpen}
        isEditing={isEditing}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        loading={formLoading}
      />
    </div>
  );

  // return (
  //   <div className="users-management">
  //     <div className="section-header">
  //       <h2 className="section-title">Gestión de Usuarios</h2>
  //       <div className="header-actions">
  //         <ExportButton 
  //           onExport={handleExport}
  //           loading={exportLoading}
  //         />
  //         <button
  //           onClick={handleCreateUser}
  //           className="create-button"
  //           type="button"
  //         >
  //           + Crear Usuario
  //         </button>
  //       </div>
  //     </div>

  //     <UsersFilters
  //       roles={roles}
  //       filters={filters}
  //       onFiltersChange={handleFiltersChange}
  //     />

  //     <div className="users-summary">
  //       <p>
  //         Mostrando {filteredUsuarios.length} de {usuarios.length} usuarios
  //         {filters.searchTerm && ` para "${filters.searchTerm}"`}
  //       </p>
  //     </div>

  //     {/* REEMPLANZADO UsersTable con EnhancedUsersTable */}
  //     <EnhancedUsersTable
  //       usuarios={filteredUsuarios}
  //       onEdit={handleEditUser}
  //       onToggleStatus={onUsuarioToggleStatus}
  //       loading={loading}
  //     />

  //     <UserForm
  //       usuario={editingUsuario}
  //       roles={roles}
  //       isOpen={isFormOpen}
  //       isEditing={isEditing}
  //       onSubmit={handleFormSubmit}
  //       onCancel={handleFormCancel}
  //       loading={formLoading}
  //     />
  //   </div>
  // );
};