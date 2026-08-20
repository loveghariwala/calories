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
    default: `Calorie Chart & Counts: Food Calories & Calorie Calculator | Low Calorie Meals & Snacks | ${SITE_NAME}`,
    template: `%s | Calorie, Low Calorie Meals & Snacks | ${SITE_NAME}`,
  },
  description:
    'Free USDA food calorie chart, calorie calculator, low calorie meals & low calorie snacks. Check calories in foods and counts, calculate daily calorie deficit, and track macros.',
  keywords: [
    'low calorie snacks',
    'low calorie meal',
    'low calorie meals',
    'calorie',
    'calories',
    'calorie calculator',
    'Calorie Chart & Counts: Food Calories & Calorie Calculator',
    'calories in food',
    'food calorie calculator',
    'calorie deficit calculator',
    'calorie chart common foods and their counts',
    'how much calories should i eat to lose weight',
    'calories on the nutrition facts label',
    'nutrition facts',
    'usda food data',
    'macro calculator',
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
    title: `Calorie Chart & Counts: Food Calories & Calorie Calculator | Low Calorie Meals & Snacks | ${SITE_NAME}`,
    description:
      'Look up exact calories, protein, carbs, and fat with clinical accuracy. Discover low calorie meals, low calorie snacks, and interactive calorie calculators.',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Calorie Chart & Counts: Food Calories & Calorie Calculator | Low Calorie Meals & Snacks | ${SITE_NAME}`,
    description:
      'Look up exact calories, protein, carbs, and fat with clinical accuracy. Discover low calorie meals, low calorie snacks, and interactive calorie calculators.',
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
