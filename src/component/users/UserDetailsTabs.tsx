'use client';

import { useState } from 'react';
import { User } from '../../../data/user.mock';

const tabs = [
  'Personal Info',
  'Ride History',
  'Bookings',
  'Ratings',
  'Reports',
];

export default function UserDetailsTabs({ user }: { user: User }) {
  const [active, setActive] = useState(tabs[0]);

  return (
    <div>
      <div className="mb-4 flex gap-3 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-sm ${
              active === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-300">
        {active === 'Personal Info' && (
          <div className="space-y-2">
            <div>Email: {user.email}</div>
            <div>Phone: {user.phone}</div>
            <div>Total Rides: {user.rides}</div>
          </div>
        )}

        {active !== 'Personal Info' && (
          <div className="italic text-gray-400">
            No data yet (API pending)
          </div>
        )}
      </div>
    </div>
  );
}
