'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AuthService } from '@/services/auth/authService';
import { SystemRole } from '@/services/permissions/permissionsService';
import {
  Lock,
  Mail,
  User,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register' | 'reset';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const { showToast, loginAsDemoUser } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'reset'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState<SystemRole>('team_member');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await AuthService.loginWithEmail(email, password);
        showToast('Logged in successfully');
        onClose();
      } else if (mode === 'register') {
        if (!displayName.trim()) {
          setErrorMsg('Please enter your full name');
          setIsLoading(false);
          return;
        }
        await AuthService.registerWithEmail(email, password, displayName, selectedRole);
        showToast(`Account registered as ${selectedRole.replace('_', ' ')}`);
        onClose();
      } else if (mode === 'reset') {
        await AuthService.resetPassword(email);
        showToast('Password reset link sent to your email');
        setMode('login');
      }
    } catch (err: any) {
      console.error('Auth action failed:', err);
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setErrorMsg('Invalid email or password.');
      } else if (code === 'auth/email-already-in-use') {
        setErrorMsg('An account with this email already exists.');
      } else if (code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters.');
      } else {
        setErrorMsg(err.message || 'Authentication error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const res = await AuthService.signInWithGoogle();
      if (res) {
        showToast(`Authenticated as ${res.displayName}`);
      } else {
        showToast('Signed in with Google successfully');
      }
      onClose();
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      setErrorMsg(err?.message || 'Google Sign-In failed. Please try again or use email sign-in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: SystemRole) => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await loginAsDemoUser(role);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to authenticate sandbox user.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-[#171717] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs">
              R
            </div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {mode === 'login' ? 'Sign In to ROSE AI OS' : mode === 'register' ? 'Create Agency Account' : 'Reset Password'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-800 dark:text-neutral-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Alexander Rose"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="name@agencyrose.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-[11px] text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Account Type / Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as SystemRole)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer"
              >
                <option value="team_member">Agency Team Member</option>
                <option value="client">Client Portal User</option>
              </select>
              <div className="text-[10px] text-neutral-400">
                Notice: Super Admin roles are provisioned strictly through platform security approval.
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer mt-2"
          >
            {isLoading
              ? 'Authenticating...'
              : mode === 'login'
              ? 'Sign In with Email'
              : mode === 'register'
              ? 'Create Account'
              : 'Send Reset Link'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1 h-px bg-neutral-200 dark:border-neutral-800" />
          <span className="text-[10px] text-neutral-400 uppercase">Or</span>
          <div className="flex-1 h-px bg-neutral-200 dark:border-neutral-800" />
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* 1-Click Quick Access for Sandbox / Evaluation */}
        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
              1-Click Demo Access
            </span>
            <span className="text-[10px] text-neutral-400">Preview Safe</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickDemoLogin('super_admin')}
              className="px-2 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-left transition-colors cursor-pointer"
            >
              <div className="text-[11px] font-medium text-neutral-900 dark:text-neutral-100 truncate">Alexander</div>
              <div className="text-[9px] text-neutral-500 truncate">Super Admin</div>
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickDemoLogin('team_member')}
              className="px-2 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-left transition-colors cursor-pointer"
            >
              <div className="text-[11px] font-medium text-neutral-900 dark:text-neutral-100 truncate">Sarah Lin</div>
              <div className="text-[9px] text-neutral-500 truncate">Team Member</div>
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickDemoLogin('client')}
              className="px-2 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-left transition-colors cursor-pointer"
            >
              <div className="text-[11px] font-medium text-neutral-900 dark:text-neutral-100 truncate">Elena R.</div>
              <div className="text-[9px] text-neutral-500 truncate">Client Portal</div>
            </button>
          </div>
          <div className="text-[10px] text-neutral-400 text-center leading-relaxed">
            Directly authenticates role credentials and activates multi-tenant workspace partitioning.
          </div>
        </div>

        {/* Toggle Mode footer */}
        <div className="text-center text-xs text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          {mode === 'login' ? (
            <span>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-neutral-900 dark:text-neutral-100 font-medium underline"
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-neutral-900 dark:text-neutral-100 font-medium underline"
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
