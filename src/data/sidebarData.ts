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
    // ✅ CORREGIDO: Usar permisos reales de la API
    permisosRequeridos: ['MOD01:CONSULTAR', 'USUARIOS:CONSULTAR']
  },
  {
    id: 'roles',
    nombre: 'Gestión de Roles',
    icono: '🎭',
    ruta: '/admin/roles', 
    modulo: 'MOD02',
    permisosRequeridos: ['MOD02:CONSULTAR', 'ROLES:CONSULTAR']
  },
  {
    id: 'modulos',
    nombre: 'Gestión de Módulos',
    icono: '📦',
    ruta: '/admin/modulos',
    modulo: 'MOD03',
    permisosRequeridos: ['MOD03:CONSULTAR', 'MODULOS:CONSULTAR']
  },
  {
    id: 'accesos',
    nombre: 'Gestión de Accesos',
    icono: '⚙️',
    ruta: '/admin/accesos',
    modulo: 'MOD04',
    permisosRequeridos: ['MOD04:CONSULTAR', 'ACCESOS:CONSULTAR']
  }
];