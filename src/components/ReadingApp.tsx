'use client';

import { useState } from 'react';
import type { BirthInput, IntegratedReading } from '@/types';
import { buildReading } from '@/lib/reading';
import { getSunSignInterpretation } from '@/lib/astrology';
import { BirthInputForm } from './form/BirthInputForm';
import { IntegratedReadingView } from './result/IntegratedReadingView';

/**
 * 入力フォーム → 計算 → 統合表示 をつなぐアプリ本体。
 * 計算はすべてクライアントで実行（astronomy-engine は純JS）。
 */
export function ReadingApp() {
  const [reading, setReading] = useState<IntegratedReading | null>(null);

  function handleSubmit(input: BirthInput) {
    setReading(buildReading(input));
  }

  // 太陽サインの解釈（占星術カード用）。占星術の解釈データ/型は今後拡張予定。
  const astrologyInterpretation = reading
    ? getSunSignInterpretation(reading.astrology.planets[0]!.sign)
    : null;

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-2xl">
        <BirthInputForm onSubmit={handleSubmit} />
      </div>
      {reading && astrologyInterpretation ? (
        <IntegratedReadingView
          reading={reading}
          astrologyInterpretation={astrologyInterpretation}
        />
      ) : (
        <p className="text-center text-sm text-slate-400">
          上のフォームに入力して「鑑定する」を押すと、3体系の結果が表示されます。
        </p>
      )}
    </div>
  );
}
