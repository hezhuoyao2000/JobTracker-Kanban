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
            href="/iot"
            className={`${font.heading} group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-2xl hover:-translate-y-1 overflow-hidden`}
          >
            <span className="relative z-10 flex items-center gap-2">
              IoT 设备监控
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
          <Link
            href="https://kiwisquare.co.nz/grocery"
            target="_blank"
            rel="noopener noreferrer"
            className={`${font.heading} group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-2xl hover:-translate-y-1 overflow-hidden`}
          >
            <span className="relative z-10 flex items-center gap-2">
              Grocery 电商
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}
