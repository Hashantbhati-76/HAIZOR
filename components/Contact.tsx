import React from 'react';

export const Newsletter: React.FC = () => {
  return (
    <section id="contact-section" className="py-24 px-6 md:px-12 lg:px-24 bg-brand-bg text-brand-text">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="relative font-display font-extrabold text-5xl md:text-6xl tracking-tighter mb-4">Join The Studio</h2>
        <p className="text-lg text-brand-text-muted mb-12 max-w-2xl mx-auto">
          Subscribe for exclusive access to new works, studio insights, and private invitations.
        </p>
        
        <div className="relative p-8 rounded-2xl bg-brand-surface/70 backdrop-blur-xl border border-brand-glass-border text-left max-w-lg mx-auto overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/subtle-grunge.png)' }}/>
          <form className="relative space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">Email Address</label>
              <input type="email" id="email" name="email" placeholder="Enter your email address" className="w-full bg-white/5 border border-brand-glass-border rounded-full py-3 px-6 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-shadow" />
            </div>
            <div className="text-center">
              <button type="submit" className="px-10 py-4 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-primary-hover transition-transform hover:scale-105 shadow-lg">
                Subscribe
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};

// Renaming export for consistency as App.tsx imports Newsletter from this file
export { Newsletter as Contact };