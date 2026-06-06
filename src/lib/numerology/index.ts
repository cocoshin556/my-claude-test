import type { BirthInput, NumerologyResult } from '@/types';

/**
 * 生年月日から数秘の各ナンバーを計算する（純粋関数・副作用なし）。
 * 数値の算出のみを行い、解釈テキストは data/numerology.json を参照して付与する
 * （コードでは占文を生成しない）。
 *
 * 仕様: マスターナンバー 11/22/33 は還元しない。
 *
 * TODO(手順3): 本実装＋Vitest テスト。
 */
export function calculateNumerology(_input: BirthInput): NumerologyResult {
  throw new Error('未実装: 数秘術モジュールは手順3で実装します');
}
