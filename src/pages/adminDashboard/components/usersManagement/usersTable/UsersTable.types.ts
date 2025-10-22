import type { UsuarioResumen } from '../../../../../types/admin.types';

export interface UsersTableProps {
  usuarios: UsuarioResumen[];
  onEdit: (usuario: UsuarioResumen) => void;
  onToggleStatus: (cdUsuario: string, nuevoEstado: boolean) => void;
  loading?: boolean;
}