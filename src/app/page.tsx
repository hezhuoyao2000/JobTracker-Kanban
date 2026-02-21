'use client';

import Link from 'next/link';
import { useTheme } from './components/theme/ThemeContext';

export default function Home() {
  const { backgroundClass, text, font } = useTheme();

  return (
    <div className={`h-screen ${backgroundClass} flex items-center justify-center`}>
      <Link
        href="/job"
        className={`${font.heading} ${text.primary} px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium`}
      >
        进入 Job Tracker
      </Link>
    </div>
  );
}
