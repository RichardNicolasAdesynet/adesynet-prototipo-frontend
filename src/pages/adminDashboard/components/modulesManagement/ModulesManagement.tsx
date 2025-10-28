import React, { useState, useEffect } from 'react';
import { modulosService } from '../../../../services/api/modulosService';
import { useAlert } from '../../../../context/AlertContext';
import type { ModulesManagementProps } from './ModulesManagement.types';
import { ModulesFilters } from './modulesFilters/ModulesFilters';
import { EnhancedModulesTable } from './enhancedModulesTable/EnhancedModulesTable';
import { ModuleForm } from './moduleForm/ModuleForm';
import type { ModuloResumen, ModuloFormData, ModuloFilters } from '../../../../types/admin.types';

export const ModulesManagement: React.FC<ModulesManagementProps> = ({
  onModuloEdit,
  onModuloCreate,
  onFiltersChange,
  loading = false
}) => {
  const [modulos, setModulos] = useState<ModuloResumen[]>([]);
  const [filters, setFilters] = useState<ModuloFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [moduloEditando, setModuloEditando] = useState<ModuloResumen | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { showAlert } = useAlert();

  // ✅ CORREGIDO: Cargar módulos con filtros
  useEffect(() => {
    cargarModulos();
  }, [filters]);

  const cargarModulos = async () => {
    try {
      // ✅ CORREGIDO: Mapear filtros correctamente con verificación de tipo
      const filtrosAPI: { Editables?: boolean } = {};
      
      if (filters.flgEdicion !== undefined) {
        filtrosAPI.Editables = filters.flgEdicion;
      }
      
      const modulosData = await modulosService.getModulosList(filtrosAPI);
      setModulos(modulosData);
    } catch (error) {
      console.error('Error cargando módulos:', error);
      showAlert('error', 'Error', 'No se pudieron cargar los módulos');
    }
  };

  // ✅ CORREGIDO: Función para cambiar estado de edición
  const manejarToggleEdicion = async (cdModulo: string, nuevoEstado: boolean) => {
    try {
      // Obtener el módulo existente para preservar la descripción
      const moduloExistente = modulos.find(modulo => modulo.cdModulo === cdModulo);
      
      if (!moduloExistente) {
        throw new Error('Módulo no encontrado');
      }

      await modulosService.updateModulo(cdModulo, {
        dsModulo: moduloExistente.dsModulo,
        flgEdicion: nuevoEstado
      });
      
      showAlert('success', 'Éxito', 'Estado de edición actualizado correctamente');
      cargarModulos(); // Recargar la lista
    } catch (error) {
      console.error('Error cambiando estado:', error);
      showAlert('error', 'Error', 'No se pudo cambiar el estado de edición');
    }
  };

  // ✅ CORREGIDO: Manejo de filtros con tipo correcto
  const manejarFiltrosChange = (nuevosFiltros: ModuloFilters) => {
    setFilters(nuevosFiltros);
    onFiltersChange(nuevosFiltros);
  };

  // ✅ CORREGIDO: Manejo de creación de módulo
  const manejarCrearModulo = () => {
    setModuloEditando(null);
    setIsEditMode(false);
    setIsFormOpen(true);
    onModuloCreate(); // Llamar al callback prop
  };

  // ✅ CORREGIDO: Manejo de edición de módulo
  const manejarEditarModulo = (modulo: ModuloResumen) => {
    setModuloEditando(modulo);
    setIsEditMode(true);
    setIsFormOpen(true);
    onModuloEdit(modulo); // Llamar al callback prop
  };

  // ✅ CORREGIDO: Manejo de envío de formulario
  const manejarEnviarFormulario = async (formData: ModuloFormData) => {
    try {
      if (isEditMode && moduloEditando) {
        await modulosService.updateModulo(moduloEditando.cdModulo, {
          dsModulo: formData.dsModulo,
          flgEdicion: formData.flgEdicion
        });
        showAlert('success', 'Éxito', 'Módulo actualizado correctamente');
      } else {
        await modulosService.createModulo({
          dsModulo: formData.dsModulo,
          flgEdicion: formData.flgEdicion
        });
        showAlert('success', 'Éxito', 'Módulo creado correctamente');
      }
      
      setIsFormOpen(false);
      cargarModulos(); // Recargar lista
    } catch (error) {
      console.error('Error guardando módulo:', error);
      showAlert('error', 'Error', 'No se pudo guardar el módulo');
    }
  };

  return (
    <div className="modules-management">
      <div className="page-header">
        <h1>Gestión de Módulos</h1>
        <button onClick={manejarCrearModulo} className="btn-primary">
          Crear Módulo
        </button>
      </div>

      <ModulesFilters 
        filters={filters}
        onFiltersChange={manejarFiltrosChange}
      />

      <EnhancedModulesTable
        modulos={modulos}
        onEdit={manejarEditarModulo}
        onToggleEdicion={manejarToggleEdicion}
        loading={loading}
      />

      {/* ✅ AGREGADO: Modal de formulario */}
      <ModuleForm
        modulo={moduloEditando as any}
        isOpen={isFormOpen}
        isEditing={isEditMode}
        onSubmit={manejarEnviarFormulario}
        onCancel={() => setIsFormOpen(false)}
        loading={loading}
      />
    </div>
  );
};