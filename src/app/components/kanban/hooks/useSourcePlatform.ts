'use client';

import { useState, useCallback } from 'react';
import { LINK_SOURCE_OPTIONS } from '../services/initialData';

function getPlatformOptionFromSource(source?: string): {
  option: string;
  custom: string;
} {
  if (!source) return { option: 'custom', custom: '' };
  const preset = LINK_SOURCE_OPTIONS.find((o) => o.label === source);
  if (preset) return { option: preset.value, custom: '' };
  return { option: 'custom', custom: source };
}

/**
 * 管理 Position link 来源平台选择：预设选项 + 自定义输入
 */
export function useSourcePlatform(
  initialSourcePlatform?: string,
  onSourceChange?: (source: string) => void
) {
  const init = getPlatformOptionFromSource(initialSourcePlatform);
  const [platformOption, setPlatformOption] = useState(init.option);
  const [customSourceInput, setCustomSourceInput] = useState(init.custom);

  const handlePlatformOptionChange = useCallback(
    (value: string) => {
      setPlatformOption(value);
      if (value === 'custom') {
        const source = customSourceInput;
        onSourceChange?.(source);
      } else {
        const label = LINK_SOURCE_OPTIONS.find((o) => o.value === value)?.label ?? '';
        onSourceChange?.(label);
      }
    },
    [customSourceInput, onSourceChange]
  );

  const handleCustomSourceChange = useCallback(
    (value: string) => {
      setCustomSourceInput(value);
      if (platformOption === 'custom') {
        onSourceChange?.(value);
      }
    },
    [platformOption, onSourceChange]
  );

  return {
    platformOption,
    customSourceInput,
    handlePlatformOptionChange,
    handleCustomSourceChange,
    options: LINK_SOURCE_OPTIONS,
  };
}
