// src/pages/adminDashboard/components/usersManagement/UsersManagement.types.ts
import type { UsuarioResumen, UsuarioFilters } from '../../../../types/admin.types';

export interface UsersManagementProps {
  onUsuarioEdit: (usuario: UsuarioResumen) => void;
  onUsuarioCreate: () => void;
  onUsuarioToggleStatus: (cdUsuario: string, nuevoEstado: boolean) => void;
  onFiltersChange: (filters: UsuarioFilters) => void;
  loading?: boolean;
}