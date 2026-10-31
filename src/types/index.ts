export interface Principle {
  number: string;
  title: string;
  description: string;
}

export interface Founder {
  id: string;
  name: string;
  role: string;
  specialty: string;
  badge: string;
  image: string;
  imagePosition?: string;
  accent: {
    bg: string;
    border: string;
    badge: string;
    dot: string;
    glow: string;
  };
  socials: {
    github?: string;
    linkedin?: string;
  };
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
