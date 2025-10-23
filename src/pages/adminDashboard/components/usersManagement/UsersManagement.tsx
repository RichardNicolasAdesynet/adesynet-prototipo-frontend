import React, { useState, useMemo } from 'react';
import type { UsersManagementProps, UsuarioFilters, UsuarioFormData } from '../../../../types/admin.types';
import { UsersFilters } from './usersFilters';
import { EnhancedUsersTable } from './enhancedUsersTable';
import { UserForm } from './userForm';
import { ExportButton } from '../../../../components/shared/exportButton';

export const UsersManagement: React.FC<UsersManagementProps> = ({
  usuarios,
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
  const [exportLoading, setExportLoading] = useState(false);

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
    // Simular exportación
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Exportando ${usuarios.length} usuarios a ${formato}`);
    setExportLoading(false);
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

  const handleFormSubmit = async (formData: UsuarioFormData) => {
    setFormLoading(true);
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Datos del formulario:', formData);
    setFormLoading(false);
    setIsFormOpen(false);
    // Aquí luego llamarás a la API real
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
        onToggleStatus={onUsuarioToggleStatus}
        loading={loading}
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