import type { AstrologyConfig, AstrologyResult, BirthInput } from '@/types';

/**
 * 占星術計算のデフォルト設定。
 * ハウスは Placidus、アスペクトは合・トライン・スクエア・オポジションを既定で検出する。
 */
export const DEFAULT_ASTROLOGY_CONFIG: AstrologyConfig = {
  houseSystem: 'placidus',
  orbs: {
    conjunction: 8,
    opposition: 8,
    trine: 6,
    square: 6,
  },
};

/**
 * 出生情報から惑星位置・ハウス・アスペクトを計算する（swisseph-wasm ラッパー）。
 * 出生時刻が無い場合、angles（ASC/MC）と houses は null で返し、notes に省略理由を記す。
 *
 * TODO(手順4-5): swisseph-wasm を導入して本実装＋テスト。
 *   検証例: 1990-05-15 14:30 UTC-5 / 40.71N,74.00W で太陽が牡牛座(taurus)になること。
 */
export async function calculateAstrology(
  _input: BirthInput,
  _config: AstrologyConfig = DEFAULT_ASTROLOGY_CONFIG,
): Promise<AstrologyResult> {
  throw new Error('未実装: 占星術モジュールは手順4-5で実装します');
}
