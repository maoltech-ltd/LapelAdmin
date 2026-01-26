'use client';


import { Rider } from '../../../lib/types/rider.types';
import DocumentViewer from './DocumentViewer';
import RatingSummary from './RatingSummary';

export default function DriverProfileDrawer({
  driver,
  open,
  onClose,
}: {
  driver: Rider | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !driver) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="w-full max-w-lg bg-white p-6 dark:bg-gray-900">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{driver.user?.username || driver.user?.firstName}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Info */}
        <div className="mt-4 space-y-4 text-sm">
          <section>
            <h3 className="font-medium">Personal Info</h3>
            <p>{driver.user?.email || driver.user?.phoneNumber || 'N/A'}</p>
            <p>{driver.user?.phoneNumber || 'N/A'}</p>
          </section>

          <section>
            <h3 className="font-medium">Vehicle Info</h3>
            <p>{driver.vehicle?.make}</p>
            <p>{driver.vehicle?.licensePlateNumber}</p>
            <p>{driver.vehicle?.color}</p>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <DocumentViewer label="Driver License" url={driver.vehicle?.licensePlateNumber} />
            <DocumentViewer label="Vehicle Document" url={driver.vehicle?.licensePlateNumber} />
          </section>

          <section>
            <h3 className="font-medium">Performance</h3>
            <RatingSummary rating={driver?.rating} trips={20} />
            <p className="text-xs text-gray-500">
              Earnings: ₦{100000000}
            </p>
          </section>

          {/* Actions */}
          <section className="flex flex-wrap gap-2 pt-4">
            <button className="rounded-md bg-green-600 px-3 py-1 text-white">
              Approve
            </button>
            <button className="rounded-md bg-red-600 px-3 py-1 text-white">
              Reject
            </button>
            <button className="rounded-md border px-3 py-1 dark:border-gray-700">
              Suspend
            </button>
            <button className="rounded-md border px-3 py-1 dark:border-gray-700">
              Disable Vehicle
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
