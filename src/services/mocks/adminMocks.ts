import type { DashboardStats, UsuarioResumen, RolResumen, ModuloResumen, UsuarioFormData, AccesoCompleto } from '../../types/admin.types';

export const mockDashboardStats: DashboardStats = {
  totalUsuarios: 45,
  totalRoles: 8,
  totalModulos: 12,
  usuariosActivos: 38,
  usuariosInactivos: 7,
  ultimaActualizacion: new Date().toISOString()
};

// export const mockUsuarios: UsuarioResumen[] = [
//   {
//     cdUsuario: 'USR05',
//     dsUsuario: 'Desarrollador backend',
//     nombreCompleto: 'David Nicolas',
//     cdRol: 'ROL02',
//     rolNombre: 'Gerente General',
//     estaActivo: true,
//     email: 'Rnicolas@empresa.com',
//     id: '',
//     nombre: ''
//   },
//   {
//     cdUsuario: 'USR01',
//     dsUsuario: 'Administrador Sistema',
//     nombreCompleto: 'Ana García',
//     cdRol: 'ROL03',
//     rolNombre: 'Administrador del Sistema',
//     estaActivo: true,
//     id: '',
//     nombre: ''
//   },
//   {
//     cdUsuario: 'USR02',
//     dsUsuario: 'Supervisor Area',
//     nombreCompleto: 'María López',
//     cdRol: 'ROL04',
//     rolNombre: 'Supervisor',
//     estaActivo: false,
//     id: '',
//     nombre: ''
//   }
// ];

export const mockRoles: RolResumen[] = [
  {
    cdRol: 'ROL01',
    nombre: 'Desarrollador Backend',
    descripcion: 'Encargado de programar las funcionalidades',
    activo: true,
    cantidadUsuarios: 3,
    id: '',
    estaActivo: false
  },
  {
    cdRol: 'ROL02',
    nombre: 'Gerente General',
    descripcion: 'Gestiona todas las áreas',
    activo: true,
    cantidadUsuarios: 1,
    id: '',
    estaActivo: false
  },
  {
    cdRol: 'ROL03',
    nombre: 'Administrador del Sistema',
    descripcion: 'Administra usuarios y permisos',
    activo: true,
    cantidadUsuarios: 2,
    id: '',
    estaActivo: false
  }
];

export const mockModulos: ModuloResumen[] = [
  {
    cdModulo: 'MOD01',
    dsModulo: 'Seguridad',
    flgEdicion: true,
    cantidadAccesos: 5,
    cantidadRolesConAcceso: 3
  },
  {
    cdModulo: 'MOD02',
    dsModulo: 'Soporte',
    flgEdicion: true,
    cantidadAccesos: 8,
    cantidadRolesConAcceso: 4
  },
  {
    cdModulo: 'MOD03',
    dsModulo: 'Reportes',
    flgEdicion: false,
    cantidadAccesos: 3,
    cantidadRolesConAcceso: 2
  }
];

// mas mocks

export const mockRolesCompletos: RolResumen[] = [
  {
    cdRol: 'ROL01',
    nombre: 'Desarrollador Backend',
    descripcion: 'Encargado de programar las funcionalidades',
    activo: true,
    cantidadUsuarios: 3,
    id: '',
    estaActivo: false
  },
  {
    cdRol: 'ROL02',
    nombre: 'Gerente General',
    descripcion: 'Gestiona todas las áreas',
    activo: true,
    cantidadUsuarios: 1,
    id: '',
    estaActivo: false
  },
  {
    cdRol: 'ROL03',
    nombre: 'Administrador del Sistema',
    descripcion: 'Administra usuarios y permisos',
    activo: true,
    cantidadUsuarios: 2,
    id: '',
    estaActivo: false
  },
  {
    cdRol: 'ROL04',
    nombre: 'Supervisor',
    descripcion: 'Supervisa equipos de trabajo',
    activo: true,
    cantidadUsuarios: 4,
    id: '',
    estaActivo: false
  },
  {
    cdRol: 'ROL05',
    nombre: 'Técnico Soporte',
    descripcion: 'Brinda soporte técnico',
    activo: true,
    cantidadUsuarios: 8,
    id: '',
    estaActivo: false
  }
];

// export const mockUsuarioFormData: UsuarioFormData = {
//   cdUsuario: '',
//   dsUsuario: '',
//   nombre: '',
//   apellidoP: '',
//   apellidoM: '',
//   dni: '',
//   email: '',
//   cdRol: 'ROL05', // Técnico Soporte por defecto
//   estaActivo: true,
//   claveUsuario: ''
// };

export const mockAccesos: AccesoCompleto[] = [
  {
    cdRol: 'ROL03',
    rolNombre: 'Administrador del Sistema',
    cdModulo: 'MOD01',
    moduloNombre: 'Seguridad',
    moduloHabilitado: true,
    permisos: [
      {
        id: 1,
        tipoPermiso: 5,
        descripcionPermiso: 'Control total sobre el módulo',
        fecAsignacion: '2025-10-14T17:01:33.096477Z'
      }
    ],
    fecCreacion: '2025-10-17T16:44:16.530867Z',
    fecModificacion: '2025-10-17T16:44:16.530867Z'
  },
  {
    cdRol: 'ROL03',
    rolNombre: 'Administrador del Sistema',
    cdModulo: 'MOD02',
    moduloNombre: 'Soporte',
    moduloHabilitado: true,
    permisos: [
      {
        id: 10,
        tipoPermiso: 1,
        descripcionPermiso: 'Permite consultar información',
        fecAsignacion: '2025-10-17T16:44:16.532294Z'
      },
      {
        id: 11,
        tipoPermiso: 2,
        descripcionPermiso: 'Permite ingresar información',
        fecAsignacion: '2025-10-17T16:44:16.532295Z'
      },
      {
        id: 12,
        tipoPermiso: 3,
        descripcionPermiso: 'Permite modificar registros existentes',
        fecAsignacion: '2025-10-17T16:44:16.532295Z'
      }
    ],
    fecCreacion: '2025-10-17T16:44:16.530867Z',
    fecModificacion: '2025-10-17T16:44:16.530867Z'
  },
  {
    cdRol: 'ROL01',
    rolNombre: 'Desarrollador Backend',
    cdModulo: 'MOD02',
    moduloNombre: 'Soporte',
    moduloHabilitado: true,
    permisos: [
      {
        id: 20,
        tipoPermiso: 1,
        descripcionPermiso: 'Permite consultar información',
        fecAsignacion: '2025-10-17T16:44:16.532294Z'
      }
    ],
    fecCreacion: '2025-10-17T16:44:16.530867Z',
    fecModificacion: '2025-10-17T16:44:16.530867Z'
  }
];