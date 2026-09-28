import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Building2, UserCheck, User, Bell, Siren, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  onOpenEmergency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEmergency }) => {
  const { role, setRole, activePgId, setActivePgId, pgs, alerts, markAlertRead, clearAllAlerts } = useApp();
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);

  const unreadAlerts = alerts.filter((a) => !a.read);

  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Society Title */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-bold text-xl">
              GE
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight flex items-center gap-2">
                Gulmohar Enclave
                <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                  22 PGs Active
                </span>
              </h1>
              <p className="text-xs text-slate-400">Resident, Gate & PG Security System</p>
            </div>
          </div>

          {/* Mobile SOS button */}
          <button
            onClick={onOpenEmergency}
            className="md:hidden flex items-center gap-1 bg-red-600/20 border border-red-500/40 text-red-400 hover:bg-red-600/30 text-xs px-2.5 py-1.5 rounded-lg font-semibold animate-pulse"
          >
            <Siren className="w-4 h-4 text-red-400" />
            SOS
          </button>
        </div>

        {/* Role Selection & PG Switcher */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-center md:justify-end">
          
          {/* Role Switcher Pills */}
          <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setRole('GUARD')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'GUARD'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Gate Guard
            </button>

            <button
              onClick={() => setRole('WARDEN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'WARDEN'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              PG Warden
            </button>

            <button
              onClick={() => setRole('ADMIN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'ADMIN'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Admin
            </button>

            <button
              onClick={() => setRole('RESIDENT')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'RESIDENT'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Resident
            </button>
          </div>

          {/* Warden PG Selector dropdown (Visible only in WARDEN role) */}
          {role === 'WARDEN' && (
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 font-medium">PG:</span>
              <select
                value={activePgId}
                onChange={(e) => setActivePgId(e.target.value)}
                className="bg-transparent text-xs text-cyan-300 font-bold focus:outline-none cursor-pointer max-w-[160px] truncate"
              >
                {pgs.map((pg) => (
                  <option key={pg.id} value={pg.id} className="bg-slate-900 text-slate-200">
                    {pg.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 relative transition-all"
              title="System Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
                  {unreadAlerts.length}
                </span>
              )}
            </button>

            {/* Alerts Dropdown Modal */}
            {showAlertsDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-4 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <h3 className="font-semibold text-sm text-white">System Notifications</h3>
                  </div>
                  {unreadAlerts.length > 0 && (
                    <button
                      onClick={clearAllAlerts}
                      className="text-xs text-cyan-400 hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-2">
                  {alerts.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No alerts recorded.</p>
                  ) : (
                    alerts.map((alert) => (
                      <div
                        key={alert.id}
                        onClick={() => markAlertRead(alert.id)}
                        className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                          alert.read
                            ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white flex items-center gap-1">
                            {alert.type === 'LATE_ENTRY' ? (
                              <span className="text-amber-400 font-semibold">⚠️ Late Entry</span>
                            ) : (
                              <span className="text-red-400 font-semibold">🚨 Emergency</span>
                            )}
                            - {alert.pgName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p>{alert.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Emergency SOS Button */}
          <button
            onClick={onOpenEmergency}
            className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs px-3 py-2 rounded-xl border border-red-500/40 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
          >
            <Siren className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
            Emergency Headcount
          </button>
        </div>
      </div>
    </header>
  );
};
