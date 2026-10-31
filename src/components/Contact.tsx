'use client';

import React, { useState } from 'react';
import { siteConfig } from '@/data/siteConfig';
import {
  Mail,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Send,
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
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setReferenceId(data.referenceId || `SVN-${Math.floor(100000 + Math.random() * 900000)}`);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          company: '',
          service: 'Custom Software Development',
          description: '',
        });
      } else {
        setStatus('error');
        const firstFieldError = data.errors ? Object.values(data.errors)[0] : null;
        setErrorMessage(
          (firstFieldError as string) ||
          data.message ||
          data.error ||
          'Failed to submit inquiry. Please reach out via email directly.'
        );
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network connection error. Please try again or email us directly.');
    }
  };

  const copyRefToClipboard = () => {
    if (!referenceId) return;
    navigator.clipboard.writeText(referenceId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <section id="contact" className="py-28 bg-black text-white border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 pb-8 border-b border-neutral-900">
          <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3 flex items-center">
            <span className="w-2 h-2 bg-white mr-2" />
            03 // PROJECT INTAKE
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-4">
            Have an Idea? Let&apos;s Build It.
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 font-light leading-relaxed">
            Tell us what you&apos;re working on. Whether you need a web platform, mobile application, software enhancement, or complete digital architecture, let&apos;s discuss how we can bring your idea to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Form (8 cols) */}
          <div className="lg:col-span-8 bg-neutral-950 p-8 sm:p-10 border border-neutral-800 shadow-2xl">
            {status === 'success' ? (
              <div className="p-8 bg-neutral-900 border border-neutral-700 text-white space-y-5">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-medium">Inquiry Submitted Successfully</h3>
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed font-light">
                  Thank you for submitting your project specifications. Our engineering lead will review your requirements and respond within 24 business hours.
                </p>

                <div className="p-4 bg-black border border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-500 block">
                      Inquiry Tracking ID
                    </span>
                    <span className="text-base font-mono text-white font-semibold">{referenceId}</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyRefToClipboard}
                    className="px-3 py-1.5 text-xs font-mono border border-neutral-700 hover:border-white transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    {copiedRef ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="px-5 py-2.5 bg-white text-black text-xs uppercase font-mono tracking-wider font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
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
                      placeholder="e.g. Alex Rivera"
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
                      placeholder="alex@company.com"
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
                      placeholder="e.g. Acme Studio"
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
                      placeholder="+1 (555) 0199"
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

                {/* Submit Row */}
                <div className="pt-4 border-t border-neutral-900 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-neutral-500">
                    Non-disclosure and data privacy guaranteed.
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-black text-xs uppercase tracking-widest font-semibold border border-white hover:bg-black hover:text-white transition-all cursor-pointer disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                        <span>Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 mr-2" />
                        <span>Send Project Inquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Direct Channels (4 cols) */}
          <div className="lg:col-span-4 bg-neutral-950 border border-neutral-800 p-8 space-y-8">
            <div className="pb-4 border-b border-neutral-800">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-1">
                COMMUNICATION
              </span>
              <h3 className="text-xl font-light text-white">Direct Channels</h3>
            </div>

            <div className="space-y-6 text-xs text-neutral-300">
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

            <div className="pt-6 border-t border-neutral-900">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-2">
                ACADEMIC INQUIRIES
              </span>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                For university research and final-year capstone engineering guidance, please reference your institution and academic deadlines in the description.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
