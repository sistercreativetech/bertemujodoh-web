import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Sparkles,
  CheckCircle2,
  Download,
  ShoppingBag,
  ShieldCheck,
  Star,
} from 'lucide-react';

export const TokoPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7E6EA] text-[#A95570] text-xs font-semibold">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Toko Produk Digital & Panduan Pranikah</span>
        </div>
        <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#29252A]">
          Koleksi E-Book & Planner Persiapan Menikah
        </h1>
        <p className="text-xs sm:text-sm text-[#777078] leading-relaxed">
          Bagi kamu yang ingin memiliki materi mandiri tanpa berlangganan penuh, kamu dapat membeli e-book kurikulum panduan pranikah dan template printable planner jodoh di bawah ini.
        </p>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Product 1: E-Book Pranikah */}
        <div className="bg-white rounded-3xl border border-[#F0E7E9] overflow-hidden hover:border-[#F7E6EA] hover:shadow-lg transition flex flex-col justify-between">
          <div className="p-8 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF5F7] text-[#A95570] flex items-center justify-center font-bold">
              <BookOpen className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#A95570] uppercase tracking-wider">
                Digital E-Book PDF & EPUB
              </span>
              <h3 className="font-serif-editorial text-2xl font-bold text-[#29252A]">
                Buku Panduan Lengkap Pranikah Islami (15 Bab)
              </h3>
              <p className="text-xs text-[#777078] leading-relaxed">
                Karya komprehensif mengupas tuntas: penyembuhan luka masa lalu, kriteria pasangan syar'i, adab nadzor & khitbah, fiqih mahar, hingga panduan malam pertama sesuai sunnah.
              </p>
            </div>

            <div className="border-t border-[#F0E7E9] pt-4 space-y-2 text-xs text-[#29252A]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Format PDF High-Res & EPUB (320 Halaman)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dilengkapi lembar pertanyaan taaruf penting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Akses baca selamanya (Download langsung)</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FFF5F7] p-6 border-t border-[#F7E6EA] flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 line-through">Rp 89.000</span>
              <div className="text-2xl font-bold text-[#A95570]">Rp 49.000</div>
            </div>
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-xl bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b] transition shadow-xs"
            >
              Beli Sekarang
            </Link>
          </div>
        </div>

        {/* Product 2: Jodoh Planner */}
        <div className="bg-white rounded-3xl border border-[#F0E7E9] overflow-hidden hover:border-[#F7E6EA] hover:shadow-lg transition flex flex-col justify-between">
          <div className="p-8 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF5F7] text-[#A95570] flex items-center justify-center font-bold">
              <Calendar className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#A95570] uppercase tracking-wider">
                Printable Planner & Notion Template
              </span>
              <h3 className="font-serif-editorial text-2xl font-bold text-[#29252A]">
                Jodoh Planner: Jurnal Ikhtiar Menuju Akad
              </h3>
              <p className="text-xs text-[#777078] leading-relaxed">
                Buku kerja harian untuk menata spiritual, kebiasaan baik, catatan doa hajat, tracking ibadah harian, hingga spreadsheet realistis anggaran pernikahan & KUA.
              </p>
            </div>

            <div className="border-t border-[#F0E7E9] pt-4 space-y-2 text-xs text-[#29252A]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Printable A4/A5 PDF Siap Cetak (60 Halaman)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bonus Link Duplicate Template Notion Pro</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Checklist administrasi syarat nikah KUA 2026</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FFF5F7] p-6 border-t border-[#F7E6EA] flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 line-through">Rp 65.000</span>
              <div className="text-2xl font-bold text-[#A95570]">Rp 35.000</div>
            </div>
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-xl bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b] transition shadow-xs"
            >
              Beli Sekarang
            </Link>
          </div>
        </div>
      </div>

      {/* Note about Membership Alternative */}
      <div className="max-w-4xl mx-auto bg-white border border-[#F0E7E9] rounded-2xl p-6 text-center space-y-2">
        <p className="text-xs font-semibold text-[#29252A]">
          💡 Tips Hemat: Seluruh materi E-Book & Planner ini otomatis dapat diakses GRATIS jika kamu mendaftar paket Membership (Mulai Rp 19.000/bulan)!
        </p>
        <Link
          to="/register"
          className="inline-block text-xs font-bold text-[#A95570] hover:underline"
        >
          Lihat Pilihan Membership Lengkap →
        </Link>
      </div>
    </div>
  );
};
