export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  techStack: string[];
  idealFor: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  subhead: string;
  description: string;
  duration: string;
  deliverables: string[];
}

export interface Principle {
  number: string;
  title: string;
  description: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget?: string;
  timeline?: string;
  description: string;
}

export interface InquiryResponse {
  success: boolean;
  message: string;
  referenceId?: string;
  errors?: Record<string, string>;
}
