import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { GateGuardView } from './components/GateGuardView';
import { WardenDashboardView } from './components/WardenDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { ResidentView } from './components/ResidentView';
import { AddResidentModal } from './components/AddResidentModal';
import { EditResidentModal } from './components/EditResidentModal';
import { QRScannerModal } from './components/QRScannerModal';
import { VisitorModal } from './components/VisitorModal';
import { EmergencyModal } from './components/EmergencyModal';
import type { Resident } from './types';

const MainContent: React.FC = () => {
  const { role } = useApp();

  // Modals state
  const [isAddResidentOpen, setIsAddResidentOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar with role switcher & emergency trigger */}
      <Navbar onOpenEmergency={() => setIsEmergencyModalOpen(true)} />

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {role === 'GUARD' && (
          <GateGuardView
            onOpenQRScanner={() => setIsQRScannerOpen(true)}
            onOpenVisitorModal={() => setIsVisitorModalOpen(true)}
          />
        )}

        {role === 'WARDEN' && <WardenDashboardView />}

        {role === 'ADMIN' && (
          <AdminDashboardView
            onOpenAddResident={() => setIsAddResidentOpen(true)}
            onOpenEditResident={(res) => setEditingResident(res)}
            onOpenEmergency={() => setIsEmergencyModalOpen(true)}
          />
        )}

        {role === 'RESIDENT' && <ResidentView />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        <p>© 2026 Gulmohar Enclave Management System • Dehradun, Uttarakhand • 22 PGs Integrated</p>
      </footer>

      {/* Modals */}
      <AddResidentModal isOpen={isAddResidentOpen} onClose={() => setIsAddResidentOpen(false)} />
      <EditResidentModal
        isOpen={Boolean(editingResident)}
        resident={editingResident}
        onClose={() => setEditingResident(null)}
      />
      <QRScannerModal isOpen={isQRScannerOpen} onClose={() => setIsQRScannerOpen(false)} />
      <VisitorModal isOpen={isVisitorModalOpen} onClose={() => setIsVisitorModalOpen(false)} />
      <EmergencyModal isOpen={isEmergencyModalOpen} onClose={() => setIsEmergencyModalOpen(false)} />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
