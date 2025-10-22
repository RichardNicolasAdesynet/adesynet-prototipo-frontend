import React, { useState } from 'react';
import type { ModulesTableProps } from '../../../../../types/admin.types';
import { ActionsDropdown } from '../../../../../components/shared/actionsDropdown';
import { TablePagination } from '../../../../../components/shared/tablePagination';

export const EnhancedModulesTable: React.FC<ModulesTableProps> = ({
  modulos,
  onEdit,
  onToggleEdicion,
  loading = false
}) => {
  // Estado para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

  // Calcular datos paginados
  const totalRegistros = modulos.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const inicio = (paginaActual - 1) * registrosPorPagina;
  const fin = inicio + registrosPorPagina;
  const modulosPaginados = modulos.slice(inicio, fin);

  const handleViewDetails = (modulo: any) => {
    console.log('Ver detalles del módulo:', modulo);
  };

  // Convertir ModuloResumen a BaseEntity
  const convertirModuloABaseEntity = (modulo: any) => ({
    ...modulo,
    id: modulo.cdModulo,
    nombre: modulo.dsModulo,
    estaActivo: modulo.flgEdicion
  });

  // Adaptar onToggleStatus para módulos
  const handleToggleStatus = (id: string, nuevoEstado: boolean) => {
    onToggleEdicion(id, nuevoEstado);
  };

  // Acciones personalizadas para módulos
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
      <div className="table-loading">
        <p>Cargando módulos...</p>
      </div>
    );
  }

  if (modulos.length === 0) {
    return (
      <div className="table-empty">
        <p>No se encontraron módulos</p>
      </div>
    );
  }

  return (
    <div className="enhanced-modules-table">
      <div className="table-container">
        <table className="modules-table">
          <thead className="table-header">
            <tr>
              <th>CÓDIGO</th>
              <th>MÓDULO</th>
              <th>EDICIÓN</th>
              <th>ACCESOS</th>
              <th>ROLES CON ACCESO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {modulosPaginados.map(modulo => (
              <tr key={modulo.cdModulo} className="table-row">
                <td className="code-cell">
                  <span className="module-code">{modulo.cdModulo}</span>
                </td>
                <td className="name-cell">
                  <div className="module-name-info">
                    <div className="module-name">{modulo.dsModulo}</div>
                  </div>
                </td>
                <td className="edition-cell">
                  <span className={`edition-badge ${modulo.flgEdicion ? 'editable' : 'readonly'}`}>
                    {modulo.flgEdicion ? 'Permite Edición' : 'Solo Lectura'}
                  </span>
                </td>
                <td className="accesses-cell">
                  <span className="accesses-count">
                    {modulo.cantidadAccesos || 0} accesos
                  </span>
                </td>
                <td className="roles-cell">
                  <span className="roles-count">
                    {modulo.cantidadRolesConAcceso || 0} roles
                  </span>
                </td>
                <td className="actions-cell">
                  <ActionsDropdown
                    entidad={convertirModuloABaseEntity(modulo)}
                    onEdit={onEdit}
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

      <TablePagination
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        totalRegistros={totalRegistros}
        registrosPorPagina={registrosPorPagina}
        onPaginaChange={setPaginaActual}
        onRegistrosPorPaginaChange={setRegistrosPorPagina}
      />
    </div>
  );
};