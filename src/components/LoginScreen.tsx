import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Role, UserAccount } from '../types';
import { INITIAL_USER_ACCOUNTS } from '../data/initialData';
import { Shield, Building2, UserCheck, User, LogIn, UserPlus, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginUser, registerUser, pgs } = useApp();
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<Role>('GUARD');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Signup form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupRole, setSignupRole] = useState<Role>('WARDEN');
  const [pgId, setPgId] = useState(pgs[0]?.id || 'pg-1');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const result = loginUser(loginEmail, loginPassword, loginRole);
    if (!result.success) {
      setLoginError(result.error || `Invalid credentials for ${loginRole} role.`);
    }
  };

  const handleDemoLogin = (account: UserAccount) => {
    loginUser(account.email, account.password || 'admin123', account.role);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (signupRole === 'RESIDENT') {
      alert('Resident registration must be completed by the PG Warden or Society Admin upon room allocation.');
      return;
    }

    const selectedPg = pgs.find((p) => p.id === pgId);

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name,
      phone,
      email,
      password,
      role: signupRole,
      pgId: signupRole === 'WARDEN' ? pgId : undefined,
      pgName: selectedPg?.name,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    };

    registerUser(newUser);
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
          
          {/* Header Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 p-2">
            <button
              onClick={() => setActiveTab('LOGIN')}
              className={`flex-1 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'LOGIN'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Sign In / Login
            </button>

            <button
              onClick={() => setActiveTab('SIGNUP')}
              className={`flex-1 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'SIGNUP'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Create Account
            </button>
          </div>

          <div className="p-6">
            
            {/* TAB 1: LOGIN */}
            {activeTab === 'LOGIN' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                
                {/* Role Pill Switcher */}
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
                      placeholder={`Enter your registered ${loginRole.toLowerCase()} email or phone...`}
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
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
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

                {/* Quick 1-Click Demo Logins */}
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Quick 1-Click Demo Login (Password auto-verified):
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {INITIAL_USER_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => handleDemoLogin(acc)}
                        className="text-left p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-xs text-slate-300 transition-all flex items-center gap-2.5 cursor-pointer"
                      >
                        <img src={acc.photoUrl} alt="" className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0" />
                        <div className="truncate min-w-0">
                          <p className="font-bold text-white truncate text-[11px]">{acc.name}</p>
                          <p className="text-indigo-300 text-[9px] font-semibold uppercase">{acc.role} • <span className="text-slate-400 font-mono font-normal">[{acc.password || 'admin123'}]</span></p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}

            {/* TAB 2: SIGNUP */}
            {activeTab === 'SIGNUP' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs">
                
                {/* Informational Notice Banner for Residents */}
                <div className="p-3 bg-amber-950/40 border border-amber-500/30 text-amber-200 rounded-xl text-xs space-y-1">
                  <p className="font-bold flex items-center gap-1 text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5" /> Notice for Residents:
                  </p>
                  <p className="text-[11px] text-amber-200/90 leading-relaxed">
                    Public resident registration is disabled. Resident Login IDs and Passwords are provided directly by your PG Warden or Society Admin upon room allocation.
                  </p>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Staff Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Vikramaditya Rawat"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Phone Number *</label>
                    <input
                      type="text"
                      placeholder="+91 98000 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Email Address *</label>
                    <input
                      type="email"
                      placeholder="staff@gulmohar.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Account Password *</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Staff Role *</label>
                    <select
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value as Role)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="WARDEN">PG Warden</option>
                      <option value="GUARD">Gate Guard</option>
                    </select>
                  </div>
                </div>

                {signupRole === 'WARDEN' && (
                  <div className="pt-1">
                    <label className="text-slate-300 font-semibold block mb-1">Assigned PG Accommodation *</label>
                    <select
                      value={pgId}
                      onChange={(e) => setPgId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      {pgs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-indigo-600/20 mt-2 cursor-pointer"
                >
                  Register Staff Account
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500">
          © 2026 Gulmohar Enclave • Dehradun, Uttarakhand
        </p>
      </div>
    </div>
  );
};
