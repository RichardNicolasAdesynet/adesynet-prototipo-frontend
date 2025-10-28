import React, { useState, useMemo, useEffect } from 'react';
import type { RolFilters, RolFormData } from '../../../../types/admin.types';
import { RolesFilters } from './rolesFilters';
import { EnhancedRolesTable } from './enhancedRolesTable';
import { RoleForm } from './roleForm';
import { ExportButton } from '../../../../components/shared/exportButton';
import type { RolesManagementProps } from './RolesManagement.types';
import { useAlert } from '../../../../context/AlertContext';
import { rolesService } from '../../../../services/api/rolesServices';

export const RolesManagement: React.FC<RolesManagementProps> = ({
  onRolEdit,
  onRolCreate,
  onRolToggleStatus,
  onFiltersChange,
  loading = false
}) => {
  const { showAlert } = useAlert();
  const [filters, setFilters] = useState<RolFilters>({});
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingRol, setEditingRol] = useState<RolFormData | undefined>();
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  //Obtener roles de la api
  const [roles, setRoles] = useState<any[]>([]);
  const [rolesLoading, setRolesLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarRoles();
  }, []);

  const cargarRoles = async () => {
    try {
      setRolesLoading(true);
      setError(null);

      const rolesReales = await rolesService.getRolesList();

      setRoles(rolesReales);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los roles';
      setError(errorMessage);
      showAlert('error', 'Error al cargar roles', errorMessage);
    } finally {
      setRolesLoading(false);
    }

  }
  // Filtrar roles basado en los filtros
  const filteredRoles = useMemo(() => {
    return roles.filter(rol => {
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch =
          rol.nombre.toLowerCase().includes(searchLower) ||
          rol.descripcion.toLowerCase().includes(searchLower) ||
          rol.cdRol.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

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

  //enviar data a la api en base a form update | create 
  const handleFormSubmit = async (formData: RolFormData) => {
    setFormLoading(true);
    try {
      if (formData.cdRol && editingRol) {
        await rolesService.updateRol(formData.cdRol, {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
        });
        showAlert('success', 'Éxito', 'Rol actualizado correctamente');
      } else {
        //crea nuevo rol
        await rolesService.createRol({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          activo: true
        });
        showAlert('success', 'Éxito', 'Rol creado correctamente');
      }
      await cargarRoles();
      setFormLoading(false);
      setIsFormOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al guardar el rol';
      showAlert('error', 'Error al guardar', errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleRolToggleStatus = async (cdRol: string, nuevoEstado: boolean) => {
    try {
      setRolesLoading(true);
      if(nuevoEstado){
        await rolesService.updateRol(cdRol,{activo: nuevoEstado});
        showAlert('success','Rol activado', 'El rol ha sido activado correctamente');
      }else{
        await rolesService.updateRol(cdRol,{activo: nuevoEstado});
        showAlert('success','Rol activado', 'El rol ha sido activado correctamente');
      }
      await cargarRoles();
      onRolToggleStatus(cdRol,nuevoEstado);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message: 'Error al cambiar de estado al rol';
      showAlert('error', 'Error', errorMessage);
    } finally {
      setRolesLoading(false);
    }
  }

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
    <div className="space-y-6 animate-fade-in">
      {/* Header Principal */}
      <div className="
        flex flex-col sm:flex-row
        items-start sm:items-center
        justify-between
        gap-4
        p-6
        bg-gradient-to-r from-purple-50/50 to-indigo-50/30
        rounded-2xl
        border border-purple-200/40
      ">
        <div className="flex-1 min-w-0">
          <h2 className="
            text-2xl sm:text-3xl
            font-bold
            bg-gradient-to-r from-purple-700 to-indigo-700
            bg-clip-text text-transparent
          ">
            Gestión de Roles
          </h2>
          <p className="text-slate-600 mt-1">
            Administra los roles y permisos del sistema
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <ExportButton
            onExport={handleExport}
            loading={exportLoading}
          />

          <button
            onClick={handleCreateRole}
            className="
              px-6 py-3
              bg-gradient-to-r from-purple-500 to-indigo-600
              hover:from-purple-600 hover:to-indigo-700
              text-white font-medium
              rounded-xl
              shadow-lg shadow-purple-500/25
              hover:shadow-xl hover:shadow-purple-500/35
              transition-all duration-300
              transform hover:scale-105
              flex items-center space-x-2
              whitespace-nowrap
            "
            type="button"
          >
            <span className="text-lg">+</span>
            <span>Crear Rol</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <RolesFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Resumen */}
      <div className="
        px-4 py-3
        bg-purple-50/50
        border border-purple-200/40
        rounded-xl
        text-sm text-purple-700
      ">
        <p>
          Mostrando <span className="font-semibold">{filteredRoles.length}</span> de{' '}
          <span className="font-semibold">{roles.length}</span> roles
          {filters.searchTerm && (
            <> para "<span className="font-semibold">{filters.searchTerm}</span>"</>
          )}
        </p>
      </div>

      {/* Tabla */}
      <EnhancedRolesTable
        roles={filteredRoles}
        onEdit={handleEditRole}
        onToggleStatus={handleRolToggleStatus}
        loading={loading}
      />

      {/* Modal de Formulario */}
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

