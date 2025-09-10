import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Collection } from './components/Collection';
import { Newsletter } from './components/Contact';
import { ArtworkDetailModal } from './components/ArtworkDetailModal';
import { ARTWORKS } from './constants';
import type { Artwork } from './types';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const handleToggleWishlist = (artworkId: number) => {
    setWishlist(prev =>
      prev.includes(artworkId)
        ? prev.filter(id => id !== artworkId)
        : [...prev, artworkId]
    );
  };
  
  const handleSelectArtwork = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
  };

  const handleCloseModal = () => {
    setSelectedArtwork(null);
  };

  return (
    <div 
      className="relative min-h-screen w-full overflow-x-hidden bg-brand-bg font-sans" 
      style={{ 
        perspective: '2000px',
      }}
    >
      <Header onNavigate={(callback) => callback()} />
      <main>
        <div id="home"><Hero /></div>
        <div id="collection"><Collection artworks={ARTWORKS} onArtworkSelect={handleSelectArtwork} /></div>
        <div id="about"><About /></div>
        <div id="contact"><Newsletter /></div>
      </main>
      <Footer />
      {selectedArtwork && (
        <ArtworkDetailModal 
          artwork={selectedArtwork} 
          onClose={handleCloseModal}
          isWishlisted={wishlist.includes(selectedArtwork.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      )}
    </div>
  );
};

export default App;