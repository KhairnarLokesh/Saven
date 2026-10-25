import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/data/siteConfig';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SAVEN · Software Development & Digital Solutions Agency',
    template: '%s | SAVEN',
  },
  description:
    'SAVEN transforms ideas into digital reality through custom software development, mobile apps, software modernization, web platforms, and academic engineering assistance.',
  keywords: [
    'SAVEN',
    'software development agency',
    'custom software solutions',
    'mobile app development',
    'software modernization',
    'software enhancement',
    'college academic projects',
    'website design and development',
    'Next.js agency',
    'digital solutions',
  ],
  authors: [{ name: 'SAVEN Digital Solutions Agency' }],
  creator: 'SAVEN',
  publisher: 'SAVEN',
  metadataBase: new URL('https://saven.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SAVEN · Ideas Into Digital Reality',
    description:
      'From custom software and mobile applications to modern websites and project enhancement, SAVEN transforms ideas into reliable digital experiences.',
    url: 'https://saven.dev',
    siteName: 'SAVEN',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAVEN · Ideas Into Digital Reality',
    description:
      'Premium software development and digital solutions agency. Minimalist, modern, and high-performance engineering.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    description: siteConfig.heroDescription,
    url: 'https://saven.dev',
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin, siteConfig.social.instagram],
    serviceType: [
      'Custom Software Development',
      'Software Enhancement & Modernization',
      'Mobile App Development',
      'College & Academic Projects',
      'Website Design & Development',
      'End-to-End Project Development',
    ],
  };

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceGrotesk.className} scroll-smooth dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${spaceGrotesk.className} bg-black text-white antialiased selection:bg-white selection:text-black min-h-screen flex flex-col font-sans`}>
        {children}
      </body>
    </html>
  );
}
