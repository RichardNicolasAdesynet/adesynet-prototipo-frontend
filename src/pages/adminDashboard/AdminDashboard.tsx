import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BaseLayout } from '../layout/BaseLayout';
import { useAuth } from '../../hooks/auth/useAuth';
import { Sidebar } from '../../components/navigation';
import { DashboardHeader } from './components/dashboardHeader';
import { UsersManagement } from './components/usersManagement';
import { RolesManagement } from './components/rolesManagement';
import { ModulesManagement } from './components/modulesManagement';
import { AccessManagement } from './components/accessManagement';
import type { DashboardStats } from '../../types/admin.types';
import { userService } from '../../services/api/userService';
import { modulosService } from '../../services/api/modulosService';
import { rolesService } from '../../services/api/rolesServices';

export const AdminDashboard: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const statsIniciales: DashboardStats = {
    totalModulos: 0,
    totalRoles: 0,
    totalUsuarios: 0,
    usuariosActivos: 0,
    usuariosInactivos: 0,
    ultimaActualizacion: new Date().toISOString()
  };
  const [stats, setStats] = useState<DashboardStats>(statsIniciales);
  const [cargando, setCargando] = useState<boolean>(false);
  const [itemActivo, setItemActivo] = useState<string>('dashboard');
  // Determinar item activo basado en la ruta actual


  useEffect(() => {
    const rutas: Record<string, string> = {
      '/admin': 'dashboard',
      '/admin/usuarios': 'usuarios',
      '/admin/roles': 'roles',
      '/admin/modulos': 'modulos',
      '/admin/accesos': 'accesos'
    } as const;

    const item = rutas[location.pathname as keyof typeof rutas] || 'dashboard';
    setItemActivo(item);
  }, [location.pathname]);

  const manejarNavegacion = (ruta: string) => {
    navigate(ruta);
  };

  //********PARA EL DASHBOARD HEADER********** */
  const cargarStats = async (): Promise<DashboardStats> => {
    const totalUsuarios = (await userService.getUsuariosList()).length;
    const usuarioActivos = ((await userService.getUsuariosList()).filter(u => u.estaActivo === true)).length;
    const totalModulos = (await modulosService.getModulosList()).length;
    const totalRoles = (await rolesService.getRolesList()).length;

    return {
      totalModulos: totalModulos,
      totalRoles: totalRoles,
      totalUsuarios: totalUsuarios,
      usuariosActivos: usuarioActivos,
      usuariosInactivos: (totalUsuarios - usuarioActivos),
      ultimaActualizacion: new Date().toISOString()
    };
  };
  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      const statsData = await cargarStats();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats(statsData);
      setCargando(false);
    };

    cargarDatos();
  }, []);

  const manejarRefresh = async () => {
    setCargando(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const statsActualizados = await cargarStats();
    setStats(statsActualizados);
    setCargando(false);
  };
  //********************************************* */
  if (!usuario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No autenticado</h2>
          <p className="text-slate-600">Por favor inicia sesión para continuar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10 flex">
      {/* Sidebar Fijo */}
      <div className="shrink-0">
        <Sidebar
          usuario={usuario}
          onNavegacion={manejarNavegacion}
          itemActivo={itemActivo}
        />
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <BaseLayout usuario={usuario} onLogout={logout}>
          <div className="space-y-6">
            {/* Mostrar DashboardHeader solo en dashboard principal */}
            {location.pathname === '/admin' && (
              <DashboardHeader
                stats={stats}
                onRefresh={manejarRefresh}
                cargando={cargando}
              />
            )}

            {/* Indicador de carga */}
            {cargando && location.pathname === '/admin' && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                <span className="ml-3 text-slate-600">Cargando datos...</span>
              </div>
            )}

            {/* Contenido dinámico basado en la ruta */}
            <div className="dashboard-content">
              {location.pathname === '/admin/usuarios' && (
                <div className="animate-fade-in">
                  <UsersManagement />
                </div>
              )}

              {location.pathname === '/admin/roles' && (
                <div className="animate-fade-in">
                  <RolesManagement />
                </div>
              )}

              {location.pathname === '/admin/modulos' && (
                <div className="animate-fade-in">
                  <ModulesManagement />
                </div>
              )}

              {location.pathname === '/admin/accesos' && (
                <div className="animate-fade-in">
                  <AccessManagement
                    onPermisoChange={async (cdRol, cdModulo, tipoPermiso, asignado) => {
                      console.log(`Permiso ${tipoPermiso} ${asignado ? 'asignado' : 'removido'} para rol ${cdRol} en módulo ${cdModulo}`);
                    }}
                    onModuloHabilitadoChange={async (cdRol, cdModulo, habilitado) => {
                      console.log(`Módulo ${cdModulo} ${habilitado ? 'habilitado' : 'deshabilitado'} para rol ${cdRol}`);
                    }}
                  // onBulkPermissionChange={async (cdRol, permisos) => {
                  //   console.log(`Asignación masiva de permisos ${permisos.join(', ')} para rol ${cdRol}`);
                  // }}
                  />
                </div>
              )}

              {location.pathname === '/admin' && !cargando && (
                <div className="animate-fade-in">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <span className="text-2xl text-white">📊</span>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-4">
                      Bienvenido al Panel de Administración
                    </h2>
                    <p className="text-slate-600 text-lg max-w-md mx-auto">
                      Selecciona una sección del menú lateral para comenzar a gestionar tu sistema.
                    </p>
                    <div className="mt-8 flex justify-center space-x-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <span className="text-cyan-600">👥</span>
                        </div>
                        <span className="text-sm text-slate-600">Usuarios</span>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <span className="text-purple-600">🔑</span>
                        </div>
                        <span className="text-sm text-slate-600">Roles</span>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <span className="text-green-600">📦</span>
                        </div>
                        <span className="text-sm text-slate-600">Módulos</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </BaseLayout>
      </div>
    </div>
  );
};