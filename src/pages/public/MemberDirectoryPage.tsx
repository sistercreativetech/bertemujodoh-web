import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Profile, Gender } from '@/types/database';
import {
  Users,
  Lock,
  Search,
  Filter,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

// Teaser mock profiles for public directory view
const TEASER_PROFILES: Partial<Profile>[] = [
  {
    id: 't-1',
    gender: 'female',
    birth_year: 1999, // 27 tahun in 2026
    city: 'Bandung',
    province: 'Jawa Barat',
    occupation: 'Guru Bahasa Arab & Tahfidz',
    education: 'S1 Pendidikan Bahasa Arab',
    bio: 'Menyukai kajian fiqih wanita, menjaga hafalan Al-Quran, gemar memasak pastry dan mengajar anak-anak.',
    privacy_level: 'blur_photo',
  },
  {
    id: 't-2',
    gender: 'male',
    birth_year: 1996, // 30 tahun
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    occupation: 'Software Engineer',
    education: 'S1 Teknik Informatika',
    bio: 'Gemar menuntut ilmu syar’i, olahraga renang dan lari, siap menjadi nakhoda keluarga yang bertanggung jawab.',
    privacy_level: 'blur_photo',
  },
  {
    id: 't-3',
    gender: 'female',
    birth_year: 2000, // 26 tahun
    city: 'Yogyakarta',
    province: 'DI Yogyakarta',
    occupation: 'Apoteker Klinis',
    education: 'Profesi Apoteker (S1 Farmasi)',
    bio: 'Pribadi ramah, senang membaca buku parenting islami, siap berbakti kepada suami dan keluarga.',
    privacy_level: 'blur_photo',
  },
  {
    id: 't-4',
    gender: 'male',
    birth_year: 1995, // 31 tahun
    city: 'Surabaya',
    province: 'Jawa Timur',
    occupation: 'Dokter Umum',
    education: 'Profesi Dokter',
    bio: 'Berusaha istiqomah shalat berjamaah di masjid, gemar membaca sirah nabawiyah, mencari pendamping shalihah.',
    privacy_level: 'blur_photo',
  },
  {
    id: 't-5',
    gender: 'female',
    birth_year: 1998, // 28 tahun
    city: 'Solo',
    province: 'Jawa Tengah',
    occupation: 'Desainer Grafis Freelance',
    education: 'S1 Desain Komunikasi Visual',
    bio: 'Hobi berkebun, crafting, dan membuat ilustrasi dakwah. Siap mendampingi suami dari nol.',
    privacy_level: 'blur_photo',
  },
  {
    id: 't-6',
    gender: 'male',
    birth_year: 1997, // 29 tahun
    city: 'Malang',
    province: 'Jawa Timur',
    occupation: 'Dosen Muda & Peneliti',
    education: 'S2 Sains Komputasi',
    bio: 'Karakter pendiam namun hangat, rutin menghadiri kajian ustadz ahlussunnah, mendambakan keluarga berilmu.',
    privacy_level: 'blur_photo',
  },
];

export const MemberDirectoryPage: React.FC = () => {
  const [selectedGender, setSelectedGender] = useState<'all' | Gender>('all');
  const [searchCity, setSearchCity] = useState('');
  const [profiles, setProfiles] = useState<Partial<Profile>[]>(TEASER_PROFILES);
  const currentYear = 2026;

  useEffect(() => {
    // If Supabase is connected, query public profiles
    if (isSupabaseConfigured()) {
      supabase
        .from('profiles')
        .select('id, gender, birth_year, city, province, occupation, education, bio, privacy_level')
        .limit(20)
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setProfiles(data);
          }
        });
    }
  }, []);

  const filtered = profiles.filter((p) => {
    const matchGender = selectedGender === 'all' || p.gender === selectedGender;
    const matchCity = !searchCity || p.city?.toLowerCase().includes(searchCity.toLowerCase());
    return matchGender && matchCity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FFF5F7] to-white border border-[#F7E6EA] rounded-3xl p-6 sm:p-10 text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7E6EA] text-[#A95570] text-xs font-semibold">
          <Users className="w-3.5 h-3.5" />
          <span>Katalog Teaser Anggota Taaruf</span>
        </div>
        <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#29252A]">
          Jelajahi Profil Calon Pasangan
        </h1>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#777078] leading-relaxed">
          Sesuai prinsip syariat Islam, foto asli dan data kontak personal diburamkan di ruang publik. Silakan masuk atau daftar akun untuk melihat biodata lengkap dan mengajukan taaruf.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#F0E7E9] flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Gender Tabs */}
        <div className="flex bg-[#FFF5F7] p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setSelectedGender('all')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedGender === 'all' ? 'bg-[#A95570] text-white shadow-xs' : 'text-[#777078] hover:text-[#29252A]'
            }`}
          >
            Semua ({profiles.length})
          </button>
          <button
            onClick={() => setSelectedGender('female')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedGender === 'female' ? 'bg-[#A95570] text-white shadow-xs' : 'text-[#777078] hover:text-[#29252A]'
            }`}
          >
            Akhwat (Wanita)
          </button>
          <button
            onClick={() => setSelectedGender('male')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedGender === 'male' ? 'bg-[#A95570] text-white shadow-xs' : 'text-[#777078] hover:text-[#29252A]'
            }`}
          >
            Ikhwan (Pria)
          </button>
        </div>

        {/* City Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#777078] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Cari kota domisili..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570] focus:ring-1 focus:ring-[#A95570]"
          />
        </div>
      </div>

      {/* Grid of Teaser Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, idx) => {
          const age = item.birth_year ? currentYear - item.birth_year : 25;
          const isFemale = item.gender === 'female';

          return (
            <div
              key={item.id || idx}
              className="bg-white rounded-2xl border border-[#F0E7E9] hover:border-[#F7E6EA] hover:shadow-md transition p-5 flex flex-col justify-between space-y-4 relative group"
            >
              {/* Header with Blurred Avatar and Gender Tag */}
              <div className="flex items-start gap-4">
                {/* Syar'i Blurred Avatar Placeholder */}
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-tr from-[#F7E6EA] to-[#FCEEF1] border border-[#F0E7E9] flex items-center justify-center shrink-0">
                  <div className="w-full h-full backdrop-blur-md flex items-center justify-center bg-white/40">
                    <Lock className="w-5 h-5 text-[#A95570]" />
                  </div>
                  <span className="absolute bottom-1 text-[9px] font-bold text-[#A95570] uppercase">
                    Privasi
                  </span>
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isFemale ? 'bg-[#FFF0F3] text-[#A95570]' : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {isFemale ? 'Akhwat' : 'Ikhwan'}
                    </span>
                    <span className="text-xs font-semibold text-[#29252A]">
                      {age} Tahun
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#29252A] line-clamp-1">
                    {item.occupation || 'Profesional Muslim'}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-[#777078]">
                    <MapPin className="w-3.5 h-3.5 text-[#A95570]" />
                    <span>{item.city}, {item.province}</span>
                  </div>
                </div>
              </div>

              {/* Education & Bio snippet */}
              <div className="space-y-2 text-xs text-[#777078] border-t border-[#F0E7E9] pt-3">
                {item.education && (
                  <div className="flex items-center gap-1.5 font-medium text-[#29252A]">
                    <GraduationCap className="w-3.5 h-3.5 text-[#A95570]" />
                    <span className="truncate">{item.education}</span>
                  </div>
                )}
                <p className="line-clamp-2 leading-relaxed italic text-[11px]">
                  "{item.bio || 'Berniat mencari pasangan yang shalih/shalihah untuk membangun rumah tangga barakah.'}"
                </p>
              </div>

              {/* Action Button */}
              <Link
                to={`/login`}
                className="w-full py-2.5 rounded-xl bg-[#FFF5F7] hover:bg-[#A95570] text-[#A95570] hover:text-white font-semibold text-xs text-center border border-[#F7E6EA] hover:border-[#A95570] transition flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Masuk untuk Ajukan Taaruf</span>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Bottom Conversion Prompt */}
      <div className="rounded-2xl bg-[#FFF5F7] border border-[#F7E6EA] p-6 text-center space-y-3">
        <h3 className="font-serif-editorial text-xl font-bold text-[#29252A]">
          Ingin Profilmu Ditampilkan & Mulai Menemukan Jodoh?
        </h3>
        <p className="text-xs text-[#777078] max-w-lg mx-auto">
          Daftarkan akunmu dalam 2 menit. Dapatkan Free Trial 7 Hari untuk menyusun CV Taaruf lengkap dan menjelajahi seluruh profil anggota.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#A95570] text-white font-semibold text-xs hover:bg-[#92435b] transition"
        >
          <span>Daftar Akun Gratis Sekarang</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
