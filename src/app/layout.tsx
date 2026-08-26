import type { Metadata } from 'next';
import './globals.css';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Background } from '@/components/Background';
import { IPAIChat } from '@/components/ai/IPAIChat';
import { VoiceGreeting } from '@/components/ai/VoiceGreeting';

export const metadata: Metadata = {
  metadataBase: new URL('https://qudayan.com'),
  title: {
    default: '瞿达炎 · 产品经理 | Portfolio',
    template: '%s · 瞿达炎',
  },
  description:
    '瞿达炎 - 9 年互联网产品 / 设计经验，主导智能家居、APP、快应用、ERP 等多领域项目。深圳，可到岗。',
  keywords: [
    '瞿达炎',
    '产品经理',
    'Product Manager',
    '深圳',
    '智能家居',
    'IoT',
    'AIGC',
    'Portfolio',
  ],
  authors: [{ name: '瞿达炎' }],
  openGraph: {
    title: '瞿达炎 · 产品经理',
    description: '用设计师的眼睛做产品，用工程师的脑子做决策。',
    type: 'website',
    locale: 'zh_CN',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: '瞿达炎 · 产品经理',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '瞿达炎 · 产品经理',
    description: '用设计师的眼睛做产品，用工程师的脑子做决策。',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen bg-ink-950 text-neutral-100 antialiased">
        <Background />
        <Nav />
        <main className="relative z-10">{children}</main>
        <Footer />
        <IPAIChat />
        <VoiceGreeting />
      </body>
    </html>
  );
}