import React from 'react';
import { SocialLinks } from './SocialLinks';
import { HaizorLogo } from './HaizorLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="relative py-12 px-6 md:px-12 lg:px-24 bg-brand-bg border-t border-brand-glass-border mt-16">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/subtle-grunge.png)' }}/>
      <div className="relative max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-8">
        <HaizorLogo />
        <div className="text-center sm:text-left order-last sm:order-none">
          <p className="text-sm text-brand-text-muted">© {new Date().getFullYear()} Haizor Art Collection. All Rights Reserved.</p>
          <p className="text-xs text-brand-text-muted/50 mt-1">Where timeless paper craft meets the boundless world of digital art.</p>
        </div>
        <SocialLinks />
      </div>
    </footer>
  );
};
