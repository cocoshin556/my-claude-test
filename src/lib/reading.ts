import type { BirthInput, IntegratedReading } from '@/types';
import { calculateNumerology } from './numerology';
import { calculateAstrology } from './astrology';
import { judgeRyuseimei } from './ryuseimei';

/**
 * 入力から3体系を計算して統合鑑定結果を組み立てる。
 * 各モジュールは独立して計算し、解釈は data/ 参照のみ（コードは占文を生成しない）。
 */
export function buildReading(
  input: BirthInput,
  targetYear: number = new Date().getFullYear(),
): IntegratedReading {
  return {
    input,
    numerology: calculateNumerology(input),
    astrology: calculateAstrology(input),
    ryuseimei: judgeRyuseimei(input, targetYear),
    generatedAt: new Date().toISOString(),
  };
}
