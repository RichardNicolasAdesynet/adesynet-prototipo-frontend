import React from 'react';

export interface AccessManagementTableProps {
  roles: any[];
  accesos: any[];
  modulos: any[];
  onRoleClick: (rol: any) => void;
  loading?: boolean;
}

export const AccessManagementTable: React.FC<AccessManagementTableProps> = ({
  roles,
  accesos,
  modulos,
  onRoleClick,
  loading = false
}) => {
  const obtenerModulosDelRol = (cdRol: string) => {
    return accesos
      .filter(acceso => acceso.cdRol === cdRol && acceso.moduloHabilitado)
      .map(acceso => acceso.moduloNombre);
  };

  const contarModulosHabilitados = (cdRol: string) => {
    return accesos.filter(acceso => 
      acceso.cdRol === cdRol && acceso.moduloHabilitado
    ).length;
  };

  const contarUsuariosDelRol = (cdRol: string) => {
    const usuariosPorRol: Record<string, number> = {
      'ROL01': 3,
      'ROL02': 1,
      'ROL03': 2,
      'ROL04': 4,
      'ROL05': 8
    };
    return usuariosPorRol[cdRol] || 0;
  };

  const formatearModulos = (modulosList: string[]) => {
    if (modulosList.length <= 3) {
      return modulosList.join(', ');
    }
    return `${modulosList.slice(0, 3).join(', ')}... +${modulosList.length - 3} más`;
  };

  if (loading) {
    return (
      <div className="
        flex justify-center items-center
        py-12
        bg-white/50
        rounded-2xl
        border border-slate-200
      ">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando roles y accesos...</p>
        </div>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="
        text-center
        py-12
        bg-white/50
        rounded-2xl
        border border-slate-200
      ">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-indigo-600">🎭</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">No hay roles configurados</h3>
        <p className="text-slate-600">Configura roles en el módulo de Gestión de Roles</p>
      </div>
    );
  }

  return (
    <div className="
      bg-white/80 backdrop-blur-sm
      border border-slate-200/60
      rounded-2xl
      shadow-lg
      overflow-hidden
    ">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="
            bg-gradient-to-r from-indigo-50 to-blue-50
            border-b border-indigo-200/40
          ">
            <tr>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-indigo-700 uppercase tracking-wider
              ">
                ROL
              </th>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-indigo-700 uppercase tracking-wider
              ">
                MÓDULOS ASIGNADOS
              </th>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-indigo-700 uppercase tracking-wider
              ">
                USUARIOS
              </th>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-indigo-700 uppercase tracking-wider
              ">
                ACCESOS
              </th>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-indigo-700 uppercase tracking-wider
              ">
                ESTADO
              </th>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-indigo-700 uppercase tracking-wider
              ">
                ACCIÓN
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200/60">
            {roles.map(rol => {
              const modulosDelRol = obtenerModulosDelRol(rol.cdRol);
              const modulosHabilitados = contarModulosHabilitados(rol.cdRol);
              const totalUsuarios = contarUsuariosDelRol(rol.cdRol);
              const porcentajeAcceso = modulos.length > 0 
                ? Math.round((modulosHabilitados / modulos.length) * 100) 
                : 0;

              return (
                <tr 
                  key={rol.cdRol}
                  className="
                    hover:bg-indigo-50/30
                    transition-colors duration-150
                    cursor-pointer
                  "
                  onClick={() => onRoleClick(rol)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="
                        w-10 h-10
                        bg-gradient-to-r from-indigo-500 to-blue-500
                        rounded-lg
                        flex items-center justify-center
                        text-white
                      ">
                        🎭
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{rol.nombre}</div>
                        <div className="text-sm text-slate-500">{rol.cdRol}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      {modulosDelRol.length > 0 ? (
                        <div>
                          <div className="text-slate-800 line-clamp-2">
                            {formatearModulos(modulosDelRol)}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {modulosDelRol.length} módulos asignados
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Sin módulos asignados</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="
                        w-8 h-8
                        bg-cyan-100
                        rounded-full
                        flex items-center justify-center
                      ">
                        <span className="text-cyan-600 text-sm">👥</span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{totalUsuarios}</div>
                        <div className="text-xs text-slate-500">usuarios</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Progreso:</span>
                        <span className="font-semibold text-indigo-700">
                          {porcentajeAcceso}%
                        </span>
                      </div>
                      <div className="
                        w-full
                        bg-slate-200
                        rounded-full
                        h-2
                      ">
                        <div 
                          className="
                            h-2
                            bg-gradient-to-r from-indigo-500 to-blue-500
                            rounded-full
                            transition-all duration-500
                          "
                          style={{ width: `${porcentajeAcceso}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-slate-500">
                        {modulosHabilitados}/{modulos.length} módulos
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center
                      px-3 py-1
                      rounded-full
                      text-sm font-medium
                      border
                      ${rol.activo 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                        : 'bg-rose-100 text-rose-700 border-rose-200'
                      }
                    `}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${rol.activo ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                      {rol.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRoleClick(rol);
                      }}
                      className="
                        px-4 py-2
                        bg-indigo-500
                        hover:bg-indigo-600
                        text-white
                        rounded-lg
                        font-medium
                        transition-all duration-200
                        transform hover:scale-105
                        flex items-center space-x-2
                      "
                      type="button"
                    >
                      <span>⚙️</span>
                      <span>Gestionar</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};