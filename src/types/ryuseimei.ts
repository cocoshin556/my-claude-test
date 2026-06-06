import type { Interpretation } from './common';

/**
 * 流生命モジュールの結果型。原典「流生命の図」「流生命の出し方」に基づく。
 *
 * 重要原則: コードは星(タイプ)・サイクルという機械判定できる "枠" のみを出す。
 * 解釈文（性格・運勢など）は絶対にコードで生成せず、必ず data/ryuseimei/ を参照する。
 * 該当データが無ければ Interpretation.found=false（＝「未登録」）として空で返す。
 */

/** 流生命の星（タイプ）。末尾合計の数字 0-9 に対応する10種。 */
export type RyuseimeiStarId =
  | 'mizu' // 0 水流生
  | 'hikari' // 1 光流生
  | 'hi' // 2 火流生
  | 'sou' // 3 奏流生
  | 'chi' // 4 地流生
  | 'ten' // 5 天流生
  | 'fu' // 6 風流生
  | 'sora' // 7 空流生
  | 'umi' // 8 海流生
  | 'ki'; // 9 気流生

/** 五行（「流生命の図」の分類）。 */
export type RyuseimeiElement = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

/** 星判定の計算過程（透明性・デバッグ用）。 */
export interface RyuseimeiStarCalculation {
  /** 誕生年の末尾（0-9）。 */
  yearLast: number;
  /** 誕生月の末尾（0-9）。 */
  monthLast: number;
  /** 誕生日の末尾（0-9）。 */
  dayLast: number;
  /** 末尾3つの合計（2ケタになりうる）。 */
  sum: number;
  /** sum の末尾＝最終的なタイプ番号（0-9）。 */
  digit: number;
}

/** 流生命の星（タイプ）。生年月日から機械判定できる確定の枠。 */
export interface RyuseimeiStar {
  /** タイプ番号 0-9。 */
  digit: number;
  /** 星ID。 */
  id: RyuseimeiStarId;
  /** 原典の名称。例: "風流生"（枠＝構造ラベルであり占文ではない）。 */
  name: string;
  /** 五行。 */
  element: RyuseimeiElement;
  /** 計算過程。 */
  calculation: RyuseimeiStarCalculation;
  /** 解釈テキスト（data/ryuseimei/ 由来。未登録なら found=false）。 */
  interpretation: Interpretation;
}

/**
 * 当年（鑑定対象年）のサイクル（枠）。
 * 原典の判定ルールは現資料に無いため未確定。ルール提供後に実装する。
 */
export interface RyuseimeiCycle {
  /** 鑑定対象の西暦年。 */
  year: number;
  /** サイクル識別子。判定ルール未確定のため現状は null。 */
  value: string | null;
  /** 解釈テキスト（data/ryuseimei/ 由来）。 */
  interpretation: Interpretation;
}

/**
 * 流生命モジュールの結果。
 * 機械判定できる「枠」のみを保持し、解釈は必ず data/ から引く。
 */
export interface RyuseimeiResult {
  /** 星（タイプ）。生年月日から機械判定。 */
  star: RyuseimeiStar;
  /** 当年のサイクル（判定ルール未確定）。 */
  cycle: RyuseimeiCycle;
}
