// src/types/admin.types.ts
export interface DashboardStats {
  totalUsuarios: number;
  totalRoles: number;
  totalModulos: number;
  usuariosActivos: number;
  usuariosInactivos: number;
  ultimaActualizacion: string;
}

export interface UsuarioResumen extends BaseEntity {
  cdUsuario: string;
  dsUsuario: string;
  nombreCompleto: string;
  cdRol: string;
  rolNombre: string;
  estaActivo: boolean;
  email?: string;
}

export interface RolResumen extends BaseEntity {
  cdRol: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  cantidadUsuarios: number;
}

export interface ModuloResumen {
  cdModulo: string;
  dsModulo: string;
  flgEdicion: boolean;
  cantidadAccesos: number;
  cantidadRolesConAcceso: number;
}

// Props para los componentes
export interface DashboardHeaderProps {
  stats: DashboardStats;
  onRefresh?: () => void;
  cargando: boolean;
}

export interface StatsCardProps {
  titulo: string;
  valor: number | string;
  subtitulo?: string;
  variacion?: number;
  icono?: string;
  tipo?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

// Tipos para formularios de usuario
export interface UsuarioFormData {
  cdUsuario: string;
  dsUsuario: string;
  nombre: string;
  apellidoP: string;
  apellidoM?: string;
  dni: string;
  email: string;
  cdRol: string;
  estaActivo: boolean;
  claveUsuario?: string;
}

export interface UsuarioFilters {
  cdRol?: string;
  estaActivo?: boolean;
  searchTerm?: string;
}

// Props para componentes de usuarios
export interface UsersManagementProps {
  //usuarios: UsuarioResumen[];
  roles: RolResumen[];
  onUsuarioEdit: (usuario: UsuarioResumen) => void;
  onUsuarioCreate: () => void;
  onUsuarioToggleStatus: (cdUsuario: string, nuevoEstado: boolean) => void;
  onFiltersChange: (filters: UsuarioFilters) => void;
  loading?: boolean;
}

export interface UserFormProps {
  usuario?: UsuarioFormData;
  roles: RolResumen[];
  isOpen: boolean;
  isEditing: boolean;
  onSubmit: (data: UsuarioFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface UsersTableProps {
  usuarios: UsuarioResumen[];
  onEdit: (usuario: UsuarioResumen) => void;
  onToggleStatus: (cdUsuario: string, nuevoEstado: boolean) => void;
  loading?: boolean;
}

export interface UsersFiltersProps {
  roles: RolResumen[];
  filters: UsuarioFilters;
  onFiltersChange: (filters: UsuarioFilters) => void;
}

export interface TablePaginationProps {
  paginaActual: number;
  totalPaginas: number;
  totalRegistros: number;
  registrosPorPagina: number;
  onPaginaChange: (pagina: number) => void;
  onRegistrosPorPaginaChange: (cantidad: number) => void;
}

export interface ExportButtonProps {
  onExport: (formato: 'excel' | 'pdf') => void;
  loading?: boolean;
}

// Interface genérica para ActionsDropdown
export interface BaseEntity {
  id: string;
  nombre: string;
  estaActivo: boolean;

  [key: string]: any;
}

export interface ActionsDropdownProps<T extends BaseEntity> {
  entidad: T;
  onEdit: (entidad: T) => void;
  onToggleStatus: (id: string, nuevoEstado: boolean) => void;
  onViewDetails: (entidad: T) => void;
  customActions?: Array<{
    label: string;
    icono: string;
    onClick: (entidad: T) => void;
    peligroso?: boolean;
  }>;
}

export interface UserTableRowProps {
  usuario: UsuarioResumen;
  onEdit: (usuario: UsuarioResumen) => void;
  onToggleStatus: (cdUsuario: string, nuevoEstado: boolean) => void;
  onViewDetails: (usuario: UsuarioResumen) => void;
}


// Tipos para formularios de roles
export interface RolFormData {
  cdRol: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface RolFilters {
  activo?: boolean;
  searchTerm?: string;
}

// Props para componentes de roles
export interface RolesManagementProps {
  roles: RolResumen[];
  onRolEdit: (rol: RolResumen) => void;
  onRolCreate: () => void;
  onRolToggleStatus: (cdRol: string, nuevoEstado: boolean) => void;
  onFiltersChange: (filters: RolFilters) => void;
  loading?: boolean;
}

export interface RoleFormProps {
  rol?: RolFormData;
  isOpen: boolean;
  isEditing: boolean;
  onSubmit: (data: RolFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface RolesTableProps {
  roles: RolResumen[];
  onEdit: (rol: RolResumen) => void;
  onToggleStatus: (cdRol: string, nuevoEstado: boolean) => void;
  loading?: boolean;
}

export interface RolesFiltersProps {
  filters: RolFilters;
  onFiltersChange: (filters: RolFilters) => void;
}


// Tipos para formularios de módulos
export interface ModuloFormData {
  cdModulo: string;
  dsModulo: string;
  flgEdicion: boolean;
}

export interface ModuloFilters {
  flgEdicion?: boolean;
  searchTerm?: string;
}

// Props para componentes de módulos
export interface ModulesManagementProps {
  modulos: ModuloResumen[];
  onModuloEdit: (modulo: ModuloResumen) => void;
  onModuloCreate: () => void;
  onModuloToggleEdicion: (cdModulo: string, nuevoEstado: boolean) => void;
  onFiltersChange: (filters: ModuloFilters) => void;
  loading?: boolean;
}

export interface ModuleFormProps {
  modulo?: ModuloFormData;
  isOpen: boolean;
  isEditing: boolean;
  onSubmit: (data: ModuloFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface ModulesTableProps {
  modulos: ModuloResumen[];
  onEdit: (modulo: ModuloResumen) => void;
  onToggleEdicion: (cdModulo: string, nuevoEstado: boolean) => void;
  loading?: boolean;
}

export interface ModulesFiltersProps {
  filters: ModuloFilters;
  onFiltersChange: (filters: ModuloFilters) => void;
}


// Tipos para la matriz de accesos
export interface AccesoCompleto {
  cdRol: string;
  rolNombre: string;
  cdModulo: string;
  moduloNombre: string;
  moduloHabilitado: boolean;
  permisos: Permiso[];
  fecCreacion: string;
  fecModificacion: string;
}

export interface Permiso {
  id: number;
  tipoPermiso: TipoPermiso;
  descripcionPermiso: string;
  fecAsignacion: string;
}

export type TipoPermiso = 1 | 2 | 3 | 4 | 5;

export interface PermisoConfig {
  tipo: TipoPermiso;
  nombre: string;
  descripcion: string;
  icono: string;
}

export interface MatrizAccesosProps {
  roles: RolResumen[];
  modulos: ModuloResumen[];
  accesos: AccesoCompleto[];
  onPermisoChange: (cdRol: string, cdModulo: string, tipoPermiso: TipoPermiso, asignado: boolean) => void;
  onModuloHabilitadoChange: (cdRol: string, cdModulo: string, habilitado: boolean) => void;
  loading?: boolean;
}

export interface AccessManagementProps {
  roles: RolResumen[];
  modulos: ModuloResumen[];
  accesos: AccesoCompleto[];
  onPermisoChange: (cdRol: string, cdModulo: string, tipoPermiso: TipoPermiso, asignado: boolean) => void;
  onModuloHabilitadoChange: (cdRol: string, cdModulo: string, habilitado: boolean) => void;
  onBulkPermissionChange: (cdRol: string, permisos: TipoPermiso[]) => void;
  loading?: boolean;
}

export interface PermisoCellProps {
  rol: RolResumen;
  modulo: ModuloResumen;
  acceso?: AccesoCompleto;
  tipoPermiso: TipoPermiso;
  configPermiso: PermisoConfig;
  onChange: (cdRol: string, cdModulo: string, tipoPermiso: TipoPermiso, asignado: boolean) => void;
}

export interface ModuloHabilitadoCellProps {
  rol: RolResumen;
  modulo: ModuloResumen;
  acceso?: AccesoCompleto;
  onChange: (cdRol: string, cdModulo: string, habilitado: boolean) => void;
}