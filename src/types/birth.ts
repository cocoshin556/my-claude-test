/**
 * 鑑定の入力（BirthInput）と、その構成要素の型。
 * 各占術モジュール（numerology / astrology / ryuseimei）はこの型だけを受け取る。
 */

/** 血液型（任意入力）。 */
export type BloodType = 'A' | 'B' | 'O' | 'AB';

/**
 * 性別。流生命で使用する。
 * 注: 原典「流生命の出し方」では星(タイプ)判定に生年月日のみを用い、性別は使わない。
 * 性別はサイクル等、別ルールで参照する想定（原典の該当部提供後に確定）。
 */
export type Gender = 'male' | 'female';

/** 生年月日（必須）。西暦。 */
export interface BirthDate {
  /** 西暦の年。例: 1990 */
  year: number;
  /** 月 1-12 */
  month: number;
  /** 日 1-31 */
  day: number;
}

/** 出生時刻（任意）。BirthInput.time が null の場合は「時刻不明」を表す。 */
export interface BirthTime {
  /** 時 0-23 */
  hour: number;
  /** 分 0-59 */
  minute: number;
}

/** 出生地。都市名 lookup または手入力の緯度経度。 */
export interface BirthPlace {
  /** 都市名（表示・lookup 用）。手入力で緯度経度を直接指定する場合は null 可。 */
  name: string | null;
  /** 緯度。北緯を正、南緯を負（-90..90）。 */
  latitude: number;
  /** 経度。東経を正、西経を負（-180..180）。 */
  longitude: number;
}

/**
 * タイムゾーン指定。出生地から自動推定し、手動上書きも可能。
 * 占星術計算では「現地時刻 + タイムゾーン → UT」の変換に使う。
 */
export interface TimeZoneInput {
  /** IANA タイムゾーン名。例: "Asia/Tokyo" */
  ianaName: string;
  /**
   * UTC からのオフセット（分）を手動指定する場合の値。東を正（日本は +540）。
   * null の場合は ianaName と生年月日から自動算出する（夏時間等を考慮）。
   */
  manualOffsetMinutes: number | null;
}

/**
 * 鑑定の全入力。
 */
export interface BirthInput {
  /** 生年月日（必須）。 */
  date: BirthDate;
  /** 出生時刻（任意）。null ならアセンダント/MC・ハウスは省略する。 */
  time: BirthTime | null;
  /** 出生地。 */
  place: BirthPlace;
  /** 血液型（任意）。 */
  bloodType: BloodType | null;
  /** 性別。流生命で使用。 */
  gender: Gender;
  /** タイムゾーン。 */
  timezone: TimeZoneInput;
}
