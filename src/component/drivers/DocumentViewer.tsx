'use client';

export default function DocumentViewer({
  label,
  url,
}: {
  label: string;
  url: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-gray-500">{label}</p>
      <a
        href={url}
        target="_blank"
        className="inline-block rounded-md border px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
      >
        View Document
      </a>
    </div>
  );
}
