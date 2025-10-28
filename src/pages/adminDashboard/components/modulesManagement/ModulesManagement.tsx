import React, { useState, useEffect } from 'react';
import { useAlert } from '../../../../context/AlertContext';
import type { ModulesManagementProps } from './ModulesManagement.types';
import { ModulesFilters } from './modulesFilters';
import { EnhancedModulesTable } from './enhancedModulesTable';

export const ModulesManagement: React.FC<ModulesManagementProps> = ({
  onModuloEdit,
  onModuloCreate,
  onFiltersChange,
  loading = false
}) => {
  const [modulos, setModulos] = useState<any[]>([]);
  const [filters, setFilters] = useState({});
  const { showAlert } = useAlert();

  // ✅ SOLO estructura principal
  useEffect(() => {
    cargarModulos();
  }, [filters]);

  const cargarModulos = async () => {
    try {
      // Simulación temporal
      const modulosSimulados = [
        {
          cdModulo: 'MOD01',
          dsModulo: 'Gestión de Usuarios',
          flgEdicion: true,
          cantidadAccesos: 3,
          cantidadRolesConAcceso: 2
        }
      ];
      setModulos(modulosSimulados);
    } catch (error) {
      console.error('Error cargando módulos:', error);
      showAlert('error', 'Error', 'No se pudieron cargar los módulos');
    }
  };

  const manejarToggleEdicion = async (cdModulo: string, nuevoEstado: boolean) => {
    try {
      console.log(`Cambiando edición del módulo ${cdModulo} a ${nuevoEstado}`);
      showAlert('success', 'Éxito', 'Estado de edición actualizado');
      
      setModulos(prev => prev.map(modulo => 
        modulo.cdModulo === cdModulo ? { ...modulo, flgEdicion: nuevoEstado } : modulo
      ));
    } catch (error) {
      console.error('Error cambiando estado:', error);
      showAlert('error', 'Error', 'No se pudo cambiar el estado de edición');
    }
  };

  return (
    <div className="modules-management">
      <div className="page-header">
        <h1>Gestión de Módulos</h1>
        <button onClick={onModuloCreate} className="btn-primary">
          Crear Módulo
        </button>
      </div>

      {/* ✅ Subcomponentes modulares existentes */}
      <ModulesFilters 
        filters={filters}
        onFiltersChange={(nuevosFiltros) => {
          setFilters(nuevosFiltros);
          onFiltersChange(nuevosFiltros);
        }}
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