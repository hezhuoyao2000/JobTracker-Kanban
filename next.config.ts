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
  // API 代理：/api/* 转发到后端，目标地址通过 Vercel 环境变量 BACKEND_URL 配置
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl.replace(/\/$/, '')}/:path*`,
      },
    ];
  },
};

export default withGluestackUI(nextConfig);
