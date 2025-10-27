// src/data/sidebarData.ts 
import type { SidebarItem } from '../types/navigation.types';

export const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    nombre: 'Dashboard',
    icono: '📊',
    ruta: '/admin',
    modulo: 'MOD00'
  },
  {
    id: 'usuarios',
    nombre: 'Gestión de Usuarios',
    icono: '👥',
    ruta: '/admin/usuarios',
    modulo: 'MOD01',
    permisosRequeridos: ['MOD01:Consultar']
  },
  {
    id: 'roles',
    nombre: 'Gestión de Roles',
    icono: '🎭',
    ruta: '/admin/roles', 
    modulo: 'MOD02',
    permisosRequeridos: ['MOD02:Consultar']
  },
  {
    id: 'modulos',
    nombre: 'Gestión de Módulos',
    icono: '📦',
    ruta: '/admin/modulos',
    modulo: 'MOD03',
    permisosRequeridos: ['MOD03:Consultar']
  },
  {
    id: 'accesos',
    nombre: 'Gestión de Accesos',
    icono: '⚙️',
    ruta: '/admin/accesos',
    modulo: 'MOD04',
    permisosRequeridos: ['MOD04:Consultar']
  }
];