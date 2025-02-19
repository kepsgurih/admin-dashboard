import { Toaster } from '@/components/ui/sonner';
import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata:Metadata = {
  title: 'Kepsgurih ERP',
  description:
  'A user admin dashboard configured with Next.js, Postgres, NextAuth, Tailwind CSS, TypeScript, and Prettier.',
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon/favicon-16x16.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/favicon/apple-touch-icon.png',
    },
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen w-full flex-col">
        <ClerkProvider>
        {children}
        </ClerkProvider>
        </body>
      <Toaster />
      <Analytics />
    </html>
  );
}
