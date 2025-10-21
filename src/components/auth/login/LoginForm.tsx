import React from 'react';
import type { LoginFormProps } from './Login.types';
import type { Credenciales } from '../../../types/auth.types';


export const LoginForm: React.FC<LoginFormProps> = ({ 
    onSubmit, 
    cargando 
}) => {
    const [credenciales, setCredenciales] = React.useState<Credenciales>({
        usuario: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredenciales(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(credenciales);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label 
                    htmlFor="usuario" 
                    className="block text-sm font-medium text-gray-700"
                >
                    Usuario
                </label>
                <input
                    id="usuario"
                    name="usuario"
                    type="text"
                    required
                    disabled={cargando}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="tu.usuario"
                    value={credenciales.usuario}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label 
                    htmlFor="password" 
                    className="block text-sm font-medium text-gray-700"
                >
                    Contraseña
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    disabled={cargando}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="••••••••"
                    value={credenciales.password}
                    onChange={handleChange}
                />
            </div>

            <button
                type="submit"
                disabled={cargando}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
                {cargando ? 'Iniciando sesión...' : 'Ingresar al Sistema'}
            </button>
        </form>
    );
};