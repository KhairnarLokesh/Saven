'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { siteConfig } from '@/data/siteConfig';
import { LegalModal } from './LegalModal';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onSelectService?: (title: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectService }) => {
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);
  const [currentYear, setCurrentYear] = useState('2026');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentYear(String(new Date().getFullYear()));
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black text-white border-t border-neutral-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 mb-12 border-b border-neutral-900 gap-8">
          <div>
            <Logo size="lg" variant="white" className="mb-4" />
            <p className="text-xl sm:text-2xl font-light text-neutral-300 tracking-tight">
              {siteConfig.tagline}
            </p>
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mt-1">
              {siteConfig.subTagline}
            </p>
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-16 border-b border-neutral-900">
          {/* Col 1: Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4 pb-2 border-b border-neutral-900">
              EXPLORE
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-wider text-neutral-400">
              {siteConfig.navLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => handleScrollTo(e, item.href)}
                    className="hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4 pb-2 border-b border-neutral-900">
              SERVICES
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              {[
                'Custom Software Development',
                'Software Enhancement & Modernization',
                'College & Academic Projects',
                'Mobile App Development',
                'Website Design & Development',
                'End-to-End Project Development',
              ].map((svc) => (
                <li key={svc}>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onSelectService) {
                        onSelectService(svc);
                      } else {
                        handleScrollTo(e, '#services');
                      }
                    }}
                    className="hover:text-white transition-colors block truncate"
                  >
                    {svc}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4 pb-2 border-b border-neutral-900">
              DIRECT CHANNELS
            </h4>
            <div className="space-y-3 text-xs text-neutral-400">
              <div>
                <span className="text-[10px] font-mono text-neutral-600 block uppercase">
                  Support & Inquiries
                </span>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-neutral-300 hover:text-white transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-600 block uppercase">Response</span>
                <span className="text-neutral-400">{siteConfig.contact.responseTarget}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Social / Verification */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4 pb-2 border-b border-neutral-900">
              CONNECT
            </h4>
            <div className="flex flex-col space-y-2.5 text-xs text-neutral-400">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-neutral-300 hover:text-white transition-colors py-1 group"
              >
                {/* Clean inline GitHub SVG */}
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors" />
              </a>

              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-neutral-300 hover:text-white transition-colors py-1 group"
              >
                {/* Clean inline LinkedIn SVG */}
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors" />
              </a>

              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-neutral-300 hover:text-white transition-colors py-1 group"
              >
                {/* Clean inline Instagram SVG */}
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>Instagram</span>
                <ArrowUpRight className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-mono gap-4">
          <div>
            © {currentYear} {siteConfig.name}. All rights reserved.
          </div>

          <div className="flex items-center space-x-6"> 
            <button
              onClick={() => setLegalModalType('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>/</span>
            <button
              onClick={() => setLegalModalType('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>

      {/* Legal Dialog */}
      <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />
    </footer>
  );
};
