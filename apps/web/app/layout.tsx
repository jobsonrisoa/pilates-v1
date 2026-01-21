import type { Metadata } from 'next';

import { Providers } from '@/app/providers';

import './globals.css';

export const metadata: Metadata = {
  title: 'Pilates System',
  description: 'Sistema de gestão para Pilates & Fisioterapia'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


