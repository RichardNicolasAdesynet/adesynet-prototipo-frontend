import type { DashboardStats, UsuarioResumen, RolResumen, ModuloResumen, UsuarioFormData } from '../../types/admin.types';

export const mockDashboardStats: DashboardStats = {
  totalUsuarios: 45,
  totalRoles: 8,
  totalModulos: 12,
  usuariosActivos: 38,
  usuariosInactivos: 7,
  ultimaActualizacion: new Date().toISOString()
};

export const mockUsuarios: UsuarioResumen[] = [
  {
    cdUsuario: 'USR05',
    dsUsuario: 'Desarrollador backend',
    nombreCompleto: 'David Nicolas',
    cdRol: 'ROL02',
    rolNombre: 'Gerente General',
    estaActivo: true,
    email: 'Rnicolas@empresa.com'
  },
  {
    cdUsuario: 'USR01',
    dsUsuario: 'Administrador Sistema',
    nombreCompleto: 'Ana García',
    cdRol: 'ROL03',
    rolNombre: 'Administrador del Sistema',
    estaActivo: true
  },
  {
    cdUsuario: 'USR02',
    dsUsuario: 'Supervisor Area',
    nombreCompleto: 'María López',
    cdRol: 'ROL04',
    rolNombre: 'Supervisor',
    estaActivo: false
  }
];

export const mockRoles: RolResumen[] = [
  {
    cdRol: 'ROL01',
    nombre: 'Desarrollador Backend',
    descripcion: 'Encargado de programar las funcionalidades',
    activo: true,
    cantidadUsuarios: 3
  },
  {
    cdRol: 'ROL02',
    nombre: 'Gerente General',
    descripcion: 'Gestiona todas las áreas',
    activo: true,
    cantidadUsuarios: 1
  },
  {
    cdRol: 'ROL03',
    nombre: 'Administrador del Sistema',
    descripcion: 'Administra usuarios y permisos',
    activo: true,
    cantidadUsuarios: 2
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
    cantidadUsuarios: 3
  },
  {
    cdRol: 'ROL02',
    nombre: 'Gerente General',
    descripcion: 'Gestiona todas las áreas',
    activo: true,
    cantidadUsuarios: 1
  },
  {
    cdRol: 'ROL03',
    nombre: 'Administrador del Sistema',
    descripcion: 'Administra usuarios y permisos',
    activo: true,
    cantidadUsuarios: 2
  },
  {
    cdRol: 'ROL04',
    nombre: 'Supervisor',
    descripcion: 'Supervisa equipos de trabajo',
    activo: true,
    cantidadUsuarios: 4
  },
  {
    cdRol: 'ROL05',
    nombre: 'Técnico Soporte',
    descripcion: 'Brinda soporte técnico',
    activo: true,
    cantidadUsuarios: 8
  }
];

export const mockUsuarioFormData: UsuarioFormData = {
  cdUsuario: '',
  dsUsuario: '',
  nombre: '',
  apellidoP: '',
  apellidoM: '',
  dni: '',
  email: '',
  cdRol: 'ROL05', // Técnico Soporte por defecto
  estaActivo: true,
  claveUsuario: ''
};