import type { PG, Resident, MovementLog, AuditEntry, Visitor, SystemAlert, UserAccount } from '../types';

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-admin',
    name: 'Society Admin (Committee)',
    phone: '+91 98765 00000',
    email: 'admin@gulmohar.com',
    password: 'admin123',
    role: 'ADMIN',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'usr-guard',
    name: 'Security Guard (Gate 1)',
    phone: '+91 98765 11111',
    email: 'guard@gulmohar.com',
    password: 'guard123',
    role: 'GUARD',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'usr-warden-1',
    name: 'Gulmohar Haven Warden',
    phone: '+91 98765 43210',
    email: 'warden.pg1@gulmohar.com',
    password: 'warden123',
    role: 'WARDEN',
    pgId: 'pg-1',
    pgName: 'Gulmohar Haven PG',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
];

export const INITIAL_PGS: PG[] = [
  { id: 'pg-1', name: 'Gulmohar Haven PG', wardenName: 'Gulmohar Haven Warden', wardenPhone: '+91 98765 43210', totalRooms: 20, capacity: 40, curfewTime: '22:30' },
  { id: 'pg-2', name: 'Royal Nest PG', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 15, capacity: 30, curfewTime: '22:30' },
  { id: 'pg-3', name: 'Green View Residency', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 18, capacity: 36, curfewTime: '22:00' },
  { id: 'pg-4', name: 'Sunrise PG House', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 12, capacity: 24, curfewTime: '22:30' },
  { id: 'pg-5', name: 'Pine Crest PG', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 25, capacity: 50, curfewTime: '23:00' },
  { id: 'pg-6', name: 'Dehradun Heights PG', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 14, capacity: 28, curfewTime: '22:30' },
  { id: 'pg-7', name: 'Valley View Boys PG', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 16, capacity: 32, curfewTime: '22:30' },
  { id: 'pg-8', name: 'Shivalik Girls PG', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 22, capacity: 44, curfewTime: '22:00' },
  { id: 'pg-9', name: 'Maple Leaf Residency', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 10, capacity: 20, curfewTime: '22:30' },
  { id: 'pg-10', name: 'Orchid Elegance PG', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 15, capacity: 30, curfewTime: '22:30' },
  { id: 'pg-11', name: 'Cedar Wood PG', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 12, capacity: 24, curfewTime: '22:30' },
  { id: 'pg-12', name: 'Doon Valley PG', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 18, capacity: 36, curfewTime: '22:30' },
  { id: 'pg-13', name: 'Alpine View PG', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 20, capacity: 40, curfewTime: '23:00' },
  { id: 'pg-14', name: 'Blossom Girls PG', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 16, capacity: 32, curfewTime: '22:00' },
  { id: 'pg-15', name: 'Evergreen House', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 14, capacity: 28, curfewTime: '22:30' },
  { id: 'pg-16', name: 'Silver Oaks PG', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 24, capacity: 48, curfewTime: '22:30' },
  { id: 'pg-17', name: 'Hill Top Residency', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 12, capacity: 24, curfewTime: '22:30' },
  { id: 'pg-18', name: 'Golden Palms PG', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 15, capacity: 30, curfewTime: '22:30' },
  { id: 'pg-19', name: 'Comfort Zone PG', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 10, capacity: 20, curfewTime: '22:30' },
  { id: 'pg-20', name: 'Blue Sky PG', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 18, capacity: 36, curfewTime: '22:30' },
  { id: 'pg-21', name: 'Serenity Living PG', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 20, capacity: 40, curfewTime: '22:30' },
  { id: 'pg-22', name: 'Elite Crown Residency', wardenName: 'Unassigned Warden', wardenPhone: '+91 98765 00000', totalRooms: 25, capacity: 50, curfewTime: '22:30' },
];

export const INITIAL_RESIDENTS: Resident[] = [];

export const INITIAL_MOVEMENT_LOGS: MovementLog[] = [];

export const INITIAL_AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'audit-1',
    timestamp: new Date().toISOString(),
    userRole: 'ADMIN',
    userName: 'System Administrator',
    action: 'System Ready',
    details: 'Gulmohar Enclave Gate Security & PG Management System initialized in production state with 22 PG Accommodations.',
  },
];

export const INITIAL_VISITORS: Visitor[] = [];

export const INITIAL_ALERTS: SystemAlert[] = [];
