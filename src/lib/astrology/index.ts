import * as Astronomy from 'astronomy-engine';
import type {
  AstrologyConfig,
  AstrologyResult,
  Aspect,
  AspectType,
  BirthInput,
  Houses,
  Interpretation,
  PlanetId,
  PlanetPosition,
  ZodiacSign,
} from '@/types';
import astrologyData from '@/data/astrology.json';

/**
 * 占星術モジュール。
 *
 * 注: MVP の天体計算は純JSの astronomy-engine を使用（ブラウザでも動作）。
 * 設計どおり計算は本ファイルの内側に隠蔽してあるため、将来 swisseph-wasm へ
 * 差し替えても外部インターフェイス（AstrologyResult）は変わらない。
 * ハウスは暫定でホールサイン、Placidus は swisseph 導入時に対応予定。
 */

const SIGNS: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

const BODY: Record<PlanetId, Astronomy.Body> = {
  sun: Astronomy.Body.Sun,
  moon: Astronomy.Body.Moon,
  mercury: Astronomy.Body.Mercury,
  venus: Astronomy.Body.Venus,
  mars: Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter,
  saturn: Astronomy.Body.Saturn,
  uranus: Astronomy.Body.Uranus,
  neptune: Astronomy.Body.Neptune,
  pluto: Astronomy.Body.Pluto,
};

const PLANET_ORDER: PlanetId[] = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
];

const ASPECT_ANGLES: Record<AspectType, number> = {
  conjunction: 0,
  sextile: 60,
  square: 90,
  trine: 120,
  opposition: 180,
};

const OBLIQUITY_DEG = 23.4393;
const DEG = Math.PI / 180;

export const DEFAULT_ASTROLOGY_CONFIG: AstrologyConfig = {
  // MVP はホールサイン。Placidus は swisseph 導入時に対応予定。
  houseSystem: 'whole-sign',
  orbs: { conjunction: 8, opposition: 8, trine: 6, square: 6 },
};

const norm360 = (d: number): number => ((d % 360) + 360) % 360;

function signOf(lon: number): { sign: ZodiacSign; signDegree: number } {
  const l = norm360(lon);
  const idx = Math.floor(l / 30) % 12;
  return { sign: SIGNS[idx]!, signDegree: Number((l - idx * 30).toFixed(2)) };
}

function eclipticLongitude(planet: PlanetId, date: Date): number {
  if (planet === 'moon') return norm360(Astronomy.EclipticGeoMoon(date).lon);
  const vec = Astronomy.GeoVector(BODY[planet], date, true);
  return norm360(Astronomy.Ecliptic(vec).elon);
}

function isRetrograde(planet: PlanetId, date: Date): boolean {
  if (planet === 'sun' || planet === 'moon') return false;
  const l1 = eclipticLongitude(planet, date);
  const l2 = eclipticLongitude(planet, new Date(date.getTime() + 3600 * 1000));
  let delta = l2 - l1;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta < 0;
}

/** IANA タイムゾーンの、ある瞬間における UTC オフセット（分・東を正）。 */
function tzOffsetMinutes(ianaName: string, date: Date): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: ianaName,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const m: Record<string, number> = {};
  for (const p of dtf.formatToParts(date)) {
    if (p.type !== 'literal') m[p.type] = Number(p.value);
  }
  const asUtc = Date.UTC(m.year!, m.month! - 1, m.day!, m.hour!, m.minute!, m.second!);
  return Math.round((asUtc - date.getTime()) / 60000);
}

/** 出生の現地日時(+タイムゾーン) を UTC の Date に変換する。時刻が無ければ正午を用いる。 */
export function birthInstantUtc(input: BirthInput): Date {
  const { date, time, timezone } = input;
  const h = time ? time.hour : 12;
  const mi = time ? time.minute : 0;
  const naiveUtc = Date.UTC(date.year, date.month - 1, date.day, h, mi, 0);
  if (timezone.manualOffsetMinutes != null) {
    return new Date(naiveUtc - timezone.manualOffsetMinutes * 60000);
  }
  // ianaName から推定（DST 境界対応で2段階で収束させる）
  let off = tzOffsetMinutes(timezone.ianaName, new Date(naiveUtc));
  let utc = naiveUtc - off * 60000;
  off = tzOffsetMinutes(timezone.ianaName, new Date(utc));
  return new Date(naiveUtc - off * 60000);
}

/** ASC / MC（黄経）を求める。 */
function computeAngles(date: Date, latitude: number, longitudeEast: number) {
  const gastHours = Astronomy.SiderealTime(date); // グリニッジ視恒星時（時）
  const ramc = norm360(gastHours * 15 + longitudeEast); // RAMC（度）
  const theta = ramc * DEG;
  const eps = OBLIQUITY_DEG * DEG;
  const phi = latitude * DEG;

  const mc = norm360(Math.atan2(Math.sin(theta), Math.cos(theta) * Math.cos(eps)) / DEG);
  let asc = norm360(
    Math.atan2(
      Math.cos(theta),
      -(Math.sin(theta) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps)),
    ) / DEG,
  );
  // ASC は MC より黄道順で 0..180° 先（東の地平線）になるよう調整。
  if (norm360(asc - mc) > 180) asc = norm360(asc + 180);
  return { ascendant: asc, midheaven: mc };
}

function wholeSignHouse(planetLon: number, ascLon: number): number {
  const ascSign = Math.floor(norm360(ascLon) / 30);
  const planetSign = Math.floor(norm360(planetLon) / 30);
  return ((planetSign - ascSign + 12) % 12) + 1;
}

function computeAspects(
  positions: { planet: PlanetId; longitude: number }[],
  orbs: AstrologyConfig['orbs'],
): Aspect[] {
  const aspects: Aspect[] = [];
  const types = (Object.keys(orbs) as AspectType[]).filter((t) => orbs[t] != null);
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const a = positions[i]!;
      const b = positions[j]!;
      let sep = Math.abs(a.longitude - b.longitude);
      if (sep > 180) sep = 360 - sep;
      let best: Aspect | null = null;
      for (const t of types) {
        const maxOrb = orbs[t]!;
        const orb = Math.abs(sep - ASPECT_ANGLES[t]);
        if (orb <= maxOrb && (best === null || orb < best.orb)) {
          best = {
            planetA: a.planet,
            planetB: b.planet,
            type: t,
            exactAngle: ASPECT_ANGLES[t],
            actualAngle: Number(sep.toFixed(2)),
            orb: Number(orb.toFixed(2)),
          };
        }
      }
      if (best) aspects.push(best);
    }
  }
  return aspects;
}

/**
 * 出生情報から惑星位置・（時刻ありなら）ASC/MC・ハウス・アスペクトを計算する。
 */
export function calculateAstrology(
  input: BirthInput,
  config: AstrologyConfig = DEFAULT_ASTROLOGY_CONFIG,
): AstrologyResult {
  const date = birthInstantUtc(input);
  const notes: string[] = [];
  const hasTime = input.time != null;

  const raw = PLANET_ORDER.map((planet) => {
    const longitude = eclipticLongitude(planet, date);
    return { planet, longitude, retrograde: isRetrograde(planet, date) };
  });

  let angles: AstrologyResult['angles'] = null;
  let houses: Houses | null = null;

  if (hasTime) {
    const a = computeAngles(date, input.place.latitude, input.place.longitude);
    angles = {
      ascendant: { longitude: Number(a.ascendant.toFixed(2)), ...signOf(a.ascendant) },
      midheaven: { longitude: Number(a.midheaven.toFixed(2)), ...signOf(a.midheaven) },
    };
    const ascSignStart = Math.floor(norm360(a.ascendant) / 30) * 30;
    houses = {
      system: 'whole-sign',
      cusps: Array.from({ length: 12 }, (_, k) => norm360(ascSignStart + k * 30)),
    };
    notes.push('ハウスは暫定でホールサイン方式です（Placidus は swisseph 導入時に対応予定）。');
  } else {
    notes.push(
      '出生時刻が不明のため ASC/MC・ハウスは省略し、天体は正午で概算しています（特に月の位置は誤差が大きい場合があります）。',
    );
  }

  const planets: PlanetPosition[] = raw.map((p) => ({
    planet: p.planet,
    longitude: Number(p.longitude.toFixed(2)),
    ...signOf(p.longitude),
    house: angles ? wholeSignHouse(p.longitude, angles.ascendant.longitude) : null,
    retrograde: p.retrograde,
  }));

  const aspects = computeAspects(
    raw.map((p) => ({ planet: p.planet, longitude: p.longitude })),
    config.orbs,
  );

  return {
    planets,
    angles,
    houses,
    aspects,
    config: { houseSystem: 'whole-sign', orbs: config.orbs },
    notes,
  };
}

/** 太陽サインの解釈を data/astrology.json から引く（無ければ未登録）。 */
export function getSunSignInterpretation(sign: ZodiacSign): Interpretation {
  const table = (astrologyData as { sunSign?: Record<string, { title?: string; text?: string; keywords?: string[] }> }).sunSign ?? {};
  const entry = table[sign];
  const text = entry?.text?.trim() ? entry.text : null;
  return {
    text,
    title: entry?.title ?? null,
    keywords: entry?.keywords ?? [],
    found: text !== null,
    source: { file: 'data/astrology.json', key: `sunSign.${sign}` },
  };
}
