import type { Interpretation } from './common';

/**
 * 流生命モジュールの結果型。
 *
 * 重要原則: コードは「タイプ番号」「サイクル」といった機械判定できる "枠" のみを出す。
 * 解釈文は絶対にコードで生成せず、必ず data/ryuseimei/ の JSON を参照する。
 * 該当データが無ければ Interpretation.found=false（＝「未登録」）として空で返す。
 */

/** 流生命の「タイプ番号」（枠）。 */
export interface RyuseimeiType {
  /** タイプ番号。判定ルールが原典で未確定/判定不能なら null。 */
  value: number | null;
  /** 解釈テキスト（data/ryuseimei/ 由来。未登録なら found=false）。 */
  interpretation: Interpretation;
}

/** 当年（鑑定対象年）のサイクル（枠）。 */
export interface RyuseimeiCycle {
  /** 鑑定対象の西暦年。 */
  year: number;
  /** サイクル識別子（番号や名称）。判定不能なら null。 */
  value: string | null;
  /** 解釈テキスト（data/ryuseimei/ 由来）。 */
  interpretation: Interpretation;
}

/**
 * 流生命モジュールの結果。
 * 機械判定できる「枠」のみを保持する。
 */
export interface RyuseimeiResult {
  /** タイプ番号。 */
  type: RyuseimeiType;
  /** 当年のサイクル。 */
  cycle: RyuseimeiCycle;
  // TODO(手順6): 原典で確定している他の枠があれば追加する。不明な規則はハードコードしない。
}
