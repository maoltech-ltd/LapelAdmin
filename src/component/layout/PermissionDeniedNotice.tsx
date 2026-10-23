'use client';

import { useEffect, useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { PERMISSION_DENIED_EVENT, PERMISSION_DENIED_MESSAGE } from '../../../lib/axios/axiosInstance';

const AUTO_HIDE_MS = 6000;

// Global banner for 403 responses (role/permission checks on the admin API).
export default function PermissionDeniedNotice() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onDenied = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      setMessage(detail?.message || PERMISSION_DENIED_MESSAGE);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setMessage(null), AUTO_HIDE_MS);
    };
    window.addEventListener(PERMISSION_DENIED_EVENT, onDenied);
    return () => {
      window.removeEventListener(PERMISSION_DENIED_EVENT, onDenied);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!message) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-4 right-4 z-50 flex max-w-sm items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-lg dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100"
    >
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p className="flex-1">{message}</p>
      <button
        type="button"
        onClick={() => setMessage(null)}
        className="shrink-0 opacity-70 hover:opacity-100"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
