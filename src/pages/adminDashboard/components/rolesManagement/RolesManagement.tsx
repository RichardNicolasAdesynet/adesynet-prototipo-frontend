import React, { useState, useEffect } from 'react';
import { useAlert } from '../../../../context/AlertContext';
import type { RolesManagementProps } from './RolesManagement.types';
import { RolesFilters } from './rolesFilters';
import { EnhancedRolesTable } from './enhancedRolesTable';

export const RolesManagement: React.FC<RolesManagementProps> = ({
  onRolEdit,
  onRolCreate,
  onFiltersChange,
  loading = false
}) => {
  const [roles, setRoles] = useState<any[]>([]);
  const [filters, setFilters] = useState({});
  const { showAlert } = useAlert();

  // ✅ SOLO estructura principal - subcomponentes existen
  useEffect(() => {
    cargarRoles();
  }, [filters]);

  const cargarRoles = async () => {
    try {
      // Simulación temporal - se conectará con servicio real
      const rolesSimulados = [
        {
          cdRol: 'ROL01',
          nombre: 'Administrador',
          descripcion: 'Acceso completo al sistema',
          activo: true,
          cantidadUsuarios: 3,
          cantidadAccesos: 5
        }
      ];
      setRoles(rolesSimulados);
    } catch (error) {
      console.error('Error cargando roles:', error);
      showAlert('error', 'Error', 'No se pudieron cargar los roles');
    }
  };

  const manejarToggleStatus = async (cdRol: string, nuevoEstado: boolean) => {
    try {
      // Lógica temporal
      console.log(`Cambiando estado del rol ${cdRol} a ${nuevoEstado}`);
      showAlert('success', 'Éxito', 'Estado del rol actualizado');
      
      setRoles(prev => prev.map(rol => 
        rol.cdRol === cdRol ? { ...rol, activo: nuevoEstado } : rol
      ));
    } catch (error) {
      console.error('Error cambiando estado:', error);
      showAlert('error', 'Error', 'No se pudo cambiar el estado del rol');
    }
  };

  return (
    <div className="roles-management">
      <div className="page-header">
        <h1>Gestión de Roles</h1>
        <button onClick={onRolCreate} className="btn-primary">
          Crear Rol
        </button>
      </div>

      {/* ✅ Los subcomponentes específicos ya existen */}
      <RolesFilters 
        filters={filters}
        onFiltersChange={(nuevosFiltros) => {
          setFilters(nuevosFiltros);
          onFiltersChange(nuevosFiltros);
        }}
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