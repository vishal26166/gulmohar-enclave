import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, QrCode, LogIn, LogOut, Camera, CameraOff, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Resident } from '../types';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const { residents, markMovement } = useApp();
  const [scannedResident, setScannedResident] = useState<Resident | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'reader';

  // Process scanned decoded text (e.g. "res-101" or JSON or resident name)
  const processDecodedText = (decodedText: string) => {
    const textLower = decodedText.trim().toLowerCase();

    // Match resident by ID, Name, Phone, Room or ID Number
    const found = residents.find(
      (r) =>
        r.id.toLowerCase() === textLower ||
        r.name.toLowerCase() === textLower ||
        r.phone.toLowerCase() === textLower ||
        r.roomNumber.toLowerCase() === textLower ||
        r.idNumber.toLowerCase() === textLower ||
        textLower.includes(r.id.toLowerCase())
    );

    if (found) {
      setScannedResident(found);
      setScanMessage(`Scanned successfully: ${found.name} (${found.pgName}, Room ${found.roomNumber})`);
      setCameraError(null);
    } else {
      setCameraError(`Unrecognized QR code or Resident Pass ID: "${decodedText}"`);
    }
  };

  // Start Camera Scanning
  const startCamera = async () => {
    try {
      setCameraError(null);
      if (!html5QrcodeRef.current) {
        html5QrcodeRef.current = new Html5Qrcode(scannerContainerId);
      }

      await html5QrcodeRef.current.start(
        { facingMode: 'environment' }, // Rear camera on mobile
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
        },
        (decodedText) => {
          processDecodedText(decodedText);
        },
        () => {
          // ignore scan errors per frame
        }
      );
      setCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraActive(false);
      setCameraError(
        'Unable to access camera. Please check camera permissions or select a resident manually below.'
      );
    }
  };

  // Stop Camera
  const stopCamera = async () => {
    if (html5QrcodeRef.current && cameraActive) {
      try {
        await html5QrcodeRef.current.stop();
      } catch (err) {
        console.error('Error stopping camera:', err);
      }
      setCameraActive(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Auto-start camera when modal opens
      setTimeout(() => {
        startCamera();
      }, 300);
    } else {
      stopCamera();
      setScannedResident(null);
      setScanMessage(null);
      setCameraError(null);
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    processDecodedText(manualInput);
    setManualInput('');
  };

  const handleGateAction = (type: 'IN' | 'OUT') => {
    if (!scannedResident) return;
    const res = markMovement(scannedResident.id, type);
    if (res.success) {
      alert(
        `Gate ${type} recorded for ${scannedResident.name}! ${
          res.isLate ? '⚠️ LATE ENTRY FLAGGED!' : ''
        }`
      );
      stopCamera();
      setScannedResident(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-sm">Gate QR Scanner Terminal</h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-white rounded bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          
          {/* Live Camera Viewfinder Box */}
          <div className="relative w-full min-h-[220px] bg-slate-950 border-2 border-dashed border-amber-500/40 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
            <div id={scannerContainerId} className="w-full h-full"></div>

            {!cameraActive && (
              <div className="p-4 text-center space-y-2">
                <CameraOff className="w-10 h-10 mx-auto text-slate-600" />
                <p className="text-xs text-slate-400 font-medium">Camera preview inactive</p>
                <button
                  onClick={startCamera}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 mx-auto"
                >
                  <Camera className="w-3.5 h-3.5" /> Start Web Camera
                </button>
              </div>
            )}
          </div>

          {/* Camera Error Alert */}
          {cameraError && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{cameraError}</p>
              </div>
            </div>
          )}

          {/* Scan Success Message */}
          {scanMessage && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="font-semibold">{scanMessage}</p>
            </div>
          )}

          {/* Scanned Resident Result Box */}
          {scannedResident && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/40 text-left space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={scannedResident.photoUrl}
                  alt={scannedResident.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{scannedResident.name}</h4>
                  <p className="text-xs text-amber-400 font-medium">
                    {scannedResident.pgName} - Rm {scannedResident.roomNumber}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Current Status: <strong className="text-white">{scannedResident.status}</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleGateAction('IN')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" /> Mark ENTRY
                </button>
                <button
                  onClick={() => handleGateAction('OUT')}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Mark EXIT
                </button>
              </div>
            </div>
          )}

          {/* Manual Input Search Fallback */}
          <form onSubmit={handleManualSubmit} className="pt-2 border-t border-slate-800 space-y-2">
            <label className="text-[11px] text-slate-400 font-semibold block">
              Or enter Pass ID / Room Number manually:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. res-101 or 101-A or Aarav"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700"
              >
                Scan Code
              </button>
            </div>
          </form>

          {/* Quick Demo Selectors */}
          <div className="pt-2 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-400 mb-1.5 font-semibold">Test Scanner Simulation:</p>
            <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
              {residents.slice(0, 5).map((r) => (
                <button
                  key={r.id}
                  onClick={() => processDecodedText(r.id)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-[11px] text-slate-300 flex justify-between"
                >
                  <span className="font-bold">{r.name}</span>
                  <span className="font-mono text-[10px] text-amber-400">{r.id} (Rm {r.roomNumber})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
