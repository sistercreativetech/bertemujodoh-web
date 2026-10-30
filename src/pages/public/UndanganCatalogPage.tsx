import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Eye,
  Heart,
  Palette,
  CheckCircle,
  Smartphone,
  Music,
  MapPin,
  Calendar,
  Gift,
} from 'lucide-react';

interface InvitationTheme {
  id: string;
  name: string;
  category: string;
  colorScheme: string;
  description: string;
  imageAccent: string;
}

const THEMES: InvitationTheme[] = [
  {
    id: 'sakura-blush',
    name: 'Sakura Blush & Rose Gold',
    category: 'Romantis & Minimalis',
    colorScheme: 'Blush Pink & Rose',
    description: 'Nuansa bunga sakura lembut dengan aksen kaligrafi basmalah kontemporer.',
    imageAccent: 'from-[#FFF0F3] to-[#FCE4EC]',
  },
  {
    id: 'emerald-syari',
    name: 'Royal Emerald Syar’i',
    category: 'Elegan Islami',
    colorScheme: 'Hijau Zamrud & Emas',
    description: 'Kesan agung dan teduh dengan ornamen arabesque islami tanpa gambar bernyawa.',
    imageAccent: 'from-emerald-50 to-teal-100',
  },
  {
    id: 'ivory-minimalist',
    name: 'Ivory Pure Monochrome',
    category: 'Modern Clean',
    colorScheme: 'Putih Tulang & Abu Hangat',
    description: 'Desain bersih dengan tipografi serif editorial modern yang memikat.',
    imageAccent: 'from-amber-50 to-stone-100',
  },
  {
    id: 'terracotta-earth',
    name: 'Terracotta Warmth',
    category: 'Warm Bohemian',
    colorScheme: 'Terracotta & Sand Beige',
    description: 'Warna tanah yang hangat, hangat untuk resepsi semi-outdoor dan intim.',
    imageAccent: 'from-orange-50 to-amber-100',
  },
];

export const UndanganCatalogPage: React.FC = () => {
  const [activePreview, setActivePreview] = useState<InvitationTheme | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7E6EA] text-[#A95570] text-xs font-semibold">
          <Palette className="w-3.5 h-3.5" />
          <span>Katalog Tema Undangan Pernikahan Digital</span>
        </div>
        <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#29252A]">
          Bagikan Kebahagiaan Menuju Hari Akad & Walimah
        </h1>
        <p className="text-xs sm:text-sm text-[#777078] leading-relaxed">
          Pilihan template responsif ramah smartphone dengan hitung mundur (countdown), navigasi Google Maps, doa tamu & konfirmasi kehadiran (RSVP), serta amplop digital amanah.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/undangan/alif-dan-nisa"
            className="px-4 py-2.5 rounded-xl bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b] transition flex items-center gap-1.5 shadow-sm shadow-[#A95570]/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Lihat Contoh Undangan Full Live</span>
          </Link>
          <Link
            to="/undangan-builder"
            className="px-4 py-2.5 rounded-xl border border-[#F0E7E9] bg-white text-xs font-semibold text-[#29252A] hover:bg-[#FFF5F7] transition flex items-center gap-1.5"
          >
            <Smartphone className="w-4 h-4 text-[#A95570]" />
            <span>Buka Editor Undangan (CMS)</span>
          </Link>
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {THEMES.map((theme) => (
          <div
            key={theme.id}
            className="bg-white rounded-2xl border border-[#F0E7E9] overflow-hidden hover:border-[#F7E6EA] hover:shadow-lg transition flex flex-col justify-between"
          >
            {/* Visual Phone Mockup Card */}
            <div className={`h-56 bg-gradient-to-br ${theme.imageAccent} p-4 flex flex-col items-center justify-center relative group`}>
              <div className="w-32 h-44 bg-white rounded-2xl shadow-md border border-white/80 p-3 flex flex-col items-center justify-between text-center transform group-hover:scale-105 transition">
                <span className="text-[9px] text-[#A95570] font-bold uppercase tracking-widest">
                  Walimatul Ursy
                </span>
                <div className="font-serif-editorial text-xs font-bold text-[#29252A] leading-tight">
                  Aisyah & Rizky
                </div>
                <div className="text-[8px] text-[#777078]">
                  Ahad, 25 Oktober 2026
                </div>
                <div className="w-full h-1 bg-[#F7E6EA] rounded-full" />
              </div>

              <button
                onClick={() => setActivePreview(theme)}
                className="absolute inset-0 bg-[#A95570]/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 text-white text-xs font-semibold backdrop-blur-xs"
              >
                <Eye className="w-4 h-4" />
                <span>Lihat Preview Tema</span>
              </button>
            </div>

            {/* Content Details */}
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold text-[#A95570] uppercase">
                  {theme.category}
                </span>
                <h3 className="font-bold text-sm text-[#29252A] mt-0.5">{theme.name}</h3>
                <p className="text-xs text-[#777078] mt-1 line-clamp-2 leading-relaxed">
                  {theme.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0E7E9] flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Tersedia di Paket 6 & 12 Bulan
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Highlights */}
      <div className="bg-[#FFF5F7] rounded-3xl p-6 sm:p-8 border border-[#F7E6EA] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="space-y-2">
          <Smartphone className="w-6 h-6 text-[#A95570] mx-auto" />
          <h4 className="font-bold text-xs text-[#29252A]">100% Mobile Friendly</h4>
          <p className="text-[11px] text-[#777078]">Tampilan optimal di layar ponsel tamu undangan.</p>
        </div>
        <div className="space-y-2">
          <Calendar className="w-6 h-6 text-[#A95570] mx-auto" />
          <h4 className="font-bold text-xs text-[#29252A]">Countdown Akad</h4>
          <p className="text-[11px] text-[#777078]">Penghitung waktu mundur otomatis sampai hari H.</p>
        </div>
        <div className="space-y-2">
          <MapPin className="w-6 h-6 text-[#A95570] mx-auto" />
          <h4 className="font-bold text-xs text-[#29252A]">Google Maps Venue</h4>
          <p className="text-[11px] text-[#777078]">Petunjuk arah langsung ke lokasi masjid / gedung.</p>
        </div>
        <div className="space-y-2">
          <Gift className="w-6 h-6 text-[#A95570] mx-auto" />
          <h4 className="font-bold text-xs text-[#29252A]">Amplop Digital</h4>
          <p className="text-[11px] text-[#777078]">Salin nomor rekening & QRIS hadiah tanpa potongan.</p>
        </div>
      </div>

      {/* Preview Modal */}
      {activePreview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setActivePreview(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold text-[#A95570] uppercase">
                Demo Tema
              </span>
              <h3 className="font-serif-editorial text-xl font-bold text-[#29252A]">
                {activePreview.name}
              </h3>
              <p className="text-xs text-[#777078]">{activePreview.description}</p>
            </div>

            {/* Mock phone preview */}
            <div className="border-4 border-neutral-800 rounded-2xl p-4 bg-gradient-to-b from-[#FFF5F7] to-white text-center space-y-3">
              <p className="text-[10px] font-medium text-[#777078]">Maha Suci Allah yang telah menciptakan pasangan-pasangan...</p>
              <h4 className="font-serif-editorial text-lg font-bold text-[#A95570]">Fulan & Fulanah</h4>
              <p className="text-xs text-[#29252A]">Ahad, 25 Oktober 2026</p>
              <div className="bg-white p-2 rounded-xl border border-[#F0E7E9] text-[10px] text-[#777078]">
                Masjid Agung Jawa Barat, Bandung
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Link
                to="/register"
                onClick={() => setActivePreview(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#A95570] text-white text-xs font-semibold text-center hover:bg-[#92435b]"
              >
                Gunakan Tema Ini (Daftar)
              </Link>
              <button
                onClick={() => setActivePreview(null)}
                className="px-4 py-2.5 rounded-xl border border-[#F0E7E9] text-xs font-semibold text-[#777078]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
