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
    <div className="modules-filters">
      <div className="filters-header">
        <h3 className="filters-title">Filtros</h3>
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="clear-filters-button"
            type="button"
          >
            Limpiar Filtros
          </button>
        )}
      </div>

      <div className="filters-grid">
        {/* Búsqueda por texto */}
        <div className="filter-group">
          <label htmlFor="searchTerm" className="filter-label">
            Buscar Módulo
          </label>
          <input
            id="searchTerm"
            type="text"
            placeholder="Nombre o descripción..."
            value={filters.searchTerm || ''}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="filter-input"
          />
        </div>

        {/* Filtro por Edición */}
        <div className="filter-group">
          <label htmlFor="flgEdicion" className="filter-label">
            Permite Edición
          </label>
          <select
            id="flgEdicion"
            value={filters.flgEdicion?.toString() || ''}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('flgEdicion', value === '' ? undefined : value === 'true');
            }}
            className="filter-select"
          >
            <option value="">Todos</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
    </div>
  );
};