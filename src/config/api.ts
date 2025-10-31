export const API_CONFIG = {
  // BASE_URL: 'http://localhost:5129',
  BASE_URL: 'http://38.19.150.100',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/Auth/login',
      VALIDATE: '/api/Auth/validate'
    },
    USUARIOS: '/api/Usuarios',
    ROLES: '/api/Roles',
    MODULOS: '/api/Modulos',
    ACCESOS: '/api/Accesos'
  }
} as const;