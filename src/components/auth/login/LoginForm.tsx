import React from 'react';
import type { LoginFormProps } from './Login.types';
import type { Credenciales } from '../../../types/auth.types';

// LoginForm.tsx - ACTUALIZADO para el tema tecnológico
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
                    className="block text-sm font-medium text-white mb-2"
                >
                    Usuario
                </label>
                <input
                    id="usuario"
                    name="usuario"
                    type="text"
                    required
                    disabled={cargando}
                    className="mt-1 block w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl shadow-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent disabled:bg-white/5 disabled:cursor-not-allowed transition-all duration-300"
                    placeholder="tu.usuario"
                    value={credenciales.usuario}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label 
                    htmlFor="password" 
                    className="block text-sm font-medium text-white mb-2"
                >
                    Contraseña
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    disabled={cargando}
                    className="mt-1 block w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl shadow-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent disabled:bg-white/5 disabled:cursor-not-allowed transition-all duration-300"
                    placeholder="••••••••"
                    value={credenciales.password}
                    onChange={handleChange}
                />
            </div>

            <button
                type="submit"
                disabled={cargando}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
                {cargando ? (
                    <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Iniciando sesión...
                    </div>
                ) : (
                    'Ingresar al Sistema'
                )}
            </button>
        </form>
    );
};

// export const LoginForm: React.FC<LoginFormProps> = ({ 
//     onSubmit, 
//     cargando 
// }) => {
//     const [credenciales, setCredenciales] = React.useState<Credenciales>({
//         usuario: '',
//         password: ''
//     });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setCredenciales(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         onSubmit(credenciales);
//     };

//     return (
//         <form className="space-y-6" onSubmit={handleSubmit}>
//             <div>
//                 <label 
//                     htmlFor="usuario" 
//                     className="block text-sm font-medium text-gray-700"
//                 >
//                     Usuario
//                 </label>
//                 <input
//                     id="usuario"
//                     name="usuario"
//                     type="text"
//                     required
//                     disabled={cargando}
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                     placeholder="tu.usuario"
//                     value={credenciales.usuario}
//                     onChange={handleChange}
//                 />
//             </div>

//             <div>
//                 <label 
//                     htmlFor="password" 
//                     className="block text-sm font-medium text-gray-700"
//                 >
//                     Contraseña
//                 </label>
//                 <input
//                     id="password"
//                     name="password"
//                     type="password"
//                     required
//                     disabled={cargando}
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                     placeholder="••••••••"
//                     value={credenciales.password}
//                     onChange={handleChange}
//                 />
//             </div>

//             <button
//                 type="submit"
//                 disabled={cargando}
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
//             >
//                 {cargando ? 'Iniciando sesión...' : 'Ingresar al Sistema'}
//             </button>
//         </form>
//     );
// };