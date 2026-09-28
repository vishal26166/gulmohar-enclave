import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, PlusCircle } from 'lucide-react';

interface VisitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisitorModal: React.FC<VisitorModalProps> = ({ isOpen, onClose }) => {
  const { residents, addVisitor } = useApp();

  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [hostResidentId, setHostResidentId] = useState(residents[0]?.id || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const host = residents.find((r) => r.id === hostResidentId);
    if (!host) return;

    addVisitor({
      visitorName,
      visitorPhone,
      purpose,
      hostResidentId: host.id,
      hostResidentName: host.name,
      hostPgName: host.pgName,
      hostRoom: host.roomNumber,
    });

    alert(`Visitor ${visitorName} logged! Notification sent to Warden of ${host.pgName}.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-sm">Gate Visitor Registration (F12)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Visitor Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Courier Delivery / Ramesh Kumar"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              required
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Visitor Phone Number *</label>
            <input
              type="text"
              placeholder="+91 98123 45678"
              value={visitorPhone}
              onChange={(e) => setVisitorPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              required
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Host Resident *</label>
            <select
              value={hostResidentId}
              onChange={(e) => setHostResidentId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            >
              {residents.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.pgName} - Rm {r.roomNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Purpose of Visit *</label>
            <input
              type="text"
              placeholder="e.g. Delivery / Family Meeting / Maintenance"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              required
            />
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
              Log Visitor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
