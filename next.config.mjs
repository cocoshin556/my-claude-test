/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // swisseph-wasm（Swiss Ephemeris の WASM 版）をブラウザで動かすための設定。
    // 実際の依存追加・利用は手順4で行う。ここで WASM の取り込みを有効化しておく。
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
};

export default nextConfig;
