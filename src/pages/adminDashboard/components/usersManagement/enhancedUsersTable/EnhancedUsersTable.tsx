import React, { useState } from 'react';
import type { UsersTableProps } from '../../../../../types/admin.types';
import { UserAvatar } from '../../../../../components/shared/userAvatar';
import { ActionsDropdown } from '../../../../../components/shared/actionsDropdown';
import { TablePagination } from '../../../../../components/shared/tablePagination';

export const EnhancedUsersTable: React.FC<UsersTableProps> = ({
  usuarios,
  onEdit,
  onToggleStatus,
  loading = false
}) => {
  // Estado para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

  // Calcular datos paginados
  const totalRegistros = usuarios.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const inicio = (paginaActual - 1) * registrosPorPagina;
  const fin = inicio + registrosPorPagina;
  const usuariosPaginados = usuarios.slice(inicio, fin);

  const handleViewDetails = (usuario: any) => {
    console.log('Ver detalles:', usuario);
    // Aquí luego implementarás el modal de detalles
  };

  // const handleExport = (formato: 'excel' | 'pdf') => {
  //   console.log(`Exportando a ${formato}`);
  //   // Aquí luego implementarás la exportación real
  // };

  // Convertir UsuarioResumen a BaseEntity manteniendo todas las propiedades
  const convertirUsuarioABaseEntity = (usuario: any) => ({
    ...usuario,
    id: usuario.cdUsuario,
    nombre: usuario.nombreCompleto,
    estaActivo: usuario.estaActivo
  });

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
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="
        text-center
        py-12
        bg-white/50
        rounded-2xl
        border border-slate-200
      ">
        <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-cyan-600">👥</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">No se encontraron usuarios</h3>
        <p className="text-slate-600">No hay usuarios que coincidan con los criterios de búsqueda</p>
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
            bg-linear-to-r from-cyan-50 to-blue-50
            border-b border-cyan-200/40
          ">
            <tr>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-cyan-700 uppercase tracking-wider
              ">
                USUARIO
              </th>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-cyan-700 uppercase tracking-wider
              ">
                ROL
              </th>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-cyan-700 uppercase tracking-wider
              ">
                ESTADO
              </th>
              <th className="
                px-6 py-4
                text-left text-xs font-semibold
                text-cyan-700 uppercase tracking-wider
              ">
                ACCIONES
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200/60">
            {usuariosPaginados.map(usuario => (
              <tr 
                key={usuario.cdUsuario}
                className="
                  hover:bg-cyan-50/30
                  transition-colors duration-150
                "
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <UserAvatar
                    nombre={usuario.nombreCompleto}
                    email={usuario.email}
                    size="sm"
                    showInfo={true}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="
                    inline-flex items-center
                    px-3 py-1
                    bg-cyan-100 text-cyan-700
                    rounded-full
                    text-sm font-medium
                    border border-cyan-200
                  ">
                    {usuario.rolNombre}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    inline-flex items-center
                    px-3 py-1
                    rounded-full
                    text-sm font-medium
                    border
                    ${usuario.estaActivo 
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                      : 'bg-rose-100 text-rose-700 border-rose-200'
                    }
                  `}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${usuario.estaActivo ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                    {usuario.estaActivo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ActionsDropdown
                    entidad={convertirUsuarioABaseEntity(usuario)}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                    onViewDetails={handleViewDetails}
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

  // return (
  //   <div className="enhanced-users-table">
  //     <div className="table-container">
  //       <table className="users-table">
  //         <thead className="table-header">
  //           <tr>
  //             <th>USUARIO</th>
  //             <th>ROL</th>
  //             <th>ESTADO</th>
  //             <th>ACCIONES</th>
  //           </tr>
  //         </thead>
  //         <tbody className="table-body">
  //           {usuariosPaginados.map(usuario => (
  //             <tr key={usuario.cdUsuario} className="table-row">
  //               <td className="user-cell">
  //                 <UserAvatar
  //                   nombre={usuario.nombreCompleto}
  //                   email={usuario.email}
  //                   size="sm"
  //                 />
  //               </td>
  //               <td className="role-cell">
  //                 <span className="role-badge">{usuario.rolNombre}</span>
  //               </td>
  //               <td className="status-cell">
  //                 <span className={`status-badge ${usuario.estaActivo ? 'active' : 'inactive'}`}>
  //                   {usuario.estaActivo ? 'Activo' : 'Inactivo'}
  //                 </span>
  //               </td>
  //               <td className="actions-cell">
  //                 <ActionsDropdown
  //                   entidad={convertirUsuarioABaseEntity(usuario)}
  //                   onEdit={onEdit}
  //                   onToggleStatus={onToggleStatus}
  //                   onViewDetails={handleViewDetails}
  //                 />
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>

  //     <TablePagination
  //       paginaActual={paginaActual}
  //       totalPaginas={totalPaginas}
  //       totalRegistros={totalRegistros}
  //       registrosPorPagina={registrosPorPagina}
  //       onPaginaChange={setPaginaActual}
  //       onRegistrosPorPaginaChange={setRegistrosPorPagina}
  //     />
  //   </div>
  // );
};