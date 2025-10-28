import React, { useState, useMemo } from 'react';
import type {ModuloFilters, ModuloFormData } from '../../../../types/admin.types';
import { ModulesFilters } from './modulesFilters';
import { EnhancedModulesTable } from './enhancedModulesTable';
import { ModuleForm } from './moduleForm';
import { ExportButton } from '../../../../components/shared/exportButton';
import type { ModulesManagementProps } from './ModulesManagement.types';

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
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          modulo.dsModulo.toLowerCase().includes(searchLower) ||
          modulo.cdModulo.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

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
    <div className="space-y-6 animate-fade-in">
      {/* Header Principal */}
      <div className="
        flex flex-col sm:flex-row
        items-start sm:items-center
        justify-between
        gap-4
        p-6
        bg-gradient-to-r from-emerald-50/50 to-green-50/30
        rounded-2xl
        border border-emerald-200/40
      ">
        <div className="flex-1 min-w-0">
          <h2 className="
            text-2xl sm:text-3xl
            font-bold
            bg-gradient-to-r from-emerald-700 to-green-700
            bg-clip-text text-transparent
          ">
            Gestión de Módulos
          </h2>
          <p className="text-slate-600 mt-1">
            Administra los módulos y funcionalidades del sistema
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <ExportButton 
            onExport={handleExport}
            loading={exportLoading}
          />
          
          <button
            onClick={handleCreateModule}
            className="
              px-6 py-3
              bg-gradient-to-r from-emerald-500 to-green-600
              hover:from-emerald-600 hover:to-green-700
              text-white font-medium
              rounded-xl
              shadow-lg shadow-emerald-500/25
              hover:shadow-xl hover:shadow-emerald-500/35
              transition-all duration-300
              transform hover:scale-105
              flex items-center space-x-2
              whitespace-nowrap
            "
            type="button"
          >
            <span className="text-lg">+</span>
            <span>Crear Módulo</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <ModulesFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Resumen */}
      <div className="
        px-4 py-3
        bg-emerald-50/50
        border border-emerald-200/40
        rounded-xl
        text-sm text-emerald-700
      ">
        <p>
          Mostrando <span className="font-semibold">{filteredModulos.length}</span> de{' '}
          <span className="font-semibold">{modulos.length}</span> módulos
          {filters.searchTerm && (
            <> para "<span className="font-semibold">{filters.searchTerm}</span>"</>
          )}
        </p>
      </div>

      {/* Tabla */}
      <EnhancedModulesTable
        modulos={filteredModulos}
        onEdit={handleEditModule}
        onToggleEdicion={onModuloToggleEdicion}
        loading={loading}
      />

      {/* Modal de Formulario */}
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