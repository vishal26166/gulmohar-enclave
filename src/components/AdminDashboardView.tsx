import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Resident, Role, UserAccount } from '../types';
import { Building2, Users, UserPlus, Download, ShieldCheck, History, Search, Trash2, Edit3, Siren, RefreshCw, FileText, UserCheck, X, Eye, Check } from 'lucide-react';

interface AdminDashboardViewProps {
  onOpenAddResident: () => void;
  onOpenEditResident: (resident: Resident) => void;
  onOpenEmergency: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onOpenAddResident,
  onOpenEditResident,
  onOpenEmergency,
}) => {
  const {
    pgs,
    residents,
    movementLogs,
    auditLogs,
    visitors,
    updateVisitorStatus,
    userAccounts,
    setRole,
    setActivePgId,
    deleteResident,
    updatePGDetails,
    exportResidentsCSV,
    exportLogsCSV,
    resetToInitialData,
    registerUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'RESIDENTS' | 'PGS' | 'WARDENS' | 'HEADCOUNT' | 'AUDIT'>('RESIDENTS');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPgFilter, setSelectedPgFilter] = useState('ALL');
  const [editingPgId, setEditingPgId] = useState<string | null>(null);

  // PG Edit state
  const [editPgName, setEditPgName] = useState('');
  const [editTotalRooms, setEditTotalRooms] = useState<number>(0);
  const [editCapacity, setEditCapacity] = useState<number>(0);
  const [editWardenName, setEditWardenName] = useState('');
  const [editWardenPhone, setEditWardenPhone] = useState('');
  const [editCurfew, setEditCurfew] = useState('');

  // Staff Modal State
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('warden123');
  const [staffRole, setStaffRole] = useState<Role>('WARDEN');
  const [staffPgId, setStaffPgId] = useState(pgs[0]?.id || 'pg-1');

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPg = pgs.find((p) => p.id === staffPgId);

    const newStaff: UserAccount = {
      id: `usr-${Date.now()}`,
      name: staffName,
      phone: staffPhone,
      email: staffEmail,
      password: staffPassword,
      role: staffRole,
      pgId: staffRole === 'WARDEN' ? staffPgId : undefined,
      pgName: staffRole === 'WARDEN' ? selectedPg?.name : undefined,
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    };

    registerUser(newStaff);
    alert(`Successfully registered ${staffRole} account for ${staffName}!`);
    setStaffName('');
    setStaffPhone('');
    setStaffEmail('');
    setStaffPassword('warden123');
    setIsStaffModalOpen(false);
  };

  const filteredResidents = residents.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm) ||
      r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.pgName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPg = selectedPgFilter === 'ALL' || r.pgId === selectedPgFilter;
    return matchesSearch && matchesPg;
  });

  const totalResidents = residents.length;
  const currentlyIn = residents.filter((r) => r.status === 'IN').length;
  const currentlyOut = residents.filter((r) => r.status === 'OUT').length;
  const lateEntriesToday = movementLogs.filter((l) => l.isLateEntry).length;

  const handleStartEditPg = (pgId: string) => {
    const pg = pgs.find((p) => p.id === pgId);
    if (pg) {
      setEditingPgId(pgId);
      setEditPgName(pg.name);
      setEditTotalRooms(pg.totalRooms);
      setEditCapacity(pg.capacity);
      setEditWardenName(pg.wardenName);
      setEditWardenPhone(pg.wardenPhone);
      setEditCurfew(pg.curfewTime);
    }
  };

  const handleSavePg = (pgId: string) => {
    updatePGDetails(pgId, {
      name: editPgName,
      totalRooms: Number(editTotalRooms),
      capacity: Number(editCapacity),
      wardenName: editWardenName,
      wardenPhone: editWardenPhone,
      curfewTime: editCurfew,
    });
    setEditingPgId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Society Header & Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Society Admin & Committee Control</h2>
                <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  Master Access
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Gulmohar Enclave • Total PGs Managed: <strong className="text-white">22 Accommodations</strong>
              </p>
            </div>
          </div>

          {/* Quick Action Export & Staff Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsStaffModalOpen(true)}
              className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              + Provision Staff Account
            </button>
            <button
              onClick={exportResidentsCSV}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-3 py-2 rounded-xl text-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Export Residents CSV
            </button>
            <button
              onClick={exportLogsCSV}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-3 py-2 rounded-xl text-xs transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Export Gate Logs CSV
            </button>
            <button
              onClick={onOpenAddResident}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Register Resident
            </button>
          </div>
        </div>

        {/* Executive Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Total PGs</span>
            <p className="text-xl font-bold text-white mt-0.5">22</p>
          </div>
          <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/20 text-center">
            <span className="text-[11px] text-emerald-400 uppercase font-semibold">Residents INSIDE</span>
            <p className="text-xl font-bold text-emerald-300 mt-0.5">{currentlyIn} / {totalResidents}</p>
          </div>
          <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-500/20 text-center">
            <span className="text-[11px] text-amber-400 uppercase font-semibold">Residents OUTSIDE</span>
            <p className="text-xl font-bold text-amber-300 mt-0.5">{currentlyOut}</p>
          </div>
          <div className="bg-red-950/30 p-3 rounded-xl border border-red-500/20 text-center">
            <span className="text-[11px] text-red-400 uppercase font-semibold">Curfew Flags Today</span>
            <p className="text-xl font-bold text-red-400 mt-0.5">{lateEntriesToday}</p>
          </div>
        </div>
      </div>

      {/* Admin Tabs Bar */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('RESIDENTS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap ${
            activeTab === 'RESIDENTS'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Resident Directory ({totalResidents})
        </button>

        <button
          onClick={() => setActiveTab('PGS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap ${
            activeTab === 'PGS'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          22 PGs Setup
        </button>

        <button
          onClick={() => setActiveTab('WARDENS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap ${
            activeTab === 'WARDENS'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Eye className="w-4 h-4 text-cyan-400" />
          Warden Real-Time Monitor
        </button>

        <button
          onClick={() => setActiveTab('HEADCOUNT')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap ${
            activeTab === 'HEADCOUNT'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Siren className="w-4 h-4 text-red-300 animate-pulse" />
          Emergency Headcount Matrix
        </button>

        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap ${
            activeTab === 'AUDIT'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          Audit Trail (F9)
        </button>
      </div>

      {/* TAB 1: RESIDENTS DIRECTORY */}
      {activeTab === 'RESIDENTS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search resident name, room, phone or PG..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={selectedPgFilter}
                onChange={(e) => setSelectedPgFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All 22 PGs</option>
                {pgs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <button
                onClick={onOpenAddResident}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Resident
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Resident</th>
                  <th className="p-3">PG & Room</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">ID Document</th>
                  <th className="p-3">Emergency Contact</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredResidents.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-950/40">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={r.photoUrl} alt={r.name} className="w-9 h-9 rounded-xl object-cover border border-slate-700" />
                        <div>
                          <p className="font-bold text-white">{r.name}</p>
                          <p className="text-[11px] text-slate-400">{r.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-200">{r.pgName}</p>
                      <p className="text-[11px] font-mono text-cyan-300">Room {r.roomNumber}</p>
                    </td>
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
                    <td className="p-3">
                      <span className="font-medium text-slate-200">{r.idType}</span>
                      <span className="block font-mono text-[10px] text-slate-400">{r.idNumber}</span>
                    </td>
                    <td className="p-3">
                      <p className="text-slate-200">{r.emergencyContactName}</p>
                      <p className="text-[11px] text-slate-400">{r.emergencyContactPhone}</p>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onOpenEditResident(r)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                          title="Edit Resident"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to remove resident ${r.name}?`)) {
                              deleteResident(r.id);
                            }
                          }}
                          className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg"
                          title="Remove Resident"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: 22 PGS SETUP */}
      {activeTab === 'PGS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">22 PGs Warden Directory & Curfew Setup</h3>
            <span className="text-xs text-slate-400">All PGs linked to Gulmohar Enclave</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pgs.map((pg) => {
              const countIn = residents.filter((r) => r.pgId === pg.id && r.status === 'IN').length;
              const countTotal = residents.filter((r) => r.pgId === pg.id).length;
              const isEditing = editingPgId === pg.id;

              return (
                <div key={pg.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white text-base">{pg.name}</h4>
                      <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono font-bold">
                        {countIn} / {countTotal} INSIDE
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2 mt-3 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">PG Building Name</label>
                          <input
                            type="text"
                            value={editPgName}
                            onChange={(e) => setEditPgName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">Total Rooms</label>
                            <input
                              type="number"
                              value={editTotalRooms}
                              onChange={(e) => setEditTotalRooms(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                              min={1}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">Total Capacity (Beds)</label>
                            <input
                              type="number"
                              value={editCapacity}
                              onChange={(e) => setEditCapacity(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                              min={1}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Warden Name</label>
                          <input
                            type="text"
                            value={editWardenName}
                            onChange={(e) => setEditWardenName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Warden Contact Phone</label>
                          <input
                            type="text"
                            value={editWardenPhone}
                            onChange={(e) => setEditWardenPhone(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Night Curfew Time</label>
                          <input
                            type="time"
                            value={editCurfew}
                            onChange={(e) => setEditCurfew(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                          />
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleSavePg(pg.id)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition-all cursor-pointer"
                          >
                            Save PG Details
                          </button>
                          <button
                            onClick={() => setEditingPgId(null)}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-xl text-xs transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs space-y-1.5 text-slate-300 mt-2">
                        <p>
                          Warden: <strong className="text-white">{pg.wardenName}</strong>
                        </p>
                        <p className="text-slate-400">Phone: {pg.wardenPhone}</p>
                        <p>
                          Night Curfew: <strong className="text-amber-400">{pg.curfewTime}</strong>
                        </p>
                        <p className="text-slate-400">
                          Capacity: <strong className="text-indigo-300">{pg.capacity} beds</strong> ({pg.totalRooms} rooms)
                        </p>
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => handleStartEditPg(pg.id)}
                      className="mt-4 w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit PG, Beds & Warden Setup
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: WARDEN REAL-TIME MONITOR */}
      {activeTab === 'WARDENS' && (
        <div className="space-y-6">
          
          {/* Warden Monitor Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-cyan-400" />
                  Live Warden Activity & Visitor Approval Center
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time monitoring of all 22 PG wardens, live resident counts, curfew compliance, and pending visitor approvals.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs px-3 py-1 rounded-full font-mono font-bold animate-pulse">
                  ● LIVE DATA STREAM
                </span>
              </div>
            </div>

            {/* Wardens Real-Time Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {pgs.map((pg) => {
                const pgRes = residents.filter((r) => r.pgId === pg.id);
                const countIn = pgRes.filter((r) => r.status === 'IN').length;
                const countOut = pgRes.filter((r) => r.status === 'OUT').length;
                const countLate = movementLogs.filter((l) => l.pgId === pg.id && l.isLateEntry).length;
                const pendingVisitors = visitors.filter((v) => {
                  const host = residents.find((r) => r.id === v.hostResidentId);
                  return host?.pgId === pg.id && v.approvalStatus === 'PENDING';
                });

                const wardenUser = userAccounts.find(
                  (u) => u.role === 'WARDEN' && u.pgId === pg.id
                );

                return (
                  <div key={pg.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
                        <div>
                          <h4 className="font-bold text-white text-sm">{pg.name}</h4>
                          <p className="text-[11px] text-slate-400 font-mono">Curfew: <strong className="text-amber-400">{pg.curfewTime}</strong></p>
                        </div>
                        <button
                          onClick={() => {
                            setActivePgId(pg.id);
                            setRole('WARDEN');
                          }}
                          className="px-2.5 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                          title="Switch to live Warden View for this PG"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect Live
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={wardenUser?.photoUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'}
                          alt={pg.wardenName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <p className="font-bold text-slate-200 text-xs">{pg.wardenName}</p>
                          <p className="text-[11px] text-slate-400">{pg.wardenPhone}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono font-bold mb-2">
                        <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300">
                          {countIn} INSIDE
                        </div>
                        <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300">
                          {countOut} OUTSIDE
                        </div>
                        <div className="p-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
                          {countLate} LATE
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Pending Visitors:</span>
                      {pendingVisitors.length > 0 ? (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold rounded-full animate-pulse">
                          ⚠️ {pendingVisitors.length} Awaiting Approval
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-semibold">✓ None Pending</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Visitor Approvals Master Control */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              Live Warden Visitor Approvals Desk
            </h3>

            {visitors.filter((v) => v.approvalStatus === 'PENDING').length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6 bg-slate-950 rounded-xl border border-slate-800">
                No pending visitor requests awaiting approval across all 22 PGs.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {visitors
                  .filter((v) => v.approvalStatus === 'PENDING')
                  .map((vis) => (
                    <div key={vis.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{vis.visitorName}</span>
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                          PENDING
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 space-y-0.5">
                        <p>Phone: <span className="font-mono text-slate-400">{vis.visitorPhone}</span></p>
                        <p>Purpose: <span className="text-slate-400">{vis.purpose}</span></p>
                        <p>Host: <strong className="text-cyan-300">{vis.hostResidentName}</strong> ({vis.hostPgName}, Room {vis.hostRoom})</p>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => updateVisitorStatus(vis.id, 'APPROVED')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => updateVisitorStatus(vis.id, 'REJECTED')}
                          className="flex-1 bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: EMERGENCY HEADCOUNT MATRIX */}
      {activeTab === 'HEADCOUNT' && (
        <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Siren className="w-6 h-6 text-red-500 animate-spin" style={{ animationDuration: '4s' }} />
              <div>
                <h3 className="font-bold text-white text-base">Emergency Headcount Safety Matrix (F15)</h3>
                <p className="text-xs text-slate-400">Live breakdown of people inside each PG for fire/medical evacuation</p>
              </div>
            </div>
            <button
              onClick={onOpenEmergency}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-xl border border-red-400 shadow-lg shadow-red-600/30 flex items-center gap-1.5"
            >
              <Siren className="w-4 h-4" />
              Trigger Emergency Manifest
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {pgs.map((pg) => {
              const inCount = residents.filter((r) => r.pgId === pg.id && r.status === 'IN').length;
              const totalCount = residents.filter((r) => r.pgId === pg.id).length;

              return (
                <div key={pg.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                  <p className="font-bold text-xs text-white truncate">{pg.name}</p>
                  <p className="text-2xl font-extrabold text-emerald-400 my-1">{inCount}</p>
                  <p className="text-[10px] text-slate-400">
                    of {totalCount} residents inside
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL */}
      {activeTab === 'AUDIT' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Immutable Audit Trail (F9)</h3>
              <p className="text-xs text-slate-400">Complete immutable record of gate movements, admin edits, and warden alerts</p>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300">{log.action}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-300">{log.details}</p>
                <p className="text-[10px] text-slate-500">Performed by: {log.userName} ({log.userRole})</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => {
                if (confirm('Reset all demo database data to factory initial state?')) {
                  resetToInitialData();
                }
              }}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-950/40 border border-red-500/30 px-3 py-1.5 rounded-lg"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset System Data
            </button>
          </div>
        </div>
      )}
      {/* Admin Staff & Warden Provisioning Modal */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-xl">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Provision New Staff Account</h3>
                  <p className="text-xs text-slate-400">Register new PG Warden or Gate Guard login credentials</p>
                </div>
              </div>
              <button onClick={() => setIsStaffModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStaffSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Staff Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Chandra Sharma"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={staffPhone}
                    onChange={(e) => setStaffPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Email Address *</label>
                  <input
                    type="email"
                    placeholder="warden@gulmohar.com"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Assigned Initial Password *</label>
                  <input
                    type="text"
                    placeholder="e.g. warden123"
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Staff Role *</label>
                  <select
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value as Role)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-500"
                  >
                    <option value="WARDEN">PG Warden</option>
                    <option value="GUARD">Gate Guard</option>
                  </select>
                </div>
              </div>

              {staffRole === 'WARDEN' && (
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Assigned PG Accommodation *</label>
                  <select
                    value={staffPgId}
                    onChange={(e) => setStaffPgId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-500"
                  >
                    {pgs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-cyan-600/20"
                >
                  Save & Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
