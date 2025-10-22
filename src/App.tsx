import React from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
// import { Login } from './components/auth';
import { AppRouter } from './routers/AppRouter';

// Componente temporal para pruebas de routing
const DebugComponent: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🔧 Modo Pruebas - Routing</h1>
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={() => {
          localStorage.setItem('userRole', 'administrador');
          window.location.reload();
        }}>
          Simular Login como Administrador
        </button>
        <button onClick={() => {
          localStorage.setItem('userRole', 'tecnico');
          window.location.reload();
        }}>
          Simular Login como Técnico
        </button>
        <button onClick={() => {
          localStorage.removeItem('userRole');
          window.location.reload();
        }}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

// AuthProvider modificado para pruebas
const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userRole = localStorage.getItem('userRole');
  
  const mockAuth = {
    usuario: userRole ? {
      id: 'USR05',
      nombre: userRole === 'administrador' ? 'Admin User' : 'Técnico User',
      email: userRole === 'administrador' ? 'admin@empresa.com' : 'tecnico@empresa.com',
      rol: userRole as any,
      departamento: 'TI',
      permisos: []
    } : null,
    token: userRole ? 'mock-token' : null,
    estaAutenticado: !!userRole,
    cargando: false,
    login: async () => ({ exito: false, mensaje: 'En modo prueba' }),
    logout: () => {
      localStorage.removeItem('userRole');
      window.location.reload();
    }
  };

  return (
    <AuthContext.Provider value={mockAuth}>
      {userRole ? children : <DebugComponent />}
    </AuthContext.Provider>
  );
};


// const App: React.FC = () => {
//     const manejarLoginExitoso = (usuario: any) => {
//         console.log('Usuario autenticado:', usuario);
//         Aquí navegarás al dashboard
//     };

//     return (
//         <AuthProvider>
//             {/* <div className="App">
//                 <Login onLoginExitoso={manejarLoginExitoso} />
//             </div> */}
//             <AppRouter/>
//         </AuthProvider>
//     );
// };

function App() {
  return (
    <MockAuthProvider>
      <AppRouter />
    </MockAuthProvider>
  );
}

export default App;