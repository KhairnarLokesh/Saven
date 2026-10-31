'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { ShatterIntro } from '@/components/ShatterIntro';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [inquiryService, setInquiryService] = useState('Custom Software Development');

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (serviceTitle: string) => {
    setInquiryService(serviceTitle);
    scrollToContact();
  };

  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Full-screen Shatter Intro: Displays big SAVEN STUDIOS glass shards on initial visit before revealing the main website */}
      {showIntro && <ShatterIntro onComplete={() => setShowIntro(false)} />}

      {/* Navigation */}
      <Navbar onStartProject={scrollToContact} />

      {/* Hero Section */}
      <Hero
        onStartProject={scrollToContact}
        onExploreServices={scrollToServices}
      />

      {/* Services Section */}
      <Services onSelectService={handleSelectService} />



      {/* About Section & Tech Matrix */}
      <About />

      {/* Contact & Project Inquiry */}
      <Contact initialService={inquiryService} />

      {/* Footer */}
      <Footer onSelectService={handleSelectService} />
    </main>
  );
}
