import React from 'react';
import { useLogin } from '../../../hooks/auth/useLogin';
import { LoginHeader } from './LoginHeader';
import { LoginForm } from './LoginForm';
import type { LoginProps } from './Login.types';
import { useAuth } from '../../../hooks/auth/useAuth';


export const Login: React.FC<LoginProps> = ({ 
    onLoginExitoso 
}) => {
    const { login: authLogin } = useAuth();
    const { login, cargando, error } = useLogin();

    const manejarLogin = async (credenciales: any) => {
        const resultado = await login(credenciales);
        
        if (resultado.exito && resultado.usuario && resultado.token) {
            // Aquí integrarás con tu AuthContext real
            console.log('Login exitoso:', resultado.usuario);
            onLoginExitoso?.(resultado.usuario);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <LoginHeader 
                    titulo="Sistema de Soporte TI"
                    subtitulo="Área de Tecnologías de la Información"
                />
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    
                    <LoginForm 
                        onSubmit={manejarLogin}
                        cargando={cargando}
                    />
                </div>
            </div>
        </div>
    );
};