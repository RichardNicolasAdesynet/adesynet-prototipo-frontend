import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ← IMPORTANTE: Agregar esto
import { useAuth } from "../../hooks/auth/useAuth";
import { BaseLayout } from "../layout/BaseLayout";
import SidebarUsuarios from "../../components/navigation/sidebarUsuarios/SidebarUsuarios";
import type { MenuItem } from "../../types/sidebarUsuarios";
import { modulosService } from "../../services/api/modulosService";
import { transformarModulosAMenuItems } from "../../utils/transformModules";
import { PruebaDashboard } from "./components/PruebaDashboard";
import { Flip } from "./components/FlipSupport";

export const SoporteDashboard: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate(); // ← AGREGAR: Hook de navegación
  const [modulosDesdeAPI, setModulosDesdeAPI] = useState<MenuItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [sidebarColapsado, setSidebarColapsado] = useState(false);
  // const [rutaActiva, setRutaActiva] = useState('dashboard'); // ← AGREGAR: Estado para ruta activa

  // Data de prueba CON PERMISOS REALES basados en tu estructura
  const modulosDePrueba = [
    {
      id: 'dashboard',
      nombre: 'Dashboard Soporte',
      icono: '📊',
      ruta: '/soporte',
      modulo: 'MOD00',
      permisosRequeridos: ['MOD00:Consultar'] // Módulo básico de dashboard
    },
    {
      id: 'tickets',
      nombre: 'Tickets de Soporte',
      icono: '🎫',
      ruta: '/soporte/tickets',
      modulo: 'MOD02', // Módulo de tickets
      permisosRequeridos: ['MOD02:Consultar'],
      //badge: 0,
      hijos: [
        {
          id: 'nuevos-tickets',
          nombre: 'Nuevos Tickets',
          icono: '🆕',
          ruta: '/soporte/tickets/nuevos',
          modulo: 'MOD02',
          permisosRequeridos: ['MOD02:Consultar', 'MOD02:Crear'],//, 'MOD02:Crear'
          hijos: [
            {
              id: 'revision-tickets',
              nombre: 'revision Tickets',
              icono: '🆕',
              ruta: '/soporte/tickets/nuevos/revision',
              modulo: 'MOD02',
              permisosRequeridos: ['MOD02:Consultar', 'MOD02:Crear'],
              badge: 3,
              hijos: [
                {
                  id: 'hijo01-tickets',
                  nombre: 'hijo01 Tickets',
                  icono: '🆕',
                  ruta: '/soporte/tickets/nuevos/revision/hijo01',
                  modulo: 'MOD02',
                  permisosRequeridos: ['MOD02:Consultar', 'MOD02:Crear'],
                  hijos: [
                    {
                      id: 'hijo02-tickets',
                      nombre: 'hijo02 Tickets',
                      icono: '🆕',
                      ruta: '/soporte/tickets/nuevos/revision/hijo02',
                      modulo: 'MOD02',
                      permisosRequeridos: ['MOD02:Consultar', 'MOD02:Crear'],

                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'asignados',
          nombre: 'Tickets Asignados',
          icono: '👤',
          ruta: '/soporte/tickets/asignados',
          modulo: 'MOD02',
          permisosRequeridos: ['MOD02:Control'] //, 'MOD02:Modificar'
        }
      ]
    },
    {
      id: 'configuracion',
      nombre: 'Configuración',
      icono: '⚙️',
      ruta: '/soporte/configuracion',
      modulo: 'MOD05',
      permisosRequeridos: ['MOD05:Consultar'] // ← Este SÍ debe mostrarse
    },
    {
      id: 'modulos',
      nombre: 'Gestión de Módulos',
      icono: '📦',
      ruta: '/soporte/modulos',
      modulo: 'MOD04',
      permisosRequeridos: ['MOD04:Consultar'] // ← Este también debe mostrarse
    },
    {
      id: 'reportes',
      nombre: 'Reportes Avanzados',
      icono: '📈',
      ruta: '/soporte/reportes',
      modulo: 'MOD06',
      permisosRequeridos: ['MOD06:Consultar'] // ← Este NO se mostrará (no está en tus permisos)
    }
  ];

  // Ejemplo de cómo cargar desde API
  useEffect(() => {
    const cargarModulos = async () => {
      try {
        const modulosApi = await modulosService.getModulosList();
        const menuItems = transformarModulosAMenuItems(modulosApi);
        setModulosDesdeAPI(menuItems);
      } catch (error) {
        console.error('Error cargando módulos:', error);
        // En caso de error, usar datos de prueba
        setModulosDesdeAPI(modulosDePrueba);
      } finally {
        setCargando(false);
      }
    };

    cargarModulos();
  }, []);

  // ✅ FUNCIÓN ADAPTATIVA QUE DETECTA SI HAY CATEGORÍAS
  const filtrarModulosPorPermisos = (modulos: MenuItem[]): MenuItem[] => {
    const permisosUsuarioNormalizados = usuario?.permisos?.map(p =>
      p.trim().toUpperCase()
    ) || [];

    // 🔍 Detectar si hay categorías (items con hijos en nivel 0)
    const tieneCategorias = modulos.some(modulo => modulo.hijos && modulo.hijos.length > 0);

    //console.log('🔍 Modo:', tieneCategorias ? 'CON CATEGORÍAS' : 'SIN CATEGORÍAS');

    const modulosFiltrados = modulos
      .filter(modulo => {
        if (!modulo.permisosRequeridos || modulo.permisosRequeridos.length === 0) {
          return true;
        }

        const permisosRequeridosNormalizados = modulo.permisosRequeridos.map(p =>
          p.trim().toUpperCase()
        );

        return permisosRequeridosNormalizados.some(permiso =>
          permisosUsuarioNormalizados.includes(permiso)
        );
      })
      .map(modulo => ({
        ...modulo,
        hijos: modulo.hijos ? filtrarModulosPorPermisos(modulo.hijos) : undefined
      }));

    // ✅ APLICAR FILTRO SOLO SI HAY CATEGORÍAS
    if (tieneCategorias) {
      return modulosFiltrados.filter(modulo => {
        if (modulo.hijos) {
          return modulo.hijos.length > 0; // Ocultar categorías vacías
        }
        return true; // Mantener módulos individuales
      });
    }

    return modulosFiltrados; // Sin filtro adicional para módulos planos
  };

  // ✅ Módulos filtrados según permisos del usuario
  const modulosFiltrados = filtrarModulosPorPermisos(modulosDesdeAPI);

  // Manejar navegación
  const manejarNavegacion = (ruta: string) => {
    navigate(ruta);
  };

  if (!usuario) {
    return <div>Error: No se encontró información del usuario</div>;
  }

  if (cargando) return <div>Cargando módulos...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10 flex flex-1 min-w-0">
      <SidebarUsuarios
        usuario={usuario}
        onNavegacion={manejarNavegacion} // ← CORREGIDO
        //itemActivo={rutaActiva} // ← CORREGIDO
        isCollapsed={sidebarColapsado}
        onToggle={() => setSidebarColapsado(!sidebarColapsado)}
        modulos={modulosFiltrados}
      />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <BaseLayout usuario={usuario} onLogout={logout}>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Panel de Soporte TI
            </h1>
            <p className="text-gray-600 mb-6">
              Bienvenido/a, {usuario.nombre}. Rol: {usuario.rol}
            </p>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Información de Permisos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700">Tus Permisos:</h3>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    {usuario.permisos.slice(0, 6).map((permiso, index) => (
                      <li key={index}>• {permiso}</li>
                    ))}
                    {usuario.permisos.length > 6 && (
                      <li>... y {usuario.permisos.length - 6} más</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Módulos Disponibles:</h3>
                  {/* <span className="icon-[fa-solid--user] text-blue-700"></span> */}
                  <p className="text-sm text-gray-600 mt-2">
                    Basado en tus permisos, puedes acceder a las secciones del menú lateral.
                  </p>
                </div>
                <div>
                  <div className="e-card">
                    Sample Card
                  </div>
                  <PruebaDashboard/>
                  <Flip/>
                </div>
              </div>
            </div>
          </div>
        </BaseLayout>
      </div>
    </div>
  );
};