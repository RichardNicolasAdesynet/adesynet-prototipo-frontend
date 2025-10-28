import React, { useState, useEffect } from 'react';
import { rolesService } from '../../../../services/api/rolesService';
import { useAlert } from '../../../../context/AlertContext';
import type { RolesManagementProps } from './RolesManagement.types';
import { RolesFilters } from './rolesFilters/RolesFilters';
import { EnhancedRolesTable } from './enhancedRolesTable/EnhancedRolesTable';
import { RoleForm } from './roleForm/RoleForm';
import type { RolResumen, RolFormData } from '../../../../types/admin.types';

export const RolesManagement: React.FC<RolesManagementProps> = ({
  onRolEdit,
  onRolCreate,
  onFiltersChange,
  loading = false
}) => {
  const [roles, setRoles] = useState<RolResumen[]>([]);
  const [filters, setFilters] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rolEditando, setRolEditando] = useState<RolResumen | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { showAlert } = useAlert();

  // ✅ CORREGIDO: Cargar roles con filtros
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

  // ✅ CORREGIDO: Función para cambiar estado correctamente
  const manejarToggleStatus = async (cdRol: string, nuevoEstado: boolean) => {
    try {
      // Obtener el rol existente para preservar nombre y descripción
      const rolExistente = roles.find(rol => rol.cdRol === cdRol);
      
      if (!rolExistente) {
        throw new Error('Rol no encontrado');
      }

      await rolesService.updateRol(cdRol, {
        nombre: rolExistente.nombre,
        descripcion: rolExistente.descripcion,
        activo: nuevoEstado
      });
      
      showAlert('success', 'Éxito', 'Estado del rol actualizado correctamente');
      cargarRoles(); // Recargar la lista
    } catch (error) {
      console.error('Error cambiando estado:', error);
      showAlert('error', 'Error', 'No se pudo cambiar el estado del rol');
    }
  };

  // ✅ CORREGIDO: Manejo de filtros
  const manejarFiltrosChange = (nuevosFiltros: any) => {
    // Mapear filtros internos a nombres de API
    const filtrosAPI = {
      ...nuevosFiltros,
      Activo: nuevosFiltros.activo // Mapear 'activo' interno a 'Activo' de API
    };
    
    setFilters(filtrosAPI);
    onFiltersChange(nuevosFiltros);
  };

  // ✅ CORREGIDO: Manejo de creación de rol
  const manejarCrearRol = () => {
    setRolEditando(null);
    setIsEditMode(false);
    setIsFormOpen(true);
    onRolCreate(); // Llamar al callback prop
  };

  // ✅ CORREGIDO: Manejo de edición de rol
  const manejarEditarRol = (rol: RolResumen) => {
    setRolEditando(rol);
    setIsEditMode(true);
    setIsFormOpen(true);
    onRolEdit(rol); // Llamar al callback prop
  };

  // ✅ CORREGIDO: Manejo de envío de formulario
  const manejarEnviarFormulario = async (formData: RolFormData) => {
    try {
      if (isEditMode && rolEditando) {
        await rolesService.updateRol(rolEditando.cdRol, {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          activo: formData.activo
        });
        showAlert('success', 'Éxito', 'Rol actualizado correctamente');
      } else {
        await rolesService.createRol({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          activo: formData.activo
        });
        showAlert('success', 'Éxito', 'Rol creado correctamente');
      }
      
      setIsFormOpen(false);
      cargarRoles(); // Recargar lista
    } catch (error) {
      console.error('Error guardando rol:', error);
      showAlert('error', 'Error', 'No se pudo guardar el rol');
    }
  };

  return (
    <div className="roles-management">
      <div className="page-header">
        <h1>Gestión de Roles</h1>
        <button onClick={manejarCrearRol} className="btn-primary">
          Crear Rol
        </button>
      </div>

      <RolesFilters 
        filters={filters}
        onFiltersChange={manejarFiltrosChange}
      />

      <EnhancedRolesTable
        roles={roles}
        onEdit={manejarEditarRol}
        onToggleStatus={manejarToggleStatus}
        loading={loading}
      />

      {/* ✅ AGREGADO: Modal de formulario */}
      <RoleForm
        rol={rolEditando as any}
        isOpen={isFormOpen}
        isEditing={isEditMode}
        onSubmit={manejarEnviarFormulario}
        onCancel={() => setIsFormOpen(false)}
        loading={loading}
      />
    </div>
  );
};