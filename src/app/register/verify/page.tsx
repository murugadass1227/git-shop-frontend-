'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  authService,
  getRegisterVerifyPayload,
  clearRegisterVerifyPayload,
} from '@/services/authService';
import { FaEnvelope, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

export default function RegisterVerifyPage() {
  const router = useRouter();
  const [payload, setPayload] = useState<{ email: string; name: string; password: string } | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const data = getRegisterVerifyPayload();
    if (!data) {
      router.replace('/register');
      return;
    }
    setPayload(data);
  }, [router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const next = [...otp];
      digits.forEach((d, i) => {
        if (index + i < 6) next[index + i] = d;
      });
      setOtp(next);
      const lastIdx = Math.min(index + digits.length, 5);
      const el = document.getElementById(`otp-${lastIdx}`) as HTMLInputElement;
      el?.focus();
      return;
    }
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) {
      const el = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      el?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const el = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      el?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payload) return;
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.verifyRegister({
        email: payload.email,
        otp: code,
        name: payload.name,
        password: payload.password,
      });
      clearRegisterVerifyPayload();
      router.push('/login?verified=1');
    } catch (err) {
      const msg = (err as Error).message || 'Invalid OTP. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!payload || resendCooldown > 0) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authService.resendRegisterOtp(payload.email);
      setResendCooldown(60);
      setSuccess('New OTP sent to your email.');
    } catch (err) {
      const msg = (err as Error).message || 'Failed to resend OTP';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!payload) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-pink-50/90 to-pink-100/80">
        <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-pink-50 via-pink-50/90 to-pink-100/80 flex flex-col lg:flex-row overflow-x-hidden">
      <div className="w-full lg:w-1/2 min-h-0 lg:min-h-screen bg-gradient-to-br from-pink-500 via-pink-600 to-pink-400 relative overflow-hidden flex-shrink-0 py-8 sm:py-10 md:py-12 lg:py-0">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-32 h-32 sm:w-48 sm:h-48 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-4 sm:px-6 md:px-12 text-white h-full lg:py-12">
          <Link href="/" className="block hover:opacity-90 transition-opacity">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight">
              Verify your email
            </h1>
            <span className="block text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent font-bold">
              Gondget
            </span>
            <p className="text-pink-100 mt-4 text-sm md:text-base">
              We sent a 6-digit code to <strong className="text-white">{payload.email}</strong>. Enter it below to create your account.
            </p>
          </Link>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-3 py-6 sm:px-4 sm:py-8 md:py-12 flex-shrink-0">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
              Gondget
            </h1>
            <p className="text-slate-600 mt-1 text-sm">Verify your email</p>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-slate-100 p-4 sm:p-6 md:p-8">
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pink-100 text-pink-600 mb-4">
                <FaEnvelope className="h-7 w-7" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Enter verification code</h2>
              <p className="text-slate-600 text-sm md:text-base">
                Check your inbox for the 6-digit code we sent to {payload.email}
              </p>
            </div>

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-semibold border-2 rounded-lg border-pink-200 focus:border-pink-500 outline-none transition-colors"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg md:rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 py-3 md:py-4 min-h-[48px] font-semibold text-white hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Create Account
                    <FaCheckCircle className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-slate-600 text-sm">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className="font-semibold text-pink-600 hover:text-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
              </button>
            </p>

            <div className="mt-8 text-center">
              <Link
                href="/register"
                className="text-sm text-slate-600 hover:text-pink-600 transition-colors"
              >
                ← Back to register
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-pink-600 hover:text-pink-700 flex items-center justify-center gap-1 mt-2">
                Sign In
                <FaArrowRight className="h-4 w-4" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
