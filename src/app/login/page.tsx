'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { authService } from '@/services/authService';
import { setAuth } from '@/store/authSlice';
import { FaArrowRight, FaGift, FaStar, FaHeart, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';

type LoginMode = 'email' | 'mobile';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams?.get('verified') === '1';
  const dispatch = useDispatch();
  const [mode, setMode] = useState<LoginMode>('email');
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    if (!emailOrMobile.trim()) {
      setError(mode === 'email' ? 'Please enter your email' : 'Please enter your mobile number');
      return false;
    }
    if (mode === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrMobile)) {
        setError('Please enter a valid email address');
        return false;
      }
    } else {
      const digits = emailOrMobile.replace(/\D/g, '');
      if (digits.length < 10) {
        setError('Please enter a valid mobile number (at least 10 digits)');
        return false;
      }
    }
    if (!password) {
      setError('Please enter your password');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    try {
      const value = mode === 'email' ? emailOrMobile.trim() : emailOrMobile.replace(/\D/g, '');
      const res = await authService.login(value, password);
      dispatch(setAuth({ user: { ...res.user, role: res.user.role ?? 'user' }, token: res.token }));
      if (res.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err) {
      const msg = (err as Error).message || 'Invalid email/phone or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-pink-50 via-pink-50/90 to-pink-100/80 flex flex-col lg:flex-row overflow-x-hidden">
      {/* Left Side - Promotional Content */}
      <div className="w-full lg:w-1/2 min-h-0 lg:min-h-screen bg-gradient-to-br from-pink-500 via-pink-600 to-pink-400 relative overflow-hidden flex-shrink-0 py-8 sm:py-10 md:py-12 lg:py-0">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-32 h-32 sm:w-48 sm:h-48 bg-white rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full blur-xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-4 sm:px-6 md:px-12 text-white h-full lg:py-12">
          <div className="mb-4 sm:mb-6 md:mb-8">
            <Link href="/" className="block hover:opacity-90 transition-opacity">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">
                Welcome to
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  Gondget
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-pink-100 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
                Discover personalized gifts that create unforgettable moments
              </p>
            </Link>
          </div>

          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-2.5 sm:p-3 md:p-4 border border-white/20">
              <div className="bg-white/20 rounded-lg p-2 md:p-3 shrink-0">
                <FaGift className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-yellow-300" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-base md:text-lg">Unique Gifts</h3>
                <p className="text-pink-100 text-xs md:text-sm truncate sm:truncate-none">Handpicked collection for every occasion</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-2.5 sm:p-3 md:p-4 border border-white/20">
              <div className="bg-white/20 rounded-lg p-2 md:p-3 shrink-0">
                <FaStar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-yellow-300" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-base md:text-lg">Premium Quality</h3>
                <p className="text-pink-100 text-xs md:text-sm">Crafted with love and attention to detail</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-2.5 sm:p-3 md:p-4 border border-white/20 hidden sm:flex">
              <div className="bg-white/20 rounded-lg p-2 md:p-3 shrink-0">
                <FaHeart className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-yellow-300" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-base md:text-lg">Made with Love</h3>
                <p className="text-pink-100 text-xs md:text-sm">Each gift tells a unique story</p>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-12">
            <p className="text-xs md:text-sm text-pink-200 mb-2">Join thousands of happy customers</p>
            <div className="flex -space-x-1 md:-space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-yellow-300 to-pink-300 border-2 border-white flex items-center justify-center text-[10px] sm:text-xs font-bold text-slate-700"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center text-[10px] sm:text-xs font-bold text-white">
                +5k
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-3 py-6 sm:px-4 sm:py-8 md:py-12 flex-shrink-0 pb-6">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden text-center mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
              Gondget
            </h1>
            <p className="text-slate-600 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">Personalized gifts that touch hearts</p>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl border border-pink-100 p-4 sm:p-6 md:p-8">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
              <p className="text-slate-600 text-sm md:text-base">Sign in with your email or mobile number</p>
            </div>

            {verified && (
              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg md:rounded-xl text-green-800 text-xs md:text-sm">
                Account created successfully. Please sign in.
              </div>
            )}
            {error && (
              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg md:rounded-xl text-red-700 text-xs md:text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Login with Email or Mobile toggle */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 md:mb-3">
                  Sign in with
                </label>
                <div className="flex rounded-lg md:rounded-xl border-2 border-pink-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => { setMode('email'); setEmailOrMobile(''); setError(''); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${mode === 'email' ? 'bg-pink-600 text-white' : 'bg-white text-slate-600 hover:bg-pink-50'}`}
                  >
                    <FaEnvelope className="h-4 w-4" /> Email
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('mobile'); setEmailOrMobile(''); setError(''); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${mode === 'mobile' ? 'bg-pink-600 text-white' : 'bg-white text-slate-600 hover:bg-pink-50'}`}
                  >
                    <FaPhone className="h-4 w-4" /> Mobile
                  </button>
                </div>
              </div>

              {/* Email or Mobile Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 md:mb-3">
                  {mode === 'email' ? 'Email Address' : 'Mobile Number'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {mode === 'email' ? (
                      <FaEnvelope className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                    ) : (
                      <FaPhone className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                    )}
                  </div>
                  <input
                    type={mode === 'email' ? 'email' : 'tel'}
                    required
                    value={emailOrMobile}
                    onChange={(e) => setEmailOrMobile(e.target.value)}
                    placeholder={mode === 'email' ? 'Enter your email' : 'Enter 10-digit mobile number'}
                    className="w-full pl-9 sm:pl-10 pr-4 py-3 min-h-[48px] sm:min-h-0 text-sm border-2 rounded-lg md:rounded-xl outline-none transition-all duration-200 border-pink-200 focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 md:mb-3">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 sm:pl-10 pr-11 sm:pr-12 py-3 min-h-[48px] sm:min-h-0 text-sm border-2 rounded-lg md:rounded-xl outline-none transition-all duration-200 border-pink-200 focus:border-pink-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center touch-manipulation min-w-[44px]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <FaLock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                  </button>
                </div>
                <div className="mt-2 text-right">
                  <Link href="/forgot-password" className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 md:gap-3 rounded-lg md:rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 py-3 md:py-4 min-h-[48px] font-semibold text-white hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm md:text-base touch-manipulation"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <FaArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6 md:my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-pink-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 md:px-4 bg-white text-slate-500 text-xs md:text-sm">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <button type="button" className="flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2.5 md:py-3 min-h-[44px] border-2 border-pink-200 rounded-lg md:rounded-xl hover:bg-pink-50 transition-all duration-200 group touch-manipulation">
                <div className="w-4 h-4 md:w-5 md:h-5 bg-blue-600 rounded flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">f</span>
                </div>
                <span className="text-xs md:text-sm font-medium text-slate-700 group-hover:text-slate-900 hidden sm:block">Facebook</span>
              </button>
              <button type="button" className="flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2.5 md:py-3 min-h-[44px] border-2 border-pink-200 rounded-lg md:rounded-xl hover:bg-pink-50 transition-all duration-200 group touch-manipulation">
                <div className="w-4 h-4 md:w-5 md:h-5 bg-red-500 rounded flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <span className="text-xs md:text-sm font-medium text-slate-700 group-hover:text-slate-900 hidden sm:block">Google</span>
              </button>
            </div>

            <div className="mt-6 md:mt-8 text-center">
              <p className="text-slate-600 text-sm md:text-base">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-semibold text-pink-600 hover:text-pink-700 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse text-muted-foreground">Loading...</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
