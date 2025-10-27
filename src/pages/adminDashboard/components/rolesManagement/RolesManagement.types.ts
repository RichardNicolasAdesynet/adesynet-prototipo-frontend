// src/pages/adminDashboard/components/rolesManagement/RolesManagement.types.ts
import type { RolResumen, RolFilters } from '../../../../types/admin.types';

export interface RolesManagementProps {
  roles: RolResumen[];
  onRolEdit: (rol: RolResumen) => void;
  onRolCreate: () => void;
  onRolToggleStatus: (cdRol: string, nuevoEstado: boolean) => void;
  onFiltersChange: (filters: RolFilters) => void;
  loading?: boolean;
}