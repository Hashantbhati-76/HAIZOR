import React from 'react';

export const HaizorLogo: React.FC = () => (
  <a href="#" className="relative group flex items-center cursor-pointer -translate-x-3">
    <span 
      className="text-white font-display font-extrabold text-2xl tracking-wider z-10" 
      style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}
    >
      Haizor
    </span>
    <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-32 h-px bg-gray-600 group-hover:bg-white transition-colors duration-500 overflow-hidden">
        <div className="absolute top-0 left-0 w-8 h-full bg-white animate-glint" style={{ filter: 'blur(4px)' }} />
    </div>
    <div className="absolute left-16 top-1/2 -translate-y-1/2 w-2 h-4 -translate-x-1/2 bg-gray-700 border-x border-gray-500" />
  </a>
);