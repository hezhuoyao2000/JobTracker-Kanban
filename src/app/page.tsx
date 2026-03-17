'use client';

import Link from 'next/link';
import { useTheme } from './components/theme/ThemeContext';

export default function Home() {
  const { backgroundClass, text, font } = useTheme();

  return (
    <div className={`h-screen ${backgroundClass} flex items-center justify-center p-8`}>
      <div className="max-w-2xl w-full space-y-8">
        <div className="space-y-4 text-center">
          <h1 className={`${font.heading} ${text.primary} text-5xl font-bold tracking-tight`}>
            欢迎来到我的作品集
          </h1>
          <p className={`${text.secondary} text-lg leading-relaxed`}>
            个人作品集正在构建与完善中，暂时缺少引导与自动化展示，请见谅。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            href="/job"
            className={`${font.heading} group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-2xl hover:-translate-y-1 overflow-hidden`}
          >
            <span className="relative z-10 flex items-center gap-2">
              进入 Job Tracker
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
          <Link
            href="https://grocery.hezhuoyao.top"
            target="_blank"
            rel="noopener noreferrer"
            className={`${font.heading} group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-2xl hover:-translate-y-1 overflow-hidden`}
          >
            <span className="relative z-10 flex items-center gap-2">
              访问 Grocery 电商网站
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
        </div>

        <div className="text-center">
          <p className={`${text.secondary} text-sm opacity-60`}>
            更多精彩内容，敬请期待
          </p>
        </div>
      </div>
    </div>
  );
}
