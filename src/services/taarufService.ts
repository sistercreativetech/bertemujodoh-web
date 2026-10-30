import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { TaarufRequest, Profile, TaarufStatus } from '@/types/database';

const TAARUF_STORAGE_KEY = 'bertemujodoh_taaruf_requests';

// Sample Seed Requests for immediate interactive testing in demo mode
export const SEED_TAARUF_REQUESTS: TaarufRequest[] = [
  {
    id: 'req-sample-1',
    sender_id: 'usr-premium-1',
    receiver_id: 'usr-free-1',
    status: 'pending',
    introduction_note:
      'Bismillah, setelah membaca visi dan nilai yang tertulis di profil ukhti, saya berniat mengajukan taaruf resmi dengan pelibatan wali. Semoga Allah meridhai ikhtiar ini.',
    wali_phone: '081298765432',
    response_note: null,
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    sender: {
      id: 'usr-premium-1',
      email: 'rizky.pratama@bertemujodoh.my.id',
      full_name: 'Muhammad Rizky Pratama',
      display_name: 'Rizky',
      gender: 'male',
      birth_year: 1996,
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      occupation: 'Software Engineer',
      education: 'S1 Teknik Informatika',
      bio: 'Pribadi yang tenang, gemar kajian fiqih keluarga, dan siap menafkahi lahir batin menuju baiti jannati.',
      avatar_url: null,
      is_verified: true,
      role: 'member',
      privacy_level: 'public',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    receiver: {
      id: 'usr-free-1',
      email: 'aisyah@bertemujodoh.my.id',
      full_name: 'Aisyah Nurul Fadhilah',
      display_name: 'Aisyah',
      gender: 'female',
      birth_year: 1999,
      city: 'Bandung',
      province: 'Jawa Barat',
      occupation: 'Guru Bahasa Arab & Tahfidz',
      education: 'S1 Pendidikan Bahasa Arab',
      bio: 'Muslimah yang berusaha istiqomah di atas manhaj salaf.',
      avatar_url: null,
      is_verified: true,
      role: 'member',
      privacy_level: 'public',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

export const getStoredRequests = (): TaarufRequest[] => {
  try {
    const raw = localStorage.getItem(TAARUF_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return SEED_TAARUF_REQUESTS;
};

export const saveStoredRequests = (requests: TaarufRequest[]) => {
  try {
    localStorage.setItem(TAARUF_STORAGE_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error(e);
  }
};

export const fetchTaarufRequests = async (
  userId: string
): Promise<{ incoming: TaarufRequest[]; outgoing: TaarufRequest[] }> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('taaruf_requests')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          introduction_note,
          wali_phone,
          response_note,
          created_at,
          updated_at,
          sender:profiles!sender_id(*),
          receiver:profiles!receiver_id(*)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const formatted = (data as any[]).map((r) => ({
          ...r,
          sender: Array.isArray(r.sender) ? r.sender[0] : r.sender,
          receiver: Array.isArray(r.receiver) ? r.receiver[0] : r.receiver,
        })) as TaarufRequest[];

        return {
          incoming: formatted.filter((r) => r.receiver_id === userId),
          outgoing: formatted.filter((r) => r.sender_id === userId),
        };
      }
    } catch (err) {
      console.warn('Fallback to local stored taaruf requests:', err);
    }
  }

  // Local state fallback
  const all = getStoredRequests();
  return {
    incoming: all.filter((r) => r.receiver_id === userId),
    outgoing: all.filter((r) => r.sender_id === userId),
  };
};

export const sendTaarufRequest = async (
  sender: Profile,
  receiver: Profile,
  introductionNote: string,
  waliPhone: string
): Promise<{ request: TaarufRequest | null; error: string | null }> => {
  // STRICT GENDER LOGIC VALIDATION
  if (sender.id === receiver.id) {
    return { request: null, error: 'Tidak dapat mengajukan taaruf ke akun Anda sendiri.' };
  }

  if (sender.gender === receiver.gender) {
    return {
      request: null,
      error:
        'Pengajuan taaruf hanya diperbolehkan antara Ikhwan (Pria) dan Akhwat (Wanita). Anda tidak dapat mengajukan ke sesama jenis.',
    };
  }

  if (!waliPhone.trim()) {
    return { request: null, error: 'Nomor kontak wali nasab wajib dicantumkan demi menjaga adab syar’i.' };
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('taaruf_requests')
        .insert({
          sender_id: sender.id,
          receiver_id: receiver.id,
          introduction_note: introductionNote,
          wali_phone: waliPhone,
          status: 'pending',
        })
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          introduction_note,
          wali_phone,
          response_note,
          created_at,
          updated_at,
          sender:profiles!sender_id(*),
          receiver:profiles!receiver_id(*)
        `)
        .single();

      if (error) return { request: null, error: error.message };

      const formatted = {
        ...data,
        sender: Array.isArray(data.sender) ? data.sender[0] : data.sender,
        receiver: Array.isArray(data.receiver) ? data.receiver[0] : data.receiver,
      } as TaarufRequest;

      return { request: formatted, error: null };
    } catch (err: unknown) {
      return { request: null, error: err instanceof Error ? err.message : 'Gagal mengirim pengajuan' };
    }
  }

  // Local fallback
  const newReq: TaarufRequest = {
    id: `req-${Date.now()}`,
    sender_id: sender.id,
    receiver_id: receiver.id,
    status: 'pending',
    introduction_note: introductionNote,
    wali_phone: waliPhone,
    response_note: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sender,
    receiver,
  };

  const current = getStoredRequests();
  saveStoredRequests([newReq, ...current]);
  return { request: newReq, error: null };
};

export const updateTaarufStatus = async (
  requestId: string,
  newStatus: 'accepted' | 'rejected' | 'cancelled',
  responseNote?: string
): Promise<boolean> => {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('taaruf_requests')
        .update({
          status: newStatus,
          response_note: responseNote || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) return false;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  // Local fallback
  const current = getStoredRequests();
  const updated = current.map((r) => {
    if (r.id === requestId) {
      return {
        ...r,
        status: newStatus,
        response_note: responseNote || r.response_note,
        updated_at: new Date().toISOString(),
      };
    }
    return r;
  });
  saveStoredRequests(updated);
  return true;
};
