import { describe, it, expect } from 'vitest';
import { calculateAstrology, getSunSignInterpretation } from './index';
import type { BirthInput } from '@/types';

// 検証例: 1990-05-15 14:30 UTC-5 / 40.71N,74.00W → 太陽が牡牛座。
const nyc: BirthInput = {
  date: { year: 1990, month: 5, day: 15 },
  time: { hour: 14, minute: 30 },
  place: { name: 'New York', latitude: 40.71, longitude: -74.0 },
  bloodType: null,
  gender: 'male',
  timezone: { ianaName: 'America/New_York', manualOffsetMinutes: -300 },
};

describe('calculateAstrology', () => {
  it('太陽が牡牛座（検証例）', () => {
    const r = calculateAstrology(nyc);
    const sun = r.planets.find((p) => p.planet === 'sun');
    expect(sun?.sign).toBe('taurus');
  });

  it('10天体すべて算出される', () => {
    const r = calculateAstrology(nyc);
    expect(r.planets).toHaveLength(10);
    for (const p of r.planets) {
      expect(p.longitude).toBeGreaterThanOrEqual(0);
      expect(p.longitude).toBeLessThan(360);
      expect(p.signDegree).toBeGreaterThanOrEqual(0);
      expect(p.signDegree).toBeLessThan(30);
    }
  });

  it('時刻ありなら ASC/MC・ハウスが算出される', () => {
    const r = calculateAstrology(nyc);
    expect(r.angles).not.toBeNull();
    expect(r.houses).not.toBeNull();
    expect(r.houses?.cusps).toHaveLength(12);
    for (const p of r.planets) expect(p.house).not.toBeNull();
  });

  it('時刻なしなら ASC/MC・ハウスは省略され注記が付く', () => {
    const noTime: BirthInput = { ...nyc, time: null };
    const r = calculateAstrology(noTime);
    expect(r.angles).toBeNull();
    expect(r.houses).toBeNull();
    expect(r.planets.every((p) => p.house === null)).toBe(true);
    expect(r.notes.join('')).toContain('時刻');
  });

  it('アスペクトのオーブは設定の上限以内', () => {
    const r = calculateAstrology(nyc);
    for (const a of r.aspects) {
      const max = r.config.orbs[a.type]!;
      expect(a.orb).toBeLessThanOrEqual(max);
    }
  });
});

describe('getSunSignInterpretation', () => {
  it('牡牛座の解釈が data/astrology.json から引かれる', () => {
    const i = getSunSignInterpretation('taurus');
    expect(i.found).toBe(true);
    expect(i.source).toEqual({ file: 'data/astrology.json', key: 'sunSign.taurus' });
  });
});
