import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { Resident, IDType } from '../types';
import { X, Edit3 } from 'lucide-react';

interface EditResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  resident: Resident | null;
}

export const EditResidentModal: React.FC<EditResidentModalProps> = ({ isOpen, onClose, resident }) => {
  const { pgs, updateResident } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pgId, setPgId] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [idType, setIdType] = useState<IDType>('Aadhaar');
  const [idNumber, setIdNumber] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  useEffect(() => {
    if (resident) {
      setName(resident.name);
      setPhone(resident.phone);
      setPgId(resident.pgId);
      setRoomNumber(resident.roomNumber);
      setIdType(resident.idType);
      setIdNumber(resident.idNumber);
      setEmergencyContactName(resident.emergencyContactName);
      setEmergencyContactPhone(resident.emergencyContactPhone);
    }
  }, [resident]);

  if (!isOpen || !resident) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPg = pgs.find((p) => p.id === pgId);
    if (!selectedPg) return;

    updateResident(resident.id, {
      name,
      phone,
      pgId,
      pgName: selectedPg.name,
      roomNumber,
      idType,
      idNumber,
      emergencyContactName,
      emergencyContactPhone,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-xl">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Edit Resident Details</h3>
              <p className="text-xs text-slate-400">Update profile for {resident.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">PG Accommodation</label>
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
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Room Number</label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">ID Type</label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value as IDType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="Aadhaar">Aadhaar Card</option>
                <option value="PAN">PAN Card</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
                <option value="Voter ID">Voter ID</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">ID Document Number</label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Emergency Contact</label>
              <input
                type="text"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Emergency Phone</label>
              <input
                type="text"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl"
            >
              Update Resident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
