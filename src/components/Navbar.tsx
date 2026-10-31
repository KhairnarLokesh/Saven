'use client';

import React, { useState, useEffect } from 'react';
import { siteConfig } from '@/data/siteConfig';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Logo } from '@/components/Logo';

interface NavbarProps {
  onStartProject: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartProject }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = ['home', 'services', 'about', 'contact'];
      const scrollPos = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/95 backdrop-blur-md border-b border-neutral-800/80 py-3.5 shadow-2xl'
          : 'bg-black/60 backdrop-blur-sm border-b border-neutral-900/60 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center group focus:outline-none focus:ring-1 focus:ring-white rounded p-1"
            aria-label="SAVEN Agency Home"
          >
            <Logo size="md" variant="white" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
            {siteConfig.navLinks.map((item) => {
              const sectionId = item.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative px-3.5 py-1.5 text-xs lg:text-sm tracking-wider uppercase transition-colors duration-200 ${
                    isActive
                      ? 'text-white font-medium'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-[1.5px] bg-white transition-all duration-300" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action CTA & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            {/* Desktop & Tablet CTA button (hidden on compact mobile screens to prevent awkward text wrapping) */}
            <button
              onClick={onStartProject}
              className="hidden sm:inline-flex group relative items-center justify-center whitespace-nowrap px-4 py-2 text-xs uppercase tracking-wider font-semibold bg-white text-black border border-white hover:bg-black hover:text-white transition-all duration-200 cursor-pointer shadow-sm"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:text-neutral-300 border border-neutral-800 rounded focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-b border-neutral-800 px-6 pt-4 pb-8 transition-all duration-300">
          <nav className="flex flex-col space-y-3">
            {siteConfig.navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-base uppercase tracking-widest text-neutral-300 hover:text-white py-2 border-b border-neutral-900"
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 flex flex-col space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStartProject();
                }}
                className="w-full py-3 text-center text-sm uppercase tracking-wider font-semibold bg-white text-black hover:bg-neutral-200 transition-colors"
              >
                Start a Project
              </button>
              <div className="text-center text-xs text-neutral-500 font-mono tracking-widest pt-2">
                IDEAS INTO DIGITAL REALITY
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
