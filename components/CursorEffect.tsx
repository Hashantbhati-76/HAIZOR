import React, { useState, useEffect } from 'react';

export const CursorEffect: React.FC = () => {
    const [position, setPosition] = useState({ x: -300, y: -300 });
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        // Feature detection for CSS mask-image
        const isMaskSupported = 'maskImage' in document.body.style || 'webkitMaskImage' in document.body.style;
        setIsSupported(isMaskSupported);

        if (!isMaskSupported) {
          return;
        }

        const updatePosition = (e: MouseEvent | TouchEvent) => {
            let clientX, clientY;
            if (e instanceof MouseEvent) {
                clientX = e.clientX;
                clientY = e.clientY;
            } else if (e.touches[0]) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                return; // No touch data
            }
            setPosition({ x: clientX, y: clientY });
        };

        // Initial position in center
        setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

        document.addEventListener('mousemove', updatePosition);
        document.addEventListener('touchmove', updatePosition, { passive: true });
        document.addEventListener('touchstart', updatePosition, { passive: true });

        return () => {
            document.removeEventListener('mousemove', updatePosition);
            document.removeEventListener('touchmove', updatePosition);
            document.removeEventListener('touchstart', updatePosition);
        };
    }, []);

    if (!isSupported) {
        return null;
    }

    // FIX: Cast style object to React.CSSProperties to allow for CSS custom properties which are not in the default type definition.
    const torchStyle = {
        '--torch-x': `${position.x}px`,
        '--torch-y': `${position.y}px`,
        WebkitMaskImage: `radial-gradient(circle at var(--torch-x) var(--torch-y), transparent 10%, rgba(0,0,0,0.4) 20%, black 30%)`,
        maskImage: `radial-gradient(circle at var(--torch-x) var(--torch-y), transparent 10%, rgba(0,0,0,0.4) 20%, black 30%)`,
    } as React.CSSProperties;

    return (
        <div
            className="absolute inset-0 bg-black pointer-events-none z-40 transition-all duration-200 ease-out"
            style={torchStyle}
        />
    );
};