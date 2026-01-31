import { withGluestackUI } from '@gluestack/ui-next-adapter';
/** @type {import('next').NextConfig} */
const nextConfig = {
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
