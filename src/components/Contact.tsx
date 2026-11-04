'use client';

import React, { useState, useRef, useEffect } from 'react';
import { siteConfig } from '@/data/siteConfig';
import {
  Mail,
  Clock,
  MapPin,
  AlertCircle,
  Loader2,
  ArrowUpRight,
} from 'lucide-react';

interface ContactProps {
  initialService?: string;
  initialDescription?: string;
}

export const Contact: React.FC<ContactProps> = ({
  initialService = '',
  initialDescription = '',
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    service: initialService || 'Custom Software Development',
    description: initialDescription || '',
    website: '', // honeypot
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Crossfade animation state
  const [showSuccess, setShowSuccess] = useState(false);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((prev) => ({
      ...prev,
      ...(initialService ? { service: initialService } : {}),
      ...(initialDescription
        ? {
            description: prev.description
              ? `${prev.description}\n\n${initialDescription}`
              : initialDescription,
          }
        : {}),
    }));
  }, [initialService, initialDescription]);

  const serviceOptions = [
    'Custom Software Development',
    'Software Enhancement & Modernization',
    'College & Academic Projects',
    'Mobile App Development',
    'Website Design & Development',
    'End-to-End Project Development',
    'Other Technical Consulting',
  ];

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errors.fullName = 'Full Name is required (minimum 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'A valid email address is required.';
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      errors.description = 'Please describe your project (minimum 10 characters).';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/project-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          company: '',
          service: 'Custom Software Development',
          description: '',
          website: '',
        });
      } else {
        setStatus('error');
        const firstFieldError = data.errors ? Object.values(data.errors)[0] : null;
        setErrorMessage(
          (firstFieldError as string) ||
          data.message ||
          data.error ||
          'Unable to send your inquiry. Please try again.'
        );
      }
    } catch {
      setStatus('error');
      setErrorMessage('Unable to send your inquiry. Please try again.');
    }
  };

  // Sync crossfade state with form status
  useEffect(() => {
    if (status === 'success') {
      // Small rAF delay so React flushes the DOM before we start the fade-in
      const id = requestAnimationFrame(() => {
        setShowSuccess(true);
        // Move focus to success heading for keyboard/AT users
        successHeadingRef.current?.focus();
      });
      return () => cancelAnimationFrame(id);
    } else {
      setShowSuccess(false);
    }
  }, [status]);

  return (
    <section id="contact" className="pt-20 sm:pt-28 pb-12 sm:pb-16 bg-black text-white border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 pb-8 border-b border-neutral-900">
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-4">
            Have an Idea? Let&apos;s Build It.
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 font-light leading-relaxed">
            Tell us what you&apos;re working on. Whether you need a web platform, mobile application, software enhancement, or complete digital architecture, let&apos;s discuss how we can bring your idea to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Main Form (8 cols) */}
          <div className="lg:col-span-8 bg-neutral-950 p-6 sm:p-10 border border-neutral-800 shadow-2xl flex flex-col">
            {/* Live region — announces success to screen readers */}
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {status === 'success' ? 'Inquiry received. Thank you for reaching out to SAVEN Studios.' : ''}
            </div>

            {/* Crossfade wrapper — both panels are always mounted, opacity-animated */}
            <div className="relative flex-1 flex flex-col">

              {/* ── Success Panel ── */}
              <div
                aria-hidden={!showSuccess}
                // @ts-expect-error inert is a valid HTML attribute not yet in React types
                inert={!showSuccess ? '' : undefined}
                className="absolute inset-0 flex items-center justify-center text-center min-h-[480px]"
                style={{
                  opacity: showSuccess ? 1 : 0,
                  transition: prefersReducedMotion
                    ? 'none'
                    : showSuccess
                    ? 'opacity 250ms ease-in-out, transform 250ms ease-in-out'
                    : 'opacity 180ms ease-out',
                  transform: showSuccess ? 'translateY(0)' : 'translateY(4px)',
                  pointerEvents: showSuccess ? 'auto' : 'none',
                  zIndex: showSuccess ? 1 : 0,
                }}
              >
                <div className="flex flex-col items-center gap-4 max-w-sm w-full mx-auto px-4 sm:px-0">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="shrink-0"
                  >
                    <circle cx="24" cy="24" r="22" stroke="#9BCB9B" strokeWidth="1.5" />
                    <path
                      d="M15 24.5L21 30.5L33 18"
                      stroke="#9BCB9B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <h3
                    ref={successHeadingRef}
                    tabIndex={-1}
                    className="text-2xl sm:text-3xl font-light tracking-tight text-white outline-none"
                  >
                    Inquiry received.
                  </h3>

                  <p className="text-sm text-[#A0A0A0] leading-relaxed font-light max-w-xs">
                    Thank you for reaching out to SAVEN Studios. Our team will review your details and contact you shortly.
                  </p>

                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-3 w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-white text-black text-xs uppercase font-mono tracking-wider font-semibold hover:bg-neutral-200 transition-colors duration-200 cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>

              {/* ── Form Panel ── */}
              <div
                aria-hidden={showSuccess}
                // @ts-expect-error inert is a valid HTML attribute not yet in React types
                inert={showSuccess ? '' : undefined}
                style={{
                  opacity: showSuccess ? 0 : 1,
                  transition: prefersReducedMotion
                    ? 'none'
                    : showSuccess
                    ? 'opacity 180ms ease-out'
                    : 'opacity 250ms ease-in-out',
                  pointerEvents: showSuccess ? 'none' : 'auto',
                  visibility: showSuccess ? 'hidden' : 'visible',
                }}
              >
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === 'error' && (
                  <div className="p-4 bg-neutral-900 border border-red-500/50 text-red-200 flex items-center space-x-3 text-xs">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Steve Rogers"
                      className={`w-full p-3 bg-black border text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white ${
                        fieldErrors.fullName ? 'border-red-500' : 'border-neutral-800'
                      }`}
                    />
                    {fieldErrors.fullName && (
                      <span className="text-[10px] text-red-400 mt-1 block font-mono">
                        {fieldErrors.fullName}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="steve@savenstudios.in"
                      className={`w-full p-3 bg-black border text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white ${
                        fieldErrors.email ? 'border-red-500' : 'border-neutral-800'
                      }`}
                    />
                    {fieldErrors.email && (
                      <span className="text-[10px] text-red-400 mt-1 block font-mono">
                        {fieldErrors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Company & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block mb-2">
                      Company / Organization (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. SAVEN Studios"
                      className="w-full p-3 bg-black border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 8668404041"
                      className="w-full p-3 bg-black border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                {/* Service Category */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block mb-2">
                    Required Service Category
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full p-3 bg-black border border-neutral-800 text-xs text-white focus:outline-none focus:border-white cursor-pointer"
                  >
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-black text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block mb-2">
                    Project Description & Requirements *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Briefly describe what you want to build, user requirements, existing codebases (if any), and desired target dates..."
                    className={`w-full p-3 bg-black border text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white ${
                      fieldErrors.description ? 'border-red-500' : 'border-neutral-800'
                    }`}
                  />
                  {fieldErrors.description && (
                    <span className="text-[10px] text-red-400 mt-1 block font-mono">
                      {fieldErrors.description}
                    </span>
                  )}
                </div>

                {/* Honeypot — hidden from real users, bots fill it */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
                />

                {/* Submit Row */}
                <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-[11px] font-mono text-neutral-500 text-center w-full sm:w-auto leading-relaxed">
                    Non-disclosure and data privacy guaranteed.
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white text-black font-semibold text-xs sm:text-sm tracking-wide rounded-md hover:bg-neutral-200 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg hover:shadow-white/10 disabled:opacity-50 disabled:pointer-events-none group shrink-0"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />
                        <span>SENDING INQUIRY...</span>
                      </>
                    ) : (
                      <>
                        <span className="whitespace-nowrap">Send Project Inquiry</span>
                        <ArrowUpRight className="w-4 h-4 ml-1.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
              </div>
            </div>
          </div>

          {/* Direct Channels (4 cols) */}
          <div className="lg:col-span-4 bg-neutral-950 border border-neutral-800 p-8 flex flex-col h-full">
            <div className="pb-4 border-b border-neutral-800">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-1">
                COMMUNICATION
              </span>
              <h3 className="text-xl font-light text-white">Direct Channels</h3>
            </div>

            <div className="space-y-6 text-xs text-neutral-300 mt-8">
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-white mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-[10px] text-neutral-500 block uppercase">
                    Support & Inquiries Email
                  </span>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-white hover:underline font-mono"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-white mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-[10px] text-neutral-500 block uppercase">
                    Standard Response
                  </span>
                  <span>{siteConfig.contact.responseTarget}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-white mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-[10px] text-neutral-500 block uppercase">
                    Location & Hours
                  </span>
                  <span>{siteConfig.contact.location}</span>
                  <span className="text-neutral-500 block mt-0.5">{siteConfig.contact.hours}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-900 mt-auto">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-2">
                ACADEMIC INQUIRIES
              </span>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                For university research and final-year capstone engineering guidance, please reference your institution and academic deadlines in the description.
              </p>

              {/* ── WhatsApp Business Enquiry Button ── */}
              <a
                href={`https://wa.me/918668404041?text=${encodeURIComponent("Hello SAVEN Studios!\nI'm interested in your digital services and would like to discuss a project. Can we talk?")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    `https://wa.me/918668404041?text=${encodeURIComponent("Hello SAVEN Studios!\nI'm interested in your digital services and would like to discuss a project. Can we talk?")}`,
                    '_blank',
                    'noopener,noreferrer'
                  );
                }}
                className="mt-6 w-full inline-flex items-center justify-center gap-3 px-6 py-[18px] bg-transparent border border-neutral-700 rounded-[10px] text-white font-medium text-sm hover:border-neutral-400 hover:bg-neutral-900/50 transition-all duration-200 cursor-pointer"
                aria-label="Enquire on WhatsApp"
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="#25D366"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Project Consultation 
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
