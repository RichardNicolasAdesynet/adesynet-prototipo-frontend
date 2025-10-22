import React, { useState, useMemo } from 'react';
import type { ModulesManagementProps, ModuloFilters, ModuloFormData } from '../../../../types/admin.types';
import { ModulesFilters } from './modulesFilters';
import { EnhancedModulesTable } from './enhancedModulesTable';
import { ModuleForm } from './moduleForm';
import { ExportButton } from '../../../../components/shared/exportButton';

export const ModulesManagement: React.FC<ModulesManagementProps> = ({
  modulos,
  onModuloEdit,
  onModuloCreate,
  onModuloToggleEdicion,
  onFiltersChange,
  loading = false
}) => {
  const [filters, setFilters] = useState<ModuloFilters>({});
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingModulo, setEditingModulo] = useState<ModuloFormData | undefined>();
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  // Filtrar módulos basado en los filtros
  const filteredModulos = useMemo(() => {
    return modulos.filter(modulo => {
      // Filtro por término de búsqueda
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          modulo.dsModulo.toLowerCase().includes(searchLower) ||
          modulo.cdModulo.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Filtro por edición
      if (filters.flgEdicion !== undefined && modulo.flgEdicion !== filters.flgEdicion) {
        return false;
      }

      return true;
    });
  }, [modulos, filters]);

  const handleFiltersChange = (newFilters: ModuloFilters) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCreateModule = () => {
    setEditingModulo(undefined);
    setIsFormOpen(true);
    onModuloCreate();
  };

  const handleEditModule = (modulo: any) => {
    const formData: ModuloFormData = {
      cdModulo: modulo.cdModulo,
      dsModulo: modulo.dsModulo,
      flgEdicion: modulo.flgEdicion
    };
    setEditingModulo(formData);
    setIsFormOpen(true);
    onModuloEdit(modulo);
  };

  const handleFormSubmit = async (formData: ModuloFormData) => {
    setFormLoading(true);
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Datos del formulario módulo:', formData);
    setFormLoading(false);
    setIsFormOpen(false);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingModulo(undefined);
  };

  const handleExport = async (formato: 'excel' | 'pdf') => {
    setExportLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Exportando ${modulos.length} módulos a ${formato}`);
    setExportLoading(false);
  };

  const isEditing = !!editingModulo;

  return (
    <div className="modules-management">
      <div className="section-header">
        <h2 className="section-title">Gestión de Módulos</h2>
        <div className="header-actions">
          <ExportButton 
            onExport={handleExport}
            loading={exportLoading}
          />
          <button
            onClick={handleCreateModule}
            className="create-button"
            type="button"
          >
            + Crear Módulo
          </button>
        </div>
      </div>

      <ModulesFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <div className="modules-summary">
        <p>
          Mostrando {filteredModulos.length} de {modulos.length} módulos
          {filters.searchTerm && ` para "${filters.searchTerm}"`}
        </p>
      </div>

      <EnhancedModulesTable
        modulos={filteredModulos}
        onEdit={handleEditModule}
        onToggleEdicion={onModuloToggleEdicion}
        loading={loading}
      />

      <ModuleForm
        modulo={editingModulo}
        isOpen={isFormOpen}
        isEditing={isEditing}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        loading={formLoading}
      />
    </div>
  );
};