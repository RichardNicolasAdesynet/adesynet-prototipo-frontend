import type { RolFilters } from '../../../../../types/admin.types';

export interface RolesFiltersProps {
  filters: RolFilters;
  onFiltersChange: (filters: RolFilters) => void;
}