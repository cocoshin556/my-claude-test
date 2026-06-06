import type { BirthInput } from './birth';
import type { NumerologyResult } from './numerology';
import type { AstrologyResult } from './astrology';
import type { RyuseimeiResult } from './ryuseimei';

/**
 * 3 体系を統合した鑑定結果。統合表示画面はこの型を描画する。
 * 各体系の結果は「計算で出た事実」と「解釈テキスト」を内部で分離して持つ。
 */
export interface IntegratedReading {
  /** 入力（再表示・再計算用）。 */
  input: BirthInput;
  /** 数秘術。 */
  numerology: NumerologyResult;
  /** 西洋占星術。 */
  astrology: AstrologyResult;
  /** 流生命。 */
  ryuseimei: RyuseimeiResult;
  /** 生成時刻（ISO 8601 文字列）。 */
  generatedAt: string;
}
