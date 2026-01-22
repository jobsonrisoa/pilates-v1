import type { Metadata } from 'next';

import { Providers } from '@/app/providers';

import './globals.css';

export const metadata: Metadata = {
  title: 'Pilates System',
  description: 'Management system for Pilates & Physiotherapy',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
