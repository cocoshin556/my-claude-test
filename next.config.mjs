// GitHub Pages（プロジェクトページ）にデプロイするときだけ basePath を付ける。
// ローカルや Vercel ではルート配信なので付けない。
const isPages = process.env.GITHUB_PAGES === 'true';
const repoBase = '/my-claude-test';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 計算は全てクライアント側なので静的サイトとして書き出せる（Pages / Netlify / Vercel いずれも可）。
  output: 'export',
  images: { unoptimized: true },
  ...(isPages ? { basePath: repoBase, assetPrefix: `${repoBase}/` } : {}),
  webpack: (config) => {
    // 将来 swisseph-wasm を入れる場合に備え WASM 取り込みを有効化しておく。
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
};

export default nextConfig;
