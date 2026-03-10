'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  BadgeCheck,
  Camera,
  KeyRound,
  LogOut,
  Mail,
  PencilLine,
  Phone,
  Save,
  ShieldCheck,
  Store,
  UserCircle2,
  Users,
  X,
} from 'lucide-react';
import { RootState } from '@/store/store';
import { authService } from '@/services/authService';
import { getAvatarUrl } from '@/lib/api';
import { logout, updateUser } from '@/store/authSlice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function AdminProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  const [mounted, setMounted] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!token) {
      router.replace('/admin/login');
      return;
    }

    if (user?.role !== 'admin') {
      router.replace('/');
    }
  }, [mounted, token, user, router]);

  const handleLogout = async () => {
    setLogoutDialogOpen(false);
    try {
      await authService.logout();
    } catch {
      // Clear local session even if API fails.
    }
    dispatch(logout());
    router.push('/admin/login');
  };

  const startEditName = () => {
    setEditName(user?.name ?? '');
    setSaveError('');
    setEditingName(true);
  };

  const cancelEditName = () => {
    setEditingName(false);
    setEditName('');
    setSaveError('');
  };

  const saveName = async () => {
    const name = editName.trim();
    if (!name) {
      setSaveError('Admin name cannot be empty.');
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
    } catch (error) {
      setSaveError((error as Error).message || 'Failed to update admin name.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please choose an image file.');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setAvatarError('Image must be less than 3MB.');
      return;
    }

    setAvatarUploading(true);
    setAvatarError('');

    try {
      const { user: updated } = await authService.uploadAvatar(file);
      dispatch(updateUser(updated));
    } catch (error) {
      setAvatarError((error as Error).message || 'Upload failed. Please try again.');
    } finally {
      setAvatarUploading(false);
    }
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

  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fpEmail)) {
      setFpError('Please enter a valid email address.');
      return;
    }

    setFpLoading(true);
    setFpError('');
    setFpSuccess('');

    try {
      await authService.forgotPassword(fpEmail.trim());
      setFpSuccess('OTP sent to your admin email. Enter it below with the new password.');
      setFpStep('reset');
    } catch (error) {
      setFpError((error as Error).message || 'Failed to send OTP.');
    } finally {
      setFpLoading(false);
    }
  };

  const handleFpOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const nextOtp = [...fpOtp];
    nextOtp[index] = digit;
    setFpOtp(nextOtp);

    if (digit && index < 5) {
      const nextInput = document.getElementById(`admin-fp-otp-${index + 1}`) as HTMLInputElement | null;
      nextInput?.focus();
    }
  };

  const handleFpOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !fpOtp[index] && index > 0) {
      const previousInput = document.getElementById(`admin-fp-otp-${index - 1}`) as HTMLInputElement | null;
      previousInput?.focus();
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();

    const code = fpOtp.join('');
    if (code.length !== 6) {
      setFpError('Please enter all 6 digits.');
      return;
    }

    if (fpNewPassword.length < 6) {
      setFpError('Password must be at least 6 characters.');
      return;
    }

    if (fpNewPassword !== fpConfirmPassword) {
      setFpError('Passwords do not match.');
      return;
    }

    setFpLoading(true);
    setFpError('');

    try {
      await authService.resetPassword({
        email: fpEmail.trim(),
        otp: code,
        newPassword: fpNewPassword,
      });
      setFpSuccess('Admin password updated successfully.');
      setTimeout(() => {
        setForgotPasswordDialogOpen(false);
      }, 1200);
    } catch (error) {
      setFpError((error as Error).message || 'Failed to reset password.');
    } finally {
      setFpLoading(false);
    }
  };

  if (!mounted || !token || user?.role !== 'admin') {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-rose-100/70 p-6 shadow-[0_20px_60px_-30px_rgba(244,114,182,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-500">Admin profile</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Manage your admin identity and workspace access</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This profile page is dedicated to admin settings. Update your avatar, display name and security access without mixing it with the regular user profile experience.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Link href="/admin/dashboard" className="rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-pink-50">
              Dashboard
            </Link>
            <Link href="/admin/products" className="rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-pink-50">
              Products
            </Link>
            <button
              type="button"
              onClick={openForgotPasswordDialog}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Change password
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="relative">
              <label className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-[28px] bg-gradient-to-br from-pink-500 via-rose-400 to-fuchsia-400 text-white shadow-lg shadow-pink-200">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleAvatarChange}
                  disabled={avatarUploading}
                  aria-label="Upload admin profile photo"
                />
                {user.avatar && getAvatarUrl(user.avatar) ? (
                  <img src={getAvatarUrl(user.avatar)!} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-semibold">{(user.name ?? user.email ?? 'A').charAt(0).toUpperCase()}</span>
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-slate-900/45 opacity-0 transition group-hover:opacity-100">
                  <Camera className="h-6 w-6" />
                </span>
                {avatarUploading && (
                  <span className="absolute inset-0 flex items-center justify-center bg-slate-900/55">
                    <span className="h-7 w-7 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  </span>
                )}
              </label>
              {avatarError && <p className="mt-3 max-w-xs text-sm text-rose-600">{avatarError}</p>}
            </div>

            <div className="min-w-0 flex-1">
              {editingName ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && saveName()}
                    placeholder="Admin name"
                    className="w-full rounded-2xl border border-pink-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                    autoFocus
                    disabled={saving}
                  />
                  {saveError && <p className="text-sm text-rose-600">{saveError}</p>}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={saveName}
                      disabled={saving || !editName.trim()}
                      className="inline-flex items-center gap-2 rounded-2xl bg-pink-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-pink-700 disabled:opacity-60"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? 'Saving...' : 'Save changes'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditName}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-2xl border border-pink-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-pink-50"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-semibold text-slate-900">{user.name ?? 'Admin user'}</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verified admin
                    </span>
                    <button
                      type="button"
                      onClick={startEditName}
                      className="inline-flex items-center gap-2 rounded-full border border-pink-200 px-3 py-1.5 text-sm font-medium text-pink-700 transition hover:bg-pink-50"
                    >
                      <PencilLine className="h-4 w-4" />
                      Edit
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">Primary admin identity used across the store operations workspace.</p>
                </>
              )}

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] border border-pink-100 bg-pink-50/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-pink-600 shadow-sm">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Admin email</p>
                      <p className="mt-2 break-all text-sm font-medium text-slate-900">{user.email ?? 'No email available'}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-pink-100 bg-pink-50/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-pink-600 shadow-sm">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Support phone</p>
                      <p className="mt-2 text-sm font-medium text-slate-900">{user.phone ?? 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Admin access</h3>
                <p className="text-sm text-slate-500">Security details for the current admin account.</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-pink-50/60 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Role</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Administrator</p>
              </div>
              <div className="rounded-2xl bg-pink-50/60 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Access level</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Catalog, orders, customers, CMS and operations</p>
              </div>
              <button
                type="button"
                onClick={openForgotPasswordDialog}
                className="flex w-full items-center justify-between rounded-2xl border border-pink-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-pink-50"
              >
                <span className="inline-flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-pink-500" />
                  Reset admin password
                </span>
                <span className="text-pink-600">Open</span>
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-pink-100 bg-slate-900 p-6 text-white shadow-[0_18px_50px_-35px_rgba(15,23,42,0.85)]">
            <h3 className="text-xl font-semibold">Quick admin actions</h3>
            <div className="mt-5 grid gap-3">
              <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10">
                <Users className="h-4 w-4 text-pink-300" />
                Open dashboard
              </Link>
              <Link href="/admin/products" className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10">
                <Store className="h-4 w-4 text-pink-300" />
                Manage products
              </Link>
              <button
                type="button"
                onClick={() => setLogoutDialogOpen(true)}
                className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 text-pink-300" />
                Sign out from admin
              </button>
            </div>
          </div>
        </section>
      </div>

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log out from admin</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave the admin workspace? You will need to sign in again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setLogoutDialogOpen(false)} className="border-pink-200">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={forgotPasswordDialogOpen}
        onOpenChange={(open) => {
          setForgotPasswordDialogOpen(open);
          if (!open) {
            setFpError('');
            setFpSuccess('');
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <div className="mb-4 flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-200">
              <KeyRound className="h-6 w-6" />
            </div>
            <DialogHeader>
              <DialogTitle>Admin password reset</DialogTitle>
              <DialogDescription>
                {fpStep === 'email' ? 'Enter your admin email to receive an OTP.' : 'Enter the OTP and your new admin password.'}
              </DialogDescription>
            </DialogHeader>
          </div>

          {fpError && <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">{fpError}</div>}
          {fpSuccess && <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800">{fpSuccess}</div>}

          {fpStep === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Admin email</label>
                <input
                  type="email"
                  required
                  value={fpEmail}
                  onChange={(event) => setFpEmail(event.target.value)}
                  placeholder="Enter your admin email"
                  className="w-full rounded-xl border-2 border-pink-200 px-4 py-3 text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1 border-pink-200" onClick={() => setForgotPasswordDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={fpLoading} className="flex-1 bg-pink-600 text-white hover:bg-pink-700">
                  {fpLoading ? 'Sending...' : 'Send OTP'}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="flex justify-center gap-2">
                {fpOtp.map((digit, index) => (
                  <input
                    key={index}
                    id={`admin-fp-otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(event) => handleFpOtpChange(index, event.target.value)}
                    onKeyDown={(event) => handleFpOtpKeyDown(index, event)}
                    className="h-12 w-11 rounded-xl border-2 border-pink-200 text-center text-lg font-semibold text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  />
                ))}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">New password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={fpNewPassword}
                  onChange={(event) => setFpNewPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border-2 border-pink-200 px-4 py-3 text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Confirm password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={fpConfirmPassword}
                  onChange={(event) => setFpConfirmPassword(event.target.value)}
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border-2 border-pink-200 px-4 py-3 text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                />
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1 border-pink-200" onClick={() => setFpStep('email')}>
                  Back
                </Button>
                <Button type="submit" disabled={fpLoading} className="flex-1 bg-pink-600 text-white hover:bg-pink-700">
                  {fpLoading ? 'Updating...' : 'Reset password'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
