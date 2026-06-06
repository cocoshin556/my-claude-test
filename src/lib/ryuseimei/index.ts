import type { BirthInput, RyuseimeiResult } from '@/types';

/**
 * 生年月日から流生命の「タイプ番号」「当年のサイクル」の "枠" だけを機械判定する。
 *
 * 重要原則:
 *  - 解釈テキストは絶対にコードで生成しない。data/ryuseimei/ の JSON を参照するのみ。
 *  - 原典で確定している判定ルールのみ実装する。不明な規則はハードコードせず TODO を残す。
 *  - 該当データが無い枠は Interpretation.found=false（「未登録」）として空で返す。
 *
 * @param _input     入力（判定には生年月日のみ使用）
 * @param _targetYear サイクル判定の対象年（当年）
 *
 * TODO(手順6): 枠判定の本実装＋Vitest テスト。
 */
export function judgeRyuseimei(
  _input: BirthInput,
  _targetYear: number,
): RyuseimeiResult {
  throw new Error('未実装: 流生命モジュールは手順6で実装します');
}
