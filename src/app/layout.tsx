import type { Metadata, Viewport } from "next";
import { Roboto, Poppins } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bailamore-studio.com/'),
  title: {
    default: "Baila'more 拉丁舞教室",
    template: "%s | Baila'more",
  },
  description: "台南 Bachata & Salsa 社交舞教室。每週日定期開課，適合零基礎學員，不需舞伴即可報名。",
  openGraph: {
    siteName: "Baila'more 拉丁舞教室",
    locale: 'zh_TW',
    type: 'website',
    images: [{ url: '/images/hero.jpg', width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={`${roboto.variable} ${poppins.variable} font-poppins antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
