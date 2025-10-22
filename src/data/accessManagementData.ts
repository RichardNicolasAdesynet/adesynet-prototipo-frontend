import type { PermisoConfig, TipoPermiso } from '../types/admin.types';

export const permisosConfig: Record<TipoPermiso, PermisoConfig> = {
  1: {
    tipo: 1,
    nombre: 'Consultar',
    descripcion: 'Permite consultar información',
    icono: '👁️'
  },
  2: {
    tipo: 2,
    nombre: 'Ingresar',
    descripcion: 'Permite ingresar información',
    icono: '➕'
  },
  3: {
    tipo: 3,
    nombre: 'Modificar',
    descripcion: 'Permite modificar registros existentes',
    icono: '✏️'
  },
  4: {
    tipo: 4,
    nombre: 'Eliminar',
    descripcion: 'Permite eliminar registros',
    icono: '🗑️'
  },
  5: {
    tipo: 5,
    nombre: 'Control Total',
    descripcion: 'Control total sobre el módulo',
    icono: '⚡'
  }
};

export const tiposPermisoDisponibles: TipoPermiso[] = [1, 2, 3, 4, 5];