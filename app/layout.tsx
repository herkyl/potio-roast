import type { Metadata } from 'next';
import { Fraunces, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import './results.css';

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
  title: '[roast] · pricing page diagnostics',
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
      <body>{children}</body>
    </html>
  );
}
