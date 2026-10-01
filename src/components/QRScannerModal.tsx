import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, QrCode, LogIn, LogOut, Camera, CameraOff, AlertTriangle, CheckCircle, Upload, FileImage } from 'lucide-react';
import type { Resident } from '../types';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const { residents, userAccounts, pgs, markMovement, addResident } = useApp();
  const [scannedResident, setScannedResident] = useState<Resident | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scannerContainerId = 'reader';

  // Process scanned decoded text (e.g. JSON string, "usr-123", "res-101", "Sparsh Kumar Arya")
  const processDecodedText = (decodedText: string) => {
    let searchId = decodedText.trim();
    let searchName = '';
    let searchPhone = '';
    let parsedObj: any = null;

    // Attempt JSON parsing if payload is JSON
    try {
      if (decodedText.trim().startsWith('{')) {
        parsedObj = JSON.parse(decodedText.trim());
        if (parsedObj.id) searchId = String(parsedObj.id).trim();
        if (parsedObj.name) searchName = String(parsedObj.name).trim();
        if (parsedObj.phone) searchPhone = String(parsedObj.phone).trim();
      }
    } catch (e) {
      // Raw string format
    }

    const textClean = searchId.toLowerCase();
    const nameClean = searchName.toLowerCase();
    const phoneClean = searchPhone.replace(/\D/g, '');

    // 1. Match in residents list
    let found = residents.find((r) => {
      const rId = r.id.toLowerCase().trim();
      const rName = r.name.toLowerCase().trim();
      const rPhone = r.phone.replace(/\D/g, '');
      const rRoom = r.roomNumber.toLowerCase().trim();

      return (
        (textClean && rId === textClean) ||
        (textClean && rId.includes(textClean)) ||
        (nameClean && rName === nameClean) ||
        (nameClean && rName.includes(nameClean)) ||
        (phoneClean && rPhone && rPhone.includes(phoneClean)) ||
        (textClean && rName.includes(textClean)) ||
        (textClean && rRoom === textClean)
      );
    });

    // 2. Fallback match in user accounts list if newly registered account
    if (!found) {
      const userMatch = userAccounts.find((u) => {
        const uId = u.id.toLowerCase().trim();
        const uName = u.name.toLowerCase().trim();
        const uPhone = u.phone.replace(/\D/g, '');

        return (
          (textClean && uId === textClean) ||
          (nameClean && uName === nameClean) ||
          (phoneClean && uPhone && uPhone.includes(phoneClean)) ||
          (textClean && uName.includes(textClean))
        );
      });

      if (userMatch) {
        const selectedPg = pgs.find((p) => p.id === (userMatch.pgId || 'pg-1'));
        found = {
          id: userMatch.id,
          name: userMatch.name,
          phone: userMatch.phone,
          pgId: userMatch.pgId || 'pg-1',
          pgName: userMatch.pgName || selectedPg?.name || 'Gulmohar Haven PG',
          roomNumber: userMatch.roomNumber || '101-A',
          idType: 'Aadhaar',
          idNumber: 'VERIFIED-ONLINE',
          photoUrl: userMatch.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          emergencyContactName: 'Guardian',
          emergencyContactPhone: userMatch.phone,
          moveInDate: new Date().toISOString().slice(0, 10),
          status: 'IN',
          lastMovementTime: new Date().toISOString(),
          active: true,
        };
      }
    }

    // 3. Fallback: Hydrate resident directly from valid QR Payload
    if (!found && parsedObj && (parsedObj.id || parsedObj.name)) {
      const resId = String(parsedObj.id || `res-${Date.now()}`).trim();
      const resName = String(parsedObj.name || 'Scanned Resident').trim();
      const resPhone = String(parsedObj.phone || '+91 00000 00000').trim();
      const resPgName = String(parsedObj.pg || 'Gulmohar Haven PG').trim();
      const resRoom = String(parsedObj.room || '101').trim();

      const selectedPg = pgs.find(
        (p) => p.name.toLowerCase() === resPgName.toLowerCase() || p.id === (parsedObj.pgId || 'pg-1')
      );

      const hydratedRes: Resident = {
        id: resId,
        name: resName,
        phone: resPhone,
        pgId: selectedPg?.id || 'pg-1',
        pgName: resPgName,
        roomNumber: resRoom,
        idType: 'Aadhaar',
        idNumber: 'VERIFIED-QR-PASS',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        emergencyContactName: 'Guardian',
        emergencyContactPhone: resPhone,
        moveInDate: new Date().toISOString().slice(0, 10),
        status: 'IN',
        lastMovementTime: new Date().toISOString(),
        active: true,
      };

      addResident(hydratedRes);
      found = hydratedRes;
    }

    if (found) {
      setScannedResident(found);
      setScanMessage(`Scanned successfully: ${found.name} (${found.pgName}, Room ${found.roomNumber})`);
      setCameraError(null);
    } else {
      setCameraError(`Unrecognized QR payload: "${decodedText}". Try searching name or room number below.`);
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
          fps: 20,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1.0,
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
        'Unable to access camera. Please allow camera permissions or upload/type the QR pass below.'
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

  // Handle File Upload Scanning
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      const html5Qrcode = new Html5Qrcode('reader-file');
      const decodedText = await html5Qrcode.scanFile(file, true);
      processDecodedText(decodedText);
    } catch (err) {
      setCameraError(`Could not decode QR code from uploaded image file.`);
    }
  };

  useEffect(() => {
    if (isOpen) {
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
        
        {/* Hidden Div & Input for File Scanner */}
        <div id="reader-file" className="hidden"></div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

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
          <div className="relative w-full min-h-[230px] bg-slate-950 border-2 border-dashed border-amber-500/40 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
            <div id={scannerContainerId} className="w-full h-full"></div>

            {!cameraActive && (
              <div className="p-4 text-center space-y-2">
                <CameraOff className="w-10 h-10 mx-auto text-slate-600" />
                <p className="text-xs text-slate-400 font-medium">Camera preview inactive</p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={startCamera}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" /> Start Camera
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 border border-slate-700"
                  >
                    <FileImage className="w-3.5 h-3.5 text-cyan-400" /> Scan Image File
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Camera Error Alert */}
          {cameraError && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="font-semibold">{cameraError}</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] bg-red-900/60 hover:bg-red-800 text-red-100 px-2 py-1 rounded font-bold shrink-0"
              >
                Upload File
              </button>
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
            <div className="flex items-center justify-between">
              <label className="text-[11px] text-slate-400 font-semibold">
                Or enter Pass ID, Name or Room Number:
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Upload className="w-3 h-3" /> Upload QR Screenshot
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Sparsh or res-101 or 101-A"
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
              {residents.slice(0, 6).map((r) => (
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
