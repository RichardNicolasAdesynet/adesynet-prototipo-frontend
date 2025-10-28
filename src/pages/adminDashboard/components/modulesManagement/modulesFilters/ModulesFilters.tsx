import React from 'react';
import type { ModulesFiltersProps, ModuloFilters } from '../../../../../types/admin.types';

export const ModulesFilters: React.FC<ModulesFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const handleFilterChange = (key: keyof ModuloFilters, value: any) => {
  onFiltersChange({
    ...filters,
    [key]: value
  });
};

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="
      bg-white/80 backdrop-blur-sm
      border border-slate-200/60
      rounded-2xl
      p-6
      shadow-lg
    ">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h3 className="
          text-lg font-semibold
          bg-linear-to-r from-emerald-600 to-green-600
          bg-clip-text text-transparent
        ">
          Filtros de Búsqueda
        </h3>
        
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="
              px-4 py-2
              text-sm text-slate-600
              hover:text-emerald-700 hover:bg-emerald-50
              rounded-lg
              border border-slate-300
              hover:border-emerald-300
              transition-all duration-200
              flex items-center space-x-2
            "
            type="button"
          >
            <span>🗑️</span>
            <span>Limpiar Filtros</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Búsqueda por texto */}
        <div className="space-y-2">
          <label htmlFor="searchTerm" className="
            block text-sm font-medium text-slate-700
          ">
            Buscar Módulo
          </label>
          <input
            id="searchTerm"
            type="text"
            placeholder="Código o descripción..."
            value={filters.searchTerm || ''}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="
              w-full px-4 py-2
              border border-slate-300
              rounded-xl
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
              transition-all duration-200
              placeholder-slate-400
            "
          />
        </div>

        {/* Filtro por Edición */}
        <div className="space-y-2">
          <label htmlFor="flgEdicion" className="
            block text-sm font-medium text-slate-700
          ">
            Permite Edición
          </label>
          <select
            id="flgEdicion"
            value={filters.flgEdicion?.toString() || ''}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('flgEdicion', value === '' ? undefined : value === 'true');
            }}
            className="
              w-full px-4 py-2
              border border-slate-300
              rounded-xl
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
              transition-all duration-200
              bg-white
              cursor-pointer
            "
          >
            <option value="">Todos</option>
            <option value="true">Permite Edición</option>
            <option value="false">Solo Lectura</option>
          </select>
        </div>
      </div>
    </div>
  );
};