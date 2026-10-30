import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  MEMBERSHIP_PLANS,
  upgradeMembershipPlan,
  type MembershipPlan,
} from '@/services/membershipService';
import type { MembershipTier } from '@/types/database';
import {
  X,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  QrCode,
  ArrowRight,
  Heart,
} from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTier?: MembershipTier;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  defaultTier = '6_months',
}) => {
  const { user, profile, refreshProfile } = useAuth();
  const [selectedTier, setSelectedTier] = useState<MembershipTier>(
    defaultTier === 'free_trial' ? '6_months' : defaultTier
  );
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca' | 'bsi' | 'gopay'>('qris');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const currentPlan = MEMBERSHIP_PLANS[selectedTier];

  const handleUpgrade = async () => {
    if (!user) return;
    setProcessing(true);

    try {
      const res = await upgradeMembershipPlan(user.id, selectedTier, paymentMethod);
      if (res.data) {
        setSuccess(true);
        await refreshProfile();
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1800);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl border border-[#F0E7E9] my-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-neutral-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif-editorial text-2xl font-bold text-[#29252A]">
              Alhamdulillah! Paket Berhasil Diaktifkan
            </h3>
            <p className="text-xs text-[#777078] max-w-md mx-auto">
              Akun Anda kini berstatus <span className="font-bold text-[#A95570]">{currentPlan.name}</span>. Seluruh fitur pengajuan taaruf dan materi pranikah telah terbuka.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7E6EA] text-[#A95570] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Investasi Ikhtiar Pranikah</span>
              </div>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#29252A]">
                Pilih Paket Membership Anda
              </h2>
              <p className="text-xs text-[#777078] max-w-lg mx-auto">
                Buka akses pengajuan taaruf ke lawan jenis, kurikulum e-book 15 bab, dan konsultasi asatidz tanpa batasan.
              </p>
            </div>

            {/* Plan Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['1_month', '6_months', '12_months'] as MembershipTier[]).map((tierKey) => {
                const plan = MEMBERSHIP_PLANS[tierKey];
                const isSelected = selectedTier === tierKey;

                return (
                  <div
                    key={tierKey}
                    onClick={() => setSelectedTier(tierKey)}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between relative ${
                      isSelected
                        ? 'border-[#A95570] bg-[#FFF5F7]'
                        : 'border-[#F0E7E9] bg-white hover:border-[#F7E6EA]'
                    }`}
                  >
                    {plan.discountBadge && (
                      <span className="absolute -top-2.5 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#A95570] text-white tracking-wider">
                        {plan.discountBadge}
                      </span>
                    )}

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[#A95570] uppercase">
                        {plan.name}
                      </span>
                      <div className="pt-1">
                        {plan.originalPrice && (
                          <span className="text-[10px] text-gray-400 line-through block">
                            Rp {plan.originalPrice.toLocaleString('id-ID')}
                          </span>
                        )}
                        <span className="text-lg font-bold text-[#29252A]">
                          Rp {plan.price.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#777078] leading-tight pt-1">
                        {plan.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#F0E7E9] flex items-center justify-between text-[11px]">
                      <span className="font-medium text-[#777078]">{plan.durationLabel}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#A95570] bg-[#A95570]' : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Plan Features List */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
              <span className="text-xs font-bold text-[#29252A] block">
                Fasilitas Termasuk dalam {currentPlan.name}:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#29252A]">
                {currentPlan.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#29252A] block">
                Metode Pembayaran (Simulasi Instan):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    paymentMethod === 'qris'
                      ? 'border-[#A95570] bg-[#FFF5F7] text-[#A95570]'
                      : 'border-[#F0E7E9] text-[#777078] hover:bg-neutral-50'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>QRIS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bsi')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    paymentMethod === 'bsi'
                      ? 'border-[#A95570] bg-[#FFF5F7] text-[#A95570]'
                      : 'border-[#F0E7E9] text-[#777078] hover:bg-neutral-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>BSI Syariah</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bca')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    paymentMethod === 'bca'
                      ? 'border-[#A95570] bg-[#FFF5F7] text-[#A95570]'
                      : 'border-[#F0E7E9] text-[#777078] hover:bg-neutral-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Bank BCA</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('gopay')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    paymentMethod === 'gopay'
                      ? 'border-[#A95570] bg-[#FFF5F7] text-[#A95570]'
                      : 'border-[#F0E7E9] text-[#777078] hover:bg-neutral-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>GoPay / OVO</span>
                </button>
              </div>
            </div>

            {/* Total and Submit Button */}
            <div className="pt-2 border-t border-[#F0E7E9] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-[#777078] block">Total Pembayaran:</span>
                <span className="text-xl font-bold text-[#A95570]">
                  Rp {currentPlan.price.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-[#F0E7E9] text-xs font-semibold text-[#777078] hover:bg-neutral-50 transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={processing}
                  onClick={handleUpgrade}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b] transition flex items-center justify-center gap-2 shadow-md shadow-[#A95570]/20 disabled:opacity-50"
                >
                  {processing ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Aktifkan Paket Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
