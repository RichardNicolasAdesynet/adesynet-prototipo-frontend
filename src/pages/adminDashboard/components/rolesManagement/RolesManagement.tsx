import React, { useState, useMemo, useEffect } from 'react';
import { calcularPageSize, type RolFilters, type RolFormData } from '../../../../types/admin.types';
import { RolesFilters } from './rolesFilters';
import { EnhancedRolesTable } from './enhancedRolesTable';
import { RoleForm } from './roleForm';
import { ExportButton } from '../../../../components/shared/exportButton';
import type { RolesManagementProps } from './RolesManagement.types';
import { useAlert } from '../../../../context/AlertContext';
import { rolesService } from '../../../../services/api/rolesServices';
import { accesosService } from '../../../../services/api/accesosService';

export const RolesManagement: React.FC<RolesManagementProps> = ({
  loading = false
}) => {
  const { showAlert } = useAlert();
  const [filters, setFilters] = useState<RolFilters>({});
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingRol, setEditingRol] = useState<RolFormData | undefined>();
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  // Estados para el modal de confirmación
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [rolToDelete, setRolToDelete] = useState<any>(null);
  const [modulosConAcceso, setModulosConAcceso] = useState<number>(0);
  const [usuariosConRol, setUsuariosConRol] = useState<number>(0);
  const [puedeEliminar, setPuedeEliminar] = useState<boolean>(true);
  const [loadingDeleteInfo, setLoadingDeleteInfo] = useState<boolean>(false);

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

  // Función para obtener información de módulos con acceso usando getAllAccesos
  const obtenerInfoEliminacion = async (cdRol: string) => {
    try {
      setLoadingDeleteInfo(true);

      //preparar la data con paginacion
      const respuestaInicial = await accesosService.getAllAccesos({
        'PageRequest.page': 1,
        'PageRequest.rows': 1
      });

      const total = respuestaInicial.totalRecords || 0;
      const pageSize = calcularPageSize(total);
      const respuestaCompleta = await accesosService.getAllAccesos({
        'PageRequest.page': 1,
        'PageRequest.rows': pageSize
      });
      // Obtener todos los accesos y filtrar por el rol
      const accesosDelRol = respuestaCompleta.data.filter((acceso: any) =>
        acceso.cdRol === cdRol && acceso.moduloHabilitado
      );
      // Contar módulos únicos con acceso habilitado
      const modulosUnicos = new Set(
        accesosDelRol.map((acceso: any) => acceso.cdModulo)
      );

      const usuariosConEsteRol = await rolesService.getRol(cdRol);



      //setModulosConAcceso(modulosUnicos.size);
      console.log(accesosDelRol);

      return {
        modulosConAcceso: modulosUnicos.size,
        usuariosConRol: usuariosConEsteRol.cantidadUsuarios,
        puedeEliminar: usuariosConEsteRol.cantidadUsuarios === 0
      }
    } catch (error) {
      console.error('Error al obtener información de accesos:', error);
      return {
        modulosConAcceso: 0,
        usuariosConRol: 0,
        puedeEliminar: false
      };
      //setModulosConAcceso(0); // En caso de error, asumir 0
    } finally {
      setLoadingDeleteInfo(false);
    }
  };

  const handleDeleteRole = async (cdRol: string) => {
    setRolToDelete(cdRol);
    const infoEliminacion = await obtenerInfoEliminacion(cdRol);
    setModulosConAcceso(infoEliminacion.modulosConAcceso);
    setUsuariosConRol(infoEliminacion.usuariosConRol);
    setPuedeEliminar(infoEliminacion.puedeEliminar);
    setDeleteModalOpen(true);
  };

  const confirmDeleteRole = async () => {
    if (!rolToDelete) return;

    try {
      await rolesService.deleteRol(rolToDelete.cdRol);
      showAlert('warning', 'Rol Eliminado', 'Rol eliminado de la Base de datos');
      await cargarRoles();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar el rol';
      showAlert('error', 'No se puede eliminar', errorMessage);
    } finally {
      setDeleteModalOpen(false);
      setRolToDelete(null);
      setModulosConAcceso(0);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setRolToDelete(null);
    setModulosConAcceso(0);
  };


  const handleFiltersChange = (newFilters: RolFilters) => {
    setFilters(newFilters);
  };

  const handleCreateRole = () => {
    setEditingRol(undefined);
    setIsFormOpen(true);
  };

  const handleEditRole = async (rol: any) => {
    const { cdRol, nombre, descripcion, activo } = await rolesService.getRol(rol.cdRol);
    const formData: RolFormData = {
      cdRol: cdRol,
      nombre: nombre,
      descripcion: descripcion,
      activo: activo
    };
    setEditingRol(formData);
    setIsFormOpen(true);
  };

  // const handleDeleteRole = async (cdRol: string) => {
  //   console.log(`el rol es de ID : ${cdRol}`);
  //   try {
  //     await rolesService.deleteRol(cdRol);
  //     showAlert('warning', 'Rol Eliminado', 'Rol eliminado de la Base de datos');
  //     await cargarRoles();
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : 'Error desconocido al guardar el rol';
  //     showAlert('error', 'No se puede eliminar', errorMessage);
  //   }
  // }

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
      const getRol = await rolesService.getRol(cdRol);
      const { nombre, descripcion } = getRol;
      if (nuevoEstado) {
        await rolesService.updateRol(cdRol, { nombre: nombre, descripcion: descripcion, activo: nuevoEstado });
        showAlert('success', 'Rol activado', 'El rol ha sido activado correctamente');
      } else {
        await rolesService.updateRol(cdRol, { nombre: nombre, descripcion: descripcion, activo: nuevoEstado });
        showAlert('warning', 'Rol desactivado', 'El rol ha sido desactivado correctamente');
      }
      await cargarRoles();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cambiar de estado al rol';
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

      {/* ✅ NUEVO: Mostrar error si existe */}
      {error && (
        <div className="error-message">
          ❌ Error: {error}
          <button onClick={cargarRoles} className="retry-button">
            Reintentar
          </button>
        </div>
      )}

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
        onDelete={handleDeleteRole}
        onToggleStatus={handleRolToggleStatus}
        loading={rolesLoading || loading}
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

      {/* ✅ NUEVO: Modal de Confirmación de Eliminación */}
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
                ⚠️
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Confirmar Eliminación</h2>
                <p className="text-white/90 text-sm">Eliminación permanente</p>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6">
              {loadingDeleteInfo ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                </div>
              ) : (
                <>
                  <p className="text-slate-700 mb-4">
                    ¿Estás seguro de que deseas eliminar el rol  
                    <span className="font-bold text-red-600">"{rolToDelete}"</span>?
                  </p>
                  {/* BLOQUEO si tiene usuarios */}
                  {usuariosConRol > 0 && (
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
                        Este rol está asignado a <span className="font-bold">{usuariosConRol} usuario(s)</span>.
                        Para eliminar el rol, primero debe reasignar estos usuarios a otro rol.
                      </p>
                    </div>
                  )}

                  {/* ADVERTENCIA si tiene módulos (solo mostrar si no tiene usuarios) */}
                  {usuariosConRol === 0 && modulosConAcceso > 0 && (
                    <div className="
                        bg-amber-50
                        border border-amber-200
                        rounded-lg
                        p-4
                        mb-4
                    ">
                      <div className="flex items-center space-x-2 text-amber-800 mb-2">
                        <span>⚠️</span>
                        <span className="font-semibold">Advertencia</span>
                      </div>
                      <p className="text-amber-700 text-sm">
                        Este rol tiene <span className="font-bold">{modulosConAcceso} módulo(s)</span> con accesos configurados.
                        Al eliminar el rol, también se eliminarán todos estos accesos.
                      </p>
                    </div>
                  )}

                  {/* INFORMACIÓN si no tiene relaciones */}
                  {usuariosConRol === 0 && modulosConAcceso === 0 && (
                    <div className="
                      bg-blue-50
                        border border-blue-200
                        rounded-lg
                        p-3
                        mb-4
                      ">
                      <p className="text-blue-700 text-sm flex items-center space-x-2">
                        <span>ℹ️</span>
                        <span>Este rol no tiene usuarios asignados ni módulos con accesos.</span>
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

            {/* Footer del Modal - Deshabilitar botón si no puede eliminar */}
            <div className="
                px-6 py-4
                border-t border-slate-200
               bg-slate-50
                flex items-center justify-end space-x-3
              ">
              <button
                onClick={cancelDelete}
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
                  onClick={confirmDeleteRole}
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
                  <span>Eliminar Rol</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
