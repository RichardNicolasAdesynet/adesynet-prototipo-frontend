import type { PaginatedResponse } from "./api.types";

// src/types/admin.types.ts
export interface DashboardStats {
  totalUsuarios: number;
  totalRoles: number;
  totalModulos: number;
  usuariosActivos: number;
  usuariosInactivos: number;
  ultimaActualizacion: string;
}

/*********EMTIDADES DETALLADAS******* */
export interface UsuarioDetallado {
  cdUsuario: string;
  dsUsuario: string;
  nombre: string;
  apellidoP: string;
  apellidoM: string;
  nombreCompleto: string;
  dni: string;
  email: string;
  estadoCivil: string;
  sexo: string;
  fecNacimiento: string;
  direcc: string;
  cdDepartamento: string;
  cdProvincia: string;
  cdDistrito: string;
  cdZona: string;
  telef1: string;
  telef2: string;
  cdRol: string;
  rolNombre: string;
  cdArea: string;
  cdCargo: string;
  sueldo: number;
  fecIngreso: string;
  fecCese: string | null;
  estaActivoLaboralmente: boolean;
  flgBloqueado: boolean;
  flgCambiarClave: boolean;
  fecModClave: string;
  cdUsuCre: string;
  fecCre: string;
}

export interface RolDetallado {
  cdRol: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fecmod?: string;
  cantidadUsuarios: number;
  cantidadAccesos: number;
  accesos?: Array<{
    cdModulo: string;
    dsModulo: string;
    moduloHabilitado: boolean;
    cantidadPermisos: number;
  }>;
}

export interface ModuloDetallado {
  cdModulo: string;
  dsModulo: string;
  flgEdicion: boolean;
  fecmod?: string;
  cantidadAccesos: number;
  cantidadRolesConAcceso: number;
  accesos?: Array<{
    cdRol: string;
    rolNombre: string;
    moduloHabilitado: boolean;
    cantidadPermisos: number;
  }>;
}

/************RESUME ENTITY************* */
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
// Tipos para la matriz de accesos
export interface AccesoResume {
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
// export type TipoPermiso = 'Consultar' | 'Crear' | 'Modificar' | 'Eliminar' | 'ControlTotal';
// Función para convertir TipoPermiso a nombre (por si necesitas)
export const convertirPermisoANombre = (tipoPermiso: TipoPermiso): string => {
  const mapeoInverso: Record<TipoPermiso, string> = {
    1: "Consultar",
    2: "Crear",
    3: "Modificar",
    4: "Eliminar",
    5: "Control Total",
  };

  return mapeoInverso[tipoPermiso];
};

// Función para convertir nombre de permiso a TipoPermiso
export const convertirPermisoANumero = (
  permisoNombre: string
): TipoPermiso | null => {
  const mapeo: Record<string, TipoPermiso> = {
    Consultar: 1,
    Crear: 2,
    Modificar: 3,
    Eliminar: 4,
    ControlTotal: 5,
  };

  return mapeo[permisoNombre] || null;
};


/***********************/
// Función auxiliar para calcular el tamaño de página
const calcularPageSize = (total: number, base: number = 10): number => {
    if (total <= base) return base;
    return Math.ceil(total / base) * base;
  };

export const cargarDatosCompletos = async (
    serviceMethod: (params?: any) => Promise<PaginatedResponse<any>>,
    setState: (data: any[]) => void,
    entidadNombre: string
  ): Promise<void> => {
    try {
      const respuestaInicial = await serviceMethod({
        'PageRequest.page': 1,
        'PageRequest.rows': 1
      });
      const total = respuestaInicial.totalRecords || 0;

      // Calcular tamaño de página óptimo
      const pageSize = calcularPageSize(total);

      // Segunda llamada para obtener todos los datos
      const respuestaCompleta = await serviceMethod({
        'PageRequest.page': 1,
        'PageRequest.rows': pageSize
      });

      setState(respuestaCompleta.data);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : `Error al cargar ${entidadNombre}`;
      // showAlert('error', 'Error al cargar', errorMsg);
      throw error;
    }
  };



//****** */

export interface PermisoConfig {
  tipo: TipoPermiso;
  nombre: string;
  descripcion: string;
  icono: string;
}

/********************************** */

// Props para los componentes compartidos //

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
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, nuevoEstado: boolean) => void;
  onViewDetails: (entidad: T) => void;
  customActions?: Array<{
    label: string;
    icono: string;
    onClick: (entidad: T) => void;
    peligroso?: boolean;
  }>;
}

export interface ExportButtonProps {
  onExport: (formato: "excel" | "pdf") => void;
  loading?: boolean;
}

export interface TablePaginationProps {
  paginaActual: number;
  totalPaginas: number;
  totalRegistros: number;
  registrosPorPagina: number;
  onPaginaChange: (pagina: number) => void;
  onRegistrosPorPaginaChange: (cantidad: number) => void;
}

//admin dashboard components //
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
  tipo?: "primary" | "success" | "warning" | "danger" | "info";
}

// Props para componentes de usuarios
export interface UsuarioFilters {
  cdRol?: string;
  estaActivo?: boolean;
  searchTerm?: string;
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
export interface UsersFiltersProps {
  roles: RolResumen[];
  filters: UsuarioFilters;
  onFiltersChange: (filters: UsuarioFilters) => void;
}

export interface UsersTableProps {
  usuarios: UsuarioResumen[];
  onEdit: (usuario: UsuarioResumen) => void;
  onDelete: (cdUsuario: string) => void;
  onToggleStatus: (cdUsuario: string, nuevoEstado: boolean) => void;
  loading?: boolean;
}

// Props para componentes de roles

export interface RolFilters {
  activo?: boolean;
  searchTerm?: string;
}

// Props para componentes de roles
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
  onDelete: (cdRol: string) => void;
  onToggleStatus: (cdRol: string, nuevoEstado: boolean) => void;
  loading?: boolean;
}

export interface RolesFiltersProps {
  filters: RolFilters;
  onFiltersChange: (filters: RolFilters) => void;
}

// Props para componentes de modulos

export interface ModuloFilters {
  flgEdicion?: boolean;
  searchTerm?: string;
}

// Props para componentes de módulos

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
  onDelete: (cdModulo: string) => void;
  onToggleEdicion: (cdModulo: string, nuevoEstado: boolean) => void;
  loading?: boolean;
}

export interface ModulesFiltersProps {
  filters: ModuloFilters;
  onFiltersChange: (filters: ModuloFilters) => void;
}

/***********************ACcesos ************************* */
export interface MatrizAccesosProps {
  roles: RolResumen[];
  modulos: ModuloResumen[];
  accesos: AccesoResume[];
  onPermisoChange: (
    cdRol: string,
    cdModulo: string,
    tipoPermiso: TipoPermiso,
    asignado: boolean
  ) => void;
  onModuloHabilitadoChange: (
    cdRol: string,
    cdModulo: string,
    habilitado: boolean
  ) => void;
  loading?: boolean;
}

export interface PermisoCellProps {
  rol: RolResumen;
  modulo: ModuloResumen;
  acceso?: AccesoResume;
  tipoPermiso: TipoPermiso;
  configPermiso: PermisoConfig;
  onChange: (
    cdRol: string,
    cdModulo: string,
    tipoPermiso: TipoPermiso,
    asignado: boolean
  ) => void;
}

export interface ModuloHabilitadoCellProps {
  rol: RolResumen;
  modulo: ModuloResumen;
  acceso?: AccesoResume;
  onChange: (cdRol: string, cdModulo: string, habilitado: boolean) => void;
}

//---*--------DATOS PARA FORMS-----------------//

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

// Tipos para formularios de roles
export interface RolFormData {
  cdRol: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

// Tipos para formularios de módulos
export interface ModuloFormData {
  cdModulo: string;
  dsModulo: string;
  flgEdicion: boolean;
}

export interface AccesoFormData {
  cdRol: string;
  cdModulo: string;
  moduloHabilitado: boolean;
  permisos: TipoPermiso[];
}
//  LA LOS CAMPOS AL CREAR Y MODIFICAR SON DIFERENTES
export interface AccesoFromDataUpdate {
  moduloHabilitado: boolean;
  permisos: TipoPermiso[];
}

/************************************** */
