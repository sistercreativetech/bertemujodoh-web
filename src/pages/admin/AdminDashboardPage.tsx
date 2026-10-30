import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  DollarSign,
  Heart,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Trash2,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  FileText,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import { adminService, type AdminUserRecord, type AdminTransaction } from '@/services/adminService';
import { fetchPosts, deletePost } from '@/services/postService';
import { getStoredRequests } from '@/services/taarufService';
import type { Post, TaarufRequest } from '@/types/database';

export const AdminDashboardPage: React.FC = () => {
  const { profile, demoLoginAs } = useAuth();

  const [activeTab, setActiveTab] = useState<'users' | 'moderation' | 'taaruf' | 'finance'>('users');
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [taarufRequests, setTaarufRequests] = useState<TaarufRequest[]>([]);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [stats, setStats] = useState(adminService.getStats());

  // Search & Filter state for Users
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Load data
  const refreshData = () => {
    setUsers(adminService.getUsers());
    setTransactions(adminService.getTransactions());
    setStats(adminService.getStats());

    // Load posts for moderation
    fetchPosts().then((res: Post[]) => {
      setPosts(res);
    });

    // Load taaruf requests
    setTaarufRequests(getStoredRequests());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // User Actions
  const handleToggleVerification = (userId: string, name: string) => {
    const updated = adminService.toggleUserVerification(userId);
    setUsers(updated);
    setStats(adminService.getStats());
    triggerNotice(`Status verifikasi ${name} berhasil diubah.`);
  };

  const handleToggleBan = (userId: string, name: string) => {
    const updated = adminService.toggleUserBan(userId);
    setUsers(updated);
    triggerNotice(`Status pembekuan akun ${name} berhasil diperbarui.`);
  };

  const handleChangeRole = (userId: string, newRole: 'member' | 'moderator' | 'admin', name: string) => {
    const updated = adminService.changeUserRole(userId, newRole);
    setUsers(updated);
    triggerNotice(`Role ${name} berhasil diubah menjadi ${newRole.toUpperCase()}.`);
  };

  // Post Moderation Action
  const handleDeletePost = async (postId: string) => {
    await deletePost(postId, profile?.id || '');
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    triggerNotice('Postingan berhasil dihapus dari timeline komunitas.');
  };

  // Non-admin guard
  if (profile?.role !== 'admin') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#29252A]">
            Akses Khusus Administrator Platform
          </h2>
          <p className="text-xs sm:text-sm text-[#777078] max-w-lg mx-auto leading-relaxed">
            Halaman ini diproteksi dengan Role-Based Access Control (RBAC). Anda saat ini masuk dengan role{' '}
            <span className="font-semibold text-[#A95570] uppercase">
              {profile?.role || 'Guest'}
            </span>
            .
          </p>
        </div>

        {/* 1-Click Persona Switcher for easy evaluation */}
        <div className="p-6 bg-[#FFF5F7] rounded-3xl border border-[#F7E6EA] max-w-md mx-auto space-y-4">
          <p className="text-xs text-[#29252A] font-semibold">
            Ingin menguji fitur Administrator & Pengawas Syar'i?
          </p>
          <button
            onClick={() => demoLoginAs('admin')}
            className="w-full py-3 rounded-xl bg-[#A95570] text-white text-xs font-bold hover:bg-[#92435b] transition shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ganti Persona ke Admin (Ustadz Fauzan Haidar)</span>
          </button>
        </div>
      </div>
    );
  }

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = genderFilter === 'all' || u.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0E7E9]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 uppercase tracking-wider">
              Super Admin Console
            </span>
            <span className="text-xs text-[#777078]">
              Login sebagai: <strong className="text-[#29252A]">{profile.full_name}</strong>
            </span>
          </div>
          <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#29252A] mt-1">
            Pusat Pengawasan & Tata Kelola Platform
          </h1>
        </div>

        <button
          onClick={refreshData}
          className="px-3.5 py-2 rounded-xl border border-[#F0E7E9] bg-white text-xs font-semibold text-[#777078] hover:bg-[#FFF5F7] transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-[#F0E7E9] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#777078] uppercase">Total Pengguna</span>
            <Users className="w-4 h-4 text-[#A95570]" />
          </div>
          <p className="text-2xl font-bold text-[#29252A] font-serif-editorial">{stats.totalUsers}</p>
          <div className="flex items-center gap-2 text-[10px] text-[#777078] pt-1">
            <span className="text-blue-600 font-semibold">{stats.totalIkhwan} Ikhwan</span>
            <span>•</span>
            <span className="text-pink-600 font-semibold">{stats.totalAkhwat} Akhwat</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F0E7E9] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#777078] uppercase">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 font-serif-editorial">
            Rp {stats.totalRevenue.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-emerald-600 flex items-center gap-1 pt-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            Dari {transactions.filter((t) => t.status === 'paid').length} transaksi lunas
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F0E7E9] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#777078] uppercase">Member Premium</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-[#29252A] font-serif-editorial">
            {stats.activeSubscriptions}
          </p>
          <p className="text-[10px] text-[#777078] pt-1">
            {stats.freeTrialUsers} anggota dalam masa Free Trial
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F0E7E9] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#777078] uppercase">Verifikasi Syar’i</span>
            <UserCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-[#29252A] font-serif-editorial">{stats.verifiedUsers}</p>
          <p className="text-[10px] text-purple-700 font-medium pt-1">
            {Math.round((stats.verifiedUsers / stats.totalUsers) * 100)}% dari total anggota
          </p>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-[#F0E7E9] overflow-x-auto pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition whitespace-nowrap ${
            activeTab === 'users' ? 'bg-[#A95570] text-white shadow-xs' : 'text-[#777078] hover:bg-[#FFF5F7]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manajemen Pengguna ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition whitespace-nowrap ${
            activeTab === 'moderation' ? 'bg-[#A95570] text-white shadow-xs' : 'text-[#777078] hover:bg-[#FFF5F7]'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Moderasi Feed ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('taaruf')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition whitespace-nowrap ${
            activeTab === 'taaruf' ? 'bg-[#A95570] text-white shadow-xs' : 'text-[#777078] hover:bg-[#FFF5F7]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Pengawasan Taaruf Syar’i ({taarufRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition whitespace-nowrap ${
            activeTab === 'finance' ? 'bg-[#A95570] text-white shadow-xs' : 'text-[#777078] hover:bg-[#FFF5F7]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Transaksi Membership ({transactions.length})</span>
        </button>
      </div>

      {/* TAB 1: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-[#F0E7E9] p-6 space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#777078] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama, email, kota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-[#777078]">Filter Gender:</span>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as 'all' | 'male' | 'female')}
                className="px-3 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none"
              >
                <option value="all">Semua Anggota</option>
                <option value="male">Ikhwan Saja</option>
                <option value="female">Akhwat Saja</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF5F7] text-[#777078] uppercase text-[10px] tracking-wider border-y border-[#F7E6EA]">
                <tr>
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-3">Gender / Kota</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Paket</th>
                  <th className="py-3 px-3">Status Verifikasi</th>
                  <th className="py-3 px-3 text-right">Aksi Kelola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E7E9]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#29252A] flex items-center gap-1.5">
                        <span>{u.fullName}</span>
                        {u.isVerified && (
                          <span title="Terverifikasi">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          </span>
                        )}
                        {u.isBanned && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-100 text-rose-700 font-bold">
                            Dibekukan
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#777078]">{u.email}</span>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          u.gender === 'male' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                        }`}
                      >
                        {u.gender === 'male' ? 'Ikhwan' : 'Akhwat'}
                      </span>
                      <span className="block text-[10px] text-[#777078] mt-0.5">{u.city}</span>
                    </td>

                    <td className="py-3 px-3">
                      <select
                        value={u.role}
                        onChange={(e) =>
                          handleChangeRole(u.id, e.target.value as 'member' | 'moderator' | 'admin', u.fullName)
                        }
                        className="px-2 py-1 rounded-lg border border-[#F0E7E9] text-[11px] font-semibold bg-white"
                      >
                        <option value="member">Member</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-[11px] font-medium text-[#29252A] capitalize">
                        {u.membershipTier.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleToggleVerification(u.id, u.fullName)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition ${
                          u.isVerified
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-neutral-100 text-[#777078] hover:bg-neutral-200'
                        }`}
                      >
                        {u.isVerified ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-gray-400" />
                            <span>Belum Verif</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleToggleBan(u.id, u.fullName)}
                        className={`p-1.5 rounded-lg text-xs transition ${
                          u.isBanned
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                        }`}
                        title={u.isBanned ? 'Buka Pembekuan Akun' : 'Bekukan Akun'}
                      >
                        {u.isBanned ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CONTENT MODERATION */}
      {activeTab === 'moderation' && (
        <div className="bg-white rounded-2xl border border-[#F0E7E9] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#29252A]">Moderasi Postingan Komunitas</h3>
              <p className="text-xs text-[#777078]">
                Pantau isi timeline untuk memastikan tidak ada pelanggaran adab, spam, atau ujaran yang tidak syar’i.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#A95570] bg-[#FFF5F7] px-3 py-1 rounded-full">
              {posts.length} Postingan Aktif
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-xl border border-[#F0E7E9] hover:border-[#F7E6EA] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#29252A]">
                      {post.author?.full_name || 'Member'}
                    </span>
                    <span className="text-[10px] text-[#777078]">
                      {new Date(post.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-semibold">
                      {post.likes_count} Suka
                    </span>
                  </div>
                  <p className="text-xs text-[#29252A] leading-relaxed line-clamp-2">
                    {post.content}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-semibold hover:bg-rose-100 transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Post</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TAARUF OVERSIGHT */}
      {activeTab === 'taaruf' && (
        <div className="bg-white rounded-2xl border border-[#F0E7E9] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#29252A]">Pengawasan Proses Taaruf Syar’i</h3>
              <p className="text-xs text-[#777078]">
                Verifikasi kelengkapan wali nasab pada akhwat dan pastikan adab taaruf terjaga.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Syar’i Compliant
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {taarufRequests.length === 0 ? (
              <p className="text-xs text-[#777078] italic text-center py-6">
                Belum ada pengajuan taaruf yang tercatat.
              </p>
            ) : (
              taarufRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-xl border border-[#F0E7E9] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#29252A]">
                        {req.sender?.full_name || 'Ikhwan Pemohon'}
                      </span>
                      <span className="text-[10px] text-[#777078]">mengajukan taaruf ke</span>
                      <span className="font-bold text-xs text-[#A95570]">
                        {req.receiver?.full_name || 'Akhwat Tertuju'}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        req.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-700'
                          : req.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="p-2.5 bg-neutral-50 rounded-lg text-xs text-[#777078] flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#29252A]">Kontak Wali Nasab: </span>
                      <span>{req.wali_phone || 'Telah diverifikasi via akun'}</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Didampingi Wali
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: FINANCIAL TRANSACTIONS */}
      {activeTab === 'finance' && (
        <div className="bg-white rounded-2xl border border-[#F0E7E9] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#29252A]">Log Transaksi Pembayaran Membership</h3>
              <p className="text-xs text-[#777078]">
                Rekapitulasi riwayat pembelian paket langganan (QRIS, BSI, BCA, GoPay).
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-700 block">
                Total Omset: Rp {stats.totalRevenue.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF5F7] text-[#777078] uppercase text-[10px] tracking-wider border-y border-[#F7E6EA]">
                <tr>
                  <th className="py-3 px-4">No. Invoice</th>
                  <th className="py-3 px-3">Nama Anggota</th>
                  <th className="py-3 px-3">Paket Langganan</th>
                  <th className="py-3 px-3">Metode Bayar</th>
                  <th className="py-3 px-3">Nominal (Rp)</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E7E9]">
                {transactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-neutral-50/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#29252A]">{trx.invoiceNo}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#29252A]">{trx.userName}</div>
                      <div className="text-[10px] text-[#777078]">{trx.userEmail}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-[#29252A]">{trx.planName}</td>
                    <td className="py-3 px-3 text-[11px] text-[#777078]">{trx.paymentMethod}</td>
                    <td className="py-3 px-3 font-bold text-emerald-700">
                      Rp {trx.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          trx.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {trx.status === 'paid' ? 'Lunas' : 'Menunggu'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[10px] text-[#777078]">{trx.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
