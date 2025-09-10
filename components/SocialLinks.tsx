import React from 'react';
import { InstagramIcon } from './icons/InstagramIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { LinkedinIcon } from './icons/LinkedinIcon';
import { SOCIAL_LINKS } from '../constants';

const SocialLink: React.FC<{ href: string; children: React.ReactNode; label: string }> = ({ href, children, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative w-10 h-10 flex items-center justify-center rounded-full bg-brand-surface/70 backdrop-blur-md border border-brand-glass-border text-brand-text-muted hover:text-brand-text transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(245,245,245,0.2)]"
    aria-label={label}
  >
    <span className="w-5 h-5">{children}</span>
  </a>
);

export const SocialLinks: React.FC = () => {
  return (
    <div className="flex items-center space-x-4">
      <SocialLink href={SOCIAL_LINKS.instagram} label="Instagram"><InstagramIcon /></SocialLink>
      <SocialLink href={SOCIAL_LINKS.twitter} label="X"><TwitterIcon /></SocialLink>
      <SocialLink href={SOCIAL_LINKS.linkedin} label="LinkedIn"><LinkedinIcon /></SocialLink>
    </div>
  );
};
