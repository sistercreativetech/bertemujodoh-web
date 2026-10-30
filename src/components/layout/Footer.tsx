import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Lock, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#F0E7E9] text-[#777078] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#A95570] flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="font-serif-editorial text-lg font-bold text-[#29252A]">
                Bertemu<span className="text-[#A95570]">Jodoh</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              Platform pendamping ikhtiar pernikahan Islami terpadu: perbaikan diri, edukasi pranikah, CV taaruf syar’i, dan persiapan rumah tangga samara.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#A95570] font-medium bg-[#FFF5F7] px-2.5 py-1.5 rounded-lg border border-[#F7E6EA] w-fit">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Privasi Terjaga & Sesuai Adab Syar'i</span>
            </div>
          </div>

          {/* Navigasi Utama */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#29252A] mb-3">
              Jelajahi Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/daftar-member" className="hover:text-[#A95570] transition">
                  Daftar Anggota Taaruf
                </Link>
              </li>
              <li>
                <Link to="/undangan" className="hover:text-[#A95570] transition">
                  Katalog Undangan Digital
                </Link>
              </li>
              <li>
                <Link to="/toko" className="hover:text-[#A95570] transition">
                  Toko Ebook & Planner
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#A95570] transition">
                  Artikel & Tips Pranikah
                </Link>
              </li>
            </ul>
          </div>

          {/* Fitur Member */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#29252A] mb-3">
              Fitur Anggota
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="hover:text-[#A95570] transition">
                  Timeline Feed Komunitas
                </Link>
              </li>
              <li>
                <Link to="/cv-taaruf" className="hover:text-[#A95570] transition">
                  CV Taaruf Builder
                </Link>
              </li>
              <li>
                <Link to="/belajar" className="hover:text-[#A95570] transition">
                  Modul Belajar & Video Kajian
                </Link>
              </li>
              <li>
                <Link to="/planner" className="hover:text-[#A95570] transition">
                  Jodoh Planner Interaktif
                </Link>
              </li>
              <li>
                <Link to="/surat-cinta" className="hover:text-[#A95570] transition">
                  Surat Cinta untuk Jodoh
                </Link>
              </li>
            </ul>
          </div>

          {/* Syariah & Keamanan */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#29252A] mb-3">
              Prinsip & Keamanan
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#A95570]" />
                <span>Foto diburamkan secara syar'i</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A95570]" />
                <span>Tanpa chat bebas tanpa wali</span>
              </li>
              <li className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#A95570]" />
                <span>Bimbingan adab nadzor & khitbah</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#F0E7E9] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#777078]">
          <p>© {new Date().getFullYear()} bertemujodoh.my.id. Hak cipta dilindungi undang-undang.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span>Kebijakan Privasi</span>
            <span>•</span>
            <span>Syarat & Ketentuan</span>
            <span>•</span>
            <span>Bantuan & Kontak</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
