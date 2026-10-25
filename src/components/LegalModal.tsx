'use client';

import React from 'react';
import { X, Shield } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-700 p-6 sm:p-8 max-h-[85vh] overflow-y-auto text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white border border-neutral-800 hover:border-white transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 mb-3">
          <Shield className="w-4 h-4 text-white" />
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
            SAVEN LEGAL & GOVERNANCE
          </span>
        </div>

        {type === 'privacy' ? (
          <div>
            <h2 className="text-2xl font-light text-white mb-4">Privacy Policy</h2>
            <div className="space-y-4 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              <p>
                At SAVEN, we value the intellectual property and confidentiality of all potential and active clients. This policy clarifies how information submitted through our channels is handled.
              </p>
              <h3 className="font-mono text-xs uppercase text-white pt-2">1. Information Collection</h3>
              <p>
                We only collect information voluntarily transmitted through project inquiry forms, technical scopes, and email correspondence (such as your name, email address, company details, and project requirements).
              </p>
              <h3 className="font-mono text-xs uppercase text-white pt-2">2. Confidentiality & Non-Disclosure</h3>
              <p>
                Project specifications, proprietary code snippets, and business plans submitted to SAVEN are treated with utmost confidentiality and will never be sold, leased, or disclosed to third parties.
              </p>
              <h3 className="font-mono text-xs uppercase text-white pt-2">3. Data Retention</h3>
              <p>
                Inquiry data is retained solely for project assessment, communication, and technical handover. You may request deletion of your records at any time by contacting {siteConfig.contact.email}.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-light text-white mb-4">Terms & Conditions</h2>
            <div className="space-y-4 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              <p>
                These terms govern the use of the SAVEN agency digital platform and preliminary project consultation requests.
              </p>
              <h3 className="font-mono text-xs uppercase text-white pt-2">1. Scope of Engagement</h3>
              <p>
                Any formal software engineering, mobile development, or academic technical guidance is executed under a distinct Scope of Work (SOW) agreement defining explicit deliverables, milestones, and warranties.
              </p>
              <h3 className="font-mono text-xs uppercase text-white pt-2">2. Academic Project Policy</h3>
              <p>
                SAVEN provides technical guidance, architecture implementation, and prototype debugging for educational and research purposes. We strictly disclaim academic misconduct, fabricated datasets, or exam assistance.
              </p>
              <h3 className="font-mono text-xs uppercase text-white pt-2">3. Intellectual Property</h3>
              <p>
                Upon completion of agreed payment milestones in a formal SOW, all custom source code, design assets, and documentation are handed over in full to the client.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-neutral-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-mono uppercase tracking-wider bg-white text-black font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
