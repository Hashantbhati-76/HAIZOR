import React, { useRef, useEffect, useState } from 'react';

const useOnScreen = (options: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return [ref, isVisible] as const;
};

export const About: React.FC = () => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.3 });

  return (
    <section id="about-section" className="py-24 px-6 md:px-12 lg:px-24 bg-brand-bg overflow-hidden">
      <div 
        ref={ref}
        className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="text-brand-text">
          <h2 className="font-display text-5xl md:text-6xl font-extrabold tracking-tighter mb-6">Handmade × Digital</h2>
          <div className="relative p-8 rounded-2xl bg-brand-surface/70 backdrop-blur-xl border border-brand-glass-border overflow-hidden text-left">
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/subtle-grunge.png)' }}/>
            <div className="relative">
              <p className="text-base leading-relaxed mb-4 text-brand-text-muted">
                Haizor is a creative studio founded on the principle of duality. We embrace the texture and imperfection of handmade paper, collage, and traditional media, finding beauty in the tangible.
              </p>
              <p className="text-base leading-relaxed text-brand-text-muted">
                Simultaneously, we explore the limitless possibilities of the digital canvas. Our work is a conversation between these two worlds, creating pieces that feel both timeless and innovative.
              </p>
            </div>
          </div>
          <a href="#contact" className="inline-block mt-8 px-8 py-3 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-primary-hover transition-all duration-300 hover:scale-105 shadow-lg">
            Join The Studio
          </a>
        </div>
      </div>
    </section>
  );
};