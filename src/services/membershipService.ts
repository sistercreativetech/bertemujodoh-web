import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Membership, MembershipTier } from '@/types/database';

export interface MembershipPlan {
  tier: MembershipTier;
  name: string;
  durationLabel: string;
  durationDays: number;
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  description: string;
  canCreateCv: boolean;
  canSendTaaruf: boolean;
  canAccessPremium: boolean;
  features: string[];
}

export const MEMBERSHIP_PLANS: Record<MembershipTier, MembershipPlan> = {
  free_trial: {
    tier: 'free_trial',
    name: 'Free Trial',
    durationLabel: '7 Hari',
    durationDays: 7,
    price: 0,
    description: 'Akses uji coba untuk mengenali ekosistem dan menyusun CV Taaruf.',
    canCreateCv: true,
    canSendTaaruf: false,
    canAccessPremium: false,
    features: [
      'Buat & susun CV Taaruf lengkap',
      'Akses membaca timeline feed publik',
      'Preview modul pranikah terpilih',
      'Belum bisa mengirim pengajuan taaruf',
      'Video kajian premium terkunci',
    ],
  },
  '1_month': {
    tier: '1_month',
    name: 'Paket 1 Bulan',
    durationLabel: '1 Bulan (30 Hari)',
    durationDays: 30,
    price: 19000,
    description: 'Mulai ikhtiar aktif dengan pengajuan taaruf dan akses seluruh kurikulum.',
    canCreateCv: true,
    canSendTaaruf: true,
    canAccessPremium: true,
    features: [
      'Kirim & terima pengajuan taaruf syar’i',
      'Ekspor CV Taaruf ke file PDF A4',
      'Buka seluruh 15 bab e-book pranikah',
      'Akses semua video kajian asatidz & psikolog',
      'Planner jodoh harian interaktif',
    ],
  },
  '6_months': {
    tier: '6_months',
    name: 'Paket 6 Bulan',
    durationLabel: '6 Bulan (180 Hari)',
    durationDays: 180,
    price: 89000,
    originalPrice: 114000,
    discountBadge: 'Hemat 22%',
    description: 'Pilihan paling populer untuk durasi ideal persiapan taaruf hingga khitbah.',
    canCreateCv: true,
    canSendTaaruf: true,
    canAccessPremium: true,
    features: [
      'Semua fitur paket 1 bulan',
      'Prioritas review & kurasi CV taaruf',
      'Akses builder undangan pernikahan digital',
      'Checklist berkas KUA & wedding budget planner',
      'Badge profil member terverifikasi',
    ],
  },
  '12_months': {
    tier: '12_months',
    name: 'Paket 12 Bulan (1 Tahun)',
    durationLabel: '1 Tahun (365 Hari)',
    durationDays: 365,
    price: 149000,
    originalPrice: 228000,
    discountBadge: 'Hemat 35%',
    description: 'Pendampingan penuh sepanjang ikhtiar hingga hari akad nikah dan walimah.',
    canCreateCv: true,
    canSendTaaruf: true,
    canAccessPremium: true,
    features: [
      'Semua fitur paket 6 bulan',
      'Undangan pernikahan digital tanpa watermark',
      'Konsultasi pranikah bersama konselor',
      'Pembaruan materi kajian selamanya',
      'Dukungan customer care prioritas VIP',
    ],
  },
};

export const calculateDaysRemaining = (expiresAtString: string): number => {
  const expires = new Date(expiresAtString).getTime();
  const now = Date.now();
  const diff = expires - now;
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const upgradeMembershipPlan = async (
  userId: string,
  tier: MembershipTier,
  paymentMethod: string = 'qris'
): Promise<{ data: Membership | null; error: string | null }> => {
  const plan = MEMBERSHIP_PLANS[tier];
  if (!plan) return { data: null, error: 'Paket tidak valid' };

  const expiresAt = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000).toISOString();

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('memberships')
        .insert({
          user_id: userId,
          tier: plan.tier,
          status: 'active',
          price: plan.price,
          starts_at: new Date().toISOString(),
          expires_at: expiresAt,
          can_create_cv: plan.canCreateCv,
          can_send_taaruf: plan.canSendTaaruf,
          can_access_premium: plan.canAccessPremium,
          payment_method: paymentMethod,
          payment_reference: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        })
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as Membership, error: null };
    } catch (err: unknown) {
      return { data: null, error: err instanceof Error ? err.message : 'Gagal memperbarui paket' };
    }
  }

  // Local / Demo fallback
  const mockMembership: Membership = {
    id: `mem-${Date.now()}`,
    user_id: userId,
    tier: plan.tier,
    status: 'active',
    price: plan.price,
    starts_at: new Date().toISOString(),
    expires_at: expiresAt,
    can_create_cv: plan.canCreateCv,
    can_send_taaruf: plan.canSendTaaruf,
    can_access_premium: plan.canAccessPremium,
    payment_method: paymentMethod,
    payment_reference: `INV-DEMO-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return { data: mockMembership, error: null };
};
