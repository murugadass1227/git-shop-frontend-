import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';

export const metadata: Metadata = {
  title: 'Gondget - Customized Gift E-Commerce | gondget.com',
  description: 'Customized & personalised gifts. Photo mugs, frames, crystals, corporate gifts. Order online.',
  icons: { icon: '/icon.svg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden" suppressHydrationWarning>
      <body className="min-h-screen min-w-0 flex flex-col antialiased overflow-x-hidden" suppressHydrationWarning>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
