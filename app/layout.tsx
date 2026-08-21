import type { Metadata } from 'next';
import { Fraunces, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import './results.css';
import { PostHogInit } from './providers';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--mono',
  display: 'swap',
});

const serif = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Potio Pricing Roaster',
  description:
    'Paste your SaaS pricing URL. We fetch it, screenshot it, and roast it dry.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" className={`${mono.variable} ${serif.variable}`}>
      <body>
        {children}

        <PostHogInit />

        {/* Google Analytics — loaded only when NEXT_PUBLIC_GA_ID is set, so
            local dev doesn't pollute production analytics. */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
