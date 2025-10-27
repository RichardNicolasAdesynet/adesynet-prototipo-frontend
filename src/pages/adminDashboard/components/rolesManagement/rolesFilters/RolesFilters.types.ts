// src/pages/adminDashboard/components/rolesManagement/rolesFilters/RolesFilters.types.ts
import type { RolFilters } from '../../../../../types/admin.types';

export interface RolesFiltersProps {
  filters: RolFilters;
  onFiltersChange: (filters: RolFilters) => void;
}