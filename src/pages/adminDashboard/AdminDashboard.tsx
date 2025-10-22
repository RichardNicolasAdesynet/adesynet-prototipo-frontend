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
import { mockDashboardStats, mockUsuarios, mockRolesCompletos, mockModulos, mockAccesos } from '../../services/mocks/adminMocks';
import type { DashboardStats, UsuarioFilters } from '../../types/admin.types';

export const AdminDashboard: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState<DashboardStats>(mockDashboardStats);
  const [usuarios, setUsuarios] = useState(mockUsuarios);
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
    setUsuariosLoading(true);
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 500));

    setUsuarios(prev => prev.map(usuario =>
      usuario.cdUsuario === cdUsuario
        ? { ...usuario, estaActivo: nuevoEstado }
        : usuario
    ));

    setUsuariosLoading(false);
  };

  const handleFiltersChange = (filters: UsuarioFilters) => {
    console.log('Filtros cambiados:', filters);
  };

  if (!usuario) {
    return <div>No autenticado</div>;
  }

  return (
    <div className="admin-layout">
      <Sidebar
        usuario={usuario}
        onNavegacion={manejarNavegacion}
        itemActivo={itemActivo}
      />

      <div className="admin-content">
        <BaseLayout usuario={usuario} onLogout={logout}>
          <div className="admin-dashboard">
            <DashboardHeader
              stats={stats}
              onRefresh={manejarRefresh}
            />

            {cargando && (
              <div className="loading-indicator">
                <p>Cargando datos...</p>
              </div>
            )}

            <div className="dashboard-content">
              {/* Aquí irá el contenido basado en la ruta */}
              {location.pathname === '/admin/usuarios' && (
                <UsersManagement
                  usuarios={usuarios}
                  roles={mockRolesCompletos}
                  onUsuarioEdit={handleUsuarioEdit}
                  onUsuarioCreate={handleUsuarioCreate}
                  onUsuarioToggleStatus={handleUsuarioToggleStatus}
                  onFiltersChange={handleFiltersChange}
                  loading={usuariosLoading}
                />
              )}

              {location.pathname === '/admin/roles' && (
                <RolesManagement
                  roles={mockRolesCompletos}
                  onRolEdit={(rol) => console.log('Editando rol:', rol)}
                  onRolCreate={() => console.log('Creando nuevo rol')}
                  onRolToggleStatus={async (cdRol, nuevoEstado) => {
                    // Simular cambio de estado
                    console.log(`Cambiando estado del rol ${cdRol} a ${nuevoEstado}`);
                  }}
                  onFiltersChange={(filters) => console.log('Filtros roles:', filters)}
                />
              )}

              {location.pathname === '/admin/modulos' && (
                <ModulesManagement
                  modulos={mockModulos}
                  onModuloEdit={(modulo) => console.log('Editando módulo:', modulo)}
                  onModuloCreate={() => console.log('Creando nuevo módulo')}
                  onModuloToggleEdicion={async (cdModulo, nuevoEstado) => {
                    // Simular cambio de estado de edición
                    console.log(`Cambiando edición del módulo ${cdModulo} a ${nuevoEstado}`);
                  }}
                  onFiltersChange={(filters) => console.log('Filtros módulos:', filters)}
                />
              )}

              
              {location.pathname === '/admin/accesos' && (
                <AccessManagement
                  roles={mockRolesCompletos}
                  modulos={mockModulos}
                  accesos={mockAccesos}
                  onPermisoChange={async (cdRol, cdModulo, tipoPermiso, asignado) => {
                    console.log(`Permiso ${tipoPermiso} ${asignado ? 'asignado' : 'removido'} para rol ${cdRol} en módulo ${cdModulo}`);
                    // Aquí llamarás a la API real
                  }}
                  onModuloHabilitadoChange={async (cdRol, cdModulo, habilitado) => {
                    console.log(`Módulo ${cdModulo} ${habilitado ? 'habilitado' : 'deshabilitado'} para rol ${cdRol}`);
                    // Aquí llamarás a la API real
                  }}
                  onBulkPermissionChange={async (cdRol, permisos) => {
                    console.log(`Asignación masiva de permisos ${permisos.join(', ')} para rol ${cdRol}`);
                    // Aquí llamarás a la API real
                  }}
                />
              )}

              {location.pathname === '/admin' && (
                <div className="dashboard-welcome">
                  <h2>Bienvenido al Panel de Administración</h2>
                  <p>Selecciona una sección del menú para comenzar.</p>
                </div>
              )}
            </div>
          </div>
        </BaseLayout>
      </div>
    </div>
  );
};