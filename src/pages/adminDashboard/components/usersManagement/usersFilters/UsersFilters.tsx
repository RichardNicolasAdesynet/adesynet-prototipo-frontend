import React from 'react';
import type { UsersFiltersProps, UsuarioFilters } from '../../../../../types/admin.types';

export const UsersFilters: React.FC<UsersFiltersProps> = ({
  roles,
  filters,
  onFiltersChange
}) => {
  const handleFilterChange = (key: keyof UsuarioFilters, value: any) => {
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
    <div className="users-filters">
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
            Buscar Usuario
          </label>
          <input
            id="searchTerm"
            type="text"
            placeholder="Nombre, email o código..."
            value={filters.searchTerm || ''}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="filter-input"
          />
        </div>

        {/* Filtro por Rol */}
        <div className="filter-group">
          <label htmlFor="cdRol" className="filter-label">
            Rol
          </label>
          <select
            id="cdRol"
            value={filters.cdRol || ''}
            onChange={(e) => handleFilterChange('cdRol', e.target.value || undefined)}
            className="filter-select"
          >
            <option value="">Todos los roles</option>
            {roles.map(rol => (
              <option key={rol.cdRol} value={rol.cdRol}>
                {rol.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Estado */}
        <div className="filter-group">
          <label htmlFor="estaActivo" className="filter-label">
            Estado
          </label>
          <select
            id="estaActivo"
            value={filters.estaActivo?.toString() || ''}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('estaActivo', value === '' ? undefined : value === 'true');
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