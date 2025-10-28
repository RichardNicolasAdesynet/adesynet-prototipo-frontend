import React from 'react';
import type { UsersFiltersProps, UsuarioFilters } from '../../../../../types/admin.types';

export const UsersFilters: React.FC<UsersFiltersProps> = ({
  roles,
  filters,
  onFiltersChange
}) => {
  // ✅ CORREGIR: Manejo de filtros para API
  const handleFilterChange = (key: keyof UsuarioFilters, value: any) => {
    // Mapear nombres internos a nombres de API
    const apiKey = key === 'estaActivo' ? 'Activo' : key;
    const apiValue = value;

    onFiltersChange({
      ...filters,
      [apiKey]: apiValue
    } as UsuarioFilters);
  };
  // ✅ CORREGIR: Limpiar filtros
  const clearFilters = () => {
    onFiltersChange({});
  };

  // ✅ CORREGIR: Verificar filtros activos (usar nombres de API)
  const hasActiveFilters = Object.keys(filters).filter(key =>
    filters[key as keyof UsuarioFilters] !== undefined
  ).length > 0;

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
          bg-linear-to-r from-cyan-600 to-blue-600
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
              hover:text-cyan-700 hover:bg-cyan-50
              rounded-lg
              border border-slate-300
              hover:border-cyan-300
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda por texto */}
        <div className="space-y-2">
          <label htmlFor="searchTerm" className="
            block text-sm font-medium text-slate-700
          ">
            Buscar Usuario
          </label>
          <input
            id="searchTerm"
            type="text"
            placeholder="Nombre, email o código..."
            value={filters.searchTerm || ''}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="
              w-full px-4 py-2
              border border-slate-300
              rounded-xl
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
              transition-all duration-200
              placeholder-slate-400
            "
          />
        </div>

        {/* Filtro por Rol */}
        <div className="space-y-2">
          <label htmlFor="cdRol" className="
            block text-sm font-medium text-slate-700
          ">
            Rol
          </label>
          <select
            id="cdRol"
            value={filters.cdRol || ''}
            onChange={(e) => handleFilterChange('cdRol', e.target.value || undefined)}
            className="
              w-full px-4 py-2
              border border-slate-300
              rounded-xl
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
              transition-all duration-200
              bg-white
              cursor-pointer
            "
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
        <div className="space-y-2">
          <label htmlFor="estaActivo" className="
            block text-sm font-medium text-slate-700
          ">
            Estado
          </label>
          <select
            id="estaActivo"
            value={filters.estaActivo?.toString() || ''}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('estaActivo', value === '' ? undefined : value === 'true');
            }}
            className="
              w-full px-4 py-2
              border border-slate-300
              rounded-xl
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
              transition-all duration-200
              bg-white
              cursor-pointer
            "
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