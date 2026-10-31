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
