import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { calculateDaysRemaining, MEMBERSHIP_PLANS } from '@/services/membershipService';
import { UpgradeModal } from '@/components/membership/UpgradeModal';
import type { MembershipTier } from '@/types/database';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Lock,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { profile, membership } = useAuth();
  const [privacy, setPrivacy] = useState(profile?.privacy_level || 'public');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedUpgradeTier, setSelectedUpgradeTier] = useState<MembershipTier>('6_months');

  const daysLeft = membership?.expires_at ? calculateDaysRemaining(membership.expires_at) : 7;
  const isFreeTrial = membership?.tier === 'free_trial';

  const handleOpenUpgrade = (tier: MembershipTier) => {
    setSelectedUpgradeTier(tier);
    setUpgradeModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#29252A]">
          Pengaturan Akun & Status Membership
        </h1>
        <p className="text-xs sm:text-sm text-[#777078]">
          Kelola privasi data profil taaruf, preferensi notifikasi, dan upgrade paket langganan.
        </p>
      </div>

      {/* Active Membership Details Card */}
      <div className="bg-white rounded-3xl border border-[#F0E7E9] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0E7E9] pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F7E6EA] text-[#A95570] uppercase">
              Paket Aktif Saat Ini
            </span>
            <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#29252A]">
              {isFreeTrial ? 'Free Trial (7 Hari)' : MEMBERSHIP_PLANS[membership?.tier || 'free_trial'].name}
            </h3>
            <p className="text-xs text-[#777078] flex items-center gap-1.5 pt-1">
              <Clock className="w-3.5 h-3.5 text-[#A95570]" />
              Masa aktif tersisa <span className="font-bold text-[#A95570]">{daysLeft} Hari</span> (Hingga {membership?.expires_at ? new Date(membership.expires_at).toLocaleDateString('id-ID') : 'Aktif'})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                membership?.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              Status: {membership?.status === 'active' ? 'Aktif' : 'Kedaluwarsa'}
            </span>
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#FFF5F7] border border-[#F7E6EA] space-y-1">
            <span className="text-[10px] text-[#777078] block">Pembuatan CV Taaruf:</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Diizinkan
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF5F7] border border-[#F7E6EA] space-y-1">
            <span className="text-[10px] text-[#777078] block">Pengajuan Taaruf:</span>
            {membership?.can_send_taaruf ? (
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Diizinkan (Lawan Jenis)
              </span>
            ) : (
              <span className="font-bold text-amber-700 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Butuh Paket Berbayar
              </span>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF5F7] border border-[#F7E6EA] space-y-1">
            <span className="text-[10px] text-[#777078] block">Materi Ebook & Video:</span>
            {membership?.can_access_premium ? (
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Bebas Akses Penuh
              </span>
            ) : (
              <span className="font-bold text-amber-700 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Bab Terpilih Saja
              </span>
            )}
          </div>
        </div>

        {/* Upgrade Package Cards */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A95570]">
              Pilihan Paket Langganan:
            </h4>
            <span className="text-[11px] text-[#777078]">Pilih untuk simulasi upgrade instan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1 Month */}
            <div className="p-5 rounded-2xl border border-[#F0E7E9] hover:border-[#F7E6EA] transition space-y-3 bg-white flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#A95570] uppercase">1 Bulan (30 Hari)</span>
                <div className="text-xl font-bold text-[#29252A]">Rp 19.000</div>
                <p className="text-[11px] text-[#777078] leading-tight">
                  Kirim pengajuan taaruf, ekspor CV Taaruf PDF, dan buka seluruh materi e-book.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenUpgrade('1_month')}
                className="w-full py-2.5 rounded-xl bg-[#FFF5F7] text-[#A95570] text-xs font-semibold hover:bg-[#A95570] hover:text-white transition"
              >
                Pilih 1 Bulan
              </button>
            </div>

            {/* 6 Months */}
            <div className="p-5 rounded-2xl border-2 border-[#A95570] bg-[#FFF5F7]/40 space-y-3 relative flex flex-col justify-between shadow-xs">
              <span className="absolute -top-2.5 right-3 text-[9px] bg-[#A95570] text-white px-2.5 py-0.5 rounded-full font-bold">
                HEMAT 22%
              </span>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#A95570] uppercase">6 Bulan (180 Hari)</span>
                <div>
                  <span className="text-[11px] text-gray-400 line-through block">Rp 114.000</span>
                  <div className="text-xl font-bold text-[#A95570]">Rp 89.000</div>
                </div>
                <p className="text-[11px] text-[#777078] leading-tight">
                  Prioritas kurasi CV taaruf, builder undangan digital, & wedding budget planner.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenUpgrade('6_months')}
                className="w-full py-2.5 rounded-xl bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b] transition shadow-xs"
              >
                Pilih 6 Bulan
              </button>
            </div>

            {/* 12 Months */}
            <div className="p-5 rounded-2xl border border-[#F0E7E9] hover:border-[#F7E6EA] transition space-y-3 bg-white flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">12 Bulan (1 Tahun)</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">HEMAT 35%</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 line-through block">Rp 228.000</span>
                  <div className="text-xl font-bold text-[#29252A]">Rp 149.000</div>
                </div>
                <p className="text-[11px] text-[#777078] leading-tight">
                  Pendampingan penuh sampai hari akad & walimah dengan konsultasi syar’i.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenUpgrade('12_months')}
                className="w-full py-2.5 rounded-xl bg-[#FFF5F7] text-[#A95570] text-xs font-semibold hover:bg-[#A95570] hover:text-white transition"
              >
                Pilih 12 Bulan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-3xl border border-[#F0E7E9] p-6 sm:p-8 space-y-4">
        <h3 className="font-serif-editorial text-lg font-bold text-[#29252A] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#A95570]" />
          Pengaturan Privasi Syar’i & Keamanan
        </h3>

        <div className="space-y-3 text-xs">
          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#F0E7E9] hover:bg-[#FFF5F7] cursor-pointer transition">
            <input
              type="radio"
              name="privacy"
              checked={privacy === 'public'}
              onChange={() => setPrivacy('public')}
              className="mt-1 text-[#A95570]"
            />
            <div>
              <span className="font-bold text-[#29252A] block">Publik (Standar Syar'i)</span>
              <span className="text-[#777078]">Biodata teaser (usia, profesi, kota) ditampilkan di direktori publik dengan foto asli tetap terburamkan secara otomatis.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#F0E7E9] hover:bg-[#FFF5F7] cursor-pointer transition">
            <input
              type="radio"
              name="privacy"
              checked={privacy === 'blur_photo'}
              onChange={() => setPrivacy('blur_photo')}
              className="mt-1 text-[#A95570]"
            />
            <div>
              <span className="font-bold text-[#29252A] block">Sensor Ketat (Foto Hanya Terbuka Saat Nadzor)</span>
              <span className="text-[#777078]">Foto profil hanya dapat diakses setelah pengajuan taaruf disetujui bersama wali nasab.</span>
            </div>
          </label>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        defaultTier={selectedUpgradeTier}
      />
    </div>
  );
};
