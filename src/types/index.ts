export type Role = 'GUARD' | 'WARDEN' | 'ADMIN' | 'RESIDENT';

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: Role;
  pgId?: string; // Assigned PG for Warden or Resident
  pgName?: string;
  roomNumber?: string;
  photoUrl?: string;
}

export interface PG {
  id: string;
  name: string;
  wardenName: string;
  wardenPhone: string;
  totalRooms: number;
  capacity: number;
  curfewTime: string; // e.g. "22:30"
}

export type IDType = 'Aadhaar' | 'PAN' | 'Passport' | 'Driving License' | 'Voter ID';

export interface Resident {
  id: string;
  name: string;
  phone: string;
  pgId: string;
  pgName: string;
  roomNumber: string;
  idType: IDType;
  idNumber: string;
  photoUrl: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  moveInDate: string;
  status: 'IN' | 'OUT';
  lastMovementTime: string;
  active: boolean;
}

export interface MovementLog {
  id: string;
  residentId: string;
  residentName: string;
  pgId: string;
  pgName: string;
  roomNumber: string;
  type: 'IN' | 'OUT';
  timestamp: string; // ISO String
  recordedBy: string;
  isLateEntry: boolean;
  notes?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  userRole: Role;
  userName: string;
  action: string;
  details: string;
}

export interface Visitor {
  id: string;
  visitorName: string;
  visitorPhone: string;
  purpose: string;
  hostResidentId: string;
  hostResidentName: string;
  hostPgName: string;
  hostRoom: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  entryTime?: string;
  exitTime?: string;
}

export interface SystemAlert {
  id: string;
  type: 'LATE_ENTRY' | 'EMERGENCY' | 'UNAUTHORIZED';
  pgId: string;
  pgName: string;
  residentName: string;
  message: string;
  timestamp: string;
  read: boolean;
}
