import React, { useState } from 'react';
import type { ModulesTableProps } from '../../../../../types/admin.types';
import { ActionsDropdown } from '../../../../../components/shared/actionsDropdown';
import { TablePagination } from '../../../../../components/shared/tablePagination';

export const EnhancedModulesTable: React.FC<ModulesTableProps> = ({
  modulos,
  onEdit,
  onDelete,
  onToggleEdicion,
  loading = false
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

  const totalRegistros = modulos.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const inicio = (paginaActual - 1) * registrosPorPagina;
  const fin = inicio + registrosPorPagina;
  const modulosPaginados = modulos.slice(inicio, fin);

  const handleViewDetails = (modulo: any) => {
    console.log('Ver detalles del módulo:', modulo);
  };

  const convertirModuloABaseEntity = (modulo: any) => ({
    ...modulo,
    id: modulo.cdModulo,
    nombre: modulo.dsModulo,
    estaActivo: modulo.flgEdicion
  });

  const handleToggleStatus = (id: string, nuevoEstado: boolean) => {
    onToggleEdicion(id, nuevoEstado);
  };

  const customActions = [
    {
      label: 'Ver Accesos',
      icono: '👁️',
      onClick: (modulo: any) => console.log('Ver accesos de:', modulo.dsModulo),
      peligroso: false
    },
    {
      label: 'Gestionar Permisos',
      icono: '🔐',
      onClick: (modulo: any) => console.log('Gestionar permisos de:', modulo.dsModulo),
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
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando módulos...</p>
        </div>
      </div>
    );
  }

  if (modulos.length === 0) {
    return (
      <div className="
        text-center
        py-12
        bg-white/50
        rounded-2xl
        border border-slate-200
      ">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-emerald-600">📦</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">No se encontraron módulos</h3>
        <p className="text-slate-600">No hay módulos que coincidan con los criterios de búsqueda</p>
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
            bg-gradient-to-r from-emerald-50 to-green-50
            border-b border-emerald-200/40
          ">
            <tr>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-emerald-700 uppercase tracking-wider
              ">
                CÓDIGO
              </th>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-emerald-700 uppercase tracking-wider
              ">
                MÓDULO
              </th>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-emerald-700 uppercase tracking-wider
              ">
                EDICIÓN
              </th>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-emerald-700 uppercase tracking-wider
              ">
                ACCESOS
              </th>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-emerald-700 uppercase tracking-wider
              ">
                ROLES CON ACCESO
              </th>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-emerald-700 uppercase tracking-wider
              ">
                ACCIONES
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200/60">
            {modulosPaginados.map(modulo => (
              <tr 
                key={modulo.cdModulo}
                className="
                  hover:bg-emerald-50/30
                  transition-colors duration-150
                "
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="
                    inline-flex items-center
                    px-3 py-1
                    bg-emerald-100 text-emerald-700
                    rounded-lg
                    text-sm font-mono font-semibold
                    border border-emerald-200
                  ">
                    {modulo.cdModulo}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="
                      w-8 h-8
                      bg-gradient-to-r from-emerald-500 to-green-500
                      rounded-lg
                      flex items-center justify-center
                      text-white text-sm
                    ">
                      {modulo.dsModulo.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{modulo.dsModulo}</div>
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
                    ${modulo.flgEdicion 
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                    }
                  `}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${modulo.flgEdicion ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
                    {modulo.flgEdicion ? 'Permite Edición' : 'Solo Lectura'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="
                    inline-flex items-center
                    px-3 py-1
                    bg-blue-100 text-blue-700
                    rounded-full
                    text-sm font-medium
                    border border-blue-200
                  ">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    {modulo.cantidadAccesos || 0} accesos
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="
                    inline-flex items-center
                    px-3 py-1
                    bg-purple-100 text-purple-700
                    rounded-full
                    text-sm font-medium
                    border border-purple-200
                  ">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    {modulo.cantidadRolesConAcceso || 0} roles
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ActionsDropdown
                    entidad={convertirModuloABaseEntity(modulo)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleStatus={handleToggleStatus}
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