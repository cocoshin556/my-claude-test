// モックページのスクリーンショットを撮る使い捨てスクリプト。
// 使い方: next dev を起動した状態で `node scripts/screenshot.mjs <url> <outfile>`
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:3100/mock';
const out = process.argv[3] ?? '/tmp/mock.png';

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 2,
});
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(600); // フォント/レイアウト安定待ち
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log('saved', out);
