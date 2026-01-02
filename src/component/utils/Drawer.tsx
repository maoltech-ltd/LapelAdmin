export default function Drawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="flex-1 bg-black/40"
        onClick={onClose}
      />
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-xl">
        {children}
      </div>
    </div>
  );
}
