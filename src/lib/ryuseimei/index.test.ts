import { describe, it, expect } from 'vitest';
import {
  RYUSEIMEI_STARS,
  calculateStarDigit,
  determineStar,
  judgeRyuseimei,
} from './index';
import type { BirthInput } from '@/types';

/** テスト用の最小 BirthInput を作る。 */
function makeInput(year: number, month: number, day: number): BirthInput {
  return {
    date: { year, month, day },
    time: null,
    place: { name: null, latitude: 0, longitude: 0 },
    bloodType: null,
    gender: 'male',
    timezone: { ianaName: 'Asia/Tokyo', manualOffsetMinutes: null },
  };
}

describe('流生命 星判定（原典の出し方）', () => {
  it('原典例1: 1975-10-02 → 5+0+2=7 → 空流生(wood)', () => {
    const calc = calculateStarDigit({ year: 1975, month: 10, day: 2 });
    expect(calc).toEqual({ yearLast: 5, monthLast: 0, dayLast: 2, sum: 7, digit: 7 });

    const star = determineStar({ year: 1975, month: 10, day: 2 });
    expect(star.digit).toBe(7);
    expect(star.id).toBe('sora');
    expect(star.name).toBe('空流生');
    expect(star.element).toBe('wood');
  });

  it('原典例2: 1968-08-19 → 8+8+9=25 → 末尾5 → 天流生(earth)', () => {
    const calc = calculateStarDigit({ year: 1968, month: 8, day: 19 });
    expect(calc.sum).toBe(25);
    expect(calc.digit).toBe(5);

    const star = determineStar({ year: 1968, month: 8, day: 19 });
    expect(star.id).toBe('ten');
    expect(star.name).toBe('天流生');
    expect(star.element).toBe('earth');
  });

  it('合計がちょうど10 → 末尾0 → 水流生 (1990-05-15)', () => {
    const star = determineStar({ year: 1990, month: 5, day: 15 });
    expect(star.calculation.sum).toBe(10);
    expect(star.digit).toBe(0);
    expect(star.id).toBe('mizu');
  });

  it('0-9 すべてに星が定義されている', () => {
    for (let d = 0; d <= 9; d++) {
      expect(RYUSEIMEI_STARS[d]).toBeDefined();
    }
  });

  it('五行マッピングが原典「流生命の図」と一致する', () => {
    const elements = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => RYUSEIMEI_STARS[d]!.element);
    expect(elements).toEqual([
      'water', // 0 水
      'fire', // 1 光
      'fire', // 2 火
      'metal', // 3 奏
      'earth', // 4 地
      'earth', // 5 天
      'metal', // 6 風
      'wood', // 7 空
      'water', // 8 海
      'wood', // 9 気
    ]);
  });
});

describe('judgeRyuseimei', () => {
  it('星は判定され、解釈はデータ未提供のため未登録で返る', () => {
    const result = judgeRyuseimei(makeInput(1975, 10, 2), 2026);
    expect(result.star.id).toBe('sora');
    expect(result.star.interpretation.found).toBe(false);
    expect(result.star.interpretation.text).toBeNull();
    expect(result.star.interpretation.source).toEqual({
      file: 'data/ryuseimei/stars.json',
      key: 'sora',
    });
  });

  it('サイクルは判定ルール未確定のため value=null・未登録', () => {
    const result = judgeRyuseimei(makeInput(1968, 8, 19), 2026);
    expect(result.cycle.year).toBe(2026);
    expect(result.cycle.value).toBeNull();
    expect(result.cycle.interpretation.found).toBe(false);
  });
});
