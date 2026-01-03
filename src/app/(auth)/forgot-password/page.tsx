'use client';

import { useState } from 'react';
import { useAuth } from '../../../../lib/hooks/useAuth';

export default function ForgotPasswordPage() {
  const { requestPasswordReset, loading, error, success } = useAuth();
  const [identifier, setIdentifier] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await requestPasswordReset('web', identifier);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow">

        <h2 className="mb-2 text-lg font-semibold">
          Forgot Password
        </h2>

        <p className="mb-4 text-sm text-gray-500">
          Enter your email, phone or username
        </p>

        {success && (
          <div className="mb-3 text-sm text-green-600">
            Reset instructions sent successfully
          </div>
        )}

        {error && (
          <div className="mb-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Email / Phone / Username"
            required
          />

          <button
            disabled={loading}
            className="w-full rounded bg-gray-800 py-2 text-white"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      </div>
    </div>
  );
}
