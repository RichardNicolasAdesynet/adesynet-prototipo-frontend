// src/pages/adminDashboard/components/usersManagement/userFilters/UsersFilters.types.ts
import type { UsuarioFilters, RolResumen } from '../../../../../types/admin.types';

export interface UsersFiltersProps {
  roles: RolResumen[];
  filters: UsuarioFilters;
  onFiltersChange: (filters: UsuarioFilters) => void;
}