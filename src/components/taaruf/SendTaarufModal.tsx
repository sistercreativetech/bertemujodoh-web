import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { sendTaarufRequest } from '@/services/taarufService';
import type { Profile } from '@/types/database';
import {
  X,
  Send,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Phone,
  User,
  Heart,
  Lock,
} from 'lucide-react';

interface SendTaarufModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfile: Profile;
  onSuccess?: () => void;
}

export const SendTaarufModal: React.FC<SendTaarufModalProps> = ({
  isOpen,
  onClose,
  targetProfile,
  onSuccess,
}) => {
  const { profile: myProfile, membership } = useAuth();
  const [introductionNote, setIntroductionNote] = useState('');
  const [waliPhone, setWaliPhone] = useState('');
  const [waliName, setWaliName] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !myProfile) return null;

  const isSameGender = myProfile.gender === targetProfile.gender;
  const isFreeTrial = membership?.tier === 'free_trial' || !membership?.can_send_taaruf;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isSameGender) {
      setErrorMessage('Pengajuan taaruf hanya diperbolehkan antara ikhwan dan akhwat (lawan jenis).');
      return;
    }

    if (!agreementChecked) {
      setErrorMessage('Harap setujui komitmen adab taaruf syar’i sebelum melanjutkan.');
      return;
    }

    if (!waliPhone.trim()) {
      setErrorMessage('Nomor kontak wali nasab wajib diisi demi menjaga kehormatan dan adab syariat.');
      return;
    }

    setSubmitting(true);
    try {
      const fullNote = waliName
        ? `${introductionNote.trim()}\n\n[Wali Nasab: ${waliName}]`
        : introductionNote.trim();

      const res = await sendTaarufRequest(myProfile, targetProfile, fullNote, waliPhone);

      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setSuccess(true);
        onSuccess?.();
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1800);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Gagal mengirim pengajuan taaruf');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-2xl border border-[#F0E7E9] my-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-neutral-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif-editorial text-2xl font-bold text-[#29252A]">
              Pengajuan Taaruf Berhasil Dikirim!
            </h3>
            <p className="text-xs text-[#777078] max-w-md mx-auto">
              Permintaan taaruf resmi telah diteruskan ke akun {targetProfile.full_name}. Anda dapat memantau status respon di menu "Pengajuan Taaruf".
            </p>
          </div>
        ) : (
          <>
            {/* Header with Target Profile Mini Info */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7E6EA] text-[#A95570] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pengajuan Taaruf Syar'i</span>
              </div>
              <h2 className="font-serif-editorial text-2xl font-bold text-[#29252A]">
                Ajukan Taaruf Resmi
              </h2>
              <p className="text-xs text-[#777078]">
                Mengajukan perkenalan terarah kepada calon pasangan dengan melibatkan wali.
              </p>
            </div>

            {/* Target Profile Card */}
            <div className="p-4 rounded-2xl bg-[#FFF5F7] border border-[#F7E6EA] flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#A95570] to-[#C77B91] text-white flex items-center justify-center font-bold text-sm uppercase">
                {targetProfile.display_name?.charAt(0) || targetProfile.full_name?.charAt(0) || 'U'}
              </div>
              <div className="space-y-0.5 text-left">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-[#29252A]">{targetProfile.full_name}</h4>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      targetProfile.gender === 'female' ? 'bg-[#FFF0F3] text-[#A95570]' : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {targetProfile.gender === 'female' ? 'Akhwat' : 'Ikhwan'}
                  </span>
                </div>
                <p className="text-[11px] text-[#777078]">
                  {targetProfile.occupation || 'Profesional'} • {targetProfile.city}, {targetProfile.province}
                </p>
              </div>
            </div>

            {/* STRICT GENDER LOGIC WARNING */}
            {isSameGender && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <span className="font-bold block">Peringatan Aturan Syariat:</span>
                  <span>
                    Anda ({myProfile.gender === 'female' ? 'Akhwat' : 'Ikhwan'}) tidak dapat mengajukan taaruf ke sesama jenis. Tombol pengajuan dinonaktifkan.
                  </span>
                </div>
              </div>
            )}

            {/* MEMBERSHIP RESTRICTION WARNING */}
            {isFreeTrial && !isSameGender && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                <Lock className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <div>
                  <span className="font-bold block">Akun Free Trial Terbatas:</span>
                  <span>
                    Paket Free Trial 7 Hari belum mengizinkan pengiriman taaruf. Silakan upgrade ke paket 1 Bulan (Rp 19rb) atau 6 Bulan (Rp 89rb) untuk mulai mengirim.
                  </span>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#29252A] mb-1">
                  Pesan Pembuka & Visi Awal Ikhtiar
                </label>
                <textarea
                  required
                  rows={3}
                  value={introductionNote}
                  onChange={(e) => setIntroductionNote(e.target.value)}
                  placeholder="Tuliskan salam, alasan ketertarikan secara visi, dan kesiapan waktu untuk komunikasi lanjutan..."
                  className="w-full p-3 rounded-xl border border-[#F0E7E9] text-xs text-[#29252A] focus:outline-none focus:border-[#A95570]"
                  disabled={isSameGender || isFreeTrial}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#29252A] mb-1">
                    Nama Wali Nasab
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-[#777078] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={waliName}
                      onChange={(e) => setWaliName(e.target.value)}
                      placeholder="Contoh: Ayah / Paman"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#F0E7E9] text-xs text-[#29252A] focus:outline-none focus:border-[#A95570]"
                      disabled={isSameGender || isFreeTrial}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#29252A] mb-1">
                    No. WhatsApp Wali Nasab
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#777078] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={waliPhone}
                      onChange={(e) => setWaliPhone(e.target.value)}
                      placeholder="0812xxxxxxxx"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#F0E7E9] text-xs text-[#29252A] focus:outline-none focus:border-[#A95570]"
                      disabled={isSameGender || isFreeTrial}
                    />
                  </div>
                </div>
              </div>

              {/* Syar'i Agreement Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                  className="mt-0.5 text-[#A95570] rounded"
                  disabled={isSameGender || isFreeTrial}
                />
                <span className="text-[11px] text-[#777078] leading-tight">
                  Saya berniat tulus untuk menikah, bersedia melibatkan wali nasab sejak awal, dan menjunjung tinggi adab Islam tanpa pacaran/chat bebas.
                </span>
              </label>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-[#F0E7E9] text-xs font-semibold text-[#777078] hover:bg-neutral-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submitting || isSameGender || isFreeTrial}
                  className="px-6 py-2.5 rounded-xl bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b] transition shadow-md shadow-[#A95570]/20 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Pengajuan Taaruf</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
