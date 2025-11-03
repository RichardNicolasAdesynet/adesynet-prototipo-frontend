import type { TipoPermiso } from "../../../../types/admin.types";


export interface AccessManagementProps {
  onPermisoChange: (cdRol: string, cdModulo: string, tipoPermiso: TipoPermiso, asignado: boolean) => void;
  onModuloHabilitadoChange: (cdRol: string, cdModulo: string, habilitado: boolean) => void;
  // onBulkPermissionChange: (cdRol: string, permisos: TipoPermiso[]) => void;
  loading?: boolean;
}