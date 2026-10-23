'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { userService } from '../../../lib/api/services/userService';
import { User } from '../../../lib/types/user.types';
import { useDebouncedValue } from '../../../lib/hooks/useDebouncedValue';

export interface PickedUser {
  id: string;
  label: string;
}

function userLabel(user: User): string {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return name ? `${name} (${user.email || user.phoneNumber || user.username})` : user.email || user.username || user.id;
}

export default function UserPicker({
  selected,
  onChange,
}: {
  selected: PickedUser[];
  onChange: (users: PickedUser[]) => void;
}) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query);
  // Results/errors are tagged with the query they answer, so "searching" is derived
  // (no setState at the start of the effect).
  const [answer, setAnswer] = useState<{ term: string; users: User[]; error: string | null }>({
    term: '',
    users: [],
    error: null,
  });
  const [pasteText, setPasteText] = useState('');

  const term = debouncedQuery.trim();
  const searching = term.length >= 2 && answer.term !== term;
  const results = answer.term === term ? answer.users : [];
  const searchError = answer.term === term ? answer.error : null;

  useEffect(() => {
    // Shorter queries just hide the dropdown (see render).
    if (term.length < 2) return;
    let cancelled = false;
    userService
      .searchUsers('admin', { query: term, page: 0, size: 8 })
      .then((response) => {
        if (!cancelled) setAnswer({ term, users: response.data?.content ?? [], error: null });
      })
      .catch(() => {
        if (!cancelled) setAnswer({ term, users: [], error: 'User search failed (needs USER_READ).' });
      });
    return () => {
      cancelled = true;
    };
  }, [term]);

  const selectedIds = new Set(selected.map((user) => user.id));

  const add = (user: PickedUser) => {
    if (selectedIds.has(user.id)) return;
    onChange([...selected, user]);
  };

  const addPasted = () => {
    const ids = pasteText
      .split(/[\s,;]+/)
      .map((id) => id.trim())
      .filter((id) => id && !selectedIds.has(id));
    if (ids.length === 0) return;
    onChange([...selected, ...Array.from(new Set(ids)).map((id) => ({ id, label: id }))]);
    setPasteText('');
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          className="input w-full"
          placeholder="Search users by name, email or phone"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {(results.length > 0 || searching || searchError) && query.trim().length >= 2 && (
          <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
            {searching && <p className="px-3 py-2 text-sm text-slate-500">Searching…</p>}
            {searchError && <p className="px-3 py-2 text-sm text-red-600">{searchError}</p>}
            {!searching &&
              results.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  disabled={selectedIds.has(user.id)}
                  onClick={() => add({ id: user.id, label: userLabel(user) })}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
                >
                  <span className="truncate">{userLabel(user)}</span>
                  <span className="ml-2 shrink-0 text-xs text-slate-500">
                    {selectedIds.has(user.id) ? 'Added' : user.isRider ? 'Driver' : 'Customer'}
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer text-slate-600 dark:text-slate-400">Paste user IDs</summary>
        <div className="mt-2 flex gap-2">
          <textarea
            className="input min-h-20 flex-1 font-mono text-xs"
            placeholder="One ID per line, or comma-separated"
            value={pasteText}
            onChange={(event) => setPasteText(event.target.value)}
          />
          <button type="button" className="btn-secondary self-start" onClick={addPasted}>
            Add
          </button>
        </div>
      </details>

      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selected.map((user) => (
            <span
              key={user.id}
              className="inline-flex max-w-full items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-800 dark:bg-blue-950/50 dark:text-blue-200"
            >
              <span className="truncate">{user.label}</span>
              <button
                type="button"
                aria-label={`Remove ${user.label}`}
                onClick={() => onChange(selected.filter((item) => item.id !== user.id))}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <button type="button" className="text-xs text-slate-500 underline" onClick={() => onChange([])}>
            Clear all
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-500">No users selected yet.</p>
      )}
    </div>
  );
}
