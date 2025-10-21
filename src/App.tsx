import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { Login } from './components/auth';

const App: React.FC = () => {
    const manejarLoginExitoso = (usuario: any) => {
        console.log('Usuario autenticado:', usuario);
        // Aquí navegarás al dashboard
    };

    return (
        <AuthProvider>
            <div className="App">
                <Login onLoginExitoso={manejarLoginExitoso} />
            </div>
        </AuthProvider>
    );
};

export default App;