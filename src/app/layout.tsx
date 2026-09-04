import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';
import { getBrandingSettings } from './hq-management-system/branding-actions';

export const metadata: Metadata = {
  metadataBase: new URL('https://abdulmalik-almekhlafi.com'),
  title: {
    default: 'عبدالملك المخلافي | الموقع الرسمي',
    template: '%s | عبدالملك المخلافي'
  },
  description: 'الموقع الرقمي الشامل والأرشيف التاريخي لعبدالملك المخلافي.',
  keywords: ['عبدالملك المخلافي', 'اليمن', 'سياسة يمنية', 'فكر سياسي', 'أرشيف وطني', 'دبلوماسية'],
  authors: [{ name: 'عبدالملك المخلافي' }],
  creator: 'عبدالملك المخلافي',
  publisher: 'المكتب الإعلامي - عبدالملك المخلافي',
  openGraph: {
    title: 'الموقع الرسمي | عبدالملك المخلافي',
    description: 'الموقع الرقمي الشامل والأرشيف التاريخي لعبدالملك المخلافي.',
    url: 'https://abdulmalik-almekhlafi.com',
    siteName: 'عبدالملك المخلافي',
    locale: 'ar_AR',
    type: 'website',
    images: [
      {
        url: '/logo-last.png',
        width: 1200,
        height: 630,
        alt: 'عبدالملك المخلافي',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الموقع الرسمي | عبدالملك المخلافي',
    description: 'الموقع الرقمي الشامل والأرشيف التاريخي لعبدالملك المخلافي.',
    creator: '@almekhlafi_a',
    images: ['/logo-last.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/apple-icon.png',
    apple: '/apple-icon.png',
  },
};
  
export const viewport = {
  themeColor: '#fafaf9',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const branding = await getBrandingSettings();
  const h = await headers();
  const nonce = h.get('x-nonce') || undefined;

  // Sanitize branding values to prevent XSS via style injection
  const headerScale = Math.min(Math.max(Number(branding.header_logo_scale) || 1.0, 0.1), 3.0);
  const footerScale = Math.min(Math.max(Number(branding.footer_logo_scale) || 1.0, 0.1), 3.0);

  return (
    <html lang="ar" dir="rtl" nonce={nonce} suppressHydrationWarning>
      <body
        className="min-h-screen selection:bg-amber-100 selection:text-amber-900 bg-[#fafaf9] text-[#1c1917]"
        style={{
          '--header-logo-scale': headerScale,
          '--footer-logo-scale': footerScale,
        } as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  );
}
