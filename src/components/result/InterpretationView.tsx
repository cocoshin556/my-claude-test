import type { Interpretation } from '@/types';

/**
 * 解釈テキストの表示ブロック。
 * - データがあれば本文（＋任意の見出し・キーワード）を表示。
 * - 未登録なら「原典データ未登録」チップを表示（捏造しない）。
 * - showSource が true のとき出典（どの JSON 由来か）を表示する。
 */
export function InterpretationView({
  interpretation,
  showSource,
}: {
  interpretation: Interpretation;
  showSource: boolean;
}) {
  const { text, title, keywords, found, source } = interpretation;
  return (
    <div className="space-y-2">
      {found ? (
        <>
          {title ? (
            <p className="text-sm font-semibold text-slate-700">{title}</p>
          ) : null}
          {text ? (
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {text}
            </p>
          ) : null}
          {keywords && keywords.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {keywords.map((k) => (
                <span
                  key={k}
                  className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500"
                >
                  #{k}
                </span>
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-inset ring-slate-200">
          原典データ未登録
        </span>
      )}
      {showSource ? (
        <p className="font-mono text-[11px] text-slate-400">
          出典: {source.file}#{source.key}
        </p>
      ) : null}
    </div>
  );
}
