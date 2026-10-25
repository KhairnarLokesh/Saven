'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { Estimator } from '@/components/Estimator';
import { Process } from '@/components/Process';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { ShatterIntro } from '@/components/ShatterIntro';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [inquiryService, setInquiryService] = useState('Custom Software Development');
  const [inquiryDescription, setInquiryDescription] = useState('');

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

  const handleApplyEstimate = (data: {
    service: string;
    summary: string;
  }) => {
    setInquiryService(data.service);
    setInquiryDescription(data.summary);
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

      {/* Scope & Cost Estimator */}
      <Estimator onApplyEstimate={handleApplyEstimate} />

      {/* Development Methodology Process */}
      <Process onStartProject={scrollToContact} />

      {/* About Section & Tech Matrix */}
      <About />

      {/* Contact & Project Inquiry */}
      <Contact
        initialService={inquiryService}
        initialDescription={inquiryDescription}
      />

      {/* Footer */}
      <Footer onSelectService={handleSelectService} />
    </main>
  );
}
