/**
 * 西洋占星術モジュール（swisseph-wasm ラッパー）の結果型。
 * 出生時刻が無い場合、ASC/MC・ハウスは null（「時刻不明のため省略」）。
 */

/** 12 サイン。 */
export type ZodiacSign =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

/** 10 天体。 */
export type PlanetId =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto';

/**
 * アスペクト種別。型としては古典的メジャーアスペクトを網羅する。
 * 実際にどれを検出するかは AstrologyConfig.orbs で制御する
 * （デフォルトは合・トライン・スクエア・オポジション）。
 */
export type AspectType =
  | 'conjunction' // 合 0°
  | 'sextile' // セクスタイル 60°
  | 'square' // スクエア 90°
  | 'trine' // トライン 120°
  | 'opposition'; // オポジション 180°

/** ハウスシステム。デフォルトは Placidus、UI で切替可能。 */
export type HouseSystem =
  | 'placidus'
  | 'koch'
  | 'whole-sign'
  | 'equal'
  | 'campanus'
  | 'regiomontanus';

/** 黄経を持つ点（天体・感受点）に共通するサイン情報。 */
export interface ZodiacPosition {
  /** 黄経 0-360°（牡羊座 0° 起点）。 */
  longitude: number;
  /** サイン。 */
  sign: ZodiacSign;
  /** サイン内度数 0-30。 */
  signDegree: number;
}

/** 天体位置（黄経・サイン・ハウス）。 */
export interface PlanetPosition extends ZodiacPosition {
  planet: PlanetId;
  /** ハウス 1-12。出生時刻が無い場合は null。 */
  house: number | null;
  /** 逆行か。 */
  retrograde: boolean;
}

/** アセンダント・MC 等の感受点。 */
export type AnglePoint = ZodiacPosition;

/** ハウス情報（出生時刻ありの場合のみ算出）。 */
export interface Houses {
  system: HouseSystem;
  /** 第1〜第12ハウスのカスプ黄経。配列長 12、index 0 = 第1ハウス。 */
  cusps: number[];
}

/** アスペクト 1 件。 */
export interface Aspect {
  planetA: PlanetId;
  planetB: PlanetId;
  type: AspectType;
  /** 定義角度（例: トライン=120）。 */
  exactAngle: number;
  /** 実際の 2 天体間の離角（度）。 */
  actualAngle: number;
  /** オーブ（定義角度との差の絶対値、度）。 */
  orb: number;
}

/** 占星術計算の設定。 */
export interface AstrologyConfig {
  /** ハウスシステム（デフォルト placidus）。 */
  houseSystem: HouseSystem;
  /**
   * アスペクト種別ごとの許容オーブ（度）。
   * キーが存在する種別のみ検出対象。例: { conjunction: 8, opposition: 8, trine: 6, square: 6 }。
   */
  orbs: Partial<Record<AspectType, number>>;
}

/**
 * 占星術モジュールの結果。
 */
export interface AstrologyResult {
  /** 10 天体の位置。 */
  planets: PlanetPosition[];
  /** アセンダント / MC。出生時刻が無い場合は null。 */
  angles: {
    ascendant: AnglePoint;
    midheaven: AnglePoint;
  } | null;
  /** ハウス。出生時刻が無い場合は null。 */
  houses: Houses | null;
  /** 検出されたアスペクト。 */
  aspects: Aspect[];
  /** 実際に使用した設定（ハウスシステム・オーブ）。 */
  config: AstrologyConfig;
  /** 「時刻不明のため省略」等の注記（UI 表示用）。 */
  notes: string[];
}
