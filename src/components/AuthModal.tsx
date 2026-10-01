import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Role } from '../types';
import { Shield, Building2, UserCheck, User, LogIn, Lock, Mail, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginUser } = useApp();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<Role>('GUARD');
  const [loginError, setLoginError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const result = loginUser(loginEmail, loginPassword, loginRole);
    if (result.success) {
      onClose();
    } else {
      setLoginError(result.error || `Invalid login credentials for ${loginRole} role.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
        
        {/* Header Title */}
        <div className="flex border-b border-slate-800 bg-slate-950/80 p-3 items-center justify-between">
          <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-xs">
            <LogIn className="w-4 h-4" />
            Portal Sign In
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs bg-slate-800 px-2.5 py-1 rounded-lg">
            Close
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">Select Role *</label>
              <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setLoginRole('GUARD')}
                  className={`py-2 px-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition-all ${
                    loginRole === 'GUARD'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" /> Gate Guard
                </button>

                <button
                  type="button"
                  onClick={() => setLoginRole('WARDEN')}
                  className={`py-2 px-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition-all ${
                    loginRole === 'WARDEN'
                      ? 'bg-cyan-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" /> PG Warden
                </button>

                <button
                  type="button"
                  onClick={() => setLoginRole('ADMIN')}
                  className={`py-2 px-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition-all ${
                    loginRole === 'ADMIN'
                      ? 'bg-indigo-500 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" /> Admin
                </button>

                <button
                  type="button"
                  onClick={() => setLoginRole('RESIDENT')}
                  className={`py-2 px-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition-all ${
                    loginRole === 'RESIDENT'
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" /> Resident
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Email / Phone *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. guard@gulmohar.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="p-2.5 bg-red-950/40 border border-red-500/30 text-red-300 rounded-xl text-[11px] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p>{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              Log In as {loginRole}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
