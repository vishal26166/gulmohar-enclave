import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { Resident } from '../types';
import { Search, QrCode, LogIn, LogOut, Clock, ShieldCheck, UserCheck, AlertTriangle, Phone, Home, PlusCircle, CheckCircle } from 'lucide-react';

interface GateGuardViewProps {
  onOpenQRScanner: () => void;
  onOpenVisitorModal: () => void;
}

export const GateGuardView: React.FC<GateGuardViewProps> = ({ onOpenQRScanner, onOpenVisitorModal }) => {
  const { residents, pgs, movementLogs, markMovement } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPgFilter, setSelectedPgFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL');
  const [lastActionResult, setLastActionResult] = useState<{
    residentName: string;
    type: 'IN' | 'OUT';
    isLate: boolean;
    timestamp: string;
  } | null>(null);

  // Filter residents fast
  const filteredResidents = useMemo(() => {
    return residents.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.phone.includes(searchTerm) ||
        r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.pgName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPg = selectedPgFilter === 'ALL' || r.pgId === selectedPgFilter;
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

      return matchesSearch && matchesPg && matchesStatus;
    });
  }, [residents, searchTerm, selectedPgFilter, statusFilter]);

  const handleGateAction = (resident: Resident, type: 'IN' | 'OUT') => {
    const res = markMovement(resident.id, type);
    if (res.success) {
      setLastActionResult({
        residentName: resident.name,
        type,
        isLate: res.isLate,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });

      // Clear alert banner after 6 seconds
      setTimeout(() => {
        setLastActionResult(null);
      }, 6000);
    }
  };

  const totalResidentsCount = residents.length;
  const currentlyInsideCount = residents.filter((r) => r.status === 'IN').length;
  const currentlyOutsideCount = residents.filter((r) => r.status === 'OUT').length;

  return (
    <div className="space-y-6">
      
      {/* Guard Banner & Action Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/20 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Society Main Gate Terminal</h2>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Fast entry/exit logging across all 22 PGs. Search by Name, Phone, Room or PG.
              </p>
            </div>
          </div>

          {/* Gate Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenQRScanner}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all text-sm cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              Scan Resident QR
            </button>

            <button
              onClick={onOpenVisitorModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-2.5 rounded-xl transition-all text-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              Log Visitor
            </button>
          </div>
        </div>

        {/* Gate Movement Metrics Summary */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Registered Occupants</span>
            <p className="text-lg font-bold text-white mt-0.5">{totalResidentsCount}</p>
          </div>
          <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/20 text-center">
            <span className="text-[11px] text-emerald-400 uppercase tracking-wider font-semibold">Currently INSIDE</span>
            <p className="text-lg font-bold text-emerald-300 mt-0.5">{currentlyInsideCount}</p>
          </div>
          <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-500/20 text-center">
            <span className="text-[11px] text-amber-400 uppercase tracking-wider font-semibold">Currently OUTSIDE</span>
            <p className="text-lg font-bold text-amber-300 mt-0.5">{currentlyOutsideCount}</p>
          </div>
        </div>
      </div>

      {/* Action Banner Feedback popup */}
      {lastActionResult && (
        <div
          className={`p-4 rounded-xl border shadow-lg flex items-center justify-between transition-all animate-bounce ${
            lastActionResult.isLate
              ? 'bg-red-500/20 border-red-500/40 text-red-200'
              : lastActionResult.type === 'IN'
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-500/20 border-amber-500/40 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {lastActionResult.isLate ? (
              <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
            ) : (
              <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
            )}
            <div>
              <p className="font-bold text-sm">
                Gate {lastActionResult.type} Recorded for <span className="underline">{lastActionResult.residentName}</span> at {lastActionResult.timestamp}
              </p>
              {lastActionResult.isLate && (
                <p className="text-xs text-red-300 font-semibold mt-0.5">
                  ⚠️ LATE ENTRY FLAGGED! Curfew violation notification sent to PG Warden.
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setLastActionResult(null)}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-900/60 rounded-lg"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Filters Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Main Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Type Resident Name, Phone, Room (e.g. 101-A) or PG Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-medium transition-all shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* PG Selection Filter */}
        <div className="md:col-span-3">
          <select
            value={selectedPgFilter}
            onChange={(e) => setSelectedPgFilter(e.target.value)}
            className="w-full py-3 px-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All 22 PGs</option>
            {pgs.map((pg) => (
              <option key={pg.id} value={pg.id}>
                {pg.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3 flex bg-slate-900 border border-slate-700 p-1 rounded-xl">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('IN')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === 'IN' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            IN Only
          </button>
          <button
            onClick={() => setStatusFilter('OUT')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === 'OUT' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            OUT Only
          </button>
        </div>
      </div>

      {/* Main Resident Cards Grid for Gate Action */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Showing {filteredResidents.length} Residents</span>
          <span>Tap buttons below to mark instant Entry or Exit</span>
        </div>

        {filteredResidents.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            <UserCheck className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="font-semibold text-white">No residents found matching your search.</p>
            <p className="text-xs text-slate-500 mt-1">Try searching by room number or name.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResidents.map((resident) => {
              const pg = pgs.find((p) => p.id === resident.pgId);
              const isCurrentlyIn = resident.status === 'IN';

              return (
                <div
                  key={resident.id}
                  className={`bg-slate-900 border rounded-2xl p-4 shadow-lg flex flex-col justify-between transition-all hover:border-slate-700 ${
                    isCurrentlyIn ? 'border-slate-800' : 'border-amber-500/30 bg-amber-950/10'
                  }`}
                >
                  <div>
                    {/* Header: Photo, Name, Room & Status */}
                    <div className="flex items-start gap-3">
                      <img
                        src={resident.photoUrl}
                        alt={resident.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-bold text-white truncate text-base">{resident.name}</h3>
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border tracking-wide uppercase ${
                              isCurrentlyIn
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {resident.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 font-medium flex items-center gap-1 mt-0.5 truncate">
                          <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {resident.pgName}
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded font-mono font-bold">
                            Room {resident.roomNumber}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {resident.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details: Curfew & Last Movement */}
                    <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Curfew: <strong className="text-slate-300">{pg?.curfewTime || '22:30'}</strong>
                      </span>
                      <span>
                        Last:{' '}
                        <strong className="text-slate-300">
                          {new Date(resident.lastMovementTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* One-Tap Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-2">
                    <button
                      onClick={() => handleGateAction(resident, 'IN')}
                      disabled={isCurrentlyIn}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        isCurrentlyIn
                          ? 'bg-slate-800/50 text-slate-600 border border-slate-800 cursor-not-allowed'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20'
                      }`}
                    >
                      <LogIn className="w-4 h-4" />
                      Mark ENTRY
                    </button>

                    <button
                      onClick={() => handleGateAction(resident, 'OUT')}
                      disabled={!isCurrentlyIn}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        !isCurrentlyIn
                          ? 'bg-slate-800/50 text-slate-600 border border-slate-800 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-md shadow-amber-600/20'
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      Mark EXIT
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Live Movement Feed Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">Live Gate Movement Feed</h3>
          </div>
          <span className="text-xs text-slate-400">Real-time log</span>
        </div>

        <div className="mt-4 space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {movementLogs.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No gate movements logged yet.</p>
          ) : (
            movementLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded font-bold text-[10px] uppercase ${
                      log.type === 'IN'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {log.type}
                  </span>
                  <div>
                    <p className="font-bold text-white flex items-center gap-1">
                      {log.residentName}
                      <span className="text-slate-400 font-normal">
                        ({log.pgName}, Room {log.roomNumber})
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-400">{log.notes}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-slate-300 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {log.isLateEntry && (
                    <span className="block text-[10px] text-red-400 font-bold uppercase">⚠️ Late Entry</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
