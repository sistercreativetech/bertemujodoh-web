import type { Profile, Post, TaarufRequest } from '@/types/database';

export interface AdminUserRecord {
  id: string;
  email: string;
  fullName: string;
  displayName: string;
  gender: 'male' | 'female';
  role: 'member' | 'moderator' | 'admin';
  isVerified: boolean;
  isBanned: boolean;
  membershipTier: 'free_trial' | 'premium_1m' | 'premium_6m' | 'premium_12m';
  city: string;
  joinDate: string;
  hasCv: boolean;
}

export interface AdminTransaction {
  id: string;
  invoiceNo: string;
  userName: string;
  userEmail: string;
  planName: string;
  amount: number;
  paymentMethod: string;
  status: 'paid' | 'pending' | 'expired';
  createdAt: string;
}

const INITIAL_USERS: AdminUserRecord[] = [
  {
    id: 'user-ikhwan-1',
    email: 'alif.ramadhan@example.com',
    fullName: 'Muhammad Alif Ramadhan, S.Kom.',
    displayName: 'Alif',
    gender: 'male',
    role: 'member',
    isVerified: true,
    isBanned: false,
    membershipTier: 'premium_6m',
    city: 'Jakarta Selatan',
    joinDate: '2026-09-15',
    hasCv: true,
  },
  {
    id: 'user-akhwat-1',
    email: 'khadijah.annisa@example.com',
    fullName: 'Khadijah Annisa Putri, S.Pd.',
    displayName: 'Annisa',
    gender: 'female',
    role: 'member',
    isVerified: true,
    isBanned: false,
    membershipTier: 'premium_12m',
    city: 'Bandung',
    joinDate: '2026-09-20',
    hasCv: true,
  },
  {
    id: 'user-ikhwan-2',
    email: 'fauzan.haidar@example.com',
    fullName: 'Fauzan Haidar Al-Farisi',
    displayName: 'Fauzan',
    gender: 'male',
    role: 'admin',
    isVerified: true,
    isBanned: false,
    membershipTier: 'premium_12m',
    city: 'Jakarta Timur',
    joinDate: '2026-08-01',
    hasCv: true,
  },
  {
    id: 'user-akhwat-2',
    email: 'syarifah.zahra@example.com',
    fullName: 'Syarifah Zahra Ramadhani, dr.',
    displayName: 'dr. Zahra',
    gender: 'female',
    role: 'member',
    isVerified: false,
    isBanned: false,
    membershipTier: 'free_trial',
    city: 'Surabaya',
    joinDate: '2026-10-25',
    hasCv: true,
  },
  {
    id: 'user-ikhwan-3',
    email: 'rizky.firmansyah@example.com',
    fullName: 'Rizky Firmansyah, S.T.',
    displayName: 'Rizky',
    gender: 'male',
    role: 'member',
    isVerified: false,
    isBanned: false,
    membershipTier: 'free_trial',
    city: 'Yogyakarta',
    joinDate: '2026-10-28',
    hasCv: false,
  },
];

const INITIAL_TRANSACTIONS: AdminTransaction[] = [
  {
    id: 'trx-101',
    invoiceNo: 'INV/20261028/BJ/0091',
    userName: 'Khadijah Annisa Putri',
    userEmail: 'khadijah.annisa@example.com',
    planName: 'Paket Berkah (12 Bulan)',
    amount: 149000,
    paymentMethod: 'QRIS Gopay/ShopeePay',
    status: 'paid',
    createdAt: '2026-10-28 14:22:10',
  },
  {
    id: 'trx-102',
    invoiceNo: 'INV/20261027/BJ/0088',
    userName: 'Muhammad Alif Ramadhan',
    userEmail: 'alif.ramadhan@example.com',
    planName: 'Paket Serius (6 Bulan)',
    amount: 89000,
    paymentMethod: 'BSI Virtual Account',
    status: 'paid',
    createdAt: '2026-10-27 10:15:45',
  },
  {
    id: 'trx-103',
    invoiceNo: 'INV/20261029/BJ/0094',
    userName: 'Ahmad Faisal',
    userEmail: 'faisal.ahmad@example.com',
    planName: 'Paket Taaruf (1 Bulan)',
    amount: 19000,
    paymentMethod: 'BCA Virtual Account',
    status: 'paid',
    createdAt: '2026-10-29 08:40:12',
  },
  {
    id: 'trx-104',
    invoiceNo: 'INV/20261030/BJ/0099',
    userName: 'Rizky Firmansyah',
    userEmail: 'rizky.firmansyah@example.com',
    planName: 'Paket Serius (6 Bulan)',
    amount: 89000,
    paymentMethod: 'BSI Virtual Account',
    status: 'pending',
    createdAt: '2026-10-30 18:05:00',
  },
];

const USERS_STORAGE_KEY = 'bertemujodoh_admin_users';
const TRANSACTIONS_STORAGE_KEY = 'bertemujodoh_admin_transactions';

function loadUsers(): AdminUserRecord[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
}

function saveUsers(users: AdminUserRecord[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error(e);
  }
}

function loadTransactions(): AdminTransaction[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_TRANSACTIONS;
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

function saveTransactions(trxs: AdminTransaction[]): void {
  try {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(trxs));
  } catch (e) {
    console.error(e);
  }
}

export const adminService = {
  getUsers: (): AdminUserRecord[] => {
    return loadUsers();
  },

  toggleUserVerification: (userId: string): AdminUserRecord[] => {
    const users = loadUsers();
    const updated = users.map((u) => (u.id === userId ? { ...u, isVerified: !u.isVerified } : u));
    saveUsers(updated);
    return updated;
  },

  toggleUserBan: (userId: string): AdminUserRecord[] => {
    const users = loadUsers();
    const updated = users.map((u) => (u.id === userId ? { ...u, isBanned: !u.isBanned } : u));
    saveUsers(updated);
    return updated;
  },

  changeUserRole: (userId: string, newRole: 'member' | 'moderator' | 'admin'): AdminUserRecord[] => {
    const users = loadUsers();
    const updated = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    saveUsers(updated);
    return updated;
  },

  getTransactions: (): AdminTransaction[] => {
    return loadTransactions();
  },

  getStats: () => {
    const users = loadUsers();
    const trxs = loadTransactions();

    const totalUsers = users.length;
    const totalIkhwan = users.filter((u) => u.gender === 'male').length;
    const totalAkhwat = users.filter((u) => u.gender === 'female').length;
    const verifiedUsers = users.filter((u) => u.isVerified).length;

    const paidTransactions = trxs.filter((t) => t.status === 'paid');
    const totalRevenue = paidTransactions.reduce((acc, curr) => acc + curr.amount, 0);

    const activeSubscriptions = users.filter((u) => u.membershipTier !== 'free_trial').length;
    const freeTrialUsers = users.filter((u) => u.membershipTier === 'free_trial').length;

    return {
      totalUsers,
      totalIkhwan,
      totalAkhwat,
      verifiedUsers,
      totalRevenue,
      activeSubscriptions,
      freeTrialUsers,
    };
  },
};
