// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Eye, EyeOff, Lock, User } from 'lucide-react';

// export default function LoginPage() {
//   const router = useRouter();

//   const [identifier, setIdentifier] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     // Dummy credentials
//     const dummyUser = {
//       identifier: 'admin',
//       password: 'password123',
//     };

//     setTimeout(() => {
//       if (
//         identifier === dummyUser.identifier &&
//         password === dummyUser.password
//       ) {
//         router.push('/dashboard');
//       } else {
//         setError('Invalid login credentials');
//         setLoading(false);
//       }
//     }, 800);
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
//       <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
        
//         {/* Title */}
//         <div className="mb-6 text-center">
//           <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
//             Lapel Admin
//           </h1>
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             Sign in to your dashboard
//           </p>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="mb-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
//             {error}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleLogin} className="space-y-4">

//           {/* Email / Phone / Username */}
//           <div>
//             <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">
//               Email / Phone / Username
//             </label>
//             <div className="relative">
//               <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="admin"
//                 value={identifier}
//                 onChange={(e) => setIdentifier(e.target.value)}
//                 className="w-full rounded-lg border px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-gray-300"
//                 required
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div>
//             <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">
//               Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full rounded-lg border px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-gray-300"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//               >
//                 {showPassword ? (
//                   <EyeOff className="h-4 w-4" />
//                 ) : (
//                   <Eye className="h-4 w-4" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-lg bg-gray-800 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
//           >
//             {loading ? 'Signing in...' : 'Sign In'}
//           </button>
//         </form>

//         {/* Footer */}
//         <div className="mt-6 text-center text-xs text-gray-500">
//           © {new Date().getFullYear()} Lapel Admin
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useAuth } from '../../../../lib/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, isAuthenticated, authChecked, clearError } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.replace('/dashboard');
  //   }
  // }, [isAuthenticated, router]);

  useEffect(() => {
    if (!loading && authChecked && isAuthenticated) {
        router.replace('/dashboard');
    }
  }, [isAuthenticated, authChecked, loading]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    await login('web', {
      identifier,
      password,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">

        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold">Lapel Admin</h1>
          <p className="text-sm text-gray-500">
            Sign in to your dashboard
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-100 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Identifier */}
          <div>
            <label className="text-sm text-gray-600">
              Email / Phone / Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full rounded border px-10 py-2 text-sm"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border px-10 py-2 text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => router.push('/forgot-password')}
              className="text-xs text-gray-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            disabled={loading}
            className="w-full rounded bg-gray-800 py-2 text-white"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
