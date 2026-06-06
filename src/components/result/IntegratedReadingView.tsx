'use client';

import { useState } from 'react';
import type {
  AstrologyResult,
  IntegratedReading,
  Interpretation,
  NumerologyNumber,
  PlanetId,
  RyuseimeiStar,
  ZodiacSign,
} from '@/types';
import { SystemCard } from './SystemCard';
import { InterpretationView } from './InterpretationView';

const SIGN_JA: Record<ZodiacSign, string> = {
  aries: '牡羊',
  taurus: '牡牛',
  gemini: '双子',
  cancer: '蟹',
  leo: '獅子',
  virgo: '乙女',
  libra: '天秤',
  scorpio: '蠍',
  sagittarius: '射手',
  capricorn: '山羊',
  aquarius: '水瓶',
  pisces: '魚',
};

const PLANET_JA: Record<PlanetId, string> = {
  sun: '太陽',
  moon: '月',
  mercury: '水星',
  venus: '金星',
  mars: '火星',
  jupiter: '木星',
  saturn: '土星',
  uranus: '天王星',
  neptune: '海王星',
  pluto: '冥王星',
};

const ELEMENT_JA: Record<RyuseimeiStar['element'], string> = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水',
};

const ASPECT_JA: Record<string, string> = {
  conjunction: '合',
  sextile: 'セクスタイル',
  square: 'スクエア',
  trine: 'トライン',
  opposition: 'オポジション',
};

const deg = (n: number) => `${Math.floor(n)}°`;

function RyuseimeiFacts({ star }: { star: RyuseimeiStar }) {
  const c = star.calculation;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-lg bg-white px-3 py-1 text-2xl font-bold text-violet-700 ring-1 ring-violet-200">
          {star.name}
        </span>
        <span className="rounded-md bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
          タイプ {star.digit}
        </span>
        <span className="rounded-md bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
          五行 {ELEMENT_JA[star.element]}
        </span>
      </div>
      <p className="font-mono text-xs text-slate-500">
        末尾合計: {c.yearLast} + {c.monthLast} + {c.dayLast} = {c.sum} → 末尾 {c.digit}
      </p>
    </div>
  );
}

function NumberRow({ label, n }: { label: string; n: NumerologyNumber }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="flex items-center gap-2">
        <span className="font-mono text-2xl font-bold text-amber-700">{n.value}</span>
        {n.isMasterNumber ? (
          <span className="rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
            マスター
          </span>
        ) : null}
        <span className="font-mono text-[11px] text-slate-400">
          [{n.reductionSteps.join(' → ')}]
        </span>
      </span>
    </div>
  );
}

function AstrologyFacts({ astrology }: { astrology: AstrologyResult }) {
  return (
    <div className="space-y-3">
      {astrology.angles ? (
        <div className="flex gap-2 text-xs">
          <span className="rounded bg-indigo-100 px-2 py-1 font-medium text-indigo-700">
            ASC {SIGN_JA[astrology.angles.ascendant.sign]} {deg(astrology.angles.ascendant.signDegree)}
          </span>
          <span className="rounded bg-indigo-100 px-2 py-1 font-medium text-indigo-700">
            MC {SIGN_JA[astrology.angles.midheaven.sign]} {deg(astrology.angles.midheaven.signDegree)}
          </span>
        </div>
      ) : null}
      <table className="w-full text-left text-xs">
        <thead className="text-slate-400">
          <tr>
            <th className="py-1 font-medium">天体</th>
            <th className="font-medium">サイン</th>
            <th className="font-medium">度</th>
            <th className="font-medium">室</th>
          </tr>
        </thead>
        <tbody className="text-slate-600">
          {astrology.planets.map((p) => (
            <tr key={p.planet} className="border-t border-slate-100">
              <td className="py-1 font-medium text-slate-700">{PLANET_JA[p.planet]}</td>
              <td>
                {SIGN_JA[p.sign]}
                {p.retrograde ? <span className="ml-1 text-rose-500">R</span> : null}
              </td>
              <td className="font-mono">{deg(p.signDegree)}</td>
              <td className="font-mono">{p.house ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {astrology.aspects.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {astrology.aspects.map((a, i) => (
            <span
              key={i}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
            >
              {PLANET_JA[a.planetA]}–{PLANET_JA[a.planetB]} {ASPECT_JA[a.type] ?? a.type}（{a.orb}°）
            </span>
          ))}
        </div>
      ) : null}
      {astrology.notes.length > 0 ? (
        <ul className="space-y-0.5 pt-1">
          {astrology.notes.map((n, i) => (
            <li key={i} className="text-[11px] leading-snug text-slate-400">
              ※ {n}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * 統合表示画面。3体系の結果をカードで並べ、各カードで「事実」と「解釈」を分離する。
 * 出典トグルで、解釈テキストがどの JSON 由来かを表示できる。
 * notice を渡すと上部に注記バー（モック用など）を表示する。
 */
export function IntegratedReadingView({
  reading,
  astrologyInterpretation,
  notice,
}: {
  reading: IntegratedReading;
  astrologyInterpretation: Interpretation;
  notice?: string;
}) {
  const [showSources, setShowSources] = useState(false);
  const { input, numerology, astrology, ryuseimei } = reading;

  const timeLabel = input.time
    ? `${String(input.time.hour).padStart(2, '0')}:${String(input.time.minute).padStart(2, '0')}`
    : '時刻不明';
  const genderLabel = input.gender === 'female' ? '女性' : '男性';
  const sunSign = astrology.planets[0] ? SIGN_JA[astrology.planets[0].sign] : '—';

  return (
    <section className="space-y-6">
      {notice ? (
        <div className="rounded-lg bg-amber-100 px-4 py-2 text-center text-xs font-medium text-amber-800">
          {notice}
        </div>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">統合鑑定結果</h2>
          <p className="mt-1 text-sm text-slate-500">
            {input.date.year}年{input.date.month}月{input.date.day}日 / {timeLabel} /{' '}
            {input.place.name ?? '出生地不明'} / {genderLabel} /{' '}
            {input.bloodType ? `${input.bloodType}型` : '血液型不明'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowSources((v) => !v)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ring-1 transition ${
            showSources
              ? 'bg-slate-800 text-white ring-slate-800'
              : 'bg-white text-slate-600 ring-slate-300 hover:bg-slate-100'
          }`}
        >
          出典表示: {showSources ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <SystemCard
          accent="violet"
          system="流生命"
          headline={ryuseimei.star.name}
          headlineSub={`タイプ ${ryuseimei.star.digit}`}
          facts={<RyuseimeiFacts star={ryuseimei.star} />}
          interpretation={
            <div className="space-y-3">
              <InterpretationView
                interpretation={ryuseimei.star.interpretation}
                showSource={showSources}
              />
              <div className="border-t border-dashed border-slate-200 pt-2">
                <p className="mb-1 text-xs text-slate-400">
                  当年サイクル（{ryuseimei.cycle.year}）
                </p>
                <InterpretationView
                  interpretation={ryuseimei.cycle.interpretation}
                  showSource={showSources}
                />
              </div>
            </div>
          }
        />

        <SystemCard
          accent="indigo"
          system="西洋占星術"
          headline={`太陽 ${sunSign}`}
          headlineSub={
            astrology.angles ? `ASC ${SIGN_JA[astrology.angles.ascendant.sign]}` : '時刻不明'
          }
          facts={<AstrologyFacts astrology={astrology} />}
          interpretation={
            <InterpretationView
              interpretation={astrologyInterpretation}
              showSource={showSources}
            />
          }
        />

        <SystemCard
          accent="amber"
          system="数秘術"
          headline={`ライフパス ${numerology.lifePath.value}`}
          headlineSub={numerology.lifePath.isMasterNumber ? 'マスターナンバー' : undefined}
          facts={
            <div className="space-y-2">
              <NumberRow label="ライフパス" n={numerology.lifePath} />
              <NumberRow label="ディスティニー（誕生数）" n={numerology.destiny} />
            </div>
          }
          interpretation={
            <div className="space-y-3">
              <InterpretationView
                interpretation={numerology.lifePath.interpretation}
                showSource={showSources}
              />
              <div className="border-t border-dashed border-slate-200 pt-2">
                <InterpretationView
                  interpretation={numerology.destiny.interpretation}
                  showSource={showSources}
                />
              </div>
            </div>
          }
        />
      </div>

      <p className="text-center text-xs text-slate-400">
        各カードは「計算で出た事実」と「解釈テキスト」を分離表示。解釈は data/ 由来のみ（コードは占文を生成しない）。
      </p>
    </section>
  );
}
