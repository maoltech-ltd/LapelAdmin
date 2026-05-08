'use client';

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between pt-4">
      
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="btn-secondary px-3 py-1 disabled:opacity-50"
      >
        Prev
      </button>

      <div className="flex gap-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`rounded-md px-3 py-1 text-sm ${
                p === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800'
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="btn-secondary px-3 py-1 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
