// src/pages/adminDashboard/components/modulesManagement/moduleForm/ModuleForm.types.ts
import type { ModuloFormData } from '../../../../../types/admin.types';

export interface ModuleFormProps {
  modulo?: ModuloFormData;
  isOpen: boolean;
  isEditing: boolean;
  onSubmit: (data: ModuloFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}