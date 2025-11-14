// utils/transformModules.ts
import type { MenuItem } from '../types/sidebarUsuarios';

interface ModuloFromAPI {
  cdModulo: string;
  dsModulo: string;
  flgEdicion: boolean;
}

interface CategoriaFromAPI {
  cdCategoria: string;
  dsCategoria: string;
  modulos: ModuloFromAPI[];
}

// ✅ FUNCIÓN PARA TRANSFORMAR MÓDULOS API A MENUITEM
export const transformarModulosAMenuItems = (
  modulosAPI: ModuloFromAPI[], 
  categoriasAPI?: CategoriaFromAPI[]
): MenuItem[] => {
  
  // Si tenemos categorías, agrupar por categoría
  if (categoriasAPI && categoriasAPI.length > 0) {
    return categoriasAPI.map(categoria => ({
      id: `cat-${categoria.cdCategoria}`,
      nombre: categoria.dsCategoria,
      icono: obtenerIconoPorCategoria(categoria.cdCategoria), // Función auxiliar
      ruta: '', // Las categorías no navegan
      modulo: categoria.cdCategoria,
      hijos: categoria.modulos.map(modulo => transformarModuloIndividual(modulo))
    })).filter(categoria => categoria.hijos.length > 0); // Solo categorías con módulos
  }
  
  // Si no hay categorías, mostrar módulos planos
  return modulosAPI.map(modulo => transformarModuloIndividual(modulo));
};

// ✅ TRANSFORMAR MÓDULO INDIVIDUAL
const transformarModuloIndividual = (modulo: ModuloFromAPI): MenuItem => {
  return {
    id: modulo.cdModulo,
    nombre: modulo.dsModulo,
    icono: obtenerIconoPorModulo(modulo.cdModulo),
    ruta: generarRutaDesdeModulo(modulo.dsModulo),// modulo.cdModulo
    modulo: modulo.cdModulo,
    permisosRequeridos: [`${modulo.cdModulo}:Consultar`], // Permiso básico de consulta
    hijos:[] // Por ahora vacío, se llenará cuando tengas sub-módulos
  };
};

// ✅ GENERAR RUTA AUTOMÁTICA
const generarRutaDesdeModulo = (nombreModulo: string): string => {//, cdModulo: string
    const nombreNormalizado = nombreModulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/\s+/g, '-');
  
  return `/soporte/${nombreNormalizado}`;
  // O alternativamente: return `/modulo/${cdModulo.toLowerCase()}`;
};

// ✅ ASIGNAR ICONOS (puedes personalizar según tus módulos)
const obtenerIconoPorModulo = (cdModulo: string): string => {
  const iconos: { [key: string]: string } = {
    'MOD01': '👥', // Gestión de Usuarios
    'MOD02': '🎭', // Gestión de Roles  
    'MOD03': '📦', // Gestión de Módulos
    'MOD04': '⚙️', // Gestión de Accesos
    'MOD05': '🎫', // Tickets
    'MOD06': '📦', // Caja pre orden
    'MOD07': '💰', // Facturación
    'MOD08': '📊', // Reportes
    // Agrega más mapeos según tus módulos
  };
  
  return iconos[cdModulo] || '📄'; // Icono por defecto
};

const obtenerIconoPorCategoria = (cdCategoria: string): string => {
  const iconos: { [key: string]: string } = {
    'CAT01': '🏢', // Administración
    'CAT02': '🛠️',  // Operaciones
    'CAT03': '📈',  // Reportes
  };
  
  return iconos[cdCategoria] || '📁';
};