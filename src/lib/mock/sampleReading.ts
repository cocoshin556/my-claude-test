import type { IntegratedReading, Interpretation } from '@/types';

/**
 * モック表示用のサンプル鑑定データ。
 *
 * 注意: ここに含まれる解釈テキストは「レイアウト確認用のダミー」であり、
 * 原典データでも計算結果でもない。実モジュール（src/lib/*）はこの種の文章を生成しない。
 * モックページ上部のバナーでサンプルである旨を明示する。
 *
 * 1998-08-30 生まれの例 → 流生命=風流生(6, 五行=金) / 数秘ライフパス=11(マスター)。
 */
export const sampleReading: IntegratedReading = {
  input: {
    date: { year: 1998, month: 8, day: 30 },
    time: { hour: 14, minute: 30 },
    place: { name: '東京', latitude: 35.6895, longitude: 139.6917 },
    bloodType: 'O',
    gender: 'female',
    timezone: { ianaName: 'Asia/Tokyo', manualOffsetMinutes: null },
  },
  numerology: {
    lifePath: {
      value: 11,
      isMasterNumber: true,
      reductionSteps: [38, 11],
      interpretation: {
        title: 'ライフパス 11（マスターナンバー）',
        text: '直感と理想を併せ持つマスターナンバー。鋭い感受性で場の空気を読み、人を導く力を持つ。理想が高いぶん現実とのギャップに揺れやすいが、信念を行動に変えると大きく開花する。',
        keywords: ['直感', '理想', '感受性'],
        found: true,
        source: { file: 'data/numerology.json', key: 'lifePath.11' },
      },
    },
    destiny: {
      value: 3,
      isMasterNumber: false,
      reductionSteps: [3],
      interpretation: {
        title: '誕生数 3',
        text: '表現力と楽天性。遊び心とコミュニケーションで周囲を明るくする。',
        keywords: ['表現', '社交', '創造'],
        found: true,
        source: { file: 'data/numerology.json', key: 'destiny.3' },
      },
    },
  },
  astrology: {
    planets: [
      { planet: 'sun', longitude: 156, sign: 'virgo', signDegree: 6, house: 10, retrograde: false },
      { planet: 'moon', longitude: 258, sign: 'sagittarius', signDegree: 18, house: 1, retrograde: false },
      { planet: 'mercury', longitude: 182, sign: 'libra', signDegree: 2, house: 11, retrograde: false },
      { planet: 'venus', longitude: 140, sign: 'leo', signDegree: 20, house: 9, retrograde: false },
      { planet: 'mars', longitude: 192, sign: 'libra', signDegree: 12, house: 11, retrograde: false },
      { planet: 'jupiter', longitude: 355, sign: 'pisces', signDegree: 25, house: 4, retrograde: true },
      { planet: 'saturn', longitude: 1, sign: 'aries', signDegree: 1, house: 5, retrograde: true },
      { planet: 'uranus', longitude: 310, sign: 'aquarius', signDegree: 10, house: 3, retrograde: true },
      { planet: 'neptune', longitude: 270, sign: 'capricorn', signDegree: 0, house: 2, retrograde: true },
      { planet: 'pluto', longitude: 214, sign: 'scorpio', signDegree: 4, house: 12, retrograde: false },
    ],
    angles: {
      ascendant: { longitude: 245, sign: 'sagittarius', signDegree: 5 },
      midheaven: { longitude: 170, sign: 'virgo', signDegree: 20 },
    },
    houses: {
      system: 'placidus',
      cusps: [245, 275, 312, 350, 25, 55, 65, 95, 132, 170, 200, 218],
    },
    aspects: [
      { planetA: 'sun', planetB: 'neptune', type: 'trine', exactAngle: 120, actualAngle: 114, orb: 6 },
      { planetA: 'mercury', planetB: 'jupiter', type: 'opposition', exactAngle: 180, actualAngle: 173, orb: 7 },
      { planetA: 'mercury', planetB: 'neptune', type: 'square', exactAngle: 90, actualAngle: 88, orb: 2 },
    ],
    config: {
      houseSystem: 'placidus',
      orbs: { conjunction: 8, opposition: 8, trine: 6, square: 6 },
    },
    notes: [],
  },
  ryuseimei: {
    star: {
      digit: 6,
      id: 'fu',
      name: '風流生',
      element: 'metal',
      calculation: { yearLast: 8, monthLast: 8, dayLast: 0, sum: 16, digit: 6 },
      interpretation: {
        title: '風流生',
        text: '風のように軽やかで、束縛を嫌い自由を愛する。人と人の間を渡り歩く社交性と情報感度を持ち、変化の中でこそ生き生きする。',
        keywords: ['自由', '社交', '変化'],
        found: true,
        source: { file: 'data/ryuseimei/stars.json', key: 'fu' },
      },
    },
    cycle: {
      year: 2026,
      value: null,
      interpretation: {
        text: null,
        found: false,
        source: { file: 'data/ryuseimei/cycles.json', key: '2026' },
      },
    },
  },
  generatedAt: '2026-06-06T00:00:00.000Z',
};

/**
 * 占星術カードの「解釈」サンプル。
 * 注: 占星術の解釈データ／型は手順5で追加予定。現状はモック表示用にここで与える。
 */
export const sampleAstrologyInterpretation: Interpretation = {
  title: '太陽 — 乙女座 / 第10ハウス',
  text: '実務的で分析的。細部に気づき「役に立つこと」に喜びを見いだす。第10ハウスの太陽は、社会的役割や仕事を通じて自分を確立するテーマを示す。',
  keywords: ['分析', '実務', '貢献'],
  found: true,
  source: { file: 'data/astrology.json', key: 'sun.virgo' },
};
