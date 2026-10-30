import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Heart,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Bell,
  BookOpen,
  Calendar,
  FileText,
  Mail,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, profile, membership, signOut, isConfigured, demoLoginAs } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#F0E7E9]">
      {/* Top Banner: Supabase status & Quick Persona Switcher for reviewer */}
      <div className="bg-[#FFF5F7] border-b border-[#F7E6EA] text-xs py-1.5 px-4 text-[#777078]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#A95570]">
              <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              {isConfigured ? 'Supabase Connected' : 'Demo / Development Mode'}
            </span>
            <span className="hidden sm:inline text-neutral-300">|</span>
            <span className="hidden sm:inline">Platform Syar’i Menemukan Jodoh Menuju Pernikahan</span>
          </div>

          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white border border-[#F7E6EA] text-[11px] font-medium text-[#A95570] hover:bg-[#F7E6EA]/40 transition"
              title="Ganti persona untuk menguji akses"
            >
              <Sparkles className="w-3 h-3 text-[#A95570]" />
              Role Tester: <span className="font-bold underline">{profile?.role === 'admin' ? 'Admin' : membership?.tier === 'free_trial' ? 'Free (7 Hari)' : user ? 'Premium' : 'Guest'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {demoMenuOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-[#F0E7E9] py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#777078] font-semibold border-b border-[#F0E7E9]">
                  Pilih Role Pengujian:
                </div>
                <button
                  onClick={() => {
                    demoLoginAs('free');
                    setDemoMenuOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#29252A] hover:bg-[#FFF5F7] flex items-center justify-between"
                >
                  <span>Member Free (Trial)</span>
                  <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">7 Hari</span>
                </button>
                <button
                  onClick={() => {
                    demoLoginAs('premium');
                    setDemoMenuOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#29252A] hover:bg-[#FFF5F7] flex items-center justify-between"
                >
                  <span>Member Premium</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Full</span>
                </button>
                <button
                  onClick={() => {
                    demoLoginAs('admin');
                    setDemoMenuOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#29252A] hover:bg-[#FFF5F7] flex items-center justify-between"
                >
                  <span>Administrator</span>
                  <span className="text-[10px] text-[#A95570] bg-[#F7E6EA] px-1.5 py-0.5 rounded">Super</span>
                </button>
                <div className="border-t border-[#F0E7E9] mt-1 pt-1">
                  <button
                    onClick={() => {
                      handleSignOut();
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50"
                  >
                    Logout (Guest Mode)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#A95570] to-[#C77B91] flex items-center justify-center text-white shadow-sm shadow-[#A95570]/20 group-hover:scale-105 transition">
            <Heart className="w-5 h-5 fill-white/90" />
          </div>
          <div>
            <span className="font-serif-editorial text-xl font-bold tracking-tight text-[#29252A]">
              Bertemu<span className="text-[#A95570]">Jodoh</span>
            </span>
            <span className="block text-[10px] -mt-1 tracking-wider text-[#777078] uppercase font-semibold">
              bertemujodoh.my.id
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {!user ? (
            // PUBLIC GUEST LINKS
            <>
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/') ? 'text-[#A95570] bg-[#FFF5F7]' : 'text-[#29252A] hover:text-[#A95570]'
                }`}
              >
                Beranda
              </Link>
              <Link
                to="/daftar-member"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/daftar-member') ? 'text-[#A95570] bg-[#FFF5F7]' : 'text-[#29252A] hover:text-[#A95570]'
                }`}
              >
                Daftar Member
              </Link>
              <Link
                to="/undangan"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/undangan') ? 'text-[#A95570] bg-[#FFF5F7]' : 'text-[#29252A] hover:text-[#A95570]'
                }`}
              >
                Undangan Digital
              </Link>
              <Link
                to="/toko"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/toko') ? 'text-[#A95570] bg-[#FFF5F7]' : 'text-[#29252A] hover:text-[#A95570]'
                }`}
              >
                Toko & E-Book
              </Link>
              <Link
                to="/blog"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/blog') ? 'text-[#A95570] bg-[#FFF5F7]' : 'text-[#29252A] hover:text-[#A95570]'
                }`}
              >
                Artikel
              </Link>
            </>
          ) : (
            // AUTHENTICATED MEMBER LINKS
            <>
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/dashboard') ? 'text-[#A95570] bg-[#FFF5F7]' : 'text-[#29252A] hover:text-[#A95570]'
                }`}
              >
                Timeline Feed
              </Link>
              <Link
                to="/cv-taaruf"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/cv-taaruf') ? 'text-[#A95570] bg-[#FFF5F7]' : 'text-[#29252A] hover:text-[#A95570]'
                }`}
              >
                CV Taaruf
              </Link>
              <Link
                to="/taaruf"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/taaruf') ? 'text-[#A95570] bg-[#FFF5F7]' : 'text-[#29252A] hover:text-[#A95570]'
                }`}
              >
                Pengajuan Taaruf
              </Link>
              <Link
                to="/belajar"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/belajar') ? 'text-[#A95570] bg-[#FFF5F7]' : 'text-[#29252A] hover:text-[#A95570]'
                }`}
              >
                E-Library & Kajian
              </Link>
              <Link
                to="/planner"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/planner') ? 'text-[#A95570] bg-[#FFF5F7]' : 'text-[#29252A] hover:text-[#A95570]'
                }`}
              >
                Planner Jodoh
              </Link>
              <Link
                to="/surat-cinta"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/surat-cinta') ? 'text-[#A95570] bg-[#FFF5F7]' : 'text-[#29252A] hover:text-[#A95570]'
                }`}
              >
                Surat Cinta
              </Link>
              <Link
                to="/undangan-builder"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/undangan-builder') ? 'text-[#A95570] bg-[#FFF5F7]' : 'text-[#29252A] hover:text-[#A95570]'
                }`}
              >
                Undangan
              </Link>
              {profile?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-lg text-sm font-bold transition ${
                    isActive('/admin') ? 'text-purple-700 bg-purple-50' : 'text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  Admin
                </Link>
              )}
            </>
          )}
        </div>

        {/* Right CTA / Member Menu */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#29252A] hover:text-[#A95570] transition"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#A95570] text-white hover:bg-[#92435b] shadow-sm shadow-[#A95570]/30 transition hover:-translate-y-0.5"
              >
                Daftar Akun
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl border border-[#F0E7E9] hover:bg-[#FFF5F7] transition"
              >
                <div className="w-8 h-8 rounded-full bg-[#F7E6EA] text-[#A95570] flex items-center justify-center font-bold text-xs uppercase">
                  {profile?.display_name?.charAt(0) || profile?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-semibold text-[#29252A] line-clamp-1">
                    {profile?.display_name || profile?.full_name || 'Anggota'}
                  </div>
                  <div className="text-[10px] text-[#A95570] font-medium capitalize">
                    {membership?.tier.replace('_', ' ')}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-[#777078]" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#F0E7E9] py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-[#F0E7E9]">
                    <p className="text-xs font-medium text-[#777078]">Masuk sebagai:</p>
                    <p className="text-sm font-bold text-[#29252A] truncate">
                      {profile?.full_name}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F7E6EA] text-[#A95570] uppercase">
                        {membership?.tier === 'free_trial' ? 'Free Trial (7 Hari)' : membership?.tier}
                      </span>
                      {profile?.role === 'admin' && (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/profil/${profile?.id || 'me'}`}
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#29252A] hover:bg-[#FFF5F7]"
                  >
                    <UserIcon className="w-4 h-4 text-[#777078]" />
                    Lihat Profil Saya
                  </Link>
                  <Link
                    to="/undangan-builder"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#29252A] hover:bg-[#FFF5F7]"
                  >
                    <Sparkles className="w-4 h-4 text-[#A95570]" />
                    Undangan Digital Builder
                  </Link>
                  <Link
                    to="/pengaturan"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#29252A] hover:bg-[#FFF5F7]"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#777078]" />
                    Pengaturan & Membership
                  </Link>

                  {profile?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-purple-700 font-semibold hover:bg-purple-50"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      Super Admin Console
                    </Link>
                  )}

                  <div className="border-t border-[#F0E7E9] my-1" />

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar Akun
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#29252A] hover:bg-[#FFF5F7]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#F0E7E9] px-4 pt-2 pb-6 space-y-2">
          {!user ? (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#29252A] hover:bg-[#FFF5F7]"
              >
                Beranda
              </Link>
              <Link
                to="/daftar-member"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#29252A] hover:bg-[#FFF5F7]"
              >
                Daftar Member (Teaser)
              </Link>
              <Link
                to="/undangan"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#29252A] hover:bg-[#FFF5F7]"
              >
                Undangan Digital
              </Link>
              <Link
                to="/toko"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#29252A] hover:bg-[#FFF5F7]"
              >
                Toko Ebook & Planner
              </Link>
              <Link
                to="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#29252A] hover:bg-[#FFF5F7]"
              >
                Artikel Pranikah
              </Link>
              <div className="pt-4 border-t border-[#F0E7E9] flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-[#F0E7E9] text-sm font-semibold text-[#29252A]"
                >
                  Masuk Akun
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-[#A95570] text-sm font-semibold text-white shadow-sm"
                >
                  Daftar Sekarang
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="px-3 py-2 bg-[#FFF5F7] rounded-xl flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-semibold text-[#29252A]">{profile?.full_name}</p>
                  <p className="text-[10px] text-[#A95570] uppercase font-bold">{membership?.tier}</p>
                </div>
                <span className="text-xs text-[#777078] bg-white px-2 py-0.5 rounded border border-[#F0E7E9]">
                  {profile?.gender === 'male' ? 'Ikhwan' : 'Akhwat'}
                </span>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#29252A] hover:bg-[#FFF5F7]"
              >
                Timeline Feed
              </Link>
              <Link
                to="/cv-taaruf"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#29252A] hover:bg-[#FFF5F7]"
              >
                CV Taaruf
              </Link>
              <Link
                to="/taaruf"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#29252A] hover:bg-[#FFF5F7]"
              >
                Pengajuan Taaruf
              </Link>
              <Link
                to="/belajar"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#29252A] hover:bg-[#FFF5F7]"
              >
                E-Library & Kajian
              </Link>
              <Link
                to="/planner"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#29252A] hover:bg-[#FFF5F7]"
              >
                Planner Jodoh
              </Link>
              <Link
                to="/surat-cinta"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#29252A] hover:bg-[#FFF5F7]"
              >
                Surat Cinta untuk Jodoh
              </Link>
              <Link
                to="/undangan-builder"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#29252A] hover:bg-[#FFF5F7]"
              >
                Undangan Digital Builder
              </Link>
              {profile?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-bold text-purple-700 bg-purple-50"
                >
                  Super Admin Console
                </Link>
              )}
              <Link
                to="/pengaturan"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#29252A] hover:bg-[#FFF5F7]"
              >
                Pengaturan Akun & Paket
              </Link>
              <div className="pt-2 border-t border-[#F0E7E9]">
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-rose-600 font-medium"
                >
                  Keluar Akun
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
