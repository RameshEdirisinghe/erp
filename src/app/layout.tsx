import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ERP Dashboard',
  description: 'Enterprise Resource Planning Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col w-64 transition-all duration-300" style={{ marginLeft: '0px' }}>
            <Navbar />
            <main className="flex-1 p-6 overflow-auto">{children}</main>
          
          </div>
        </div>
      </body>
    </html>
  );
}