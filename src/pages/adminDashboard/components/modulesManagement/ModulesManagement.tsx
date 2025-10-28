import React, { useState, useEffect } from 'react';
import { modulosService } from '../../../../services/api/modulosService';
import { useAlert } from '../../../../context/AlertContext';
import type { ModulesManagementProps } from './ModulesManagement.types';
import { ModulesFilters } from './modulesFilters';
import { EnhancedModulesTable } from './enhancedModulesTable';
import type { ModuloResumen } from '../../../../types/admin.types';

export const ModulesManagement: React.FC<ModulesManagementProps> = ({
  onModuloEdit,
  onModuloCreate,
  onFiltersChange,
  loading = false
}) => {
  const [modulos, setModulos] = useState<ModuloResumen[]>([]);
  const [filters, setFilters] = useState({});
  const { showAlert } = useAlert();

  // ✅ ACTUALIZADO: Usar servicio real
  useEffect(() => {
    cargarModulos();
  }, [filters]);

  const cargarModulos = async () => {
    try {
      const modulosData = await modulosService.getModulosList(filters);
      setModulos(modulosData);
    } catch (error) {
      console.error('Error cargando módulos:', error);
      showAlert('error', 'Error', 'No se pudieron cargar los módulos');
    }
  };

  const manejarToggleEdicion = async (cdModulo: string, nuevoEstado: boolean) => {
    try {
      // ✅ ACTUALIZADO: Usar servicio real para actualizar
      // Primero obtener el módulo actual para preservar otros datos
      const moduloActual = await modulosService.getModulo(cdModulo);
      
      await modulosService.updateModulo(cdModulo, {
        dsModulo: moduloActual.dsModulo,
        flgEdicion: nuevoEstado
      });
      
      showAlert('success', 'Éxito', 'Estado de edición actualizado correctamente');
      
      // Recargar la lista
      cargarModulos();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      showAlert('error', 'Error', 'No se pudo cambiar el estado de edición');
    }
  };

  const manejarFiltrosChange = (nuevosFiltros: any) => {
    setFilters(nuevosFiltros);
    onFiltersChange(nuevosFiltros);
  };

  return (
    <div className="modules-management">
      <div className="page-header">
        <h1>Gestión de Módulos</h1>
        <button onClick={onModuloCreate} className="btn-primary">
          Crear Módulo
        </button>
      </div>

      <ModulesFilters 
        filters={filters}
        onFiltersChange={manejarFiltrosChange}
      />

      <EnhancedModulesTable
        modulos={modulos}
        onEdit={onModuloEdit}
        onToggleEdicion={manejarToggleEdicion}
        loading={loading}
      />
    </div>
  );
};