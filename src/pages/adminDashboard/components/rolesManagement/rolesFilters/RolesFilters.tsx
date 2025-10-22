import React from 'react';
import type { RolesFiltersProps, RolFilters } from '../../../../../types/admin.types';

export const RolesFilters: React.FC<RolesFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const handleFilterChange = (key: keyof RolFilters, value: any) => {
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
    <div className="roles-filters">
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
            Buscar Rol
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

        {/* Filtro por Estado */}
        <div className="filter-group">
          <label htmlFor="activo" className="filter-label">
            Estado
          </label>
          <select
            id="activo"
            value={filters.activo?.toString() || ''}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('activo', value === '' ? undefined : value === 'true');
            }}
            className="filter-select"
          >
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>
      </div>
    </div>
  );
};