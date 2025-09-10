import React, { useRef, useEffect, useState } from 'react';
import type { Artwork } from '../types';

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: () => void;
  index: number;
  isTransitioning: boolean;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onClick, index, isTransitioning }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const animationClass = isVisible && !isTransitioning ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { clientX, clientY, currentTarget } = e;
    const { top, left, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    const rotateY = 20 * ((x - width / 2) / (width / 2));
    const rotateX = -20 * ((y - height / 2) / (height / 2));
    
    currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    currentTarget.style.transition = 'transform 0.1s ease-out';
  };
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    e.currentTarget.style.transition = 'transform 0.5s ease-in-out';
  };

  return (
    <div
      ref={cardRef}
      className={`group relative aspect-[4/5] w-full cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ease-out ${animationClass}`}
      style={{ 
        transition: 'all 0.6s cubic-bezier(0.77, 0, 0.175, 1), transform 0.5s ease-in-out',
        transitionDelay: `${index * 60}ms`,
        transformStyle: 'preserve-3d'
      }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden rounded-2xl border border-white/5 bg-brand-bg/50 flex items-center justify-center transition-all duration-500 ease-out" style={{ transform: 'translateZ(0px)' }}>
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-full object-contain transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" style={{transformStyle: 'preserve-3d'}}>
        <div className="relative bg-black/50 backdrop-blur-xl border border-brand-glass-border p-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 overflow-hidden" style={{ transform: 'translateZ(40px)'}}>
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/subtle-grunge.png)' }}/>
            <div className="relative">
              <h3 className="font-bold text-lg">{artwork.title}</h3>
              <div className="flex justify-between items-center text-sm mt-2 opacity-80">
                  <span>{artwork.category}</span>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};