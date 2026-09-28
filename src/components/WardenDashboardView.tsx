import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, AlertTriangle, Phone, Search, Check, X, ShieldAlert } from 'lucide-react';

export const WardenDashboardView: React.FC = () => {
  const { activePgId, pgs, residents, movementLogs, visitors, updateVisitorStatus, updatePGWarden } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingWarden, setEditingWarden] = useState(false);

  // Filter to active PG
  const currentPg = pgs.find((p) => p.id === activePgId) || pgs[0];

  const [wardenName, setWardenName] = useState(currentPg.wardenName);
  const [wardenPhone, setWardenPhone] = useState(currentPg.wardenPhone);
  const [curfewTime, setCurfewTime] = useState(currentPg.curfewTime);

  const pgResidents = residents.filter((r) => r.pgId === currentPg.id);
  const pgLogs = movementLogs.filter((l) => l.pgId === currentPg.id);
  const pgVisitors = visitors.filter((v) => {
    const host = residents.find((r) => r.id === v.hostResidentId);
    return host?.pgId === currentPg.id;
  });

  const filteredResidents = pgResidents.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm)
  );

  const totalOccupants = pgResidents.length;
  const currentlyInside = pgResidents.filter((r) => r.status === 'IN').length;
  const currentlyOutside = pgResidents.filter((r) => r.status === 'OUT').length;
  const lateEntriesCount = pgLogs.filter((l) => l.isLateEntry).length;

  const handleSaveWarden = (e: React.FormEvent) => {
    e.preventDefault();
    updatePGWarden(currentPg.id, wardenName, wardenPhone, curfewTime);
    setEditingWarden(false);
  };

  return (
    <div className="space-y-6">
      
      {/* PG Warden Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-500/20 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{currentPg.name}</h2>
                <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  Warden Dashboard
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Warden: <strong className="text-white">{currentPg.wardenName}</strong> ({currentPg.wardenPhone}) • Curfew:{' '}
                <strong className="text-amber-400">{currentPg.curfewTime}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setWardenName(currentPg.wardenName);
              setWardenPhone(currentPg.wardenPhone);
              setCurfewTime(currentPg.curfewTime);
              setEditingWarden(!editingWarden);
            }}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold px-3 py-2 rounded-xl transition-all self-start lg:self-center"
          >
            {editingWarden ? 'Cancel Edit' : 'Edit Warden & Curfew Settings'}
          </button>
        </div>

        {/* Quick Edit Warden Details Drawer */}
        {editingWarden && (
          <form onSubmit={handleSaveWarden} className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Warden Name</label>
              <input
                type="text"
                value={wardenName}
                onChange={(e) => setWardenName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Warden Phone</label>
              <input
                type="text"
                value={wardenPhone}
                onChange={(e) => setWardenPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Night Curfew Time</label>
              <input
                type="time"
                value={curfewTime}
                onChange={(e) => setCurfewTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs"
              >
                Save Settings
              </button>
            </div>
          </form>
        )}

        {/* Warden PG Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Occupants</span>
            <p className="text-xl font-bold text-white mt-0.5">{totalOccupants} / {currentPg.capacity}</p>
          </div>
          <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/20 text-center">
            <span className="text-[11px] text-emerald-400 uppercase font-semibold">Inside PG</span>
            <p className="text-xl font-bold text-emerald-300 mt-0.5">{currentlyInside}</p>
          </div>
          <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-500/20 text-center">
            <span className="text-[11px] text-amber-400 uppercase font-semibold">Outside PG</span>
            <p className="text-xl font-bold text-amber-300 mt-0.5">{currentlyOutside}</p>
          </div>
          <div className="bg-red-950/30 p-3 rounded-xl border border-red-500/20 text-center">
            <span className="text-[11px] text-red-400 uppercase font-semibold">Late Entry Alerts</span>
            <p className="text-xl font-bold text-red-400 mt-0.5">{lateEntriesCount}</p>
          </div>
        </div>
      </div>

      {/* Visitor Requests Approval Panel */}
      {pgVisitors.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">Visitor Approval Requests ({currentPg.name})</h3>
          </div>
          <div className="space-y-2">
            {pgVisitors.map((vis) => (
              <div
                key={vis.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 gap-3 text-xs"
              >
                <div>
                  <p className="font-bold text-white">
                    Visitor: {vis.visitorName} ({vis.visitorPhone})
                  </p>
                  <p className="text-slate-400 mt-0.5">
                    Visiting Host: <strong className="text-cyan-300">{vis.hostResidentName}</strong> (Room {vis.hostRoom}) • Purpose: {vis.purpose}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {vis.approvalStatus === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => updateVisitorStatus(vis.id, 'APPROVED')}
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => updateVisitorStatus(vis.id, 'REJECTED')}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-2.5 py-1 rounded font-bold uppercase text-[10px] ${
                        vis.approvalStatus === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {vis.approvalStatus}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Resident Directory for this PG */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-white text-base">PG Resident Occupant List</h3>
            <p className="text-xs text-slate-400">Live movement status for residents of {currentPg.name}</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search resident or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {filteredResidents.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No residents found in this PG.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Resident</th>
                  <th className="p-3">Room</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">ID Proof</th>
                  <th className="p-3">Emergency Contact</th>
                  <th className="p-3">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredResidents.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-950/40">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img src={r.photoUrl} alt={r.name} className="w-8 h-8 rounded-lg object-cover border border-slate-700" />
                        <div>
                          <p className="font-bold text-white">{r.name}</p>
                          <p className="text-[11px] text-slate-400">{r.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-cyan-300">Room {r.roomNumber}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          r.status === 'IN'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">
                      <span className="font-medium text-slate-200">{r.idType}</span>
                      <span className="block font-mono text-[10px] text-slate-500">{r.idNumber}</span>
                    </td>
                    <td className="p-3">
                      <p className="text-slate-200 font-medium">{r.emergencyContactName}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" /> {r.emergencyContactPhone}
                      </p>
                    </td>
                    <td className="p-3 text-slate-400 font-mono">
                      {new Date(r.lastMovementTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Late Entries History Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-white text-base">Late Entry Log ({currentPg.name})</h3>
          </div>
          <span className="text-xs text-slate-400">Filtered by curfew ({currentPg.curfewTime})</span>
        </div>

        <div className="space-y-2">
          {pgLogs.filter((l) => l.isLateEntry).length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No late entries recorded for this PG today.</p>
          ) : (
            pgLogs
              .filter((l) => l.isLateEntry)
              .map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">
                      {log.residentName} (Room {log.roomNumber})
                    </p>
                    <p className="text-slate-300 text-[11px] mt-0.5">{log.notes}</p>
                  </div>
                  <span className="font-mono text-red-400 font-bold">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};
