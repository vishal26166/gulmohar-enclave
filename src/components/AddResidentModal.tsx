import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { IDType } from '../types';
import { X, UserPlus } from 'lucide-react';

interface AddResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddResidentModal: React.FC<AddResidentModalProps> = ({ isOpen, onClose }) => {
  const { pgs, addResident } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pgId, setPgId] = useState(pgs[0]?.id || 'pg-1');
  const [roomNumber, setRoomNumber] = useState('');
  const [idType, setIdType] = useState<IDType>('Aadhaar');
  const [idNumber, setIdNumber] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [moveInDate, setMoveInDate] = useState(new Date().toISOString().slice(0, 10));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPg = pgs.find((p) => p.id === pgId);
    if (!selectedPg) return;

    // Avatar generator placeholder
    const avatarUrl = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`;

    addResident({
      name,
      phone,
      pgId,
      pgName: selectedPg.name,
      roomNumber,
      idType,
      idNumber,
      photoUrl: avatarUrl,
      emergencyContactName,
      emergencyContactPhone,
      moveInDate,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Register New Resident (F1)</h3>
              <p className="text-xs text-slate-400">Add resident details to Gulmohar Enclave database</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          
          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Vikramaditya Rawat"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Phone Number *</label>
              <input
                type="text"
                placeholder="+91 98765 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* PG Assignment & Room Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Assigned PG Accommodation *</label>
              <select
                value={pgId}
                onChange={(e) => setPgId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500"
              >
                {pgs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Room Number *</label>
              <input
                type="text"
                placeholder="e.g. 104-B"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* ID Proof Verification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">ID Proof Type *</label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value as IDType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500"
              >
                <option value="Aadhaar">Aadhaar Card</option>
                <option value="PAN">PAN Card</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
                <option value="Voter ID">Voter ID</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">ID Document Number *</label>
              <input
                type="text"
                placeholder="e.g. 4532 9988 1122"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Emergency Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Emergency Contact Name *</label>
              <input
                type="text"
                placeholder="e.g. Father Name / Guardian"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Emergency Contact Phone *</label>
              <input
                type="text"
                placeholder="+91 98000 99887"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Move in date */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Move-In Date</label>
            <input
              type="date"
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500"
            />
          </div>

          {/* Submit buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/20"
            >
              Save Resident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
