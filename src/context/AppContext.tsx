import React, { createContext, useContext, useState, useEffect } from 'react';
import type { PG, Resident, MovementLog, AuditEntry, Visitor, SystemAlert, Role, UserAccount } from '../types';
import { INITIAL_PGS, INITIAL_RESIDENTS, INITIAL_MOVEMENT_LOGS, INITIAL_AUDIT_LOGS, INITIAL_VISITORS, INITIAL_ALERTS, INITIAL_USER_ACCOUNTS } from '../data/initialData';

interface AppContextType {
  currentUser: UserAccount | null;
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
  userAccounts: UserAccount[];

  // Auth Actions
  loginUser: (emailOrPhone: string, passwordStr: string, selectedRole: Role) => { success: boolean; error?: string };
  registerUser: (newUser: UserAccount) => void;
  logoutUser: () => void;
  changePassword: (userId: string, currentPasswordStr: string, newPasswordStr: string) => { success: boolean; error?: string };
  updateProfilePhoto: (userId: string, photoUrl: string) => void;
  
  // App Actions
  markMovement: (residentId: string, type: 'IN' | 'OUT', notes?: string) => { success: boolean; isLate: boolean };
  addResident: (residentData: Omit<Resident, 'id' | 'status' | 'lastMovementTime' | 'active'> & { password?: string }) => void;
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
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USER_ACCOUNTS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_current_user`);
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRoleState] = useState<Role>(currentUser?.role || 'GUARD');
  const [activePgId, setActivePgId] = useState<string>(currentUser?.pgId || 'pg-1');

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (currentUser) {
      setCurrentUser((prev) => prev ? { ...prev, role: newRole } : null);
    }
  };

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
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(userAccounts));
  }, [userAccounts]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_current_user`);
    }
  }, [currentUser]);

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
      userName: currentUser ? currentUser.name : 'System User',
      action,
      details,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const loginUser = (
    emailOrPhone: string,
    passwordStr: string,
    selectedRole: Role
  ): { success: boolean; error?: string } => {
    const inputClean = emailOrPhone.trim().toLowerCase();

    if (!inputClean) {
      return { success: false, error: 'Please enter your registered email address or phone number.' };
    }

    // 1. Find exact matching user by email or phone
    const matchingUser = userAccounts.find(
      (u) => u.email.toLowerCase() === inputClean || u.phone.trim().includes(inputClean)
    );

    if (!matchingUser) {
      return {
        success: false,
        error: `No account found registered with "${emailOrPhone}". Please contact your Warden or Admin to provision your ID.`,
      };
    }

    // 2. Strict Role Verification: Ensure user's registered role matches selected login role tab
    if (matchingUser.role !== selectedRole) {
      return {
        success: false,
        error: `Access Denied: Account "${matchingUser.name}" is registered as a ${matchingUser.role}, not a ${selectedRole}. Please select the ${matchingUser.role} tab to log in.`,
      };
    }

    // 3. Strict Password Verification
    if (matchingUser.password && matchingUser.password !== passwordStr) {
      return {
        success: false,
        error: 'Incorrect Password. Please check your password and try again.',
      };
    }

    // 4. Authenticate User & ensure Resident record exists in residents array
    if (matchingUser.role === 'RESIDENT') {
      const existingRes = residents.find(
        (r) => r.id === matchingUser.id || r.phone === matchingUser.phone || r.name.toLowerCase() === matchingUser.name.toLowerCase()
      );
      if (!existingRes) {
        const selectedPg = pgs.find((p) => p.id === (matchingUser.pgId || 'pg-1'));
        const newRes: Resident = {
          id: matchingUser.id,
          name: matchingUser.name,
          phone: matchingUser.phone,
          password: matchingUser.password || 'resident123',
          pgId: matchingUser.pgId || 'pg-1',
          pgName: selectedPg?.name || 'Gulmohar Haven PG',
          roomNumber: matchingUser.roomNumber || '101',
          idType: 'Aadhaar',
          idNumber: 'VERIFIED-ONLINE',
          photoUrl: matchingUser.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          emergencyContactName: 'Guardian',
          emergencyContactPhone: matchingUser.phone,
          moveInDate: new Date().toISOString().slice(0, 10),
          status: 'IN',
          lastMovementTime: new Date().toISOString(),
          active: true,
        };
        setResidents((prev) => [newRes, ...prev]);
      }
    }

    if (matchingUser.role === 'WARDEN' && matchingUser.pgId) {
      setPgs((prev) =>
        prev.map((p) =>
          p.id === matchingUser.pgId
            ? { ...p, wardenName: matchingUser.name, wardenPhone: matchingUser.phone }
            : p
        )
      );
    }

    setCurrentUser(matchingUser);
    setRoleState(matchingUser.role);
    if (matchingUser.pgId) {
      setActivePgId(matchingUser.pgId);
    }
    addAuditLog('User Login', `${matchingUser.name} logged in as ${matchingUser.role}.`);

    return { success: true };
  };

  const changePassword = (
    userId: string,
    currentPasswordStr: string,
    newPasswordStr: string
  ): { success: boolean; error?: string } => {
    const user = userAccounts.find((u) => u.id === userId);
    if (!user) {
      return { success: false, error: 'User account not found.' };
    }

    // Check current password if defined
    if (user.password && user.password !== currentPasswordStr) {
      return { success: false, error: 'Current password does not match.' };
    }

    // Update in user accounts
    setUserAccounts((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, password: newPasswordStr } : u))
    );

    // Update in residents if resident
    setResidents((prev) =>
      prev.map((r) => (r.id === userId ? { ...r, password: newPasswordStr } : r))
    );

    // Update current user if logged in
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, password: newPasswordStr } : null));
    }

    addAuditLog('Password Changed', `User ${user.name} successfully updated their password.`);
    return { success: true };
  };

  const updateProfilePhoto = (userId: string, photoUrl: string) => {
    setUserAccounts((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, photoUrl } : u))
    );

    setResidents((prev) =>
      prev.map((r) => (r.id === userId ? { ...r, photoUrl } : r))
    );

    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, photoUrl } : null));
    }

    addAuditLog('Profile Photo Updated', `User ID ${userId} updated their profile picture.`);
  };

  const registerUser = (newUser: UserAccount) => {
    setUserAccounts((prev) => [newUser, ...prev]);

    // Also sync to residents database if user registered as a resident!
    if (newUser.role === 'RESIDENT') {
      const selectedPg = pgs.find((p) => p.id === (newUser.pgId || 'pg-1'));
      const newResident: Resident = {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        password: newUser.password || 'resident123',
        pgId: newUser.pgId || 'pg-1',
        pgName: selectedPg?.name || 'Gulmohar Haven PG',
        roomNumber: newUser.roomNumber || '101-A',
        idType: 'Aadhaar',
        idNumber: 'VERIFIED-ONLINE',
        photoUrl: newUser.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        emergencyContactName: 'Guardian',
        emergencyContactPhone: newUser.phone,
        moveInDate: new Date().toISOString().slice(0, 10),
        status: 'IN',
        lastMovementTime: new Date().toISOString(),
        active: true,
      };
      setResidents((prev) => [newResident, ...prev]);
    }

    if (newUser.role === 'WARDEN' && newUser.pgId) {
      setPgs((prev) =>
        prev.map((p) =>
          p.id === newUser.pgId
            ? { ...p, wardenName: newUser.name, wardenPhone: newUser.phone }
            : p
        )
      );
    }

    setCurrentUser(newUser);
    setRoleState(newUser.role);
    if (newUser.pgId) {
      setActivePgId(newUser.pgId);
    }
    addAuditLog('User Registration', `New user ${newUser.name} registered account as ${newUser.role}.`);
  };

  const logoutUser = () => {
    addAuditLog('User Logout', `${currentUser?.name || 'User'} logged out.`);
    setCurrentUser(null);
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
      recordedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Gate Guard (Gate 1)',
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

  const addResident = (residentData: Omit<Resident, 'id' | 'status' | 'lastMovementTime' | 'active'> & { password?: string }) => {
    const newId = `res-${Date.now()}`;
    const initialPass = residentData.password || 'resident123';
    const newResident: Resident = {
      ...residentData,
      id: newId,
      password: initialPass,
      status: 'IN',
      lastMovementTime: new Date().toISOString(),
      active: true,
    };
    setResidents((prev) => [newResident, ...prev]);

    // Also register user account so resident can log in
    const newUserAcc: UserAccount = {
      id: newId,
      name: residentData.name,
      phone: residentData.phone,
      email: `${residentData.name.toLowerCase().replace(/\s+/g, '.')}@gulmohar.com`,
      password: initialPass,
      role: 'RESIDENT',
      pgId: residentData.pgId,
      pgName: residentData.pgName,
      roomNumber: residentData.roomNumber,
      photoUrl: residentData.photoUrl,
    };
    setUserAccounts((prev) => [newUserAcc, ...prev]);

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
    setUserAccounts(INITIAL_USER_ACCOUNTS);
    setCurrentUser(null);
    localStorage.clear();
    addAuditLog('System Reset', 'Reset all system database data to initial factory state.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
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
        userAccounts,
        loginUser,
        registerUser,
        logoutUser,
        changePassword,
        updateProfilePhoto,
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
