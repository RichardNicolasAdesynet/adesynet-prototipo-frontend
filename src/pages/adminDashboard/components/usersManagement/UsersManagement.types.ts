// src/pages/adminDashboard/components/usersManagement/UsersManagement.types.ts
import type { UsuarioResumen, RolResumen, UsuarioFilters } from '../../../../types/admin.types';

export interface UsersManagementProps {
  usuarios: UsuarioResumen[];
  roles: RolResumen[];
  onUsuarioEdit: (usuario: UsuarioResumen) => void;
  onUsuarioCreate: () => void;
  onUsuarioToggleStatus: (cdUsuario: string, nuevoEstado: boolean) => void;
  onFiltersChange: (filters: UsuarioFilters) => void;
  loading?: boolean;
}