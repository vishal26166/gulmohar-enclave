import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, QrCode, Scan, LogIn, LogOut } from 'lucide-react';
import type { Resident } from '../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const { residents, markMovement } = useApp();
  const [scannedResident, setScannedResident] = useState<Resident | null>(null);

  if (!isOpen) return null;

  const handleSimulateScan = (resident: Resident) => {
    setScannedResident(resident);
  };

  const handleAction = (type: 'IN' | 'OUT') => {
    if (!scannedResident) return;
    const res = markMovement(scannedResident.id, type);
    if (res.success) {
      alert(`Gate ${type} recorded for ${scannedResident.name}! ${res.isLate ? '⚠️ LATE ENTRY FLAGGED!' : ''}`);
      setScannedResident(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-sm">Gate Scanner Terminal (QR / RFID)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-center">
          
          {/* Simulated Camera Viewfinder */}
          <div className="relative w-full h-48 bg-slate-950 border-2 border-dashed border-amber-500/40 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-amber-500/10 animate-pulse"></div>
            <Scan className="w-16 h-16 text-amber-400 animate-bounce" />
            <p className="text-xs text-slate-400 mt-2 font-mono">Point camera at Resident QR code or tap below</p>
          </div>

          {/* Quick Scanner Selection for Testing */}
          <div>
            <p className="text-xs text-slate-400 mb-2 font-semibold">Simulate Scanner Input (Select Resident):</p>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {residents.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleSimulateScan(r)}
                  className={`w-full text-left p-2 rounded-xl border text-xs flex items-center justify-between transition-all ${
                    scannedResident?.id === r.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold">{r.name}</span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {r.pgName} (Room {r.roomNumber}) - [{r.status}]
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Scanned Card Details & Action Buttons */}
          {scannedResident && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/40 text-left space-y-3">
              <div className="flex items-center gap-3">
                <img src={scannedResident.photoUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                <div>
                  <h4 className="font-bold text-white text-sm">{scannedResident.name}</h4>
                  <p className="text-xs text-amber-400 font-medium">{scannedResident.pgName} - Rm {scannedResident.roomNumber}</p>
                  <p className="text-[10px] text-slate-400">Status: <strong className="text-white">{scannedResident.status}</strong></p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleAction('IN')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1"
                >
                  <LogIn className="w-4 h-4" /> Mark ENTRY
                </button>
                <button
                  onClick={() => handleAction('OUT')}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1"
                >
                  <LogOut className="w-4 h-4" /> Mark EXIT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
