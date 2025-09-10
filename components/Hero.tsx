import React from 'react';
import { CursorEffect } from './CursorEffect';

export const Hero: React.FC = () => {
  return (
    <section 
        className="relative w-full h-screen overflow-hidden bg-cover bg-center"
        style={{ 
            backgroundImage: 'url(https://i.pinimg.com/736x/fb/d0/dd/fbd0dda3112c63156f73fad337362c39.jpg)',
        }}
    >
        <CursorEffect />
    </section>
  );
};
