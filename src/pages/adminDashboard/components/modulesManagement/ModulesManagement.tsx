import React, { useState, useMemo, useEffect } from 'react';
import type { ModuloFilters, ModuloFormData } from '../../../../types/admin.types';
import { ModulesFilters } from './modulesFilters';
import { EnhancedModulesTable } from './enhancedModulesTable';
import { ModuleForm } from './moduleForm';
import { ExportButton } from '../../../../components/shared/exportButton';
import type { ModulesManagementProps } from './ModulesManagement.types';
import { modulosService } from '../../../../services/api/modulosService';
import { useAlert } from '../../../../context/AlertContext';

interface accesosNombre {
  cdRol: string;
  rolNombre: string;
  moduloHabilitado: boolean;
  cantidadPermisos: number;
}

export const ModulesManagement: React.FC<ModulesManagementProps> = ({
  loading = false
}) => {
  const { showAlert } = useAlert();
  const [filters, setFilters] = useState<ModuloFilters>({});
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingModulo, setEditingModulo] = useState<ModuloFormData | undefined>();
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  //Modal de confirmacion para modulos
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [loadingDeleteInfo, setLoadingDeleteInfo] = useState<boolean>(false);
  const [moduloToDelete, setModuloToDelete] = useState<any>(null);
  const [moduloConRole, setModuloConRole] = useState<any>(null);
  const [puedeEliminar, setPuedeEliminar] = useState<boolean>(true);
  const [detalleModuloConRole, setDetalleModuloConRole] = useState<accesosNombre[]>([])

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

  const obtenerInfoEliminacion = async (cdModulo: string) => {
    try {
      setLoadingDeleteInfo(true);

      const respuesta = await modulosService.getModulo(cdModulo);
      const rolesConAcceso = respuesta.cantidadRolesConAcceso;
      const accesosNombre: accesosNombre[] | undefined = respuesta.accesos;
      setDetalleModuloConRole(accesosNombre || [])
      // if(rolesConAcceso>0 && accesosNombre){
      //   console.log(accesosNombre);
      //   const nombreRoles = accesosNombre.map(rol => rol.rolNombre);
      //   console.log(nombreRoles);
      //   setDetalleModuloConRole(nombreRoles);
      // }

      return {
        modulosConRoles: rolesConAcceso,
        puedeEliminar: rolesConAcceso == 0,
      }
    } catch (error) {
      console.error('Error al obtener información de accesos:', error);
      return {
        modulosConRoles: 0,
        puedeEliminar: false
      }
    } finally {
      setLoadingDeleteInfo(false);
    }
  }

  const handleDeleteModule = async (cdModulo: string) => {
    setModuloToDelete(cdModulo);
    const infoEliminacion = await obtenerInfoEliminacion(cdModulo);
    setModuloConRole(infoEliminacion.modulosConRoles);
    setPuedeEliminar(infoEliminacion.puedeEliminar);
    setDeleteModalOpen(true);
  }

  const handleConfirmDeleteModule = async () => {
    if (!moduloToDelete) return;
    try {
      await modulosService.deleteModulo(moduloToDelete);
      showAlert('warning', 'Modulo Eliminado', 'Modulo eliminado de la Base de datos');
      await cargarModulos();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al guardar el rol';
      showAlert('error', 'No se puede eliminar', errorMessage);
    } finally {
      setDeleteModalOpen(false);
      setModuloToDelete(null);
      setModuloConRole(0);
      setDetalleModuloConRole([]);
    }
  }

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setModuloToDelete(null);
    setModuloConRole(0);
    setDetalleModuloConRole([]);
  }


  const handleFormSubmit = async (formData: ModuloFormData) => {
    setFormLoading(true);
    try {
      if (formData.cdModulo && editingModulo) {
        await modulosService.updateModulo(formData.cdModulo, {
          dsModulo: formData.dsModulo,
          flgEdicion: formData.flgEdicion
        });
        showAlert('success', ' Exito', 'Modulo actualizado correctamente');
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
    } finally {
      setFormLoading(false);
    }
  };

  const handleModuloToggleStatus = async (cdModulo: string, editable: boolean) => {
    try {
      setModulosLoading(true);
      const { dsModulo } = await modulosService.getModulo(cdModulo);
      if (editable) {
        await modulosService.updateModulo(cdModulo, { dsModulo: dsModulo, flgEdicion: editable });
        showAlert('success', 'Modulo editable', 'El modulo permite la edicion');
      } else {
        await modulosService.updateModulo(cdModulo, { dsModulo: dsModulo, flgEdicion: editable });
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
        onDelete={handleDeleteModule}
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
      {/**Modal de confirmaciond de eliminacion */}
      {deleteModalOpen && (
        <div className="
          fixed inset-0
          bg-black/50
          backdrop-blur-sm
          flex items-center justify-center
          p-4
          z-50
          animate-fade-in
        ">
          <div className="
            bg-white
            rounded-2xl
            shadow-2xl
            w-full max-w-md
            animate-scale-in
          ">
            {/* Header del Modal */}
            <div className="
              bg-gradient-to-r from-red-500 to-orange-500
              px-6 py-4
              flex items-center space-x-3
            ">
              <div className="
                w-10 h-10
                bg-white/20
                rounded-lg
                flex items-center justify-center
                text-white text-xl
              ">
                ⚠️</div>
              <div>
                <h2 className="text-xl font-bold text-white">Confirmar Eliminacion</h2>
                <p className='text-white/80 text-sm'>Eliminacion permanente</p>
              </div>
            </div >
            {/* Contenido del Modal */}
            <div className="p-6">
              {loadingDeleteInfo ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                </div>
              ) : (
                <>
                  <p className="text-slate-700 mb-4">
                    ¿Estas seguro de querer eliminar este Modulo {'  '}
                    <span className="font-bold text-red-600">{moduloToDelete}</span>
                  </p>
                  {/* BLOQUEO si tiene roles asociados */}
                  {moduloConRole > 0 && (
                    <div className="
                      bg-red-50
                      border border-red-200
                      rounded-lg
                      p-4
                      mb-4
                    ">
                      <div className="flex items-center space-x-2 text-red-800 mb-2">
                        <span>🚫</span>
                        <span className="font-semibold">No se puede eliminar</span>
                      </div>
                      <p className="text-red-700 text-sm">
                        Este modulo esta asignado a <span> {moduloConRole} roles(s)</span>.
                        Para eliminar este modulo, primero debe quitar los roles asociados a este en el apartado de "Accesos"
                      </p>
                      <div className="flex items-center space-x-2 text-red-800 mb-2 py-3">
                        <h2 className="font-bold">Role(s) Asociados:</h2>
                        <ul>
                          {detalleModuloConRole.map(rol => (
                            <li key={rol.cdRol}
                              className="
                                flex items-center justify-center
                                py-2
                                px-3
                                m-1
                                bg-gradient-to-r from-red-500 to-orange-300
                                rounded-lg
                              text-white text-sm
                              "
                            >
                              {rol.rolNombre}
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  )}

                  {/* INFORMACIÓN si no tiene relaciones */}
                  {moduloConRole === 0 && (
                    <div className="
                      bg-blue-50
                      border border-blue-200
                      rounded-lg
                      p-3
                      mb-4
                    ">
                      <p className="text-blue-700 text-sm flex items-center space-x-2">
                        <span>ℹ️</span>
                        <span>Este Modulo no esta asociado a ningun rol</span>
                      </p>
                    </div>
                  )}
                  <div className="
                    bg-red-50
                    border border-red-200
                    rounded-lg
                    p-3
                    mt-3
                  ">
                    <p className="text-red-700 text-sm flex items-center space-x-2">
                      <span>🚨</span>
                      <span>Esta acción no se puede deshacer.</span>
                    </p>
                  </div>
                </>
              )}
            </div>
            {/* Footer del Modal*/}
            <div className="
              px-6 py-4
              border-t border-slate-200
             bg-slate-50
              flex items-center justify-end space-x-3
            ">
              <button
                onClick={handleCancelDelete}
                className="
                  px-6 py-2
                  border border-slate-300
                 text-slate-700
                  rounded-lg
                  font-medium
                 hover:bg-slate-50
                 hover:border-slate-400
                  transition-all duration-200
                "
                type="button"
              >
                {puedeEliminar ? 'Cancelar' : 'Entendido'}
              </button>
              {puedeEliminar && (
                <button
                  onClick={handleConfirmDeleteModule}
                  className="
                    px-6 py-2
                    bg-gradient-to-r from-red-500 to-orange-500
                   hover:from-red-600 hover:to-orange-600
                   text-white font-medium
                    rounded-lg
                    shadow-lg shadow-red-500/25
                    hover:shadow-xl hover:shadow-red-500/35
                    transition-all duration-300
                    flex items-center space-x-2
                  "
                  type="button"
                >
                  <span>🗑️</span>
                  <span>Eliminar Modulo</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}


    </div>
  );
};