import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, Clock, Home, Send, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { Resident } from '../types';

export const ResidentView: React.FC = () => {
  const { currentUser, residents, movementLogs, addVisitor } = useApp();

  // Find resident matching logged in user
  const loggedInResident = residents.find(
    (r) =>
      r.id === currentUser?.id ||
      r.phone === currentUser?.phone ||
      r.name.toLowerCase() === currentUser?.name.toLowerCase()
  );

  // Fallback resident object if newly registered
  const fallbackResident: Resident = {
    id: currentUser?.id || 'res-new',
    name: currentUser?.name || 'Sparsh Kumar Arya',
    phone: currentUser?.phone || '+91 98000 00000',
    pgId: currentUser?.pgId || 'pg-1',
    pgName: currentUser?.pgName || 'Gulmohar Haven PG',
    roomNumber: currentUser?.roomNumber || '101-A',
    idType: 'Aadhaar',
    idNumber: 'VERIFIED-ONLINE',
    photoUrl: currentUser?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    emergencyContactName: 'Guardian',
    emergencyContactPhone: currentUser?.phone || '',
    moveInDate: new Date().toISOString().slice(0, 10),
    status: 'IN',
    lastMovementTime: new Date().toISOString(),
    active: true,
  };

  const initialResident = loggedInResident || fallbackResident;
  const [selectedResidentId, setSelectedResidentId] = useState<string>(initialResident.id);
  const [showVisitorForm, setShowVisitorForm] = useState(false);

  useEffect(() => {
    if (loggedInResident) {
      setSelectedResidentId(loggedInResident.id);
    }
  }, [currentUser, loggedInResident]);

  const activeResident = residents.find((r) => r.id === selectedResidentId) || initialResident;
  const personalLogs = movementLogs.filter((l) => l.residentId === activeResident?.id);

  // Visitor form state
  const [vName, setVName] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vPurpose, setVPurpose] = useState('');

  const handleVisitorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeResident) return;
    addVisitor({
      visitorName: vName,
      visitorPhone: vPhone,
      purpose: vPurpose,
      hostResidentId: activeResident.id,
      hostResidentName: activeResident.name,
      hostPgName: activeResident.pgName,
      hostRoom: activeResident.roomNumber,
    });
    setVName('');
    setVPhone('');
    setVPurpose('');
    setShowVisitorForm(false);
    alert('Visitor pre-registration request sent to PG Warden for approval!');
  };

  const isAdmin = currentUser?.role === 'ADMIN';

  // Format rich QR Payload for optical scanners
  const qrPayload = JSON.stringify({
    id: activeResident.id,
    name: activeResident.name,
    phone: activeResident.phone,
    room: activeResident.roomNumber,
    pg: activeResident.pgName,
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <User className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-sm font-bold text-white">Resident Mobile Self-Service Portal</h2>
            <p className="text-[11px] text-slate-400">Welcome, <strong className="text-emerald-400">{currentUser?.name || activeResident.name}</strong></p>
          </div>
        </div>

        {/* Demo Selector Header (Visible ONLY to Admin) */}
        {isAdmin && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400">Admin Preview Profile:</span>
            <select
              value={selectedResidentId}
              onChange={(e) => setSelectedResidentId(e.target.value)}
              className="bg-slate-950 text-xs text-emerald-300 font-bold border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              {residents.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.pgName} - Rm {r.roomNumber})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeResident && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Digital ID Card & Gate QR Code Pass */}
          <div className="md:col-span-5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500"></div>

            <div className="relative mt-2">
              <img
                src={activeResident.photoUrl}
                alt={activeResident.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-xl"
              />
              <span
                className={`absolute -bottom-2 -right-2 text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase shadow-lg ${
                  activeResident.status === 'IN'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-amber-500 text-slate-950 border-amber-400'
                }`}
              >
                {activeResident.status}
              </span>
            </div>

            <h3 className="font-bold text-xl text-white mt-4">{activeResident.name}</h3>
            <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1 mt-0.5">
              <Home className="w-3.5 h-3.5" />
              {activeResident.pgName} • Room {activeResident.roomNumber}
            </p>

            {/* Resident Details Table */}
            <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mt-5 space-y-2 text-xs text-left">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Phone:</span>
                <span className="text-white font-medium">{activeResident.phone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">ID Verification ({activeResident.idType}):</span>
                <span className="text-white font-mono">{activeResident.idNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Emergency Contact:</span>
                <span className="text-white font-medium">{activeResident.emergencyContactName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Move-in Date:</span>
                <span className="text-white font-mono">{activeResident.moveInDate}</span>
              </div>
            </div>

            {/* High-Contrast, Large Quiet-Zone Scannable Resident Gate Pass QR Code */}
            <div className="mt-6 w-full bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xl flex flex-col items-center">
              <div className="p-3 bg-white rounded-xl flex items-center justify-center shadow-inner">
                <QRCodeSVG
                  value={qrPayload}
                  size={180}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="L"
                  includeMargin={true}
                />
              </div>
              <p className="text-[11px] text-slate-900 font-black mt-2 font-mono tracking-wider flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                PASS ID: {activeResident.id.toUpperCase()}
              </p>
              <p className="text-[10px] text-slate-600 font-semibold">Point security camera at this QR code to scan</p>
            </div>
          </div>

          {/* Right Column: Personal Logs & Pre-register Visitor */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Quick Action: Pre-register Visitor */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Pre-Register Guest / Visitor</h3>
                  <p className="text-xs text-slate-400">Notify the warden and gate guard of expected guests</p>
                </div>
                <button
                  onClick={() => setShowVisitorForm(!showVisitorForm)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
                >
                  {showVisitorForm ? 'Close' : '+ New Visitor Pass'}
                </button>
              </div>

              {showVisitorForm && (
                <form onSubmit={handleVisitorSubmit} className="mt-4 pt-4 border-t border-slate-800 space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Visitor Name</label>
                    <input
                      type="text"
                      value={vName}
                      onChange={(e) => setVName(e.target.value)}
                      placeholder="e.g. Ramesh Singh"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Visitor Phone Number</label>
                    <input
                      type="text"
                      value={vPhone}
                      onChange={(e) => setVPhone(e.target.value)}
                      placeholder="+91 98000 11122"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Purpose of Visit</label>
                    <input
                      type="text"
                      value={vPurpose}
                      onChange={(e) => setVPurpose(e.target.value)}
                      placeholder="e.g. Family visit / Book delivery"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Visitor Pass Request
                  </button>
                </form>
              )}
            </div>

            {/* Personal Gate Movement History */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white text-base">My Gate Entry / Exit Log</h3>
                </div>
                <span className="text-xs text-slate-400">Total Entries: {personalLogs.length}</span>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto">
                {personalLogs.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">No movement history logged yet.</p>
                ) : (
                  personalLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-xs flex items-center justify-between"
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
                          <p className="font-bold text-white">{log.notes || `${log.type} Gate Pass`}</p>
                          <p className="text-[11px] text-slate-400">Logged by {log.recordedBy}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-slate-300">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="block text-[10px] text-slate-500 font-mono">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
