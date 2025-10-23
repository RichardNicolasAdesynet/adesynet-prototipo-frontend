import React from 'react';

export interface UserAvatarProps {
  nombre: string;
  email?: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  showInfo?: boolean;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  nombre,
  email,
  avatarUrl,
  size = 'md',
  showInfo = true,
  className = ''
}) => {
  const getIniciales = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = {
    sm: {
      avatar: 'w-8 h-8',
      text: 'text-xs',
      info: 'text-xs'
    },
    md: {
      avatar: 'w-10 h-10',
      text: 'text-sm',
      info: 'text-sm'
    },
    lg: {
      avatar: 'w-12 h-12',
      text: 'text-base',
      info: 'text-base'
    }
  };

  
    
   const getColorFromName = (name: string): string => {
    // Generar un color consistente basado en el nombre
    const colors = [
      'from-cyan-500 to-blue-500',    // Cyan (protagonista)
      'from-purple-500 to-pink-500',  // Púrpura
      'from-emerald-500 to-green-500', // Esmeralda
      'from-orange-500 to-red-500',   // Naranja
      'from-indigo-500 to-purple-500' // Índigo
    ];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const colorGradient = getColorFromName(nombre);

  return (
    <div className={`
      flex items-center space-x-3
      group
      ${className}
    `}>
      {/* Avatar */}
      <div className="relative">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={nombre}
            className={`
              ${sizeClasses[size].avatar}
              rounded-full
              object-cover
              border-2 border-white
              shadow-lg
              group-hover:scale-110
              transition-transform duration-300
            `}
          />
        ) : (
          <div className={`
            ${sizeClasses[size].avatar}
            ${sizeClasses[size].text}
            rounded-full
            bg-gradient-to-r ${colorGradient}
            text-white
            font-semibold
            flex items-center justify-center
            border-2 border-white
            shadow-lg
            group-hover:scale-110
            transition-all duration-300
            transform-gpu
          `}>
            {getIniciales(nombre)}
          </div>
        )}
        
        {/* Indicador de estado en línea (sutil) */}
        <div className="
          absolute -bottom-0.5 -right-0.5
          w-3 h-3
          bg-emerald-400
          border-2 border-white
          rounded-full
          shadow-sm
        "></div>
      </div>

      {/* Información del usuario - Solo si showInfo es true */}
      {showInfo && (
        <div className="flex flex-col min-w-0">
          <span className={`
            font-semibold text-slate-800
            truncate
            group-hover:text-cyan-700
            transition-colors duration-200
            ${sizeClasses[size].info}
          `}>
            {nombre}
          </span>
          
          {email && (
            <span className={`
              text-slate-500
              truncate
              group-hover:text-slate-600
              transition-colors duration-200
              text-xs
            `}>
              {email}
            </span>
          )}
        </div>
      )}
    </div>
  );

  // return (
  //   <div className="user-avatar-container">
  //     <div className="avatar-wrapper">
  //       {avatarUrl ? (
  //         <img
  //           src={avatarUrl}
  //           alt={nombre}
  //           className={`avatar-image ${sizeClasses[size]}`}
  //         />
  //       ) : (
  //         <div className={`avatar-fallback ${sizeClasses[size]}`}>
  //           {getIniciales(nombre)}
  //         </div>
  //       )}
  //     </div>
  //     <div className="user-info">
  //       <div className="user-name">{nombre}</div>
  //       {email && <div className="user-email">{email}</div>}
  //     </div>
  //   </div>
  // );
};