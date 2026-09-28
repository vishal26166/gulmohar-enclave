import React, { createContext, useContext, useState, useEffect } from 'react';
import type { PG, Resident, MovementLog, AuditEntry, Visitor, SystemAlert, Role } from '../types';
import { INITIAL_PGS, INITIAL_RESIDENTS, INITIAL_MOVEMENT_LOGS, INITIAL_AUDIT_LOGS, INITIAL_VISITORS, INITIAL_ALERTS } from '../data/initialData';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  activePgId: string;
  setActivePgId: (pgId: string) => void;
  pgs: PG[];
  residents: Resident[];
  movementLogs: MovementLog[];
  auditLogs: AuditEntry[];
  visitors: Visitor[];
  alerts: SystemAlert[];
  
  // Actions
  markMovement: (residentId: string, type: 'IN' | 'OUT', notes?: string) => { success: boolean; isLate: boolean };
  addResident: (residentData: Omit<Resident, 'id' | 'status' | 'lastMovementTime' | 'active'>) => void;
  updateResident: (id: string, residentData: Partial<Resident>) => void;
  deleteResident: (id: string) => void;
  updatePGWarden: (pgId: string, wardenName: string, wardenPhone: string, curfewTime: string) => void;
  addVisitor: (visitor: Omit<Visitor, 'id' | 'approvalStatus'>) => void;
  updateVisitorStatus: (visitorId: string, status: 'APPROVED' | 'REJECTED') => void;
  markAlertRead: (alertId: string) => void;
  clearAllAlerts: () => void;
  exportResidentsCSV: () => void;
  exportLogsCSV: () => void;
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'gulmohar_enclave_data_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('GUARD');
  const [activePgId, setActivePgId] = useState<string>('pg-1');

  // State initialization with localStorage backup
  const [pgs, setPgs] = useState<PG[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_pgs`);
    return saved ? JSON.parse(saved) : INITIAL_PGS;
  });

  const [residents, setResidents] = useState<Resident[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_residents`);
    return saved ? JSON.parse(saved) : INITIAL_RESIDENTS;
  });

  const [movementLogs, setMovementLogs] = useState<MovementLog[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_logs`);
    return saved ? JSON.parse(saved) : INITIAL_MOVEMENT_LOGS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_audit`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_visitors`);
    return saved ? JSON.parse(saved) : INITIAL_VISITORS;
  });

  const [alerts, setAlerts] = useState<SystemAlert[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_alerts`);
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_pgs`, JSON.stringify(pgs));
  }, [pgs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_residents`, JSON.stringify(residents));
  }, [residents]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_logs`, JSON.stringify(movementLogs));
  }, [movementLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_visitors`, JSON.stringify(visitors));
  }, [visitors]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_alerts`, JSON.stringify(alerts));
  }, [alerts]);

  const addAuditLog = (action: string, details: string) => {
    const newEntry: AuditEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userRole: role,
      userName: role === 'GUARD' ? 'Gate Guard' : role === 'WARDEN' ? `Warden (${pgs.find(p=>p.id===activePgId)?.wardenName || 'PG Warden'})` : 'Society Admin',
      action,
      details,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Helper to check late entry
  const checkIsLateEntry = (timestampIso: string, curfewTimeStr: string): boolean => {
    const date = new Date(timestampIso);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Curfew e.g. "22:30"
    const [curfewH, curfewM] = curfewTimeStr.split(':').map(Number);

    // Curfew range: between curfew time (e.g. 10:30 PM) and 5:00 AM
    if (hours > curfewH || (hours === curfewH && minutes >= curfewM)) {
      return true; // Night late entry
    }
    if (hours < 5) {
      return true; // Early morning late entry (before 5:00 AM)
    }
    return false;
  };

  const markMovement = (residentId: string, type: 'IN' | 'OUT', notes?: string) => {
    const resident = residents.find((r) => r.id === residentId);
    if (!resident) return { success: false, isLate: false };

    const pg = pgs.find((p) => p.id === resident.pgId);
    const curfew = pg ? pg.curfewTime : '22:30';
    const nowIso = new Date().toISOString();

    let isLate = false;
    if (type === 'IN') {
      isLate = checkIsLateEntry(nowIso, curfew);
    }

    // 1. Update Resident Status
    setResidents((prev) =>
      prev.map((r) =>
        r.id === residentId ? { ...r, status: type, lastMovementTime: nowIso } : r
      )
    );

    // 2. Add Movement Log
    const newLog: MovementLog = {
      id: `log-${Date.now()}`,
      residentId,
      residentName: resident.name,
      pgId: resident.pgId,
      pgName: resident.pgName,
      roomNumber: resident.roomNumber,
      type,
      timestamp: nowIso,
      recordedBy: role === 'GUARD' ? 'Gate Guard (Gate 1)' : 'System Admin',
      isLateEntry: isLate,
      notes: notes || (isLate ? `Late Entry after ${curfew} curfew` : `Gate ${type}`),
    };

    setMovementLogs((prev) => [newLog, ...prev]);

    // 3. Create Alert if Late Entry
    if (isLate) {
      const newAlert: SystemAlert = {
        id: `alert-${Date.now()}`,
        type: 'LATE_ENTRY',
        pgId: resident.pgId,
        pgName: resident.pgName,
        residentName: resident.name,
        message: `Late entry marked for ${resident.name} (${resident.roomNumber}) at ${new Date(nowIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Curfew: ${curfew}).`,
        timestamp: nowIso,
        read: false,
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }

    // 4. Audit Log
    addAuditLog(
      `Gate ${type} Marked`,
      `${type} recorded for ${resident.name} (${resident.pgName}, Room ${resident.roomNumber})${isLate ? ' - LATE ENTRY FLAG' : ''}.`
    );

    return { success: true, isLate };
  };

  const addResident = (residentData: Omit<Resident, 'id' | 'status' | 'lastMovementTime' | 'active'>) => {
    const newId = `res-${Date.now()}`;
    const newResident: Resident = {
      ...residentData,
      id: newId,
      status: 'IN',
      lastMovementTime: new Date().toISOString(),
      active: true,
    };
    setResidents((prev) => [newResident, ...prev]);
    addAuditLog('Resident Registered', `Added new resident ${newResident.name} to ${newResident.pgName}, Room ${newResident.roomNumber}.`);
  };

  const updateResident = (id: string, residentData: Partial<Resident>) => {
    setResidents((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...residentData } : r))
    );
    addAuditLog('Resident Updated', `Updated resident profile for ID ${id}.`);
  };

  const deleteResident = (id: string) => {
    const resident = residents.find((r) => r.id === id);
    setResidents((prev) => prev.filter((r) => r.id !== id));
    if (resident) {
      addAuditLog('Resident Removed', `Removed resident ${resident.name} from ${resident.pgName}.`);
    }
  };

  const updatePGWarden = (pgId: string, wardenName: string, wardenPhone: string, curfewTime: string) => {
    setPgs((prev) =>
      prev.map((p) => (p.id === pgId ? { ...p, wardenName, wardenPhone, curfewTime } : p))
    );
    const pg = pgs.find((p) => p.id === pgId);
    addAuditLog('PG Warden Updated', `Updated warden info for ${pg?.name || pgId}: ${wardenName} (${wardenPhone}), Curfew: ${curfewTime}.`);
  };

  const addVisitor = (visitorData: Omit<Visitor, 'id' | 'approvalStatus'>) => {
    const newVisitor: Visitor = {
      ...visitorData,
      id: `vis-${Date.now()}`,
      approvalStatus: 'PENDING',
    };
    setVisitors((prev) => [newVisitor, ...prev]);
    addAuditLog('Visitor Logged', `Visitor ${newVisitor.visitorName} registered to visit ${newVisitor.hostResidentName} (${newVisitor.hostPgName}).`);
  };

  const updateVisitorStatus = (visitorId: string, status: 'APPROVED' | 'REJECTED') => {
    setVisitors((prev) =>
      prev.map((v) => (v.id === visitorId ? { ...v, approvalStatus: status } : v))
    );
    addAuditLog('Visitor Status Updated', `Visitor ID ${visitorId} marked as ${status}.`);
  };

  const markAlertRead = (alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, read: true } : a)));
  };

  const clearAllAlerts = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const exportResidentsCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'PG Name', 'Room', 'ID Type', 'ID Number', 'Emergency Contact', 'Emergency Phone', 'Status', 'Move In Date'];
    const rows = residents.map((r) => [
      r.id,
      `"${r.name}"`,
      `"${r.phone}"`,
      `"${r.pgName}"`,
      `"${r.roomNumber}"`,
      `"${r.idType}"`,
      `"${r.idNumber}"`,
      `"${r.emergencyContactName}"`,
      `"${r.emergencyContactPhone}"`,
      r.status,
      r.moveInDate,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gulmohar_enclave_residents_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog('CSV Export', 'Exported resident database as CSV.');
  };

  const exportLogsCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'Resident Name', 'PG Name', 'Room', 'Movement Type', 'Late Entry Flag', 'Recorded By', 'Notes'];
    const rows = movementLogs.map((l) => [
      l.id,
      `"${new Date(l.timestamp).toLocaleString()}"`,
      `"${l.residentName}"`,
      `"${l.pgName}"`,
      `"${l.roomNumber}"`,
      l.type,
      l.isLateEntry ? 'YES' : 'NO',
      `"${l.recordedBy}"`,
      `"${l.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gulmohar_enclave_gate_logs_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog('CSV Export', 'Exported gate movement logs as CSV.');
  };

  const resetToInitialData = () => {
    setPgs(INITIAL_PGS);
    setResidents(INITIAL_RESIDENTS);
    setMovementLogs(INITIAL_MOVEMENT_LOGS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setVisitors(INITIAL_VISITORS);
    setAlerts(INITIAL_ALERTS);
    localStorage.clear();
    addAuditLog('System Reset', 'Reset all system database data to initial factory state.');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activePgId,
        setActivePgId,
        pgs,
        residents,
        movementLogs,
        auditLogs,
        visitors,
        alerts,
        markMovement,
        addResident,
        updateResident,
        deleteResident,
        updatePGWarden,
        addVisitor,
        updateVisitorStatus,
        markAlertRead,
        clearAllAlerts,
        exportResidentsCSV,
        exportLogsCSV,
        resetToInitialData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
