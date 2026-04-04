'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f5f7f2_0%,#eaf4e4_45%,#dfeedd_100%)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-14 h-60 w-60 rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-lime-300/30 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-2">
        <section className="hidden lg:block">
          <p className="inline-flex rounded-full border border-emerald-800/10 bg-white/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
            Yala wild spirit
          </p>
          <h1 className="mt-5 text-5xl font-black leading-tight text-emerald-950">
            Admin
            <span className="block text-amber-700">Sign In</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-emerald-900/80">
            Access your dashboard to publish safari stories and manage gallery visuals from one secure place.
          </p>
        </section>

        <div className="w-full rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_-20px_rgba(24,63,42,0.35)] backdrop-blur-sm sm:p-8">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-emerald-950 lg:hidden">
            Admin Sign In
          </h2>
          <h2 className="hidden text-2xl font-bold text-emerald-950 lg:block">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-emerald-900/70 lg:text-left">
            Enter your credentials to continue.
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-emerald-900">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-emerald-900">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-3 pr-12 text-sm text-emerald-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-emerald-800 transition hover:bg-emerald-50 hover:text-emerald-950 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[linear-gradient(135deg,#0f6b3a_0%,#15803d_55%,#166534_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_-12px_rgba(15,107,58,0.8)] transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
