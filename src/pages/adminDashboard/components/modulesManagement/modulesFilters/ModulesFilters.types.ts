import type { ModuloFilters } from '../../../../../types/admin.types';

export interface ModulesFiltersProps {
  filters: ModuloFilters;
  onFiltersChange: (filters: ModuloFilters) => void;
}