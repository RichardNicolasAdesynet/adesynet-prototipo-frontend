import React, { useState } from 'react';
import type { RolesTableProps } from '../../../../../types/admin.types';
import { ActionsDropdown } from '../../../../../components/shared/actionsDropdown';
import { TablePagination } from '../../../../../components/shared/tablePagination';

export const EnhancedRolesTable: React.FC<RolesTableProps> = ({
  roles,
  onEdit,
  onToggleStatus,
  loading = false
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

  const totalRegistros = roles.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const inicio = (paginaActual - 1) * registrosPorPagina;
  const fin = inicio + registrosPorPagina;
  const rolesPaginados = roles.slice(inicio, fin);

  const handleViewDetails = (rol: any) => {
    console.log('Ver detalles del rol:', rol);
  };

  const convertirRolABaseEntity = (rol: any) => ({
    ...rol,
    id: rol.cdRol,
    nombre: rol.nombre,
    estaActivo: rol.activo
  });

  const customActions = [
    {
      label: 'Gestionar Permisos',
      icono: '🔐',
      onClick: (rol: any) => console.log('Gestionar permisos de:', rol.nombre),
      peligroso: false
    }
  ];

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
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando roles...</p>
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
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-purple-600">🎭</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">No se encontraron roles</h3>
        <p className="text-slate-600">No hay roles que coincidan con los criterios de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="
      bg-white/80 backdrop-blur-sm
      border border-slate-200/60
      rounded-2xl
      shadow-lg
      overflow-visible
    ">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="
            bg-linear-to-r from-purple-50 to-indigo-50
            border-b border-purple-200/40
          ">
            <tr>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-purple-700 uppercase tracking-wider
              ">
                CÓDIGO
              </th>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-purple-700 uppercase tracking-wider
              ">
                NOMBRE
              </th>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-purple-700 uppercase tracking-wider
              ">
                DESCRIPCIÓN
              </th>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-purple-700 uppercase tracking-wider
              ">
                USUARIOS
              </th>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-purple-700 uppercase tracking-wider
              ">
                ESTADO
              </th>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-purple-700 uppercase tracking-wider
              ">
                ACCIONES
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200/60">
            {rolesPaginados.map(rol => (
              <tr 
                key={rol.cdRol}
                className="
                  hover:bg-purple-50/30
                  transition-colors duration-150
                "
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="
                    inline-flex items-center
                    px-3 py-1
                    bg-purple-100 text-purple-700
                    rounded-lg
                    text-sm font-mono font-semibold
                    border border-purple-200
                  ">
                    {rol.cdRol}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="
                      w-8 h-8
                      bg-linear-to-r from-purple-500 to-indigo-500
                      rounded-lg
                      flex items-center justify-center
                      text-white text-sm
                    ">
                      {rol.nombre.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{rol.nombre}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-600 text-sm max-w-xs line-clamp-2">
                    {rol.descripcion}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="
                    inline-flex items-center
                    px-3 py-1
                    bg-slate-100 text-slate-700
                    rounded-full
                    text-sm font-medium
                    border border-slate-200
                  ">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    {rol.cantidadUsuarios || 0} usuarios
                  </span>
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
                  <ActionsDropdown
                    entidad={convertirRolABaseEntity(rol)}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                    onViewDetails={handleViewDetails}
                    customActions={customActions}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="border-t border-slate-200/60">
        <TablePagination
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          totalRegistros={totalRegistros}
          registrosPorPagina={registrosPorPagina}
          onPaginaChange={setPaginaActual}
          onRegistrosPorPaginaChange={setRegistrosPorPagina}
        />
      </div>
    </div>
  );
};