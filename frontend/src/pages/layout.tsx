import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PCS-B-LTD - Construction Management Platform',
  description: 'Professional Construction Services Management Platform with real-time updates, multi-language support, and offline capabilities.',
  keywords: 'construction, management, PWA, real-time, multi-language, offline',
  authors: [{ name: 'PCS-B-LTD Team' }],
  creator: 'PCS-B-LTD',
  publisher: 'PCS-B-LTD',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  themeColor: '#000000',
  colorScheme: 'light',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PCS-B-LTD',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="PCS-B-LTD" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PCS-B-LTD" />
        <meta name="description" content="Professional Construction Services Management Platform" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
        
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icon-192x192.png" color="#000000" />
        <link rel="shortcut icon" href="/icon-192x192.png" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://pcs-b-ltd.com" />
        <meta name="twitter:title" content="PCS-B-LTD" />
        <meta name="twitter:description" content="Professional Construction Services Management Platform" />
        <meta name="twitter:image" content="/icon-192x192.png" />
        <meta name="twitter:creator" content="@pcs_b_ltd" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="PCS-B-LTD" />
        <meta property="og:description" content="Professional Construction Services Management Platform" />
        <meta property="og:site_name" content="PCS-B-LTD" />
        <meta property="og:url" content="https://pcs-b-ltd.com" />
        <meta property="og:image" content="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <SocketProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: '#10b981',
                  },
                },
                error: {
                  duration: 5000,
                  style: {
                    background: '#ef4444',
                  },
                },
              }}
            />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}