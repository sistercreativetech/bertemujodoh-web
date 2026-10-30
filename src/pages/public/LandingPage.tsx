import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShieldCheck,
  BookOpen,
  Calendar,
  Sparkles,
  CheckCircle2,
  Users,
  Lock,
  ArrowRight,
  FileCheck,
  Star,
  Compass,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-[#FFF5F7] via-white to-white">
        {/* Soft background decor circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#F7E6EA]/60 to-[#FCEEF1]/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F7E6EA] border border-[#F0D5DC] text-xs font-semibold text-[#A95570] animate-fade-in shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Pendamping Ikhtiar Pranikah & Taaruf Syar'i</span>
          </div>

          <h1 className="font-serif-editorial text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#29252A] max-w-4xl mx-auto leading-tight">
            Menata Diri, Menyusun Ikhtiar,{' '}
            <span className="text-[#A95570] italic">Menjemput Takdir</span> Menuju Pernikahan.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#777078] leading-relaxed">
            Bukan sekadar aplikasi cari jodoh. Kami mendampingimu memperbaiki diri, belajar ilmu pranikah, membuat CV Taaruf elegan, hingga merencanakan pernikahan yang diridai Allah.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#A95570] text-white font-semibold text-base hover:bg-[#92435b] shadow-lg shadow-[#A95570]/25 transition hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Mulai Free Trial 7 Hari</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/daftar-member"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-[#F0E7E9] bg-white text-[#29252A] font-semibold text-base hover:bg-[#FFF5F7] hover:border-[#F7E6EA] transition flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4 text-[#A95570]" />
              <span>Lihat Anggota (Teaser)</span>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-[#777078]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A95570]" />
              <span>100% Taaruf Sesuai Syariat</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#A95570]" />
              <span>Foto Buram & Privasi Terjaga</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#A95570]" />
              <span>Libatkan Perantara & Wali</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 PILAR UTAMA IKHTIAR */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A95570]">
            Sistem Terpadu
          </span>
          <h2 className="font-serif-editorial text-3xl font-bold text-[#29252A]">
            Perjalanan Lengkap Dari Memperbaiki Diri Hingga Pelaminan
          </h2>
          <p className="text-sm text-[#777078]">
            Setiap tahapan dirancang menjaga kehormatan, keikhlasan, dan kejelasan visi berumah tangga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-[#F0E7E9] hover:border-[#F7E6EA] hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF5F7] text-[#A95570] flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#29252A]">1. Refleksi & CV Taaruf</h3>
            <p className="text-xs text-[#777078] leading-relaxed">
              Susun portofolio diri, visi pernikahan, dan kriteria pasangan melalui wizard CV Taaruf rapi yang dapat dicetak PDF resmi.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-[#F0E7E9] hover:border-[#F7E6EA] hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF5F7] text-[#A95570] flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#29252A]">2. Belajar Ilmu Pranikah</h3>
            <p className="text-xs text-[#777078] leading-relaxed">
              Akses e-library dan video kajian fiqih pernikahan, komunikasi pasutri, dan manajemen finansial keluarga.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-[#F0E7E9] hover:border-[#F7E6EA] hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF5F7] text-[#A95570] flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#29252A]">3. Taaruf Terarah</h3>
            <p className="text-xs text-[#777078] leading-relaxed">
              Jelajahi profil yang cocok dengan kriteria syar'i. Kirim pengajuan taaruf aman tanpa chat bebas dan melibatkan perantara wali.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-white border border-[#F0E7E9] hover:border-[#F7E6EA] hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF5F7] text-[#A95570] flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#29252A]">4. Planner & Undangan</h3>
            <p className="text-xs text-[#777078] leading-relaxed">
              Persiapkan hari pernikahan dengan checklist KUA, wedding budget planner, dan builder undangan digital yang menawan.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A95570]">
            Paket Membership
          </span>
          <h2 className="font-serif-editorial text-3xl font-bold text-[#29252A]">
            Investasi Terjangkau Menjemput Masa Depan
          </h2>
          <p className="text-sm text-[#777078]">
            Mulai dari Free Trial 7 Hari tanpa komitmen, upgrade kapan saja untuk akses pengajuan taaruf dan materi premium.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
          {/* FREE TRIAL */}
          <div className="bg-white rounded-2xl border border-[#F0E7E9] p-6 flex flex-col justify-between hover:shadow-sm transition">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                Uji Coba
              </div>
              <h3 className="font-bold text-xl text-[#29252A]">Free Trial</h3>
              <p className="text-xs text-[#777078]">Masa aktif 7 Hari untuk mengenal ekosistem.</p>
              <div className="pt-2">
                <span className="text-3xl font-bold text-[#29252A]">Rp 0</span>
                <span className="text-xs text-[#777078]"> / 7 hari</span>
              </div>

              <div className="border-t border-[#F0E7E9] pt-4 space-y-2.5 text-xs text-[#29252A]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Buat CV Taaruf Rapi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Akses Feed Komunitas</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="w-4 h-4 text-center leading-4 font-bold">✕</span>
                  <span>Tidak bisa kirim Taaruf</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="w-4 h-4 text-center leading-4 font-bold">✕</span>
                  <span>E-book & video terkunci</span>
                </div>
              </div>
            </div>

            <Link
              to="/register"
              className="mt-6 w-full py-2.5 rounded-xl border border-[#A95570] text-[#A95570] font-semibold text-xs text-center hover:bg-[#FFF5F7] transition"
            >
              Daftar Free Trial
            </Link>
          </div>

          {/* 1 MONTH */}
          <div className="bg-white rounded-2xl border border-[#F0E7E9] p-6 flex flex-col justify-between hover:shadow-sm transition">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-[#F7E6EA] text-[#A95570]">
                1 Bulan
              </div>
              <h3 className="font-bold text-xl text-[#29252A]">Bulanan</h3>
              <p className="text-xs text-[#777078]">Cocok untuk mulai ikhtiar aktif taaruf.</p>
              <div className="pt-2">
                <span className="text-3xl font-bold text-[#29252A]">Rp 19.000</span>
                <span className="text-xs text-[#777078]"> / bulan</span>
              </div>

              <div className="border-t border-[#F0E7E9] pt-4 space-y-2.5 text-xs text-[#29252A]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kirim Pengajuan Taaruf</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ekspor CV Taaruf PDF</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Akses Semua E-book & Video</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Planner Jodoh Interaktif</span>
                </div>
              </div>
            </div>

            <Link
              to="/register"
              className="mt-6 w-full py-2.5 rounded-xl bg-[#A95570] text-white font-semibold text-xs text-center hover:bg-[#92435b] transition shadow-xs"
            >
              Pilih 1 Bulan
            </Link>
          </div>

          {/* 6 MONTHS (MOST POPULAR) */}
          <div className="bg-white rounded-2xl border-2 border-[#A95570] p-6 flex flex-col justify-between shadow-md relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#A95570] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              Paling Populer
            </div>
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-[#F7E6EA] text-[#A95570]">
                Hemat 22%
              </div>
              <h3 className="font-bold text-xl text-[#29252A]">6 Bulan</h3>
              <p className="text-xs text-[#777078]">Durasi ideal persiapan mental dan taaruf.</p>
              <div className="pt-2">
                <div className="text-xs text-gray-400 line-through">Rp 114.000</div>
                <span className="text-3xl font-bold text-[#A95570]">Rp 89.000</span>
                <span className="text-xs text-[#777078]"> / 6 bulan</span>
              </div>

              <div className="border-t border-[#F0E7E9] pt-4 space-y-2.5 text-xs text-[#29252A]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Semua Fitur Bulanan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Prioritas Review CV Taaruf</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Builder Undangan Digital</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Wedding Budget Planner</span>
                </div>
              </div>
            </div>

            <Link
              to="/register"
              className="mt-6 w-full py-2.5 rounded-xl bg-[#A95570] text-white font-semibold text-xs text-center hover:bg-[#92435b] transition shadow-md shadow-[#A95570]/20"
            >
              Pilih 6 Bulan
            </Link>
          </div>

          {/* 12 MONTHS */}
          <div className="bg-white rounded-2xl border border-[#F0E7E9] p-6 flex flex-col justify-between hover:shadow-sm transition">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                Hemat 35%
              </div>
              <h3 className="font-bold text-xl text-[#29252A]">12 Bulan</h3>
              <p className="text-xs text-[#777078]">Pendampingan penuh sampai akad & walimah.</p>
              <div className="pt-2">
                <div className="text-xs text-gray-400 line-through">Rp 228.000</div>
                <span className="text-3xl font-bold text-[#29252A]">Rp 149.000</span>
                <span className="text-xs text-[#777078]"> / tahun</span>
              </div>

              <div className="border-t border-[#F0E7E9] pt-4 space-y-2.5 text-xs text-[#29252A]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Akses Penuh Semua Modul</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Undangan Digital Tanpa Batas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Konsultasi Syar'i Pranikah</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Update Modul Seumur Hidup</span>
                </div>
              </div>
            </div>

            <Link
              to="/register"
              className="mt-6 w-full py-2.5 rounded-xl border border-[#A95570] text-[#A95570] font-semibold text-xs text-center hover:bg-[#FFF5F7] transition"
            >
              Pilih 12 Bulan
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#A95570] to-[#C77B91] p-8 sm:p-12 text-white text-center space-y-6 shadow-xl shadow-[#A95570]/20">
          <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold max-w-2xl mx-auto">
            Siap Memulai Ikhtiar yang Bersih, Terhormat, dan Penuh Berkah?
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-white/90">
            Bergabunglah bersama ribuan ikhwan dan akhwat yang berniat tulus membangun keluarga sakinah mawaddah warahmah.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-[#A95570] font-bold text-sm hover:bg-neutral-50 shadow-md transition hover:scale-105"
            >
              <span>Daftar Sekarang — Gratis 7 Hari</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
