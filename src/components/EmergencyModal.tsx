import React from 'react';
import { useApp } from '../context/AppContext';
import { Siren, X, Download, AlertTriangle } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const { pgs, residents } = useApp();

  if (!isOpen) return null;

  const occupantsInside = residents.filter((r) => r.status === 'IN');
  const occupantsOutside = residents.filter((r) => r.status === 'OUT');

  const downloadEmergencyManifest = () => {
    const headers = ['PG Name', 'Room', 'Resident Name', 'Resident Phone', 'Status', 'Emergency Contact Name', 'Emergency Contact Phone'];
    const rows = occupantsInside.map((r) => [
      `"${r.pgName}"`,
      `"${r.roomNumber}"`,
      `"${r.name}"`,
      `"${r.phone}"`,
      r.status,
      `"${r.emergencyContactName}"`,
      `"${r.emergencyContactPhone}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EMERGENCY_HEADCOUNT_MANIFEST_${new Date().toISOString().slice(0, 19)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-red-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-red-500 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-rose-700 p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Siren className="w-7 h-7 text-white animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-wide uppercase">Emergency Headcount Manifest</h3>
              <p className="text-xs text-red-100">Live evacuation count across 22 Gulmohar Enclave PGs</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white hover:bg-white/20 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
          
          {/* Summary Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
            <div className="bg-red-950/40 border border-red-500/30 p-3 rounded-2xl">
              <span className="text-xs text-red-300 uppercase font-semibold">Total People INSIDE</span>
              <p className="text-3xl font-extrabold text-red-400 mt-1">{occupantsInside.length}</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total People OUTSIDE</span>
              <p className="text-3xl font-extrabold text-slate-200 mt-1">{occupantsOutside.length}</p>
            </div>
            <div className="bg-amber-950/30 border border-amber-500/30 p-3 rounded-2xl">
              <span className="text-xs text-amber-300 uppercase font-semibold">Active PGs Occupied</span>
              <p className="text-3xl font-extrabold text-amber-400 mt-1">22</p>
            </div>
          </div>

          {/* Action Download Manifest */}
          <div className="flex justify-end">
            <button
              onClick={downloadEmergencyManifest}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-red-400 shadow-lg shadow-red-600/30"
            >
              <Download className="w-4 h-4" />
              Download Emergency Evacuation Manifest (CSV)
            </button>
          </div>

          {/* Per PG Live Breakdown */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Live PG Occupancy Breakup
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pgs.map((pg) => {
                const inResidents = residents.filter((r) => r.pgId === pg.id && r.status === 'IN');

                return (
                  <div key={pg.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                      <div>
                        <h5 className="font-bold text-white text-xs">{pg.name}</h5>
                        <p className="text-[10px] text-slate-400">
                          Warden: {pg.wardenName} ({pg.wardenPhone})
                        </p>
                      </div>
                      <span className="text-sm font-extrabold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-mono">
                        {inResidents.length} INSIDE
                      </span>
                    </div>

                    <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                      {inResidents.length === 0 ? (
                        <p className="text-[10px] text-slate-500 text-center py-1">No occupants inside this PG currently.</p>
                      ) : (
                        inResidents.map((r) => (
                          <div key={r.id} className="flex items-center justify-between text-[11px] text-slate-300">
                            <span>
                              Rm {r.roomNumber} - <strong className="text-white">{r.name}</strong>
                            </span>
                            <span className="text-slate-400 text-[10px] font-mono">{r.phone}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
