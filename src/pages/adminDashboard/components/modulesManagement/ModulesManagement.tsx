import React, { useState, useMemo, useEffect } from 'react';
import type { ModuloFilters, ModuloFormData } from '../../../../types/admin.types';
import { ModulesFilters } from './modulesFilters';
import { EnhancedModulesTable } from './enhancedModulesTable';
import { ModuleForm } from './moduleForm';
import { ExportButton } from '../../../../components/shared/exportButton';
import type { ModulesManagementProps } from './ModulesManagement.types';
import { modulosService } from '../../../../services/api/modulosService';
import { useAlert } from '../../../../context/AlertContext';

export const ModulesManagement: React.FC<ModulesManagementProps> = ({ 
  loading = false
}) => {
  const { showAlert } = useAlert();
  const [filters, setFilters] = useState<ModuloFilters>({});
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingModulo, setEditingModulo] = useState<ModuloFormData | undefined>();
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  //uso de modulos de la api
  const [modulos, setModulos] = useState<any[]>([]);
  const [modulosLoading, setModulosLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarModulos();
  }, [])

  const cargarModulos = async () => {
    try {
      setModulosLoading(true);
      setError(null);
      const modulosPaginadosReales = await modulosService.getAllModulos();
      const modulosReales: any[] = modulosPaginadosReales.data;
      setModulos(modulosReales);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error al cargar modulos';
      setError(errorMsg);
      showAlert('error', 'Error al cargar', errorMsg);
    } finally {
      setModulosLoading(false);
    }
  }


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
  };

  const handleCreateModule = () => {
    setEditingModulo(undefined);
    setIsFormOpen(true);
  };

  const handleEditModule = async (modulo: any) => {
    const { cdModulo, dsModulo, flgEdicion } = await modulosService.getModulo(modulo.cdModulo);
    const formData: ModuloFormData = {
      cdModulo: cdModulo,
      dsModulo: dsModulo,
      flgEdicion: flgEdicion
    };
    setEditingModulo(formData);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: ModuloFormData) => {
    setFormLoading(true);
    try {
      if (formData.cdModulo && editingModulo) {
        await modulosService.updateModulo(formData.cdModulo , {
          dsModulo: formData.dsModulo,
          flgEdicion : formData.flgEdicion
        });
        showAlert('success', ' Exito' , 'Modulo actualizado correctamente');
      } else {
        await modulosService.createModulo({
          dsModulo: formData.dsModulo,
          flgEdicion: formData.flgEdicion
        });
        showAlert('success', 'Existo', 'Modulo creado correctamente');
      }

      await cargarModulos();
      setFormLoading(false);
      setIsFormOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Error desconocido al guardar el modulo';

      showAlert('error', 'Error al guardar', errorMessage);
    }finally {
      setFormLoading(false);
    }
  };

  const handleModuloToggleStatus = async (cdModulo: string, editable : boolean) => {
    try {
        setModulosLoading(true);
        const {dsModulo} = await modulosService.getModulo(cdModulo);
        if(editable){
          await modulosService.updateModulo(cdModulo,{dsModulo: dsModulo, flgEdicion:editable});
          showAlert('success', 'Modulo editable', 'El modulo permite la edicion');
        }else{
          await modulosService.updateModulo(cdModulo,{dsModulo: dsModulo, flgEdicion:editable});
          showAlert('warning', 'Modulo NO editable', 'El modulo NO permite la edicion');
        }
        await cargarModulos();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cambiar estado';
      showAlert('error', 'Error', errorMessage);
    } finally {
      setModulosLoading(false);
    }
  }

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
      {/* ✅ NUEVO: Mostrar error si existe */}
      {error && (
        <div className="error-message">
          ❌ Error: {error}
          <button onClick={cargarModulos} className="retry-button">
            Reintentar
          </button>
        </div>
      )}

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
        onToggleEdicion={handleModuloToggleStatus}
        loading={modulosLoading || loading}
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