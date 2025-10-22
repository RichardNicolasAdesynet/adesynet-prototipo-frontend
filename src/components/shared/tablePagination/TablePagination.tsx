import React from 'react';
import type { TablePaginationProps } from '../../../types/admin.types';

export const TablePagination: React.FC<TablePaginationProps> = ({
  paginaActual,
  totalPaginas,
  totalRegistros,
  registrosPorPagina,
  onPaginaChange,
  onRegistrosPorPaginaChange
}) => {
  const paginasParaMostrar = 5;
  const inicioRegistro = (paginaActual - 1) * registrosPorPagina + 1;
  const finRegistro = Math.min(paginaActual * registrosPorPagina, totalRegistros);

  const getPaginas = (): number[] => {
    const paginas = [];
    const inicio = Math.max(1, paginaActual - Math.floor(paginasParaMostrar / 2));
    const fin = Math.min(totalPaginas, inicio + paginasParaMostrar - 1);
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
  };

  return (
    <div className="table-pagination">
      <div className="pagination-info">
        Mostrando {inicioRegistro} a {finRegistro} de {totalRegistros} registros
      </div>
      
      <div className="pagination-controls">
        <select
          value={registrosPorPagina}
          onChange={(e) => onRegistrosPorPaginaChange(Number(e.target.value))}
          className="records-per-page"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        <div className="pagination-buttons">
          <button
            onClick={() => onPaginaChange(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="pagination-button"
            type="button"
          >
            ‹
          </button>

          {getPaginas().map(pagina => (
            <button
              key={pagina}
              onClick={() => onPaginaChange(pagina)}
              className={`pagination-button ${pagina === paginaActual ? 'active' : ''}`}
              type="button"
            >
              {pagina}
            </button>
          ))}

          <button
            onClick={() => onPaginaChange(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="pagination-button"
            type="button"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};