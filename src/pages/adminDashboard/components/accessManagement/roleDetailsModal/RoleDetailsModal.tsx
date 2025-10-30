import React, { useState, useEffect } from 'react';
import { permisosConfig, tiposPermisoDisponibles } from '../../../../../data/accessManagementData';
import { convertirPermisoANumero, type ModuloResumen, type RolDetallado, type TipoPermiso } from '../../../../../types/admin.types';

export interface RoleDetailsModalProps {
  roleDetail:any;
  isOpen: boolean;
  modulos: ModuloResumen[];
  onPermisoChange: (cdRol: string, cdModulo: string, tipoPermiso: TipoPermiso, asignado: boolean) => void;
  onModuloHabilitadoChange: (cdRol: string, cdModulo: string, habilitado: boolean) => void;
  onClose: () => void;
}

export const RoleDetailsModal: React.FC<RoleDetailsModalProps> = ({
  roleDetail,
  isOpen,
  modulos,
  onPermisoChange,
  onModuloHabilitadoChange,
  onClose
}) => {
  const [cambiosPendientes, setCambiosPendientes] = useState(false);
  const [accesosLocales, setAccesosLocales] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && roleDetail) {
      const accesosIniciales = modulos.map(modulo => {
        const accesoExistente = roleDetail.accesos?.find((a: any) => a.cdModulo === modulo.cdModulo);

        if (accesoExistente) {
          // Convierte los permisosNombres a permisos numéricos
          const permisosNumericos = accesoExistente.permisosNombres?.map((nombre: string) => {
            const tipoPermiso = convertirPermisoANumero(nombre);
            return tipoPermiso ? {
              tipoPermiso: tipoPermiso,
              descripcionPermiso: permisosConfig[tipoPermiso]?.descripcion || nombre,
              fecAsignacion: new Date().toISOString()
            } : null;
          }).filter(Boolean) || [];
          return { 
            ...accesoExistente,
            permisos: permisosNumericos 
          };

        }
        return {
          cdRol: roleDetail.cdRol,
          cdModulo: modulo.cdModulo,
          moduloNombre: modulo.dsModulo,
          moduloHabilitado: false,
          permisos: []
        };
      });
      //console.log(accesosIniciales);
      setAccesosLocales(accesosIniciales);
      setCambiosPendientes(false);
    } else {
      setAccesosLocales([]);
      setCambiosPendientes(false);
    }
  }, [isOpen, roleDetail, modulos]);


  const tienePermiso = (cdModulo: string, tipoPermiso: TipoPermiso) => {
    const acceso = accesosLocales.find(a => a.cdModulo === cdModulo);

    if (acceso && acceso.permisos) {
      // Lee directamente de los permisos numéricos en el estado local
      return acceso.permisos.some((p: any) => p.tipoPermiso === tipoPermiso);
    }
    // if (acceso ) {
    //   return acceso.permisosNombres?.some((permiso: string) => {
    //     const permisoNumerico = convertirPermisoANumero(permiso);
    //     return permisoNumerico === tipoPermiso;
    //   }) || false;
    // }

    return false;
  }

  const moduloEstaHabilitado = (cdModulo: string) => {
    const acceso = accesosLocales.find(a => a.cdModulo === cdModulo);
    return acceso?.moduloHabilitado || false;
  };

  const handlePermisoToggle = (cdModulo: string, tipoPermiso: TipoPermiso) => {
    const nuevosAccesos = [...accesosLocales];
    const accesoIndex = nuevosAccesos.findIndex(a => a.cdModulo === cdModulo);

    if (accesoIndex !== -1) {
      const acceso = { ...nuevosAccesos[accesoIndex] };
      const tieneElPermiso = acceso.permisos?.some((p: any) => p.tipoPermiso === tipoPermiso);

      if (tieneElPermiso) {
        acceso.permisos = acceso.permisos.filter((p: any) => p.tipoPermiso !== tipoPermiso);
      } else {
        if (!acceso.permisos) acceso.permisos = [];
        acceso.permisos.push({
          id: Date.now(),
          tipoPermiso: tipoPermiso,
          descripcionPermiso: permisosConfig[tipoPermiso].descripcion,
          fecAsignacion: new Date().toISOString()
        });
      }

      nuevosAccesos[accesoIndex] = acceso;
      setAccesosLocales(nuevosAccesos);
      setCambiosPendientes(true);
      if (!roleDetail) return;
      onPermisoChange(roleDetail.cdRol, cdModulo, tipoPermiso, !tieneElPermiso);
    }
  };

  const handleModuloToggle = (cdModulo: string) => {
    const nuevosAccesos = [...accesosLocales];
    const accesoIndex = nuevosAccesos.findIndex(a => a.cdModulo === cdModulo);

    if (accesoIndex !== -1) {
      const acceso = { ...nuevosAccesos[accesoIndex] };
      const nuevoEstado = !acceso.moduloHabilitado;

      acceso.moduloHabilitado = nuevoEstado;

      if (!nuevoEstado) {
        acceso.permisos = [];
      }

      nuevosAccesos[accesoIndex] = acceso;
      setAccesosLocales(nuevosAccesos);
      setCambiosPendientes(true);
      if (!roleDetail) return;
      onModuloHabilitadoChange(roleDetail.cdRol, cdModulo, nuevoEstado);
    }
  };

  const handleSave = () => {
    if (!roleDetail) return;
    console.log('Guardando cambios para el rol:', roleDetail.cdRol, accesosLocales);
    setCambiosPendientes(false);
    onClose();
  };

  const handleClose = () => {
    if (cambiosPendientes) {
      const confirmar = window.confirm('Tienes cambios sin guardar. ¿Seguro que quieres cerrar?');
      if (confirmar) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const contarUsuariosDelRol = () => {
    if (!roleDetail) return;
    return roleDetail.cantidadUsuarios;
  };

  if (!isOpen || !roleDetail) return null;

  return (
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
        w-full max-w-4xl
        max-h-[90vh]
        overflow-hidden
        animate-scale-in
      ">
        {/* Header del Modal */}
        <div className="
          bg-gradient-to-r from-indigo-500 to-blue-600
          px-6 py-4
          flex items-center justify-between
        ">
          <div className="flex items-center space-x-3">
            <div className="
              w-10 h-10
              bg-white/20
              rounded-lg
              flex items-center justify-center
              text-white
            ">
              🎭
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{roleDetail.nombre}</h2>
              <div className="flex items-center space-x-4 text-white/90 text-sm">
                <span className="bg-white/20 px-2 py-1 rounded">Código: {roleDetail.cdRol}</span>
                <span className="flex items-center space-x-1">
                  <span>👥</span>
                  <span>{contarUsuariosDelRol()} usuarios</span>
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="
              w-8 h-8
              flex items-center justify-center
              text-white/80 hover:text-white
              hover:bg-white/10
              rounded-lg
              transition-all duration-200
            "
            type="button"
          >
            ×
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="
            mb-6 p-4
            bg-indigo-50
            border border-indigo-200
            rounded-xl
          ">
            <h3 className="
              font-semibold text-indigo-800
              mb-2
              flex items-center space-x-2
            ">
              <span>📦</span>
              <span>Módulos y Permisos del Rol</span>
            </h3>
            <p className="text-indigo-600 text-sm">
              Habilita módulos y asigna permisos específicos para este rol
            </p>
          </div>

          <div className="space-y-4">
            {modulos.map(modulo => {
              const habilitado = moduloEstaHabilitado(modulo.cdModulo);
              const acceso = accesosLocales.find(a => a.cdModulo === modulo.cdModulo);
              return (
                <div key={modulo.cdModulo} className="
                  border border-slate-200
                  rounded-xl
                  overflow-hidden
                  transition-all duration-200
                  hover:shadow-md
                ">
                  {/* Header del Módulo */}
                  <div className={`
                    px-4 py-3
                    flex items-center justify-between
                    transition-colors duration-200
                    ${habilitado
                      ? 'bg-emerald-50 border-b border-emerald-200'
                      : 'bg-slate-50 border-b border-slate-200'
                    }
                  `}>
                    <div className="flex items-center space-x-3">
                      <label className="
                        relative
                        inline-flex
                        items-center
                        cursor-pointer
                      ">
                        <input
                          type="checkbox"
                          checked={habilitado}
                          onChange={() => handleModuloToggle(modulo.cdModulo)}
                          className="sr-only"
                        />
                        <div className={`
                          w-12 h-6
                          rounded-full
                          transition-colors duration-200
                          flex items-center
                          ${habilitado ? 'bg-emerald-500' : 'bg-slate-400'}
                        `}>
                          <div className={`
                            bg-white
                            w-4 h-4
                            rounded-full
                            shadow-lg
                            transform transition-transform duration-200
                            ${habilitado ? 'translate-x-7' : 'translate-x-1'}
                          `}></div>
                        </div>
                      </label>

                      <div className="flex items-center space-x-3">
                        <div className="
                          w-8 h-8
                          bg-gradient-to-r from-indigo-500 to-blue-500
                          rounded-lg
                          flex items-center justify-center
                          text-white text-sm
                        ">
                          {modulo.dsModulo.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{modulo.dsModulo}</div>
                          <div className="text-sm text-slate-500">{modulo.cdModulo}</div>
                        </div>
                      </div>
                    </div>

                    <span className={`
                      px-3 py-1
                      rounded-full
                      text-sm font-medium
                      ${habilitado
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }
                    `}>
                      {habilitado ? '✅ Habilitado' : '❌ Deshabilitado'}
                    </span>
                  </div>

                  {/* Permisos del Módulo */}
                  {habilitado && (
                    <div className="p-4 bg-white">
                      <h4 className="
                        font-medium text-slate-700
                        mb-3
                        flex items-center space-x-2
                      ">
                        <span>🔐</span>
                        <span>Permisos Disponibles</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {tiposPermisoDisponibles.map(tipoPermiso => {
                          const tieneElPermiso = tienePermiso(modulo.cdModulo, tipoPermiso);
                          const configPermiso = permisosConfig[tipoPermiso];

                          return (
                            <label key={tipoPermiso} className="
                              flex items-center space-x-3
                              p-3
                              border rounded-lg
                              cursor-pointer
                              transition-all duration-200
                              hover:shadow-md
                              ${tieneElPermiso 
                                ? 'bg-emerald-50 border-emerald-200' 
                                : 'bg-white border-slate-200 hover:border-slate-300'
                              }
                            ">
                              <input
                                type="checkbox"
                                checked={tieneElPermiso}
                                onChange={() => handlePermisoToggle(modulo.cdModulo, tipoPermiso)}
                                className="
                                  w-4 h-4
                                  text-emerald-600
                                  border-slate-300 rounded
                                  focus:ring-emerald-500
                                "
                              />
                              <div className="flex-1 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">{configPermiso.icono}</span>
                                  <span className="font-medium text-slate-700">
                                    {configPermiso.nombre}
                                  </span>
                                </div>
                                <span className={`
                                  text-sm
                                  ${tieneElPermiso ? 'text-emerald-600' : 'text-slate-400'}
                                `}>
                                  {tieneElPermiso ? '✓ Asignado' : '✗ No asignado'}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="
          px-6 py-4
          border-t border-slate-200
          bg-slate-50
          flex items-center justify-between
        ">
          <div className="flex items-center space-x-2">
            {cambiosPendientes && (
              <span className="
                flex items-center space-x-2
                text-amber-600 text-sm
              ">
                <span>⚠️</span>
                <span>Tienes cambios sin guardar</span>
              </span>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleClose}
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
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!cambiosPendientes}
              className="
                px-6 py-2
                bg-gradient-to-r from-indigo-500 to-blue-600
                hover:from-indigo-600 hover:to-blue-700
                disabled:from-indigo-400 disabled:to-blue-500
                text-white font-medium
                rounded-lg
                shadow-lg shadow-indigo-500/25
                hover:shadow-xl hover:shadow-indigo-500/35
                disabled:shadow-none
                transition-all duration-300
                transform hover:scale-105 disabled:scale-100
                flex items-center space-x-2
                disabled:cursor-not-allowed
              "
              type="button"
            >
              <span>💾</span>
              <span>Guardar Cambios</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};