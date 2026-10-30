import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { calculateDaysRemaining } from '@/services/membershipService';
import {
  ShieldCheck,
  Lock,
  Sparkles,
  FileText,
  Settings,
  ChevronRight,
  Clock,
  Heart,
} from 'lucide-react';

interface SidebarProfileProps {
  onOpenUpgradeModal: () => void;
  postsCount: number;
  followingCount: number;
}

export const SidebarProfile: React.FC<SidebarProfileProps> = ({
  onOpenUpgradeModal,
  postsCount,
  followingCount,
}) => {
  const { profile, membership } = useAuth();

  if (!profile) return null;

  const isFreeTrial = membership?.tier === 'free_trial';
  const daysLeft = membership?.expires_at ? calculateDaysRemaining(membership.expires_at) : 7;

  return (
    <div className="space-y-4">
      {/* Profile Summary Card */}
      <div className="bg-white rounded-3xl border border-[#F0E7E9] overflow-hidden shadow-xs">
        {/* Header Ribbon */}
        <div className="h-16 bg-gradient-to-r from-[#F7E6EA] to-[#FFF5F7]" />

        <div className="p-5 pt-0 space-y-4 relative">
          {/* Avatar and Main Info */}
          <div className="flex items-end justify-between -mt-8">
            <Link
              to={`/profil/${profile.id}`}
              className="w-16 h-16 rounded-2xl bg-white border-2 border-white shadow-md bg-gradient-to-tr from-[#A95570] to-[#C77B91] flex items-center justify-center text-white font-bold text-xl uppercase font-serif-editorial hover:scale-105 transition"
            >
              {profile.display_name?.charAt(0) || profile.full_name?.charAt(0) || 'U'}
            </Link>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                profile.gender === 'female' ? 'bg-[#FFF0F3] text-[#A95570]' : 'bg-blue-50 text-blue-700'
              }`}
            >
              {profile.gender === 'female' ? 'Akhwat' : 'Ikhwan'}
            </span>
          </div>

          <div>
            <Link
              to={`/profil/${profile.id}`}
              className="font-serif-editorial text-base font-bold text-[#29252A] hover:text-[#A95570] transition block"
            >
              {profile.full_name}
            </Link>
            <p className="text-xs text-[#777078]">{profile.occupation || 'Profesional'}</p>
            <p className="text-[11px] text-[#777078]">{profile.city}, {profile.province}</p>
          </div>

          {/* Follow / Post Stats */}
          <div className="grid grid-cols-2 gap-2 text-center border-y border-[#F0E7E9] py-2.5 text-xs">
            <div>
              <span className="font-bold text-[#29252A] block">{postsCount}</span>
              <span className="text-[10px] text-[#777078]">Refleksi Ditulis</span>
            </div>
            <div>
              <span className="font-bold text-[#29252A] block">{followingCount}</span>
              <span className="text-[10px] text-[#777078]">Mengikuti</span>
            </div>
          </div>

          {/* Membership Status Box */}
          <div className="p-3.5 rounded-2xl bg-[#FFF5F7] border border-[#F7E6EA] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#A95570] uppercase text-[10px]">
                {isFreeTrial ? 'Free Trial' : `Paket ${membership?.tier}`}
              </span>
              <span className="text-[10px] text-[#777078] flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3 text-[#A95570]" />
                Sisa {daysLeft} Hari
              </span>
            </div>

            {/* Trial progress line */}
            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-[#A95570] rounded-full"
                style={{ width: `${Math.min(100, Math.max(10, (daysLeft / 7) * 100))}%` }}
              />
            </div>

            {isFreeTrial ? (
              <div className="space-y-2 pt-1">
                <p className="text-[10px] text-[#777078] leading-tight">
                  Free trial dapat membuat CV Taaruf, belum bisa mengirim pengajuan taaruf.
                </p>
                <button
                  onClick={onOpenUpgradeModal}
                  className="w-full py-2 rounded-xl bg-[#A95570] text-white font-semibold text-xs hover:bg-[#92435b] transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upgrade Mulai Rp 19rb</span>
                </button>
              </div>
            ) : (
              <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Akses Taaruf Aktif
                </span>
                <button
                  onClick={onOpenUpgradeModal}
                  className="text-[#A95570] hover:underline"
                >
                  Perpanjang
                </button>
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-1 text-xs">
            <Link
              to="/cv-taaruf"
              className="flex items-center justify-between p-2 rounded-xl text-[#29252A] hover:bg-[#FFF5F7] transition font-medium"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#A95570]" />
                Kelola CV Taaruf Saya
              </span>
              <ChevronRight className="w-4 h-4 text-[#777078]" />
            </Link>
            <Link
              to="/pengaturan"
              className="flex items-center justify-between p-2 rounded-xl text-[#29252A] hover:bg-[#FFF5F7] transition font-medium"
            >
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#777078]" />
                Pengaturan Akun & Privasi
              </span>
              <ChevronRight className="w-4 h-4 text-[#777078]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
