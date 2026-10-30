import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Profile } from '@/types/database';
import { SendTaarufModal } from '@/components/taaruf/SendTaarufModal';
import { UpgradeModal } from '@/components/membership/UpgradeModal';
import {
  User,
  Heart,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Lock,
  ShieldCheck,
  ArrowLeft,
  Send,
  AlertCircle,
  BookOpen,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { profile: myProfile, membership } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [taarufModalOpen, setTaarufModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const isSelf = !id || id === 'me' || id === myProfile?.id;

  useEffect(() => {
    if (isSelf && myProfile) {
      setProfile(myProfile);
      setLoading(false);
      return;
    }

    if (id && isSupabaseConfigured()) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setProfile(data as Profile);
          } else {
            // Demo fallback profile
            setProfile({
              id: id || 'demo-profile-1',
              email: 'calon@bertemujodoh.my.id',
              full_name: 'Fulanah binti Abdullah',
              display_name: 'Fulanah',
              gender: myProfile?.gender === 'female' ? 'male' : 'female', // default to opposite for nice preview
              birth_year: 1998,
              city: 'Yogyakarta',
              province: 'DI Yogyakarta',
              occupation: 'Apoteker Klinis',
              education: 'Profesi Apoteker (S1 Farmasi)',
              bio: 'Pribadi ramah dan teratur, menyukai kajian tematik fiqih keluarga, siap membina rumah tangga di atas sunnah.',
              avatar_url: null,
              is_verified: true,
              role: 'member',
              privacy_level: 'blur_photo',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }
          setLoading(false);
        });
    } else {
      // Demo mode fallback
      setProfile({
        id: id || 'demo-profile-1',
        email: 'calon@bertemujodoh.my.id',
        full_name: myProfile?.gender === 'female' ? 'Muhammad Rizky Pratama' : 'Aisyah Nurul Fadhilah',
        display_name: myProfile?.gender === 'female' ? 'Rizky' : 'Aisyah',
        gender: myProfile?.gender === 'female' ? 'male' : 'female',
        birth_year: 1997,
        city: 'Bandung',
        province: 'Jawa Barat',
        occupation: myProfile?.gender === 'female' ? 'Software Engineer' : 'Guru Bahasa Arab',
        education: 'S1 Pendidikan',
        bio: 'Mempersiapkan diri dengan bekal ilmu syar’i, menjaga hafalan Al-Qur’an, dan bertekad membangun keluarga sakinah mawaddah warahmah.',
        avatar_url: null,
        is_verified: true,
        role: 'member',
        privacy_level: 'blur_photo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      setLoading(false);
    }
  }, [id, isSelf, myProfile]);

  if (loading || !profile) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-[#F7E6EA] border-t-[#A95570] rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#777078]">Memuat profil anggota...</p>
      </div>
    );
  }

  // STRICT GENDER LOGIC
  const isSameGender = myProfile ? myProfile.gender === profile.gender : false;
  const isOppositeGender = myProfile ? myProfile.gender !== profile.gender : false;
  const canSendTaaruf = membership?.can_send_taaruf;
  const isFreeTrial = membership?.tier === 'free_trial';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777078] hover:text-[#A95570] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Linimasa Feed</span>
      </Link>

      <div className="bg-white rounded-3xl border border-[#F0E7E9] overflow-hidden shadow-xs space-y-6">
        {/* Header Banner Background */}
        <div className="h-32 bg-gradient-to-r from-[#F7E6EA] via-[#FFF5F7] to-[#FCEEF1] relative" />

        <div className="p-6 sm:p-8 pt-0 space-y-6 relative">
          {/* Avatar and Main Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
            <div className="flex items-end gap-4">
              {/* Syar'i Avatar / Blur condition */}
              <div className="relative w-24 h-24 rounded-3xl bg-white border-4 border-white shadow-md bg-gradient-to-tr from-[#A95570] to-[#C77B91] flex items-center justify-center text-white text-3xl font-bold font-serif-editorial shrink-0 overflow-hidden">
                {profile.privacy_level === 'blur_photo' && !isSelf ? (
                  <div className="w-full h-full backdrop-blur-md bg-white/30 flex flex-col items-center justify-center text-center p-1">
                    <Lock className="w-6 h-6 text-white mb-0.5" />
                    <span className="text-[8px] uppercase tracking-wider font-bold">Privasi</span>
                  </div>
                ) : (
                  <span>{profile.display_name?.charAt(0) || profile.full_name?.charAt(0) || 'U'}</span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-serif-editorial text-2xl font-bold text-[#29252A]">
                    {profile.full_name}
                  </h1>
                  {profile.is_verified && (
                    <CheckCircle2 className="w-4 h-4 text-[#A95570] fill-[#F7E6EA]" />
                  )}
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      profile.gender === 'female' ? 'bg-[#FFF0F3] text-[#A95570]' : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {profile.gender === 'female' ? 'Akhwat' : 'Ikhwan'}
                  </span>
                </div>
                <p className="text-xs text-[#777078] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#A95570]" />
                  <span>{profile.city}, {profile.province}</span>
                </p>
              </div>
            </div>

            {/* ACTION BUTTON (STRICT GENDER LOGIC) */}
            <div>
              {isSelf ? (
                <Link
                  to="/cv-taaruf"
                  className="px-4 py-2.5 rounded-xl border border-[#A95570] text-[#A95570] font-semibold text-xs hover:bg-[#FFF5F7] transition flex items-center gap-1.5 shadow-xs"
                >
                  <User className="w-4 h-4" />
                  <span>Edit CV Taaruf Saya</span>
                </Link>
              ) : isSameGender ? (
                // DISABLED FOR SAME GENDER
                <div className="px-3.5 py-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 text-xs font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                  <span>Hanya untuk Lawan Jenis</span>
                </div>
              ) : isOppositeGender ? (
                // OPPOSITE GENDER ACTION
                canSendTaaruf ? (
                  <button
                    onClick={() => setTaarufModalOpen(true)}
                    className="px-6 py-2.5 rounded-xl bg-[#A95570] text-white font-semibold text-xs hover:bg-[#92435b] transition shadow-md shadow-[#A95570]/20 flex items-center gap-2 hover:-translate-y-0.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Ajukan Taaruf Syar'i</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setUpgradeModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#F7E6EA] text-[#A95570] font-semibold text-xs hover:bg-[#A95570] hover:text-white transition flex items-center gap-2 shadow-xs"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Buka Akses Taaruf (Upgrade)</span>
                  </button>
                )
              ) : null}
            </div>
          </div>

          {/* Demographic Attribute Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-[#F0E7E9] py-4 text-xs">
            <div className="space-y-1">
              <span className="text-[#777078] block">Profesi Saat Ini:</span>
              <p className="font-bold text-[#29252A] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#A95570]" />
                {profile.occupation || 'Profesional'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[#777078] block">Pendidikan Terakhir:</span>
              <p className="font-bold text-[#29252A] flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#A95570]" />
                {profile.education || 'S1'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[#777078] block">Usia & Tahun Lahir:</span>
              <p className="font-bold text-[#29252A] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#A95570]" />
                {2026 - profile.birth_year} Tahun ({profile.birth_year})
              </p>
            </div>
          </div>

          {/* Visi & Bio Diri */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A95570] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Visi & Kesiapan Menuju Pernikahan
            </h3>
            <div className="p-4 rounded-2xl bg-[#FFF5F7]/60 border border-[#F7E6EA] text-xs text-[#29252A] leading-relaxed">
              {profile.bio}
            </div>
          </div>

          {/* Syar'i Privacy Policy Notice */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-[#777078] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#A95570] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong className="text-[#29252A]">Prinsip Kerahasiaan Data:</strong> Kontak wali nasab, alamat lengkap, dan detail fisik mendalam hanya dibuka secara resmi setelah kedua pihak saling menyetujui pengajuan taaruf untuk melanjutkan ke tahap nadzor.
            </p>
          </div>
        </div>
      </div>

      {/* Send Taaruf Modal */}
      <SendTaarufModal
        isOpen={taarufModalOpen}
        onClose={() => setTaarufModalOpen(false)}
        targetProfile={profile}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />
    </div>
  );
};
