import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">統合占術アプリ</h1>
      <p className="mt-2 text-sm text-gray-600">
        流生命・数秘術・西洋占星術を統合する個人練習用の鑑定アプリ。
      </p>
      <Link
        href="/mock"
        className="mt-4 inline-block rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        統合表示のモックを見る →
      </Link>
    </main>
  );
}
