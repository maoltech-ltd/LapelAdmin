// 'use client';


// import { User } from '../../../lib/types/user.types';
// import Drawer from '../utils/Drawer';
// import StatusBadge from '../utils/StatusBadge';
// import UserDetailsTabs from './UserDetailsTabs';

// export default function UserProfileDrawer({
//   user,
//   open,
//   onClose,
// }: {
//   user: User | null;
//   open: boolean;
//   onClose: () => void;
// }) {
//   if (!user) return null;

//   return (
//     <Drawer open={open} onClose={onClose}>
//       <div className="flex h-full flex-col">
//         {/* Header */}
//         <div className="border-b px-6 py-4 dark:border-gray-800">
//           <h2 className="text-lg font-semibold">
//             {user.firstName} {user.lastName}
//           </h2>

//           <div className="mt-1 flex items-center gap-2">
//             <StatusBadge status={user.active ? 'active' : 'inactive'} />
//             <span className="text-xs text-gray-500">
//               Joined {new Date(user.createdAt).toLocaleDateString()}
//             </span>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex-1 overflow-y-auto px-6 py-4">
//           <UserDetailsTabs user={user} />
//         </div>

//         {/* Actions */}
//         <div className="border-t px-6 py-4 dark:border-gray-800">
//           <div className="flex gap-2">
//             <button className="flex-1 rounded-md bg-yellow-500 px-3 py-2 text-sm text-white">
//               Suspend
//             </button>
//             <button className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm text-white">
//               Flag
//             </button>
//           </div>
//         </div>
//       </div>
//     </Drawer>
//   );
// }
'use client';

import { User } from '../../../lib/types/user.types';
import UserDetailsTabs from './UserDetailsTabs';

export default function UserProfileDrawer({
  user,
  open,
  onClose,
}: {
  user: User | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !user) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3 dark:border-gray-800">
          <h2 className="text-lg font-semibold">User Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <UserDetailsTabs user={user} />
        </div>
      </div>
    </>
  );
}
