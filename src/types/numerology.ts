import type { Interpretation } from './common';

/**
 * 数秘術モジュールの結果型。
 * 「計算で出た数（事実）」と「data/numerology.json 由来の解釈」を分離して保持する。
 */

/** 数秘で扱う確定値。マスターナンバー 11/22/33 は還元しない。 */
export type NumerologyValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 22 | 33;

/** 計算した 1 つのナンバーと、その解釈。 */
export interface NumerologyNumber {
  /** 計算で出た事実としての数値。 */
  value: NumerologyValue;
  /** マスターナンバー（11/22/33）か。 */
  isMasterNumber: boolean;
  /**
   * 還元の途中経過（透明性・デバッグ用）。
   * 例: 各桁合計が 38 → 11 で確定した場合 [38, 11]。
   */
  reductionSteps: number[];
  /** 解釈テキスト（data/numerology.json 由来）。 */
  interpretation: Interpretation;
}

/**
 * 数秘術モジュールの結果。
 *
 * 注意: 現状の BirthInput には氏名フィールドが無いため、
 * 氏名由来の Expression / Soul Urge 等は計算対象外。生年月日から導けるものに限る。
 */
export interface NumerologyResult {
  /** ライフパスナンバー（生年月日全体の還元）。 */
  lifePath: NumerologyNumber;
  /** ディスティニー＝誕生数（生年月日由来）。 */
  destiny: NumerologyNumber;
  // TODO(手順3): 生年月日から計算可能な他のナンバーがあれば追加する。
}
