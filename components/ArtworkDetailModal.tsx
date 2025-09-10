import React, { useEffect, useRef, useState } from 'react';
import type { Artwork } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { HeartIcon } from './icons/HeartIcon';

interface ArtworkDetailModalProps {
  artwork: Artwork;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (artworkId: number) => void;
}

export const ArtworkDetailModal: React.FC<ArtworkDetailModalProps> = ({ artwork, onClose, isWishlisted, onToggleWishlist }) => {
  const [isClosing, setIsClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 500); // Match animation duration
  };
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const rotateX = (clientY / innerHeight - 0.5) * -3; // Max 3 deg rotation
      const rotateY = (clientX / innerWidth - 0.5) * 3;
      panel.style.setProperty('--rotate-x', `${rotateX}deg`);
      panel.style.setProperty('--rotate-y', `${rotateY}deg`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const animationClass = isClosing
    ? 'opacity-0 scale-95'
    : 'opacity-100 scale-100';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ perspective: '2000px' }}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`} style={{
        backgroundImage: 'url(https://www.transparenttextures.com/patterns/film-grain.png)'
      }}/>
      
      <div
        ref={panelRef}
        className={`relative w-full max-w-7xl h-[90vh] grid grid-cols-1 md:grid-cols-5 gap-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${animationClass}`}
        style={{
          transform: 'rotateX(var(--rotate-x, 0)) rotateY(var(--rotate-y, 0))',
          willChange: 'transform',
        }}
      >
        {/* The main glass panel */}
        <div className="md:col-span-5 w-full h-full rounded-2xl bg-brand-surface/70 backdrop-blur-xl border border-brand-glass-border shadow-2xl overflow-hidden animate-modal-enter">
             {/* Scratched glass texture */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/subtle-grunge.png)' }}/>
            {/* Light sweep effect */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl pointer-events-none">
              <div className="absolute top-0 left-0 w-1/2 h-full bg-white/10 animate-light-sweep" />
            </div>
            
            <div className="relative w-full h-full flex flex-col md:flex-row p-2">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-white/10 text-white rounded-full shadow-lg hover:bg-white/20 transition-all hover:scale-110"
                  aria-label="Close artwork details"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
                
                <div className="relative w-full md:w-3/5 h-1/2 md:h-full bg-black/20 rounded-xl overflow-hidden">
                  <img
                    ref={imageRef}
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-contain"
                  />
                </div>
        
                <div className="w-full md:w-2/5 h-1/2 md:h-full flex flex-col text-white p-6 overflow-y-auto">
                  <div className="relative">
                    <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tighter my-2" style={{
                      // @ts-ignore
                      '-webkit-box-reflect': 'below 0px linear-gradient(to bottom, transparent, rgba(255,255,255,0.1))'
                    }}>
                        {artwork.title}
                    </h2>
                    <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-brand-primary/50 rounded-full" />
                  </div>
                  
                  <div className="space-y-3 text-sm my-6 border-t border-brand-glass-border pt-6">
                    <p><strong className="font-bold text-white/60 w-24 inline-block">Type:</strong> {artwork.category}</p>
                    <p><strong className="font-bold text-white/60 w-24 inline-block">Medium:</strong> {artwork.medium}</p>
                    <p><strong className="font-bold text-white/60 w-24 inline-block">Size:</strong> {artwork.size}</p>
                  </div>
                  
                  <p className="text-white/80 leading-relaxed text-base mb-auto">
                    {artwork.description}
                  </p>

                  <div className="relative flex items-center gap-4 mt-8">
                    <button
                        onClick={() => onToggleWishlist(artwork.id)}
                        className={`relative p-4 rounded-full transition-all duration-300 bg-brand-surface/70 backdrop-blur-md border border-brand-glass-border hover:scale-110 ${isWishlisted ? 'text-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.7)]' : 'text-white hover:shadow-[0_0_15px_rgba(245,245,245,0.4)]'}`}
                        aria-label="Add to wishlist"
                    >
                      <HeartIcon className={`w-6 h-6 transition-all ${isWishlisted ? 'fill-current' : 'fill-none'}`} />
                       {isWishlisted && <div className="absolute inset-0 rounded-full bg-red-400/50 blur-lg -z-10" />}
                    </button>
                  </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};