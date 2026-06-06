'use client';

import { useMemo, useState } from 'react';
import type { BirthInput, BloodType, Gender } from '@/types';
import citiesData from '@/data/cities.json';

type City = { name: string; latitude: number; longitude: number; timezone: string };
const CITIES = (citiesData as { cities: City[] }).cities;
const MANUAL = '__manual__';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500';
const labelClass = 'block text-sm font-medium text-slate-600';

export function BirthInputForm({
  onSubmit,
}: {
  onSubmit: (input: BirthInput) => void;
}) {
  const [birthDate, setBirthDate] = useState('1990-05-15');
  const [timeKnown, setTimeKnown] = useState(true);
  const [birthTime, setBirthTime] = useState('14:30');
  const [cityName, setCityName] = useState<string>('東京');
  const [manualName, setManualName] = useState('');
  const [manualLat, setManualLat] = useState('35.6895');
  const [manualLng, setManualLng] = useState('139.6917');
  const [timezone, setTimezone] = useState('Asia/Tokyo');
  const [gender, setGender] = useState<Gender>('female');
  const [blood, setBlood] = useState<'' | BloodType>('');
  const [error, setError] = useState<string | null>(null);

  const isManual = cityName === MANUAL;
  const selectedCity = useMemo(
    () => CITIES.find((c) => c.name === cityName) ?? null,
    [cityName],
  );

  function handleCityChange(value: string) {
    setCityName(value);
    const city = CITIES.find((c) => c.name === value);
    if (city) setTimezone(city.timezone);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);
    if (!m) {
      setError('生年月日を入力してください。');
      return;
    }
    const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];

    let time: BirthInput['time'] = null;
    if (timeKnown) {
      const tm = /^(\d{2}):(\d{2})$/.exec(birthTime);
      if (!tm) {
        setError('出生時刻の形式が正しくありません。');
        return;
      }
      time = { hour: Number(tm[1]), minute: Number(tm[2]) };
    }

    let place: BirthInput['place'];
    if (isManual) {
      const lat = Number(manualLat);
      const lng = Number(manualLng);
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        setError('緯度・経度を数値で入力してください。');
        return;
      }
      place = { name: manualName.trim() || null, latitude: lat, longitude: lng };
    } else if (selectedCity) {
      place = {
        name: selectedCity.name,
        latitude: selectedCity.latitude,
        longitude: selectedCity.longitude,
      };
    } else {
      setError('出生地を選択してください。');
      return;
    }

    onSubmit({
      date: { year, month, day },
      time,
      place,
      bloodType: blood === '' ? null : blood,
      gender,
      timezone: { ianaName: timezone.trim() || 'Asia/Tokyo', manualOffsetMinutes: null },
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {/* 生年月日 */}
        <div>
          <label className={labelClass} htmlFor="birthDate">
            生年月日 <span className="text-rose-500">*</span>
          </label>
          <input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        {/* 出生時刻 */}
        <div>
          <label className={labelClass}>出生時刻</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              disabled={!timeKnown}
              className={`${inputClass} mt-0 flex-1 disabled:bg-slate-100 disabled:text-slate-400`}
            />
            <label className="flex shrink-0 items-center gap-1 text-xs text-slate-500">
              <input
                type="checkbox"
                checked={!timeKnown}
                onChange={(e) => setTimeKnown(!e.target.checked)}
              />
              不明
            </label>
          </div>
        </div>

        {/* 出生地 */}
        <div>
          <label className={labelClass} htmlFor="city">
            出生地
          </label>
          <select
            id="city"
            value={cityName}
            onChange={(e) => handleCityChange(e.target.value)}
            className={inputClass}
          >
            {CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
            <option value={MANUAL}>その他（手入力）</option>
          </select>
        </div>

        {/* タイムゾーン */}
        <div>
          <label className={labelClass} htmlFor="tz">
            タイムゾーン
          </label>
          <input
            id="tz"
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className={inputClass}
            placeholder="Asia/Tokyo"
          />
        </div>

        {/* 手入力の緯度経度 */}
        {isManual ? (
          <>
            <div>
              <label className={labelClass} htmlFor="mname">
                地名（任意）
              </label>
              <input
                id="mname"
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                className={inputClass}
                placeholder="例: ロンドン"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass} htmlFor="lat">
                  緯度
                </label>
                <input
                  id="lat"
                  type="text"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="lng">
                  経度
                </label>
                <input
                  id="lng"
                  type="text"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </>
        ) : null}

        {/* 性別 */}
        <div>
          <label className={labelClass}>性別</label>
          <div className="mt-2 flex gap-4 text-sm">
            <label className="flex items-center gap-1.5">
              <input
                type="radio"
                name="gender"
                checked={gender === 'female'}
                onChange={() => setGender('female')}
              />
              女性
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="radio"
                name="gender"
                checked={gender === 'male'}
                onChange={() => setGender('male')}
              />
              男性
            </label>
          </div>
        </div>

        {/* 血液型 */}
        <div>
          <label className={labelClass} htmlFor="blood">
            血液型
          </label>
          <select
            id="blood"
            value={blood}
            onChange={(e) => setBlood(e.target.value as '' | BloodType)}
            className={inputClass}
          >
            <option value="">未選択</option>
            <option value="A">A型</option>
            <option value="B">B型</option>
            <option value="O">O型</option>
            <option value="AB">AB型</option>
          </select>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        鑑定する
      </button>
    </form>
  );
}
