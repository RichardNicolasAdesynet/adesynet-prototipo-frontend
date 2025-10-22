import React, { useState, useMemo } from 'react';
import type { RolesManagementProps, RolFilters, RolFormData } from '../../../../types/admin.types';
import { RolesFilters } from './rolesFilters';
import { EnhancedRolesTable } from './enhancedRolesTable';
import { RoleForm } from './roleForm';
import { ExportButton } from '../../../../components/shared/exportButton';

export const RolesManagement: React.FC<RolesManagementProps> = ({
  roles,
  onRolEdit,
  onRolCreate,
  onRolToggleStatus,
  onFiltersChange,
  loading = false
}) => {
  const [filters, setFilters] = useState<RolFilters>({});
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingRol, setEditingRol] = useState<RolFormData | undefined>();
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  // Filtrar roles basado en los filtros
  const filteredRoles = useMemo(() => {
    return roles.filter(rol => {
      // Filtro por término de búsqueda
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          rol.nombre.toLowerCase().includes(searchLower) ||
          rol.descripcion.toLowerCase().includes(searchLower) ||
          rol.cdRol.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Filtro por estado
      if (filters.activo !== undefined && rol.activo !== filters.activo) {
        return false;
      }

      return true;
    });
  }, [roles, filters]);

  const handleFiltersChange = (newFilters: RolFilters) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCreateRole = () => {
    setEditingRol(undefined);
    setIsFormOpen(true);
    onRolCreate();
  };

  const handleEditRole = (rol: any) => {
    const formData: RolFormData = {
      cdRol: rol.cdRol,
      nombre: rol.nombre,
      descripcion: rol.descripcion,
      activo: rol.activo
    };
    setEditingRol(formData);
    setIsFormOpen(true);
    onRolEdit(rol);
  };

  const handleFormSubmit = async (formData: RolFormData) => {
    setFormLoading(true);
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Datos del formulario rol:', formData);
    setFormLoading(false);
    setIsFormOpen(false);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingRol(undefined);
  };

  const handleExport = async (formato: 'excel' | 'pdf') => {
    setExportLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Exportando ${roles.length} roles a ${formato}`);
    setExportLoading(false);
  };

  const isEditing = !!editingRol;

  return (
    <div className="roles-management">
      <div className="section-header">
        <h2 className="section-title">Gestión de Roles</h2>
        <div className="header-actions">
          <ExportButton 
            onExport={handleExport}
            loading={exportLoading}
          />
          <button
            onClick={handleCreateRole}
            className="create-button"
            type="button"
          >
            + Crear Rol
          </button>
        </div>
      </div>

      <RolesFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <div className="roles-summary">
        <p>
          Mostrando {filteredRoles.length} de {roles.length} roles
          {filters.searchTerm && ` para "${filters.searchTerm}"`}
        </p>
      </div>

      <EnhancedRolesTable
        roles={filteredRoles}
        onEdit={handleEditRole}
        onToggleStatus={onRolToggleStatus}
        loading={loading}
      />

      <RoleForm
        rol={editingRol}
        isOpen={isFormOpen}
        isEditing={isEditing}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        loading={formLoading}
      />
    </div>
  );
};