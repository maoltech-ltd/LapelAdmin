'use client';

export default function PermissionMatrix({
  permissions,
  selected,
  onChange,
}: {
  permissions: string[];
  selected: string[];
  onChange: (perms: string[]) => void;
}) {
  function toggle(permission: string) {
    if (selected.includes(permission)) {
      onChange(selected.filter((p) => p !== permission));
    } else {
      onChange([...selected, permission]);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {permissions.map((perm) => (
        <label
          key={perm}
          className="flex items-center gap-2 rounded-md border p-2 dark:border-gray-800"
        >
          <input
            type="checkbox"
            checked={selected.includes(perm)}
            onChange={() => toggle(perm)}
          />
          <span className="text-sm">{perm}</span>
        </label>
      ))}
    </div>
  );
}
