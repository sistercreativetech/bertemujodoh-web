export interface CVData {
  // 1. Data Diri & Identitas
  fullName: string;
  nickname: string;
  gender: 'male' | 'female';
  birthPlace: string;
  birthDate: string;
  bloodType: string;
  maritalStatus: 'Lajang' | 'Duda' | 'Janda';
  city: string;
  province: string;
  address: string;

  // 2. Ciri Fisik
  height: number;
  weight: number;
  skinColor: string;
  distinctiveFeatures: string;
  medicalHistory: string;

  // 3. Ibadah & Agama
  shalatFardhu: string;
  shalatSunnah: string;
  hafalanQuran: string;
  kajianRutin: string;
  asatidzFavorit: string;
  smokingHabit: 'Tidak Merokok' | 'Pernah / Sudah Berhenti' | 'Merokok';
  hijabStyle?: string; // Khusus Akhwat

  // 4. Pendidikan & Finansial
  lastEducation: string;
  major: string;
  schoolName: string;
  currentOccupation: string;
  companyName: string;
  monthlyIncomeRange: string;
  financialReadiness: string;

  // 5. Visi & Misi Rumah Tangga
  marriageVision: string;
  marriageMission: string;
  targetMarriageYear: string;
  willingnessToRelocate: 'Ya, Bersedia' | 'Dipertimbangkan' | 'Tidak Bisa';
  polygynyView: string;

  // 6. Kriteria Calon Pasangan
  criteriaAgeMin: number;
  criteriaAgeMax: number;
  criteriaEducation: string;
  criteriaCharacter: string;
  criteriaDealBreakers: string;

  // 7. Data Wali Nasab (Penting untuk Taaruf Syar'i)
  waliName: string;
  waliRelation: 'Ayah Kandung' | 'Kakek' | 'Saudara Laki-laki Kandung' | 'Paman Kandung' | 'Wali Hakim';
  waliPhone: string;
  waliAddress: string;
}

export const DEFAULT_CV_DATA: CVData = {
  fullName: 'Aisyah Nurul Fadhilah',
  nickname: 'Aisyah',
  gender: 'female',
  birthPlace: 'Bandung',
  birthDate: '1999-07-14',
  bloodType: 'O',
  maritalStatus: 'Lajang',
  city: 'Bandung',
  province: 'Jawa Barat',
  address: 'Jl. Dago Asri No. 18, Coblong, Bandung',

  height: 160,
  weight: 52,
  skinColor: 'Kuning Langsat',
  distinctiveFeatures: 'Mengenakan kacamata minus saat membaca',
  medicalHistory: 'Tidak ada riwayat penyakit berat / kronis',

  shalatFardhu: 'Selalu di awal waktu, menjaga shalat tepat waktu',
  shalatSunnah: 'Rutin Dhuha, Tahajjud 2-3x sepekan, dan Rawatib',
  hafalanQuran: '3 Juz (Juz 30, 29, 28) dalam proses murajaah juz 1',
  kajianRutin: 'Kajian Fiqih Wanita & Hadits Al-Arbain An-Nawawiyyah',
  asatidzFavorit: 'Ustaz Firanda Andirja, Ustaz Syafiq Riza Basalamah',
  smokingHabit: 'Tidak Merokok',
  hijabStyle: 'Jilbab Syar’i menutup dada & berkaos kaki',

  lastEducation: 'S1',
  major: 'Pendidikan Bahasa Arab',
  schoolName: 'Universitas Pendidikan Indonesia',
  currentOccupation: 'Guru Bahasa Arab & Tahfidz',
  companyName: 'SDIT Luqman Al-Hakim Bandung',
  monthlyIncomeRange: 'Rp 4.000.000 - Rp 6.000.000',
  financialReadiness: 'Memiliki tabungan mandiri dan tidak memiliki utang',

  marriageVision:
    'Membangun rumah tangga sakinah mawaddah warahmah yang berlandaskan Al-Qur’an dan Sunnah, serta melahirkan generasi penghafal Al-Qur’an.',
  marriageMission:
    '1. Menjadikan rumah sebagai madrasah pertama bagi anak-anak.\n2. Taat kepada suami dalam koridor syariat.\n3. Saling menasihati dalam kebenaran dan kesabaran.',
  targetMarriageYear: '2026 / 2027',
  willingnessToRelocate: 'Ya, Bersedia',
  polygynyView: 'Fokus pada pernikahan monogami yang sakinah',

  criteriaAgeMin: 26,
  criteriaAgeMax: 34,
  criteriaEducation: 'Minimal D3 / S1',
  criteriaCharacter:
    'Laki-laki yang menjaga shalat 5 waktu di masjid, tidak merokok, pekerja keras, lembut terhadap keluarga, dan berbakti kepada orang tua.',
  criteriaDealBreakers:
    'Meninggalkan shalat wajib, merokok/narkoba, temperamen kasar, dan suka berbohong.',

  waliName: 'Drs. H. Rahmat Hidayat',
  waliRelation: 'Ayah Kandung',
  waliPhone: '081223456789',
  waliAddress: 'Jl. Dago Asri No. 18, Coblong, Bandung',
};
