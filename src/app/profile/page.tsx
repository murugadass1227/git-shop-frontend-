'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { authService } from '@/services/authService';
import { getAvatarUrl } from '@/lib/api';
import { logout, updateUser } from '@/store/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faArrowRight,
  faBox,
  faRightFromBracket,
  faPen,
  faCheck,
  faXmark,
  faLock,
  faCircleCheck,
  faKey,
  faCamera,
} from '@fortawesome/free-solid-svg-icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((s: RootState) => s.auth.token);
  const user = useSelector((s: RootState) => s.auth.user);
  const [mounted, setMounted] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] = useState(false);
  const [fpStep, setFpStep] = useState<'email' | 'reset'>('email');
  const [fpEmail, setFpEmail] = useState('');
  const [fpOtp, setFpOtp] = useState(['', '', '', '', '', '']);
  const [fpNewPassword, setFpNewPassword] = useState('');
  const [fpConfirmPassword, setFpConfirmPassword] = useState('');
  const [fpLoading, setFpLoading] = useState(false);
  const [fpError, setFpError] = useState('');
  const [fpSuccess, setFpSuccess] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  const handleLogout = async () => {
    setLogoutDialogOpen(false);
    try {
      await authService.logout();
    } catch {
      // clear local session even if API fails
    }
    dispatch(logout());
    router.push('/');
  };

  const startEditName = () => {
    setEditName(user?.name ?? '');
    setSaveError('');
    setEditingName(true);
  };

  const cancelEditName = () => {
    setEditingName(false);
    setSaveError('');
  };

  const openForgotPasswordDialog = () => {
    setForgotPasswordDialogOpen(true);
    setFpStep('email');
    setFpEmail(user?.email ?? '');
    setFpOtp(['', '', '', '', '', '']);
    setFpNewPassword('');
    setFpConfirmPassword('');
    setFpError('');
    setFpSuccess('');
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fpEmail)) {
      setFpError('Please enter a valid email address');
      return;
    }
    setFpLoading(true);
    setFpError('');
    setFpSuccess('');
    try {
      await authService.forgotPassword(fpEmail.trim());
      setFpSuccess('OTP sent to your email. Enter it below with your new password.');
      setFpStep('reset');
    } catch (err) {
      const msg = (err as Error).message || 'Failed to send OTP';
      setFpError(msg);
    } finally {
      setFpLoading(false);
    }
  };

  const handleFpOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...fpOtp];
    next[index] = digit;
    setFpOtp(next);
    if (digit && index < 5) {
      const el = document.getElementById(`fp-otp-${index + 1}`) as HTMLInputElement;
      el?.focus();
    }
  };

  const handleFpOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !fpOtp[index] && index > 0) {
      const el = document.getElementById(`fp-otp-${index - 1}`) as HTMLInputElement;
      el?.focus();
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = fpOtp.join('');
    if (code.length !== 6) {
      setFpError('Please enter all 6 digits');
      return;
    }
    if (fpNewPassword.length < 6) {
      setFpError('Password must be at least 6 characters');
      return;
    }
    if (fpNewPassword !== fpConfirmPassword) {
      setFpError('Passwords do not match');
      return;
    }
    setFpLoading(true);
    setFpError('');
    try {
      await authService.resetPassword({ email: fpEmail.trim(), otp: code, newPassword: fpNewPassword });
      setFpSuccess('Password updated. You can sign in with your new password.');
      setTimeout(() => {
        setForgotPasswordDialogOpen(false);
        router.push('/login');
      }, 1500);
    } catch (err) {
      const msg = (err as Error).message || 'Failed to reset password';
      setFpError(msg);
    } finally {
      setFpLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !user) return;
    if (!file.type.startsWith('image/')) {
      setAvatarError('Please choose a valid image file.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setAvatarError('Image must be less than 3MB.');
      return;
    }
    setAvatarError('');
    setAvatarUploading(true);
    try {
      const { user: updated } = await authService.uploadAvatar(file);
      dispatch(updateUser(updated));
    } catch (err) {
      const msg = (err as Error).message || 'Upload failed. Please try again.';
      setAvatarError(msg);
    } finally {
      setAvatarUploading(false);
    }
  };

  const saveName = async () => {
    const name = editName.trim();
    if (!name) {
      setSaveError('Name cannot be empty');
      return;
    }
    if (name === user?.name) {
      setEditingName(false);
      return;
    }
    setSaving(true);
    setSaveError('');
    try {
      const { user: updated } = await authService.updateProfile(name);
      dispatch(updateUser(updated));
      setEditingName(false);
    } catch (e) {
      const msg = (e as Error).message || 'Failed to update name';
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.replace('/login?redirect=/profile');
    }
  }, [mounted, token, router]);

  const showContent = mounted && !!token;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50/80">
      {!showContent ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
    <>
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-in fade-in slide-in-from-top-3 duration-500">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Profile
          </h1>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-all duration-200 hover:gap-3"
          >
            Orders
            <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
          </Link>
        </div>

        {/* Profile card */}
        <div className="rounded-2xl border border-pink-200/80 bg-white shadow-lg shadow-pink-200/30 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-500">
          <div className="p-6 sm:p-8">
            {/* Avatar + name row */}
            <div className="flex items-start gap-4 sm:gap-5 mb-8">
              <label className="relative flex h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white items-center justify-center shrink-0 shadow-lg shadow-pink-200/50 transition-transform duration-300 hover:scale-105 cursor-pointer overflow-hidden group">
                <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} disabled={avatarUploading} aria-label="Upload profile photo" />
                {user?.avatar && getAvatarUrl(user.avatar) ? (
                  <img src={getAvatarUrl(user.avatar)!} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <FontAwesomeIcon icon={faUser} className="h-7 w-7 sm:h-9 sm:w-9" />
                )}
                <span className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <FontAwesomeIcon icon={faCamera} className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </span>
                {avatarUploading && (
                  <span className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </span>
                )}
              </label>
              {avatarError && <p className="absolute left-0 top-full mt-1 text-sm text-red-600">{avatarError}</p>}
              <div className="min-w-0 flex-1">
                {editingName ? (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveName()}
                      placeholder="Your name"
                      className="w-full px-3 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none text-slate-900 font-semibold transition-all duration-200"
                      autoFocus
                      disabled={saving}
                    />
                    {saveError && (
                      <p className="text-sm text-red-600 animate-in fade-in">{saveError}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={saveName}
                        disabled={saving || !editName.trim()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 disabled:opacity-50 transition-all duration-200 active:scale-95"
                      >
                        {saving ? (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FontAwesomeIcon icon={faCheck} className="h-3.5 w-3.5" />
                        )}
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditName}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-pink-200 text-slate-600 text-sm font-medium hover:bg-pink-50 transition-all duration-200 active:scale-95"
                      >
                        <FontAwesomeIcon icon={faXmark} className="h-3.5 w-3.5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                        {user?.name}
                      </h2>
                      <button
                        type="button"
                        onClick={startEditName}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 active:scale-95"
                        title="Edit name"
                        aria-label="Edit name"
                      >
                        <FontAwesomeIcon icon={faPen} className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-slate-500 text-sm mt-0.5">Account details</p>
                  </>
                )}
              </div>
            </div>

            {/* Contact info */}
            <div className="space-y-4">
              {user?.email && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-pink-50/80 border border-pink-100 hover:border-pink-200/80 hover:bg-pink-100/50 transition-all duration-300 animate-in fade-in slide-in-from-left-2" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
                  <div className="flex h-10 w-10 rounded-xl bg-pink-100 text-pink-600 items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
                    <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</p>
                    <p className="mt-1 text-slate-900 font-medium break-all">{user.email}</p>
                  </div>
                </div>
              )}
              {user?.phone && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-pink-50/80 border border-pink-100 hover:border-pink-200/80 hover:bg-pink-100/50 transition-all duration-300 animate-in fade-in slide-in-from-left-2" style={{ animationDelay: '180ms', animationFillMode: 'backwards' }}>
                  <div className="flex h-10 w-10 rounded-xl bg-pink-100 text-pink-600 items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faPhone} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mobile</p>
                    <p className="mt-1 text-slate-900 font-medium">{user.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Security - Change password / Forgot password */}
            <div className="mt-6 pt-6 border-t border-pink-100">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Security</p>
              <button
                type="button"
                onClick={openForgotPasswordDialog}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-pink-50/80 border border-pink-100 hover:bg-pink-100/80 hover:border-pink-200 transition-all duration-300 group animate-in fade-in slide-in-from-left-2 text-left"
                style={{ animationDelay: '260ms', animationFillMode: 'backwards' }}
              >
                <div className="flex h-10 w-10 rounded-xl bg-pink-100 text-pink-700 items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <FontAwesomeIcon icon={faLock} className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800 group-hover:text-pink-800">Change password</p>
                  <p className="text-xs text-slate-500 mt-0.5">Reset your password via email OTP</p>
                </div>
                <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4 text-pink-600 group-hover:translate-x-0.5 transition-transform duration-200 shrink-0" />
              </button>
            </div>
          </div>

          {/* Footer actions */}
          <div className="border-t border-pink-100 px-6 sm:px-8 py-4 bg-pink-50/60 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-all duration-200 hover:gap-3 active:scale-95"
            >
              <FontAwesomeIcon icon={faBox} className="h-4 w-4" />
              View order history
            </Link>
            <button
              type="button"
              onClick={() => setLogoutDialogOpen(true)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600 transition-all duration-200 active:scale-95"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Logout confirmation dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log out</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You will need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
              className="border-pink-200"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="gap-2"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change password / Forgot password dialog */}
      <Dialog open={forgotPasswordDialogOpen} onOpenChange={(open) => { setForgotPasswordDialogOpen(open); if (!open) { setFpError(''); setFpSuccess(''); } }}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center mb-4">
            <div className="flex h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white items-center justify-center mb-3 shadow-lg shadow-pink-200">
              <FontAwesomeIcon icon={faKey} className="h-6 w-6" />
            </div>
            <DialogHeader>
              <DialogTitle>Change password</DialogTitle>
              <DialogDescription>
                {fpStep === 'email' ? 'Enter your email to receive an OTP.' : 'Enter the OTP and your new password.'}
              </DialogDescription>
            </DialogHeader>
          </div>

          {fpError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{fpError}</div>
          )}
          {fpSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm">{fpSuccess}</div>
          )}

          {fpStep === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={fpEmail}
                    onChange={(e) => setFpEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all text-slate-900"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1 border-pink-200" onClick={() => setForgotPasswordDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={fpLoading} className="flex-1 gap-2 bg-pink-600 hover:bg-pink-700 text-white">
                  {fpLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Send OTP <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" /></>}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="flex justify-center gap-2">
                {fpOtp.map((d, i) => (
                  <input
                    key={i}
                    id={`fp-otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={d}
                    onChange={(e) => handleFpOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleFpOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-semibold border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none text-slate-900"
                  />
                ))}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">New password</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={fpNewPassword}
                    onChange={(e) => setFpNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm password</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={fpConfirmPassword}
                    onChange={(e) => setFpConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none text-slate-900"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1 border-pink-200" onClick={() => setFpStep('email')}>
                  Back
                </Button>
                <Button type="submit" disabled={fpLoading} className="flex-1 gap-2 bg-pink-600 hover:bg-pink-700 text-white">
                  {fpLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Reset password <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" /></>}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
      )}
    </div>
  );
}
