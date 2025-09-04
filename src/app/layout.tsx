import './globals.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
// import { Analytics } from '@vercel/analytics/next'
// import { Inter } from 'next/font/google';

// const inter = Inter({ subsets: ['latin'] });

import 'copilot-design-system/dist/styles/main.css';

export const metadata: Metadata = {
  title: 'Spoken Custom App',
  description: 'Custom app for Spoken',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
