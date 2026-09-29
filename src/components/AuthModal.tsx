import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Role, UserAccount } from '../types';
import { INITIAL_USER_ACCOUNTS } from '../data/initialData';
import { Shield, Building2, UserCheck, User, LogIn, UserPlus, Lock, Mail, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
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
  const [signupRole, setSignupRole] = useState<Role>('RESIDENT');
  const [pgId, setPgId] = useState(pgs[0]?.id || 'pg-1');
  const [roomNumber, setRoomNumber] = useState('');
  const [signupError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const success = loginUser(loginEmail, loginPassword, loginRole);
    if (success) {
      onClose();
    } else {
      setLoginError(`Invalid login credentials for ${loginRole} role. Or click one of the quick demo login buttons below!`);
    }
  };

  const handleDemoLogin = (account: UserAccount) => {
    loginUser(account.email, 'password123', account.role);
    onClose();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedPg = pgs.find((p) => p.id === pgId);

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name,
      phone,
      email,
      role: signupRole,
      pgId: signupRole === 'WARDEN' || signupRole === 'RESIDENT' ? pgId : undefined,
      pgName: selectedPg?.name,
      roomNumber: signupRole === 'RESIDENT' ? roomNumber : undefined,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    };

    registerUser(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
        
        {/* Header Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/80 p-2">
          <button
            onClick={() => setActiveTab('LOGIN')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'LOGIN'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Sign In / Login
          </button>

          <button
            onClick={() => setActiveTab('SIGNUP')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'SIGNUP'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Create Account
          </button>
        </div>

        <div className="p-6">
          
          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'LOGIN' && (
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
                <label className="text-slate-300 font-semibold block mb-1">Password / PIN *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
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
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-600/20"
              >
                Log In as {loginRole}
              </button>

              {/* Quick Demo Login Bar */}
              <div className="pt-3 border-t border-slate-800 space-y-1.5">
                <p className="text-[11px] text-slate-400 font-semibold">Instant 1-Click Demo Accounts:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {INITIAL_USER_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleDemoLogin(acc)}
                      className="text-left p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-[10px] text-slate-300 transition-all flex items-center gap-2"
                    >
                      <img src={acc.photoUrl} alt="" className="w-6 h-6 rounded-full object-cover border border-slate-700 shrink-0" />
                      <div className="truncate">
                        <p className="font-bold text-white truncate">{acc.name}</p>
                        <p className="text-indigo-300 text-[9px] font-semibold">{acc.role} {acc.pgName ? `(${acc.pgName})` : ''}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: SIGNUP FORM */}
          {activeTab === 'SIGNUP' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Full Name *</label>
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
                    placeholder="user@gulmohar.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Password *</label>
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
                  <label className="text-slate-300 font-semibold block mb-1">Role *</label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value as Role)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="RESIDENT">Resident Occupant</option>
                    <option value="WARDEN">PG Warden</option>
                    <option value="GUARD">Gate Guard</option>
                  </select>
                </div>
              </div>

              {(signupRole === 'WARDEN' || signupRole === 'RESIDENT') && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Assigned PG *</label>
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

                  {signupRole === 'RESIDENT' && (
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Room Number *</label>
                      <input
                        type="text"
                        placeholder="e.g. 104-A"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        required
                      />
                    </div>
                  )}
                </div>
              )}

              {signupError && (
                <p className="text-xs text-red-400 font-medium">{signupError}</p>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/20 mt-2"
              >
                Create Account & Log In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
