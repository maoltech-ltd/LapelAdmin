
'use client';

import { useEffect, useMemo, useState } from 'react';
import { User } from '../../../lib/types/user.types';
import Image from 'next/image';

const tabs = [
  'Personal Info',
  'Ride History',
  'Bookings',
  'Ratings',
  'Reports',
];

export default function UserDetailsTabs({ user }: { user: User }) {
  const [active, setActive] = useState(tabs[0]);

  const joinedDate = useMemo(
    () => {
      if (!user.createdAt) return '—';
      return new Date(user.createdAt).toLocaleDateString();
    }, 
    [user.createdAt]
  );

  // Calculate the avatar URL directly from the user prop
  const getAvatarUrl = (user: User) => {
    if (user.profilePicture && user.profilePicture.trim() !== '') {
      const trimmedUrl = user.profilePicture.trim();
      // Check if URL has proper protocol
      if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
        return trimmedUrl;
      }
    }
    // Fallback to avatar if no profile picture or invalid format
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${user.firstName} ${user.lastName}`
    )}&background=0D8ABC&color=fff`;
  };

  const avatarUrl = useMemo(() => getAvatarUrl(user), [user]);
  // const initialAvatar =
  //   user.profilePicture && user.profilePicture.trim() !== ''
  //     ? user.profilePicture
  //     : `https://ui-avatars.com/api/?name=${encodeURIComponent(
  //         `${user.firstName} ${user.lastName}`
  //       )}&background=0D8ABC&color=fff`;

  

  return (
    <div>
      {/* Tabs */}
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
          <div className="space-y-4">
            {/* Profile Image */}
            <div className="flex items-center gap-4">
              <Image
                src={avatarUrl}
                alt={`${user.firstName} ${user.lastName}`}
                width={80}
                height={80}
                className="rounded-full object-cover border dark:border-gray-700"
                onError={() => {
                  avatarUrl
                }
                  
                }
              />

              <div>
                <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-xs text-gray-500">
                  Joined {joinedDate ?? '—'}
                </div>
              </div>
            </div>

            {/* Info */}
            <div>First Name: {user.firstName}</div>
            <div>Last Name: {user.lastName}</div>
            <div>Username: {user.username}</div>
            <div>Email: {user.email}</div>
            <div>Phone: {user.phoneNumber}</div>
            <div>Rider: {user.isRider ? 'Yes' : 'No'}</div>
            <div>Admin: {user.isAdmin ? 'Yes' : 'No'}</div>
            <div>Sex: {user.sex}</div>
            <div>Address: {user.address}</div>
            <div>Date Joined: {joinedDate}</div>
            <div>Total Rides: 0</div>
            <div>Role: {user.isAdmin ? user.role : 'non admin'}</div>
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
