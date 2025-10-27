// src/pages/adminDashboard/components/usersManagement/userForm/UserForm.types.ts
import type { UsuarioFormData, RolResumen } from '../../../../../types/admin.types';

export interface UserFormProps {
  usuario?: UsuarioFormData;
  roles: RolResumen[];
  isOpen: boolean;
  isEditing: boolean;
  onSubmit: (data: UsuarioFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}