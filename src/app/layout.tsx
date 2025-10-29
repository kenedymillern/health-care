import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EUTRIV Health Care',
  description: 'Premium home care services with compassion and quality.',
  icons: {
    icon: '/images/eutriv-favicon.png', // Default favicon
    apple: '/images/eutriv-favicon.png', // Apple touch icon (optional)
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider attribute="class">
            <Header />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}