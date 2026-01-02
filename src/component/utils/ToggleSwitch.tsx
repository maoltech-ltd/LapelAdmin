'use client';

import { useState } from 'react';

interface ToggleSwitchProps {
  label: string;
  checked?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
}

export default function ToggleSwitch({
  label,
  checked,
  onChange,
  disabled = false,
}: ToggleSwitchProps) {
  const [internal, setInternal] = useState(false);

  const isControlled = typeof checked === 'boolean';
  const value = isControlled ? checked : internal;

  function toggle() {
    if (disabled) return;

    if (!isControlled) {
      setInternal(!value);
    }
    onChange?.(!value);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {label}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={value}
        disabled={disabled}
        onClick={toggle}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors
          ${value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition
            ${value ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
}
