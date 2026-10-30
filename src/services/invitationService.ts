export interface GiftAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface StoryMilestone {
  year: string;
  title: string;
  description: string;
}

export interface RsvpEntry {
  id: string;
  name: string;
  attendance: 'hadir' | 'tidak' | 'ragu';
  guestCount: number;
  message: string;
  createdAt: string;
}

export interface WeddingInvitation {
  id: string;
  userId: string;
  slug: string;
  theme: 'sakura-blush' | 'emerald-syari' | 'ivory-minimalist' | 'terracotta-earth';
  title: string;
  quoteArabic: string;
  quoteTranslation: string;
  quoteSource: string;
  groom: {
    fullName: string;
    nickname: string;
    fatherName: string;
    motherName: string;
    instagram?: string;
    bio?: string;
  };
  bride: {
    fullName: string;
    nickname: string;
    fatherName: string;
    motherName: string;
    instagram?: string;
    bio?: string;
  };
  events: {
    akad: {
      title: string;
      date: string; // ISO date YYYY-MM-DD
      startTime: string;
      endTime: string;
      venue: string;
      address: string;
      mapsUrl: string;
    };
    reception: {
      title: string;
      date: string;
      startTime: string;
      endTime: string;
      venue: string;
      address: string;
      mapsUrl: string;
    };
  };
  story: StoryMilestone[];
  giftAccounts: GiftAccount[];
  rsvps: RsvpEntry[];
  published: boolean;
  updatedAt: string;
}

export const DEFAULT_INVITATION: WeddingInvitation = {
  id: 'demo-invitation-1',
  userId: 'demo-user-1',
  slug: 'alif-dan-nisa',
  theme: 'sakura-blush',
  title: 'Walimatul ‘Ursy Alif & Nisa',
  quoteArabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
  quoteTranslation: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
  quoteSource: 'QS. Ar-Rum: 21',
  groom: {
    fullName: 'Muhammad Alif Ramadhan, S.Kom.',
    nickname: 'Alif',
    fatherName: 'Bpk. H. Rahmat Hidayat',
    motherName: 'Ibu Hj. Siti Nurhaliza',
    instagram: '@aliframadhan',
    bio: 'Putra pertama dari keluarga Bapak Rahmat Hidayat & Ibu Siti Nurhaliza.',
  },
  bride: {
    fullName: 'Khadijah Annisa Putri, S.Pd.',
    nickname: 'Nisa',
    fatherName: 'Bpk. Drs. H. Bambang Sutrisno',
    motherName: 'Ibu Hj. Aminah Wijaya',
    instagram: '@annisa.putri',
    bio: 'Putri kedua dari keluarga Bapak Bambang Sutrisno & Ibu Aminah Wijaya.',
  },
  events: {
    akad: {
      title: 'Akad Nikah',
      date: '2026-11-22',
      startTime: '08:00',
      endTime: '10:00 WIB',
      venue: 'Masjid Agung Al-Azhar, Kebayoran Baru',
      address: 'Jl. Sisingamangaraja No.1, Selong, Kebayoran Baru, Jakarta Selatan',
      mapsUrl: 'https://maps.google.com/?q=Masjid+Agung+Al-Azhar+Jakarta',
    },
    reception: {
      title: 'Walimatul ‘Ursy (Resepsi)',
      date: '2026-11-22',
      startTime: '11:00',
      endTime: '14:00 WIB',
      venue: 'Aula Buaran Al-Azhar Convention Hall',
      address: 'Jl. Sisingamangaraja No.1, Selong, Kebayoran Baru, Jakarta Selatan',
      mapsUrl: 'https://maps.google.com/?q=Masjid+Agung+Al-Azhar+Jakarta',
    },
  },
  story: [
    {
      year: '2025',
      title: 'Ikhtiar Taaruf Syar’i',
      description: 'Melalui perantara ustadz pembina di platform bertemujodoh.my.id, CV taaruf saling dipertukarkan dengan pendampingan wali.',
    },
    {
      year: '2026',
      title: 'Nadzhor & Khitbah',
      description: 'Pertemuan tatap muka didampingi kedua orang tua dan keluarga besar. Bersepakat melangkah dengan restu kedua orang tua.',
    },
    {
      year: '2026',
      title: 'Menuju Babak Baru',
      description: 'Dengan memohon ridho dan keberkahan dari Allah SWT, kami menyempurnakan separuh agama dalam ikatan suci pernikahan.',
    },
  ],
  giftAccounts: [
    {
      id: 'gift-1',
      bankName: 'Bank Syariah Indonesia (BSI)',
      accountNumber: '7123456789',
      accountHolder: 'Muhammad Alif Ramadhan',
    },
    {
      id: 'gift-2',
      bankName: 'Bank Central Asia (BCA)',
      accountNumber: '5271298492',
      accountHolder: 'Khadijah Annisa Putri',
    },
  ],
  rsvps: [
    {
      id: 'rsvp-1',
      name: 'Ustadz Ahmad Fauzan',
      attendance: 'hadir',
      guestCount: 2,
      message: 'Baarakallahu laka wa baaraka ‘alaika wa jama’a bainakuma fii khoir. Semoga menjadi keluarga sakinah mawaddah warahmah.',
      createdAt: '2026-10-28T09:15:00Z',
    },
    {
      id: 'rsvp-2',
      name: 'Fariha & Keluarga',
      attendance: 'hadir',
      guestCount: 3,
      message: 'MasyaAllah tabarakallah Ukhti Nisa & Akhi Alif! Sangat bahagia mendengar kabar baik ini. InsyaAllah kami hadir.',
      createdAt: '2026-10-29T14:30:00Z',
    },
    {
      id: 'rsvp-3',
      name: 'Rizki Dwi Putra',
      attendance: 'hadir',
      guestCount: 1,
      message: 'Selamat Alif! Semoga lancar sampai hari H dan senantiasa dalam naungan berkah Allah.',
      createdAt: '2026-10-30T11:20:00Z',
    },
  ],
  published: true,
  updatedAt: new Date().toISOString(),
};

const STORAGE_KEY = 'bertemujodoh_invitations';

function loadAllInvitations(): WeddingInvitation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [DEFAULT_INVITATION];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [DEFAULT_INVITATION];
  } catch (err) {
    console.error('Failed to parse invitations from storage:', err);
    return [DEFAULT_INVITATION];
  }
}

function saveAllInvitations(list: WeddingInvitation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save invitations to storage:', err);
  }
}

export const invitationService = {
  getInvitationByUserId: (userId: string): WeddingInvitation => {
    const all = loadAllInvitations();
    const found = all.find((item) => item.userId === userId);
    if (found) return found;

    // Return a clone with this userId
    const newInv: WeddingInvitation = {
      ...DEFAULT_INVITATION,
      id: `inv-${Date.now()}`,
      userId,
      slug: `undangan-${userId.slice(0, 6)}`,
      updatedAt: new Date().toISOString(),
    };
    all.push(newInv);
    saveAllInvitations(all);
    return newInv;
  },

  getInvitationBySlug: (slug: string): WeddingInvitation | null => {
    const all = loadAllInvitations();
    const found = all.find((item) => item.slug.toLowerCase() === slug.toLowerCase());
    if (found) return found;
    // Fallback if matching default
    if (slug === 'alif-dan-nisa' || slug === 'demo') {
      return DEFAULT_INVITATION;
    }
    return null;
  },

  saveInvitation: (invitation: WeddingInvitation): WeddingInvitation => {
    const all = loadAllInvitations();
    const idx = all.findIndex((item) => item.id === invitation.id || item.userId === invitation.userId);
    const updated = {
      ...invitation,
      updatedAt: new Date().toISOString(),
    };
    if (idx >= 0) {
      all[idx] = updated;
    } else {
      all.push(updated);
    }
    saveAllInvitations(all);
    return updated;
  },

  addRsvp: (slug: string, rsvp: Omit<RsvpEntry, 'id' | 'createdAt'>): WeddingInvitation | null => {
    const all = loadAllInvitations();
    const idx = all.findIndex((item) => item.slug.toLowerCase() === slug.toLowerCase());
    const target = idx >= 0 ? all[idx] : DEFAULT_INVITATION;

    const newEntry: RsvpEntry = {
      ...rsvp,
      id: `rsvp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const updated = {
      ...target,
      rsvps: [newEntry, ...(target.rsvps || [])],
      updatedAt: new Date().toISOString(),
    };

    if (idx >= 0) {
      all[idx] = updated;
      saveAllInvitations(all);
    }

    return updated;
  },
};
