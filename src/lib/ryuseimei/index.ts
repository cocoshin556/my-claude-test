import type {
  BirthDate,
  BirthInput,
  Interpretation,
  RyuseimeiCycle,
  RyuseimeiElement,
  RyuseimeiResult,
  RyuseimeiStar,
  RyuseimeiStarCalculation,
  RyuseimeiStarId,
} from '@/types';

/**
 * 数字(0-9) → 星 の対応表。原典「流生命の図」「流生命の出し方」より。
 * 名称・五行は構造ラベル（枠）であり占文ではないためコードに保持する。
 * 各星の「解釈（性格・運勢等）」は data/ryuseimei/ を参照する（コードでは生成しない）。
 */
export const RYUSEIMEI_STARS: Record<
  number,
  { id: RyuseimeiStarId; name: string; element: RyuseimeiElement }
> = {
  0: { id: 'mizu', name: '水流生', element: 'water' },
  1: { id: 'hikari', name: '光流生', element: 'fire' },
  2: { id: 'hi', name: '火流生', element: 'fire' },
  3: { id: 'sou', name: '奏流生', element: 'metal' },
  4: { id: 'chi', name: '地流生', element: 'earth' },
  5: { id: 'ten', name: '天流生', element: 'earth' },
  6: { id: 'fu', name: '風流生', element: 'metal' },
  7: { id: 'sora', name: '空流生', element: 'wood' },
  8: { id: 'umi', name: '海流生', element: 'water' },
  9: { id: 'ki', name: '気流生', element: 'wood' },
};

/** 非負の下1桁を返す。 */
function lastDigit(n: number): number {
  return Math.abs(Math.trunc(n)) % 10;
}

/**
 * 星判定の計算過程を求める。
 * 原典の出し方: 誕生年・月・日それぞれの末尾を足し、その合計の末尾(0-9)を採用する。
 * 例: 1975-10-02 → 5+0+2=7 → 7 / 1968-08-19 → 8+8+9=25 → 末尾5。
 */
export function calculateStarDigit(date: BirthDate): RyuseimeiStarCalculation {
  const yearLast = lastDigit(date.year);
  const monthLast = lastDigit(date.month);
  const dayLast = lastDigit(date.day);
  const sum = yearLast + monthLast + dayLast;
  const digit = sum % 10; // 2ケタになっても末尾のみ
  return { yearLast, monthLast, dayLast, sum, digit };
}

/**
 * 生年月日から流生命の星（タイプ）を機械判定する。
 * 解釈は付けない（呼び出し側で data 参照の Interpretation を合成する）。
 */
export function determineStar(date: BirthDate): Omit<RyuseimeiStar, 'interpretation'> {
  const calculation = calculateStarDigit(date);
  const star = RYUSEIMEI_STARS[calculation.digit];
  // 0-9 は必ず表に存在するが、noUncheckedIndexedAccess 対応の防御。
  if (!star) {
    throw new Error(`流生命: 数字 ${calculation.digit} に対応する星が未定義です`);
  }
  return {
    digit: calculation.digit,
    id: star.id,
    name: star.name,
    element: star.element,
    calculation,
  };
}

/**
 * 星の解釈テキストを data/ryuseimei/ から引く。
 * 各星のデータが未提供のため、現状は常に「未登録」を返す（捏造しない）。
 *
 * TODO: 各星のデータ共有後、stars.json 等を読み込んで found=true / text を返す。
 *       データ形式が確定したらここを実データ参照に差し替える。
 */
function lookupStarInterpretation(id: RyuseimeiStarId): Interpretation {
  return {
    text: null,
    found: false,
    source: { file: 'data/ryuseimei/stars.json', key: id },
  };
}

/**
 * 当年のサイクルを判定する。
 * 原典の判定ルールが現資料に無いため未確定。現状は枠だけ返す。
 *
 * TODO: サイクル判定ルール（性別の関与を含む）の提供後に実装する。
 */
function judgeCycle(targetYear: number): RyuseimeiCycle {
  return {
    year: targetYear,
    value: null,
    interpretation: {
      text: null,
      found: false,
      source: { file: 'data/ryuseimei/cycles.json', key: String(targetYear) },
    },
  };
}

/**
 * 流生命の枠（星・サイクル）を機械判定し、解釈は data 参照で合成する。
 *
 * 注意: 原典「流生命の出し方」では星判定に生年月日のみを用いる（性別は不使用）。
 *       性別はサイクル等の未提供ルールで参照する想定。
 *
 * @param input      入力（星判定には date のみ使用）
 * @param targetYear サイクル判定の対象年（当年）
 */
export function judgeRyuseimei(input: BirthInput, targetYear: number): RyuseimeiResult {
  const base = determineStar(input.date);
  const star: RyuseimeiStar = {
    ...base,
    interpretation: lookupStarInterpretation(base.id),
  };
  return {
    star,
    cycle: judgeCycle(targetYear),
  };
}
