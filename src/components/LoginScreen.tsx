import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Role } from '../types';
import { Shield, Building2, UserCheck, User, LogIn, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginUser } = useApp();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<Role>('GUARD');
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const result = loginUser(loginEmail, loginPassword, loginRole);
    if (!result.success) {
      setLoginError(result.error || `Invalid credentials for ${loginRole} role.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-2xl shadow-xl shadow-emerald-500/20 mb-1">
            GE
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Gulmohar Enclave Management System
          </h1>
          <p className="text-xs text-slate-400">
            Secure Resident Verification, Gate Logging & 22 PG Portal
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Header Title */}
          <div className="border-b border-slate-800 bg-slate-950/60 p-4 text-center">
            <div className="inline-flex items-center justify-center gap-2 text-indigo-400 font-bold text-sm">
              <LogIn className="w-4 h-4" />
              Secure Staff & Resident Portal Login
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              
              {/* Role Switcher */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Select Account Role *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setLoginRole('GUARD')}
                    className={`py-2 px-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition-all ${
                      loginRole === 'GUARD'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" /> Guard
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
                    <Building2 className="w-3.5 h-3.5" /> Warden
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
                <label className="text-slate-300 font-semibold block mb-1">Email or Phone Number *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder={`Enter registered ${loginRole.toLowerCase()} email or phone...`}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <p>{loginError}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Log In to {loginRole} Portal <ArrowRight className="w-4 h-4" />
              </button>

              {/* System Initial Access Info & Security Policy */}
              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                <p className="font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Security Access Notice:
                </p>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Public self-registration is disabled for security. Accounts for Wardens, Security Guards, and Residents are provisioned by Society Administration.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[10px] font-mono text-slate-300 pt-1">
                  <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-indigo-400 font-bold block">ADMIN:</span>
                    admin@gulmohar.com<br/>pass: admin123
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-amber-400 font-bold block">GUARD:</span>
                    guard@gulmohar.com<br/>pass: guard123
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-cyan-400 font-bold block">WARDEN:</span>
                    warden.pg1@gulmohar.com<br/>pass: warden123
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500">
          © 2026 Gulmohar Enclave • Dehradun, Uttarakhand
        </p>
      </div>
    </div>
  );
};
