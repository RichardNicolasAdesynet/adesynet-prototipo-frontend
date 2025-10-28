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
    <div className="
      flex flex-col sm:flex-row 
      items-center justify-between
      gap-4
      px-6 py-4
      bg-white/80 backdrop-blur-sm
      border border-slate-200/60
      rounded-xl
      shadow-lg
    ">
      {/* Información de registros */}
      <div className="
        text-sm text-slate-600
        flex items-center space-x-2
      ">
        <span className="font-medium">Mostrando</span>
        <span className="
          px-2 py-1 
          bg-purple-100 text-purple-700
          rounded-lg font-semibold
          border border-purple-200
        ">
          {inicioRegistro}-{finRegistro}
        </span>
        <span className="font-medium">de</span>
        <span className="
          px-2 py-1
          bg-slate-100 text-slate-700
          rounded-lg font-semibold
          border border-slate-200
        ">
          {totalRegistros}
        </span>
        <span className="font-medium">registros</span>
      </div>

      {/* Controles de paginación */}
      <div className="
        flex flex-col sm:flex-row
        items-center gap-4
      ">
        {/* Selector de registros por página */}
        <div className="relative">
          <select
            value={registrosPorPagina}
            onChange={(e) => onRegistrosPorPaginaChange(Number(e.target.value))}
            className="
              pl-3 pr-10 py-2
              bg-white
              border border-slate-300
              rounded-lg
              text-slate-700
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
              transition-all duration-200
              appearance-none
              cursor-pointer
              hover:border-purple-300
            "
          >
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={25}>25 por página</option>
            <option value={100}>100 por página</option>
          </select>
          
          {/* Icono personalizado del select */}
          <div className="
            absolute right-3 top-1/2 transform -translate-y-1/2
            pointer-events-none
            text-slate-400
          ">
            ⌄
          </div>
        </div>

        {/* Botones de paginación */}
        <div className="
          flex items-center space-x-1
          bg-slate-100/80
          rounded-lg
          p-1
        ">
          {/* Botón Anterior */}
          <button
            onClick={() => onPaginaChange(paginaActual - 1)}
            disabled={paginaActual === 1}
            className={`
              w-10 h-10
              flex items-center justify-center
              rounded-lg
              transition-all duration-200
              ${paginaActual === 1
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-slate-600 hover:text-purple-700 hover:bg-white hover:shadow-md'
              }
            `}
            type="button"
          >
            ‹
          </button>

          {/* Números de página */}
          {getPaginas().map(pagina => (
            <button
              key={pagina}
              onClick={() => onPaginaChange(pagina)}
              className={`
                w-10 h-10
                flex items-center justify-center
                rounded-lg
                font-medium
                transition-all duration-200
                ${pagina === paginaActual
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 transform scale-105'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-white hover:shadow-md'
                }
              `}
              type="button"
            >
              {pagina}
            </button>
          ))}

          {/* Botón Siguiente */}
          <button
            onClick={() => onPaginaChange(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className={`
              w-10 h-10
              flex items-center justify-center
              rounded-lg
              transition-all duration-200
              ${paginaActual === totalPaginas
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-slate-600 hover:text-purple-700 hover:bg-white hover:shadow-md'
              }
            `}
            type="button"
          >
            ›
          </button>
        </div>

        {/* Información de página actual */}
        <div className="
          text-sm text-slate-600
          flex items-center space-x-2
        ">
          <span className="font-medium">Página</span>
          <span className="
            px-3 py-1
            bg-purple-100 text-purple-700
            rounded-lg font-semibold
            border border-purple-200
          ">
            {paginaActual}
          </span>
          <span className="font-medium">de</span>
          <span className="
            px-3 py-1
            bg-slate-100 text-slate-700
            rounded-lg font-semibold
            border border-slate-200
          ">
            {totalPaginas}
          </span>
        </div>
      </div>
    </div>
  );
};