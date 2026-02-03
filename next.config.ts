import { withGluestackUI } from '@gluestack/ui-next-adapter';
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 静态导出，供 GitHub Pages 使用（out 目录）
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: [],
  // 明确禁用 Turbopack，强制使用 webpack
  experimental: {
    turbo: undefined, // 禁用 Turbopack
  },
  productionBrowserSourceMaps: false,
};

export default withGluestackUI(nextConfig);
