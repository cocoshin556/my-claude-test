# 統合占術アプリ

生年月日・出生時刻・出生地・血液型を入力すると、**流生命・数秘術・西洋占星術**の 3 体系を
統合して鑑定を返す Web アプリ。個人練習用・非商用。

## 技術スタック
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- 占星術計算: swisseph-wasm（Swiss Ephemeris の WASM 版、ブラウザ動作 / 導入は手順4）
- テスト: Vitest

## 設計の絶対原則
1. **計算ロジック・データ・表示を厳密に分離する。**
   - `src/lib/numerology/` … 数秘の純粋計算（副作用なし、テスト可能）
   - `src/lib/astrology/` … swisseph ラッパー（出生情報 → 惑星位置・ハウス・アスペクト）
   - `src/lib/ryuseimei/` … 入力から枠（タイプ/サイクル）だけを機械判定
   - `src/data/` … 解釈テキスト（JSON）。コードは占文を生成せず**参照のみ**。
2. **流生命の解釈文は絶対にコードで自動生成しない。** `data/ryuseimei/` を引くだけ。
   該当データが無ければ「原典データ未登録」と明示して空で返す（捏造しない）。
3. 各 lib 関数には Vitest のユニットテストを必ず添える。

## ディレクトリ構成
```
src/
├── app/                 # Next.js App Router（layout / page / globals.css）
├── components/          # UI コンポーネント（手順7-8）
├── lib/
│   ├── numerology/      # 数秘の純粋計算（手順3）
│   ├── astrology/       # swisseph-wasm ラッパー（手順4-5）
│   └── ryuseimei/       # 流生命の枠判定（手順6）
├── data/
│   ├── numerology.json  # 数秘ナンバーの解釈（参照のみ）
│   ├── cities.json      # 日本主要都市の緯度経度 lookup
│   └── ryuseimei/       # 流生命の原典解釈（未登録・後から投入）
└── types/               # 型定義（BirthInput / *Result / IntegratedReading）
```

## 開発手順
1. プロジェクト初期化・ディレクトリ構成 ✅
2. 型定義（BirthInput / AstrologyResult / NumerologyResult / RyuseimeiResult）✅
3. 数秘モジュール＋テスト
4. swisseph-wasm 導入・惑星位置の検証
5. 占星術モジュール＋テスト
6. 流生命の枠判定（解釈は空でも動作）
7. 入力フォーム → 結果画面の UI
8. 統合表示の整形

## コマンド
```bash
npm install        # 依存インストール（swisseph-wasm は手順4で追加）
npm run dev        # 開発サーバ
npm test           # Vitest 実行
npm run typecheck  # tsc --noEmit で型検査
npm run lint       # next lint
```
