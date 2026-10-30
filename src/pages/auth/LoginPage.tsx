import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Heart, Lock, Mail, ArrowRight, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { signIn, demoLoginAs, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await signIn(email, password);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Terjadi kendala saat masuk akun');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: 'free' | 'premium' | 'admin') => {
    demoLoginAs(role);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFF5F7] to-white">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-[#F0E7E9] shadow-xl shadow-[#F7E6EA]/40">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#A95570] to-[#C77B91] flex items-center justify-center text-white mx-auto shadow-sm">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#29252A]">
            Selamat Datang Kembali
          </h2>
          <p className="text-xs text-[#777078]">
            Masuk untuk melanjutkan ikhtiar taaruf dan persiapan pernikahanmu
          </p>
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
          <div>
            <label className="block text-xs font-semibold text-[#29252A] mb-1.5">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#777078] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#F0E7E9] text-xs text-[#29252A] focus:outline-none focus:border-[#A95570] focus:ring-1 focus:ring-[#A95570]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#29252A] mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#777078] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#F0E7E9] text-xs text-[#29252A] focus:outline-none focus:border-[#A95570] focus:ring-1 focus:ring-[#A95570]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#A95570] text-white font-semibold text-xs hover:bg-[#92435b] transition shadow-md shadow-[#A95570]/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Masuk ke Akun</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Tester Persona Buttons */}
        <div className="pt-2 border-t border-[#F0E7E9] space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-[#777078]">
            <span className="font-semibold flex items-center gap-1 text-[#A95570]">
              <Sparkles className="w-3.5 h-3.5" />
              1-Click Akun Uji Coba:
            </span>
            <span className="text-[10px] text-gray-400">Instan tanpa form</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('free')}
              className="py-2 px-1 text-[11px] font-medium rounded-lg bg-[#FFF5F7] border border-[#F7E6EA] text-[#A95570] hover:bg-[#F7E6EA] transition text-center"
            >
              Member Free
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('premium')}
              className="py-2 px-1 text-[11px] font-medium rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-emerald-100 transition text-center"
            >
              Member Premium
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-2 px-1 text-[11px] font-medium rounded-lg bg-purple-50 border border-purple-100 text-purple-700 hover:bg-purple-100 transition text-center"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Footer Redirect */}
        <div className="text-center pt-2 text-xs text-[#777078]">
          Belum memiliki akun?{' '}
          <Link to="/register" className="font-bold text-[#A95570] hover:underline">
            Daftar Akun Baru (Free 7 Hari)
          </Link>
        </div>
      </div>
    </div>
  );
};
