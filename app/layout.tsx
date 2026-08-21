import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CookieConsentModal } from '@/components/CookieConsentModal';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_NAME, SITE_TAGLINE, SITE_URL, generateWebSiteJsonLd } from '@/lib/seo';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Calories',
    template: '%s | CaloriePulse',
  },
  description:
    'Free USDA food calorie chart, calorie deficit calculator, low calorie meals & healthy snacks. Instant whole food nutrition facts & macro tracker.',
  keywords: [
    'calorie chart',
    'calorie calculator',
    'calories in food',
    'low calorie snacks',
    'low calorie meals',
    'calorie deficit calculator',
    'nutrition facts',
    'usda food database',
    'macro tracker',
  ],
  authors: [{ name: 'CaloriePulse Editorial Team' }],
  creator: 'CaloriePulse',
  publisher: 'CaloriePulse',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/icon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/icon-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  openGraph: {
    title: 'CaloriePulse — Food Calorie Chart & Calorie Calculator',
    description:
      'Free USDA food calorie chart, calorie deficit calculator, low calorie meals & healthy snacks. Instant whole food nutrition facts & macro tracker.',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CaloriePulse — Food Calorie Chart & Calorie Calculator',
    description:
      'Free USDA food calorie chart, calorie deficit calculator, low calorie meals & healthy snacks. Instant whole food nutrition facts & macro tracker.',
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
  verification: {
    google: 'hyZqyROtTl3aFS0xh_xojc8lBUNIPqgtILJbIMflcUs',
    yandex: 'fd33b3ec1671bef9',
    other: {
      'yandex-verification': 'fd33b3ec1671bef9',
    },
  },
};

import { RouteLoadingIndicator } from '@/components/RouteLoadingIndicator';
import Script from 'next/script';
import { Suspense } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = generateWebSiteJsonLd();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Google Analytics 4 (gtag.js) */}

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GW8JM9GKC9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GW8JM9GKC9', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#181513] selection:bg-[#C4552D] selection:text-white font-sans">
        <Suspense fallback={null}>
          <RouteLoadingIndicator />
        </Suspense>
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <CookieConsentModal />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
