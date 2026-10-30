import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { Gender } from '@/types/database';
import {
  Heart,
  Mail,
  Lock,
  User,
  MapPin,
  Briefcase,
  Calendar,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<Gender>('female');
  const [birthYear, setBirthYear] = useState<number>(1999);
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [occupation, setOccupation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      const res = await signUp({
        email,
        password,
        fullName,
        gender,
        birthYear: Number(birthYear),
        city,
        province,
        occupation,
      });

      if (res.error) {
        setErrorMessage(res.error);
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Pendaftaran gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFF5F7] to-white">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-[#F0E7E9] shadow-xl shadow-[#F7E6EA]/40">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#A95570] to-[#C77B91] flex items-center justify-center text-white mx-auto shadow-sm">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#29252A]">
            Daftar Anggota Bertemu Jodoh
          </h2>
          <p className="text-xs text-[#777078]">
            Dapatkan akses <span className="font-bold text-[#A95570]">Free Trial 7 Hari</span> langsung aktif setelah pendaftaran!
          </p>
        </div>

        {/* Free Trial Perks Banner */}
        <div className="p-3.5 bg-[#FFF5F7] border border-[#F7E6EA] rounded-2xl flex items-center justify-around text-xs text-[#A95570] font-semibold">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free Trial 7 Hari
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Buat CV Taaruf
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#A95570]" /> Data Terjaga Syar'i
          </span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#29252A] mb-1">
              Nama Lengkap Sesuai KTP
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#777078] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Muhammad Rizky Pratama"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#F0E7E9] text-xs text-[#29252A] focus:outline-none focus:border-[#A95570]"
              />
            </div>
          </div>

          {/* Gender & Birth Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                Jenis Kelamin
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    gender === 'female'
                      ? 'bg-[#FFF0F3] border-[#A95570] text-[#A95570]'
                      : 'border-[#F0E7E9] text-[#777078] hover:bg-[#FFF5F7]'
                  }`}
                >
                  Akhwat (Wanita)
                </button>
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    gender === 'male'
                      ? 'bg-blue-50 border-blue-600 text-blue-700'
                      : 'border-[#F0E7E9] text-[#777078] hover:bg-[#FFF5F7]'
                  }`}
                >
                  Ikhwan (Pria)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                Tahun Kelahiran
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#777078] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  required
                  min={1960}
                  max={2008}
                  value={birthYear}
                  onChange={(e) => setBirthYear(Number(e.target.value))}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#F0E7E9] text-xs text-[#29252A] focus:outline-none focus:border-[#A95570]"
                />
              </div>
            </div>
          </div>

          {/* Domisili (Kota & Provinsi) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                Kota Domisili
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#777078] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Contoh: Bandung"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#F0E7E9] text-xs text-[#29252A] focus:outline-none focus:border-[#A95570]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                Provinsi
              </label>
              <input
                type="text"
                required
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="Contoh: Jawa Barat"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0E7E9] text-xs text-[#29252A] focus:outline-none focus:border-[#A95570]"
              />
            </div>
          </div>

          {/* Pekerjaan */}
          <div>
            <label className="block text-xs font-semibold text-[#29252A] mb-1">
              Profesi / Pekerjaan Saat Ini
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-[#777078] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="Contoh: Guru, Software Engineer, Wiraswasta"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#F0E7E9] text-xs text-[#29252A] focus:outline-none focus:border-[#A95570]"
              />
            </div>
          </div>

          {/* Email & Password */}
          <div>
            <label className="block text-xs font-semibold text-[#29252A] mb-1">
              Alamat Email Aktif
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#777078] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@anda.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#F0E7E9] text-xs text-[#29252A] focus:outline-none focus:border-[#A95570]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#29252A] mb-1">
              Kata Sandi (Minimal 6 Karakter)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#777078] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#F0E7E9] text-xs text-[#29252A] focus:outline-none focus:border-[#A95570]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#A95570] text-white font-semibold text-xs hover:bg-[#92435b] transition shadow-md shadow-[#A95570]/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Daftar Sekarang & Mulai Free Trial 7 Hari</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Redirect */}
        <div className="text-center pt-2 text-xs text-[#777078]">
          Sudah memiliki akun terdaftar?{' '}
          <Link to="/login" className="font-bold text-[#A95570] hover:underline">
            Masuk ke Akun
          </Link>
        </div>
      </div>
    </div>
  );
};
