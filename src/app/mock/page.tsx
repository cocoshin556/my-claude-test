import { IntegratedReadingView } from '@/components/result/IntegratedReadingView';
import {
  sampleReading,
  sampleAstrologyInterpretation,
} from '@/lib/mock/sampleReading';

/**
 * 統合表示画面のモック（サンプルデータ）。
 * フォーム・実データ投入の前に、結果カードの見た目を確認するためのページ。
 */
export default function MockPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <IntegratedReadingView
          reading={sampleReading}
          astrologyInterpretation={sampleAstrologyInterpretation}
          notice="モック表示（サンプルデータ）— 実データ未投入。解釈テキストはレイアウト確認用のダミーです。"
        />
      </div>
    </main>
  );
}
