import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Phone, Camera, X, CheckCircle, AlertCircle, Shield } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [photoUrl, setPhotoUrl] = useState(currentUser?.photoUrl || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen || !currentUser) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Profile name cannot be empty.');
      return;
    }

    if (!phone.trim()) {
      setError('Contact phone number cannot be empty.');
      return;
    }

    updateUserProfile(currentUser.id, {
      name: name.trim(),
      phone: phone.trim(),
      photoUrl: photoUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    });

    setSuccess('Profile details and photo updated successfully!');
    setTimeout(() => {
      setSuccess(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <User className="w-4 h-4" />
            Edit Profile Details & Photo
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          {/* Avatar Preview & Photo Upload */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="relative group">
              <img
                src={photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={name}
                className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500 shadow-xl shadow-indigo-500/20"
              />
              <label className="absolute inset-0 bg-slate-950/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6 text-white mb-1" />
                <span className="text-[9px] text-white font-bold uppercase">Change Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-[10px] text-slate-400">Click photo to upload new picture from device</p>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Account Role:</span>
            <span className="font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3 h-3 text-indigo-400" /> {currentUser.role}
            </span>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Contact Phone Number *</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-xs font-mono"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <p>{success}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              Save Profile Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
