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
    default: `${SITE_NAME} — The Thoughtful Food Calorie & Macro Guide`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'A beautifully curated guide to 300,000+ USDA whole foods, calories, macronutrients, and daily meal planning. Clean, accurate, and ad-free.',
  keywords: [
    'calorie calculator',
    'food calorie lookup',
    'calorie counter',
    'food calorie counter',
    'macro calculator',
    'nutrition facts',
    'usda food data',
    'whole food calories',
    'clean eating journal',
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
  openGraph: {
    title: `${SITE_NAME} — The Thoughtful Food Calorie & Macro Guide`,
    description:
      'Look up exact calories, protein, carbs, and fat with clinical accuracy. Curated from USDA FoodData Central.',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — The Thoughtful Food Calorie & Macro Guide`,
    description:
      'Look up exact calories, protein, carbs, and fat with clinical accuracy. Curated from USDA FoodData Central.',
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = generateWebSiteJsonLd();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#181513] selection:bg-[#C4552D] selection:text-white font-sans">
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
