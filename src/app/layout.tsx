import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { AppClientLayout } from '@/components/layout/AppClientLayout';

export const metadata: Metadata = {
  title: 'Smolov Strength',
  description: 'Your companion for the Smolov workout program.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased transition-all duration-500 ease-in-out">
        <AppClientLayout>{children}</AppClientLayout>
      </body>
    </html>
  );
}