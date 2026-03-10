'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { FaEnvelope, FaLock, FaCheckCircle, FaArrowRight, FaKey } from 'react-icons/fa';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authService.forgotPassword(email.trim());
      setSuccess('OTP sent to your email. Enter it below with your new password.');
      setStep('reset');
    } catch (err) {
      const msg = (err as Error).message || 'Failed to send OTP';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) {
      const el = document.getElementById(`reset-otp-${index + 1}`) as HTMLInputElement;
      el?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const el = document.getElementById(`reset-otp-${index - 1}`) as HTMLInputElement;
      el?.focus();
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.resetPassword({ email: email.trim(), otp: code, newPassword });
      setSuccess('Password updated. Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      const msg = (err as Error).message || 'Failed to reset password';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-pink-50 via-white to-pink-50/80 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-pink-200/80 bg-white shadow-sm shadow-pink-200/30 overflow-hidden p-6 sm:p-8">
          {/* Icon + title */}
          <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
            <div className="flex h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white items-center justify-center mb-4 shadow-lg shadow-pink-200">
              <FaKey className="h-6 w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Forgot password
            </h1>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-sm">
              {step === 'email'
                ? 'Enter your email and we’ll send you an OTP to reset your password.'
                : 'Enter the OTP from your email and choose a new password.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-medium">
              {success}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaEnvelope className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 py-3.5 font-semibold text-white hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 transition-all shadow-lg shadow-pink-200/50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Send OTP
                    <FaArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="flex justify-center gap-2">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    id={`reset-otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-semibold border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all text-slate-900"
                  />
                ))}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  New password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaLock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaLock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 py-3.5 font-semibold text-white hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 transition-all shadow-lg shadow-pink-200/50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Reset password
                    <FaCheckCircle className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="mt-6 sm:mt-8 text-center">
            <Link
              href="/login"
              className="text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors"
            >
              ← Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
