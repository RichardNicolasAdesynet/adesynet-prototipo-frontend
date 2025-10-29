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
import { mockDashboardStats, mockRolesCompletos, mockModulos, mockAccesos } from '../../services/mocks/adminMocks';
import type { DashboardStats, UsuarioFilters } from '../../types/admin.types';

export const AdminDashboard: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState<DashboardStats>(mockDashboardStats);
  const [cargando, setCargando] = useState<boolean>(false);
  const [usuariosLoading, setUsuariosLoading] = useState<boolean>(false);
  const [itemActivo, setItemActivo] = useState<string>('dashboard');
  // Determinar item activo basado en la ruta actual

  useEffect(() => {
    const rutas: Record<string, string> = {
      '/admin': 'dashboard',
      '/admin/usuarios': 'usuarios',
      '/admin/roles': 'roles',
      '/admin/modulos': 'modulos',
      '/admin/accesos': 'accesos'
    };

    setItemActivo(rutas[location.pathname] || 'dashboard');
  }, [location.pathname]);

  const manejarNavegacion = (ruta: string) => {
    navigate(ruta);
  };

  // Simular carga de datos
  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats(mockDashboardStats);
      setCargando(false);
    };

    cargarDatos();
  }, []);

  const manejarRefresh = async () => {
    setCargando(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setStats(prev => ({
      ...prev,
      ultimaActualizacion: new Date().toISOString()
    }));
    setCargando(false);
  };

  // Handlers para UsersManagement
  const handleUsuarioEdit = (usuario: any) => {
    console.log('Editando usuario:', usuario);
  };

  const handleUsuarioCreate = () => {
    console.log('Creando nuevo usuario');
  };

  const handleUsuarioToggleStatus = async (cdUsuario: string, nuevoEstado: boolean) => {
    // setUsuariosLoading(true);
    // // Simular llamada a API
    // await new Promise(resolve => setTimeout(resolve, 500));

    // setUsuarios(prev => prev.map(usuario =>
    //   usuario.cdUsuario === cdUsuario
    //     ? { ...usuario, estaActivo: nuevoEstado }
    //     : usuario
    // ));

    // setUsuariosLoading(false);
    console.log(`Cambiando estado del usuario ${cdUsuario} a ${nuevoEstado}`);
  };

  const handleFiltersChange = (filters: UsuarioFilters) => {
    console.log('Filtros cambiados:', filters);
  };

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
                  <UsersManagement
                    onUsuarioEdit={handleUsuarioEdit}
                    onUsuarioCreate={handleUsuarioCreate}
                    onUsuarioToggleStatus={handleUsuarioToggleStatus}
                    onFiltersChange={handleFiltersChange}
                    loading={usuariosLoading}
                  />
                </div>
              )}

              {location.pathname === '/admin/roles' && (
                <div className="animate-fade-in">
                  <RolesManagement
                    onRolEdit={(rol) => console.log('Editando rol:', rol)}
                    onRolCreate={() => console.log('Creando nuevo rol')}
                    onRolToggleStatus={async (cdRol, nuevoEstado) => {
                      console.log(`Cambiando estado del rol ${cdRol} a ${nuevoEstado}`);
                    }}
                    onFiltersChange={(filters) => console.log('Filtros roles:', filters)}
                  />
                </div>
              )}

              {location.pathname === '/admin/modulos' && (
                <div className="animate-fade-in">
                  <ModulesManagement
                    modulos={mockModulos}
                    onModuloEdit={(modulo) => console.log('Editando módulo:', modulo)}
                    onModuloCreate={() => console.log('Creando nuevo módulo')}
                    onModuloToggleEdicion={async (cdModulo, nuevoEstado) => {
                      console.log(`Cambiando edición del módulo ${cdModulo} a ${nuevoEstado}`);
                    }}
                    onFiltersChange={(filters) => console.log('Filtros módulos:', filters)}
                  />
                </div>
              )}

              {location.pathname === '/admin/accesos' && (
                <div className="animate-fade-in">
                  <AccessManagement
                    roles={mockRolesCompletos}
                    modulos={mockModulos}
                    accesos={mockAccesos}
                    onPermisoChange={async (cdRol, cdModulo, tipoPermiso, asignado) => {
                      console.log(`Permiso ${tipoPermiso} ${asignado ? 'asignado' : 'removido'} para rol ${cdRol} en módulo ${cdModulo}`);
                    }}
                    onModuloHabilitadoChange={async (cdRol, cdModulo, habilitado) => {
                      console.log(`Módulo ${cdModulo} ${habilitado ? 'habilitado' : 'deshabilitado'} para rol ${cdRol}`);
                    }}
                    onBulkPermissionChange={async (cdRol, permisos) => {
                      console.log(`Asignación masiva de permisos ${permisos.join(', ')} para rol ${cdRol}`);
                    }}
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