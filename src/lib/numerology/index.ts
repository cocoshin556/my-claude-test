import type {
  BirthDate,
  BirthInput,
  Interpretation,
  NumerologyNumber,
  NumerologyResult,
  NumerologyValue,
} from '@/types';
import numerologyData from '@/data/numerology.json';

/** マスターナンバー（還元しない）。 */
const MASTER_NUMBERS = new Set([11, 22, 33]);

type InterpretationEntry = {
  title?: string;
  text?: string;
  keywords?: string[];
};

const DATA = numerologyData as unknown as Record<
  string,
  Record<string, InterpretationEntry>
>;

/** 整数の各桁の和。 */
function digitSum(n: number): number {
  return String(Math.abs(Math.trunc(n)))
    .split('')
    .reduce((acc, c) => acc + Number(c), 0);
}

/**
 * マスターナンバー(11/22/33)を保持しつつ1桁まで還元する。
 * 還元の途中経過も返す。例: 38 → [38, 11]、30 → [30, 3]、5 → [5]。
 */
export function reduceKeepingMaster(n: number): { value: number; steps: number[] } {
  const steps: number[] = [];
  let current = Math.abs(Math.trunc(n));
  while (current > 9 && !MASTER_NUMBERS.has(current)) {
    steps.push(current);
    current = digitSum(current);
  }
  steps.push(current);
  return { value: current, steps };
}

/**
 * ライフパスナンバー。生年月日（年・月・日）の各桁を合計し、マスターを保持して還元する。
 */
export function calculateLifePath(date: BirthDate): {
  value: number;
  steps: number[];
  isMaster: boolean;
} {
  const total = digitSum(date.year) + digitSum(date.month) + digitSum(date.day);
  const { value, steps } = reduceKeepingMaster(total);
  return { value, steps, isMaster: MASTER_NUMBERS.has(value) };
}

/**
 * ディスティニー（誕生数）。誕生日の「日」をマスター保持で還元する。
 * 例: 30日 → 3、29日 → 11（マスター）。
 */
export function calculateDestiny(date: BirthDate): {
  value: number;
  steps: number[];
  isMaster: boolean;
} {
  const { value, steps } = reduceKeepingMaster(date.day);
  return { value, steps, isMaster: MASTER_NUMBERS.has(value) };
}

/** data/numerology.json から解釈を引く。無ければ「未登録」。 */
function lookup(category: 'lifePath' | 'destiny', value: number): Interpretation {
  const source = { file: 'data/numerology.json', key: `${category}.${value}` };
  const entry = DATA[category]?.[String(value)];
  const text = entry?.text?.trim() ? entry.text : null;
  return {
    text,
    title: entry?.title ?? null,
    keywords: entry?.keywords ?? [],
    found: text !== null,
    source,
  };
}

function toNumber(
  value: number,
  isMaster: boolean,
  steps: number[],
  category: 'lifePath' | 'destiny',
): NumerologyNumber {
  return {
    value: value as NumerologyValue,
    isMasterNumber: isMaster,
    reductionSteps: steps,
    interpretation: lookup(category, value),
  };
}

/**
 * 生年月日から数秘の各ナンバーを計算する（純粋関数）。
 * 数値は計算で出し、解釈は data/numerology.json を参照する。
 */
export function calculateNumerology(input: BirthInput): NumerologyResult {
  const lp = calculateLifePath(input.date);
  const de = calculateDestiny(input.date);
  return {
    lifePath: toNumber(lp.value, lp.isMaster, lp.steps, 'lifePath'),
    destiny: toNumber(de.value, de.isMaster, de.steps, 'destiny'),
  };
}
