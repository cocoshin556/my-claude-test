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
    <IntegratedReadingView
      reading={sampleReading}
      astrologyInterpretation={sampleAstrologyInterpretation}
    />
  );
}
