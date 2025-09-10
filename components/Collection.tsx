import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArtworkCategory } from '../types';
import type { Artwork } from '../types';
import { ArtworkCard } from './ArtworkCard';

interface CollectionProps {
  artworks: Artwork[];
  onArtworkSelect: (artwork: Artwork) => void;
}

const FilterButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 z-10 ${
      active
        ? 'bg-brand-primary text-white shadow-md'
        : 'bg-transparent text-brand-text-muted hover:text-brand-text'
    }`}
  >
    {children}
  </button>
);

export const Collection: React.FC<CollectionProps> = ({ artworks, onArtworkSelect }) => {
  const [activeFilter, setActiveFilter] = useState<ArtworkCategory | 'All'>('All');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const filteredArtworks = useMemo(() => {
    if (activeFilter === 'All') {
      return artworks;
    }
    return artworks.filter(art => art.category === activeFilter);
  }, [activeFilter, artworks]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { top, left } = section.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;
      section.style.setProperty('--mouse-x', `${x}px`);
      section.style.setProperty('--mouse-y', `${y}px`);
    };
    
    const handleScroll = () => {
        const { top } = section.getBoundingClientRect();
        const scrollPercent = Math.max(0, Math.min(1, -top / (section.offsetHeight - window.innerHeight)));
        section.style.setProperty('--scroll-y', `${scrollPercent * 10}%`);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const handleFilterClick = (filter: ArtworkCategory | 'All') => {
    if (filter === activeFilter) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveFilter(filter);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  return (
    <section 
        ref={sectionRef}
        id="collection-section" 
        className="relative py-24 px-6 md:px-12 lg:px-24 bg-brand-bg overflow-hidden"
    >
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle 600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.04), transparent 80%),
            url(https://www.transparenttextures.com/patterns/dark-marble.png)
          `,
          backgroundPosition: '0% var(--scroll-y, 0%)',
          transition: 'background-position 0.5s ease-out',
        }}
      />
      <div className="relative max-w-7xl mx-auto z-10">
        <div className="text-center mb-12">
          <h2 className="font-display font-extrabold text-5xl md:text-6xl text-brand-text tracking-tighter">The Collection</h2>
          <p className="mt-2 text-brand-text-muted">Explore our curated works.</p>
        </div>
        
        <div className="flex justify-center items-center mb-12 p-2 rounded-full bg-black/20 border border-brand-glass-border w-fit mx-auto">
          <FilterButton active={activeFilter === 'All'} onClick={() => handleFilterClick('All')}>All</FilterButton>
          <FilterButton active={activeFilter === ArtworkCategory.HANDMADE} onClick={() => handleFilterClick(ArtworkCategory.HANDMADE)}>Handmade Paper</FilterButton>
          <FilterButton active={activeFilter === ArtworkCategory.DIGITAL} onClick={() => handleFilterClick(ArtworkCategory.DIGITAL)}>Digital</FilterButton>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {filteredArtworks.map((artwork, index) => (
            <ArtworkCard 
                key={artwork.id} 
                artwork={artwork} 
                onClick={() => onArtworkSelect(artwork)} 
                index={index}
                isTransitioning={isTransitioning}
            />
          ))}
        </div>
      </div>
    </section>
  );
};