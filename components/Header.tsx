import React, { useState, useEffect } from 'react';
import { HaizorLogo } from './HaizorLogo';
import { CloseIcon } from './icons/CloseIcon';

const NavLink: React.FC<{
  href: string;
  children: React.ReactNode;
  active?: boolean;
  onClick: (link: string) => void;
  onNavigate: (callback: () => void) => void;
  name: string;
  onMobileClick?: () => void;
  isMobile?: boolean;
}> = ({ href, children, active, onClick, onNavigate, name, onMobileClick, isMobile }) => (
  <a
    href={href}
    onClick={(e) => {
      e.preventDefault();
      onClick(name);
      onNavigate(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }));
      if (onMobileClick) onMobileClick();
    }}
    className={`relative group transition-colors ${
      isMobile
        ? 'text-3xl font-display text-brand-text-muted hover:text-brand-text py-4'
        : 'px-3 py-2 text-sm text-brand-text-muted hover:text-brand-text'
    }`}
  >
    {children}
    <span
      className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary transform transition-transform duration-300 ease-out ${
        active ? 'scale-x-100' : 'scale-x-0'
      } ${isMobile ? '' : 'group-hover:scale-x-100'}`}
    ></span>
  </a>
);

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);
  
interface HeaderProps {
  onNavigate: (callback: () => void) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [activeLink, setActiveLink] = useState('Home');
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Collection', href: '#collection' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 transition-transform duration-300 ease-in-out ${isHidden ? '-translate-y-[150%] scale-95' : 'translate-y-0 scale-100'}`}>
        <div className="relative mx-auto px-4 sm:px-6 py-3 rounded-2xl bg-brand-surface/70 backdrop-blur-xl border border-brand-glass-border shadow-lg overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/subtle-grunge.png)' }}/>
          <div className="relative flex items-center justify-between">
            <HaizorLogo />
            
            <nav className="hidden md:flex items-center gap-2">
              <NavLink href="#home" active={activeLink === 'Home'} onClick={setActiveLink} onNavigate={onNavigate} name="Home">Home</NavLink>
              <div className="w-1.5 h-1.5 bg-brand-text-muted/30 rounded-full"></div>
              <NavLink href="#collection" active={activeLink === 'Collection'} onClick={setActiveLink} onNavigate={onNavigate} name="Collection">Collection</NavLink>
              <NavLink href="#about" active={activeLink === 'About'} onClick={setActiveLink} onNavigate={onNavigate} name="About">About</NavLink>
              <NavLink href="#contact" active={activeLink === 'Contact'} onClick={setActiveLink} onNavigate={onNavigate} name="Contact">Contact</NavLink>
            </nav>
            
            <div className="flex items-center">
                <button 
                    className="p-2 md:hidden text-brand-text-muted hover:text-brand-text transition-colors"
                    onClick={() => setIsMenuOpen(true)}
                    aria-label="Open navigation menu"
                >
                    <MenuIcon className="w-6 h-6"/>
                </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[100] bg-brand-bg/95 backdrop-blur-xl transition-opacity duration-300 ease-in-out md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <button 
                className="absolute top-8 right-8 p-2 text-brand-text-muted hover:text-brand-text"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close navigation menu"
            >
                <CloseIcon className="w-8 h-8"/>
            </button>
            <nav className="flex flex-col items-center gap-6">
                {navLinks.map(link => (
                    <NavLink
                        key={link.name}
                        href={link.href}
                        active={activeLink === link.name}
                        onClick={setActiveLink}
                        onNavigate={onNavigate}
                        name={link.name}
                        onMobileClick={() => setIsMenuOpen(false)}
                        isMobile
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>
          </div>
      </div>
    </>
  );
};