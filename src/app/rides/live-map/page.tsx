'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';
import { liveLocationService, LiveRideLocation } from '../../../../lib/api/services/liveLocationService';

const DEVICE = 'web';
const POLL_INTERVAL_MS = 7000;

// Leaflet touches `window` at import time, so it can only render client-side.
const LiveRidesMap = dynamic(() => import('../../../component/rides/LiveRidesMap'), {
  ssr: false,
});

export default function LiveRidesMapPage() {
  const [rides, setRides] = useState<LiveRideLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    try {
      const response = await liveLocationService.getLiveLocations(DEVICE);
      setRides(response.data?.data ?? []);
      setError(null);
    } catch {
      setError('Failed to load live ride locations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
    const interval = setInterval(fetchLocations, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchLocations]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Live Rides Map
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Ongoing rides with a recently published driver location. Refreshes every{' '}
          {POLL_INTERVAL_MS / 1000}s.
        </p>
      </header>

      {loading && <Loader className="h-5 w-5 animate-spin text-blue-600" />}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}
      {!loading && !error && rides.length === 0 && (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          No ongoing rides currently have a published location.
        </div>
      )}

      <LiveRidesMap rides={rides} />
    </div>
  );
}
