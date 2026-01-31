'use client';

import { Plus } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { useBoardContext } from './context/BoardContext';

export function AddNewButton() {
  const { text, themeClass } = useTheme();
  const { openCard } = useBoardContext();

  return (
    <button
      type="button"
      onClick={() => openCard(null)}
      className={`flex items-center px-4 py-2 gap-2 rounded-full text-sm font-bold border ${themeClass.buttonBg} ${text.button} hover:opacity-90 transition-colors`}
    >
      <Plus size={16} />
      Add new
    </button>
    );
}