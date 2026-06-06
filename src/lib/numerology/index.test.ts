import { describe, it, expect } from 'vitest';
import {
  reduceKeepingMaster,
  calculateLifePath,
  calculateDestiny,
  calculateNumerology,
} from './index';
import type { BirthInput } from '@/types';

function input(year: number, month: number, day: number): BirthInput {
  return {
    date: { year, month, day },
    time: null,
    place: { name: null, latitude: 0, longitude: 0 },
    bloodType: null,
    gender: 'female',
    timezone: { ianaName: 'Asia/Tokyo', manualOffsetMinutes: null },
  };
}

describe('reduceKeepingMaster', () => {
  it('1桁はそのまま', () => {
    expect(reduceKeepingMaster(5)).toEqual({ value: 5, steps: [5] });
  });
  it('複数桁は1桁まで還元し途中経過を保持', () => {
    expect(reduceKeepingMaster(30)).toEqual({ value: 3, steps: [30, 3] });
  });
  it('マスターナンバー11/22/33は還元しない', () => {
    expect(reduceKeepingMaster(38).value).toBe(11); // 38→11 で停止
    expect(reduceKeepingMaster(38).steps).toEqual([38, 11]);
    expect(reduceKeepingMaster(29).value).toBe(11); // 29→11
    expect(reduceKeepingMaster(22).value).toBe(22);
    expect(reduceKeepingMaster(33).value).toBe(33);
  });
});

describe('calculateLifePath', () => {
  it('1998-08-30 → 11（マスター）', () => {
    const r = calculateLifePath({ year: 1998, month: 8, day: 30 });
    expect(r.value).toBe(11);
    expect(r.isMaster).toBe(true);
    expect(r.steps).toEqual([38, 11]);
  });
  it('1990-05-15 → 3', () => {
    const r = calculateLifePath({ year: 1990, month: 5, day: 15 });
    expect(r.value).toBe(3); // 19+5+6=30→3
    expect(r.isMaster).toBe(false);
  });
});

describe('calculateDestiny（誕生数）', () => {
  it('30日 → 3', () => {
    expect(calculateDestiny({ year: 2000, month: 1, day: 30 }).value).toBe(3);
  });
  it('29日 → 11（マスター）', () => {
    const r = calculateDestiny({ year: 2000, month: 1, day: 29 });
    expect(r.value).toBe(11);
    expect(r.isMaster).toBe(true);
  });
});

describe('calculateNumerology', () => {
  it('解釈テキストが data/numerology.json から引かれる', () => {
    const r = calculateNumerology(input(1998, 8, 30));
    expect(r.lifePath.value).toBe(11);
    expect(r.lifePath.interpretation.found).toBe(true);
    expect(r.lifePath.interpretation.source).toEqual({
      file: 'data/numerology.json',
      key: 'lifePath.11',
    });
    expect(r.destiny.value).toBe(3);
    expect(r.destiny.interpretation.found).toBe(true);
  });
});
