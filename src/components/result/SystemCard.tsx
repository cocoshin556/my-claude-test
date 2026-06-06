import type { ReactNode } from 'react';

type Accent = 'violet' | 'indigo' | 'amber';

/** アクセント色ごとの Tailwind クラス（リテラルで持つ＝purge 対象になるように）。 */
const ACCENT: Record<
  Accent,
  { header: string; ring: string; factBg: string }
> = {
  violet: { header: 'bg-violet-600', ring: 'ring-violet-200', factBg: 'bg-violet-50' },
  indigo: { header: 'bg-indigo-600', ring: 'ring-indigo-200', factBg: 'bg-indigo-50' },
  amber: { header: 'bg-amber-500', ring: 'ring-amber-200', factBg: 'bg-amber-50' },
};

/**
 * 各占術体系の結果カード。
 * 「計算で出た事実」と「解釈」を視覚的に分離して表示する共通シェル。
 */
export function SystemCard({
  accent,
  system,
  headline,
  headlineSub,
  facts,
  interpretation,
}: {
  accent: Accent;
  system: string;
  headline: string;
  headlineSub?: string;
  facts: ReactNode;
  interpretation: ReactNode;
}) {
  const a = ACCENT[accent];
  return (
    <section
      className={`flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ${a.ring}`}
    >
      <header className={`${a.header} px-5 py-3 text-white`}>
        <p className="text-xs font-medium uppercase tracking-wider opacity-80">
          {system}
        </p>
        <div className="mt-0.5 flex items-baseline gap-2">
          <h2 className="text-xl font-bold">{headline}</h2>
          {headlineSub ? (
            <span className="text-sm opacity-90">{headlineSub}</span>
          ) : null}
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            計算で出た事実
          </p>
          <div className={`rounded-xl ${a.factBg} p-3 ring-1 ring-inset ${a.ring}`}>
            {facts}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            解釈
          </p>
          {interpretation}
        </div>
      </div>
    </section>
  );
}
