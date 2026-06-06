/**
 * 体系横断で使う共通型。
 * 中心は「解釈テキストはコードで生成せず、必ず data/ の JSON 参照の結果として表す」という原則。
 */

/**
 * 解釈テキストの出典。統合表示画面の「出典デバッグトグル」で表示する。
 */
export interface DataSource {
  /** 参照したデータファイル識別子。例: "data/numerology.json" */
  file: string;
  /** ファイル内のキーパス。例: "lifePath.11" */
  key: string;
}

/**
 * data/ の JSON から引いた解釈テキストを表す。
 *
 * コードは占文を一切生成しない。該当データが無い場合は found=false / text=null とし、
 * UI 側で「原典データ未登録」と明示する（捏造しない）。
 */
export interface Interpretation {
  /** 解釈本文。データ未登録なら null。 */
  text: string | null;
  /** 見出し・タイトル（任意）。 */
  title?: string | null;
  /** キーワード等の補助情報（任意）。 */
  keywords?: string[];
  /** データが登録されていたか。false なら UI で「未登録」と明示する。 */
  found: boolean;
  /** 出典（デバッグ表示用）。 */
  source: DataSource;
}
