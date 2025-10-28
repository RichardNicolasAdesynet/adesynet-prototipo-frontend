import React from 'react';
import { useAuth } from '../../hooks/auth/useAuth';
import { Sidebar } from '../../components/navigation/sidebar/Sidebar';
import { useSidebar } from '../../hooks/useSidebar';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { usuario } = useAuth();
  const { estaColapsado, toggleSidebar, setItemActivo } = useSidebar();
  const navigate = useNavigate();

  // ✅ CORREGIDO: Verificar que usuario existe
  if (!usuario) {
    return <div>Error: No se encontró información del usuario</div>;
  }

  const manejarNavegacion = (ruta: string) => {
    setItemActivo(ruta);
    navigate(ruta);
  };

  return (
    <div className="admin-dashboard">
      <Sidebar
        usuario={usuario}
        onNavegacion={manejarNavegacion}
        itemActivo={window.location.pathname}
      />
      
      <div className={`main-content ${estaColapsado ? 'collapsed' : ''}`}>
        <header className="dashboard-header">
          <button onClick={toggleSidebar} className="sidebar-toggle">
            {estaColapsado ? '☰' : '✕'}
          </button>
          
          <div className="header-actions">
            <span>Bienvenido, {usuario.nombreCompleto}</span>
            <span className="user-role">{usuario.rolNombre}</span>
          </div>
        </header>

        <main className="dashboard-main">
          {/* El contenido de las rutas se cargará aquí */}
        </main>
      </div>
    </div>
  );
  // return (
  //   <div className="admin-layout">
  //     <Sidebar
  //       usuario={usuario}
  //       onNavegacion={manejarNavegacion}
  //       itemActivo={itemActivo}
  //     />

  //     <div className="admin-content">
  //       <BaseLayout usuario={usuario} onLogout={logout}>
  //         <div className="admin-dashboard">
  //           <DashboardHeader
  //             stats={stats}
  //             onRefresh={manejarRefresh}
  //           />

  //           {cargando && (
  //             <div className="loading-indicator">
  //               <p>Cargando datos...</p>
  //             </div>
  //           )}

  //           <div className="dashboard-content">
  //             {/* Aquí irá el contenido basado en la ruta */}
  //             {location.pathname === '/admin/usuarios' && (
  //               <UsersManagement
  //                 usuarios={usuarios}
  //                 roles={mockRolesCompletos}
  //                 onUsuarioEdit={handleUsuarioEdit}
  //                 onUsuarioCreate={handleUsuarioCreate}
  //                 onUsuarioToggleStatus={handleUsuarioToggleStatus}
  //                 onFiltersChange={handleFiltersChange}
  //                 loading={usuariosLoading}
  //               />
  //             )}

  //             {location.pathname === '/admin/roles' && (
  //               <RolesManagement
  //                 roles={mockRolesCompletos}
  //                 onRolEdit={(rol) => console.log('Editando rol:', rol)}
  //                 onRolCreate={() => console.log('Creando nuevo rol')}
  //                 onRolToggleStatus={async (cdRol, nuevoEstado) => {
  //                   // Simular cambio de estado
  //                   console.log(`Cambiando estado del rol ${cdRol} a ${nuevoEstado}`);
  //                 }}
  //                 onFiltersChange={(filters) => console.log('Filtros roles:', filters)}
  //               />
  //             )}

  //             {location.pathname === '/admin/modulos' && (
  //               <ModulesManagement
  //                 modulos={mockModulos}
  //                 onModuloEdit={(modulo) => console.log('Editando módulo:', modulo)}
  //                 onModuloCreate={() => console.log('Creando nuevo módulo')}
  //                 onModuloToggleEdicion={async (cdModulo, nuevoEstado) => {
  //                   // Simular cambio de estado de edición
  //                   console.log(`Cambiando edición del módulo ${cdModulo} a ${nuevoEstado}`);
  //                 }}
  //                 onFiltersChange={(filters) => console.log('Filtros módulos:', filters)}
  //               />
  //             )}


  //             {location.pathname === '/admin/accesos' && (
  //               <AccessManagement
  //                 roles={mockRolesCompletos}
  //                 modulos={mockModulos}
  //                 accesos={mockAccesos}
  //                 onPermisoChange={async (cdRol, cdModulo, tipoPermiso, asignado) => {
  //                   console.log(`Permiso ${tipoPermiso} ${asignado ? 'asignado' : 'removido'} para rol ${cdRol} en módulo ${cdModulo}`);
  //                   // Aquí llamarás a la API real
  //                 }}
  //                 onModuloHabilitadoChange={async (cdRol, cdModulo, habilitado) => {
  //                   console.log(`Módulo ${cdModulo} ${habilitado ? 'habilitado' : 'deshabilitado'} para rol ${cdRol}`);
  //                   // Aquí llamarás a la API real
  //                 }}
  //                 onBulkPermissionChange={async (cdRol, permisos) => {
  //                   console.log(`Asignación masiva de permisos ${permisos.join(', ')} para rol ${cdRol}`);
  //                   // Aquí llamarás a la API real
  //                 }}
  //               />
  //             )}

  //             {location.pathname === '/admin' && (
  //               <div className="dashboard-welcome">
  //                 <h2>Bienvenido al Panel de Administración</h2>
  //                 <p>Selecciona una sección del menú para comenzar.</p>
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //       </BaseLayout>
  //     </div>
  //   </div>
  // );
};