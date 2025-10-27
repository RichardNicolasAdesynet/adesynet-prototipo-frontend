// src/pages/adminDashboard/components/rolesManagement/roleForm/RoleForm.types.ts
import type { RolFormData } from '../../../../../types/admin.types';

export interface RoleFormProps {
  rol?: RolFormData;
  isOpen: boolean;
  isEditing: boolean;
  onSubmit: (data: RolFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}