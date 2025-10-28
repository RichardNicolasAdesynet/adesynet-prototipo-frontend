import React, { useState, useEffect } from 'react';
import { rolesService } from '../../../../services/api/rolesService';
import { useAlert } from '../../../../context/AlertContext';
import type { RolesManagementProps } from './RolesManagement.types';
import { RolesFilters } from './rolesFilters';
import { EnhancedRolesTable } from './enhancedRolesTable';
import type { RolResumen } from '../../../../types/admin.types';

export const RolesManagement: React.FC<RolesManagementProps> = ({
  onRolEdit,
  onRolCreate,
  onFiltersChange,
  loading = false
}) => {
  const [roles, setRoles] = useState<RolResumen[]>([]);
  const [filters, setFilters] = useState({});
  const { showAlert } = useAlert();

  // ✅ ACTUALIZADO: Usar servicio real
  useEffect(() => {
    cargarRoles();
  }, [filters]);

  const cargarRoles = async () => {
    try {
      const rolesData = await rolesService.getRolesList(filters);
      setRoles(rolesData);
    } catch (error) {
      console.error('Error cargando roles:', error);
      showAlert('error', 'Error', 'No se pudieron cargar los roles');
    }
  };

  const manejarToggleStatus = async (cdRol: string, nuevoEstado: boolean) => {
    try {
      // ✅ ACTUALIZADO: Usar servicio real para actualizar
      await rolesService.updateRol(cdRol, {
        nombre: '', // Se obtendrá del rol existente
        descripcion: '', // Se obtendrá del rol existente  
        activo: nuevoEstado
      });
      
      showAlert('success', 'Éxito', 'Estado del rol actualizado correctamente');
      
      // Recargar la lista
      cargarRoles();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      showAlert('error', 'Error', 'No se pudo cambiar el estado del rol');
    }
  };

  const manejarFiltrosChange = (nuevosFiltros: any) => {
    setFilters(nuevosFiltros);
    onFiltersChange(nuevosFiltros);
  };

  return (
    <div className="roles-management">
      <div className="page-header">
        <h1>Gestión de Roles</h1>
        <button onClick={onRolCreate} className="btn-primary">
          Crear Rol
        </button>
      </div>

      <RolesFilters 
        filters={filters}
        onFiltersChange={manejarFiltrosChange}
      />

      <EnhancedRolesTable
        roles={roles}
        onEdit={onRolEdit}
        onToggleStatus={manejarToggleStatus}
        loading={loading}
      />
    </div>
  );
};