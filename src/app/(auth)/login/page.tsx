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

  useEffect(() => {
    if (!loading && authChecked && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, authChecked, loading, router]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    await login('web', { identifier, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="surface w-full max-w-sm p-6">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Lapel Admin</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to your dashboard</p>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Email / Phone / Username</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="input w-full px-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="input w-full px-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => router.push('/forgot-password')}
              className="text-xs text-blue-600 transition hover:text-blue-700 hover:underline dark:text-blue-300"
              title="Reset password"
            >
              Forgot password?
            </button>
          </div>

          <button disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
