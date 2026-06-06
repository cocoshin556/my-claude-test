import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '統合占術アプリ',
  description: '流生命・数秘術・西洋占星術を統合する個人練習用の鑑定アプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
