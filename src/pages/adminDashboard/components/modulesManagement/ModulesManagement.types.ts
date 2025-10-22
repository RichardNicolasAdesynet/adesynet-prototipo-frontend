import type { ModuloResumen, ModuloFilters } from '../../../../types/admin.types';

export interface ModulesManagementProps {
  modulos: ModuloResumen[];
  onModuloEdit: (modulo: ModuloResumen) => void;
  onModuloCreate: () => void;
  onModuloToggleEdicion: (cdModulo: string, nuevoEstado: boolean) => void;
  onFiltersChange: (filters: ModuloFilters) => void;
  loading?: boolean;
}