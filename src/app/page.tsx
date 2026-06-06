import Link from 'next/link';
import { ReadingApp } from '@/components/ReadingApp';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">統合占術</h1>
          <p className="mt-1 text-sm text-slate-500">
            生年月日などから、流生命・数秘術・西洋占星術を統合して鑑定します。
          </p>
        </div>
        <Link href="/mock" className="shrink-0 text-xs text-slate-400 hover:text-slate-600">
          表示モック →
        </Link>
      </div>
      <ReadingApp />
    </main>
  );
}
