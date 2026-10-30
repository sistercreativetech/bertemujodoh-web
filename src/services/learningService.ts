export interface Chapter {
  id: number;
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  readTime: string;
  isFreePreview: boolean;
  content: string;
}

export interface VideoCourse {
  id: number;
  slug: string;
  title: string;
  instructor: string;
  instructorRole: string;
  duration: string;
  videoEmbedUrl: string;
  description: string;
  keyPoints: string[];
}

export const BOOK_CHAPTERS: Chapter[] = [
  {
    id: 1,
    slug: 'menata-niat-dan-memperbaiki-diri',
    number: 1,
    title: 'Menata Niat & Memperbaiki Diri',
    subtitle: 'Fondasi spiritual dan kesembuhan luka masa lalu sebelum melangkah.',
    readTime: '8 menit',
    isFreePreview: true,
    content: `## Bab 1: Menata Niat & Memperbaiki Diri

> *"Sesungguhnya setiap amal bergantung pada niatnya, dan setiap orang akan mendapatkan apa yang ia niatkan."* (HR. Bukhari & Muslim)

Pernikahan dalam Islam bukanlah pelarian dari kesendirian, bukan pula ajang kompetisi status sosial. Pernikahan adalah ibadah terpanjang dalam rentang hidup seorang muslim yang menuntut kedewasaan tauhid, kesabaran jiwa, dan kejujuran niat.

### 1. Memeriksa Motif Hati
Sebelum bertanya *"Siapa jodohku?"*, pertanyaan yang jauh lebih krusial adalah *"Untuk apa aku ingin menikah?"*.
- Apakah demi menyempurnakan separuh agama dan menjaga pandangan?
- Ataukah hanya karena lelah ditanya sanak famili di hari raya?
- Apakah kita siap menjadi nakhoda yang mengayomi, atau makmum yang taat dalam ketaatan kepada Allah?

Ketika niat diarahkan semata-mata mencari ridha Allah dan membangun generasi bertauhid, maka ujian adaptasi di masa awal pernikahan akan dihadapi dengan sabar dan lapang dada.

### 2. Menyembuhkan Luka Masa Lalu (Inner Healing)
Banyak kegagalan rumah tangga berakar bukan dari kurangnya rasa cinta, melainkan luka batin masa kecil (*inner child*) dan trauma masa lalu yang belum selesai.
- Jangan menuntut pasangan menjadi "tabib" penyembuh seluruh kekosongan emosimu.
- Maafkan kesalahan orang tua dan orang-orang di masa lalumu.
- Penuhi cangkir jiwamu dengan cinta kepada Allah dan ketaatan sebelum meminta orang lain mengisinya.

### 3. Tiga Rukun Kesiapan Diri
1. **Kesiapan Spiritual (Ruhiyah):** Shalat fardhu terjaga di awal waktu, interaksi harian dengan Al-Qur'an, dan pemahaman dasar fiqih keluarga.
2. **Kesiapan Mental (Nafsiyah):** Mampu mengendalikan amarah, tidak temperamental, dan siap menerima perbedaan watak pasangan.
3. **Kesiapan Finansial (Maliyah):** Memiliki etos kerja halal, tidak malas, dan mampu mengelola kebutuhan primer secara terencana.`,
  },
  {
    id: 2,
    slug: 'kriteria-syari-dan-adab-nadzor',
    number: 2,
    title: 'Kriteria Syar’i & Adab Nadzor',
    subtitle: 'Pedoman memilih pasangan ideal dan tata cara melihat calon pasangan secara sah.',
    readTime: '10 menit',
    isFreePreview: false,
    content: `## Bab 2: Kriteria Syar’i & Adab Nadzor

Rasulullah ﷺ bersabda:
> *"Wanita dinikahi karena empat perkara: hartanya, keturunannya, kecantikannya, dan agamanya. Maka pilihlah yang memiliki agama, niscaya engkau beruntung."* (HR. Bukhari)

### 1. Skala Prioritas Kriteria
Ketampanan, kecantikan, kekayaan, dan nasab adalah fitrah manusiawi yang boleh dipertimbangkan. Namun, Rasulullah ﷺ menegaskan bahwa pilar agama (*din*) dan akhlak adalah filter utama mutlak:
- **Karakter Agama:** Bagaimana ketaatannya kepada Allah di saat sepi maupun ramai? Bagaimana sikapnya saat mendengar firman Allah dan sunnah Nabi?
- **Karakter Akhlak:** Bagaimana caranya memperlakukan orang tua, terutama ibunya? Bagaimana responnya saat berada dalam kondisi marah atau lelah?

### 2. Adab Nadzor (Melihat Calon Pasangan)
Nadzor disyariatkan dalam Islam agar timbul kecondongan hati yang sah sebelum mengikat janji khitbah (lamaran).
- Dilakukan di hadapan mahram/wali dan tidak boleh berkhalwat (berdua-duaan).
- Batas yang dilihat adalah wajah dan kedua telapak tangan.
- Menjaga pandangan dari syahwat berlebih dan tidak menyebarkan aib calon jika ternyata tidak ada kecocokan hati.`,
  },
  {
    id: 3,
    slug: 'fiqih-mahar-dan-kesederhanaan-walimah',
    number: 3,
    title: 'Fiqih Mahar & Kesederhanaan Walimah',
    subtitle: 'Menjaga keberkahan akad tanpa terjerat gengsi pesta yang membebani.',
    readTime: '9 menit',
    isFreePreview: false,
    content: `## Bab 3: Fiqih Mahar & Kesederhanaan Walimah

> *"Sebaik-baik wanita adalah yang paling mudah maharnya."* (HR. Ahmad)

### 1. Kedudukan dan Hikmah Mahar
Mahar adalah hak murni milik mempelai wanita, sebagai simbol pemuliaan dan kesungguhan calon suami.
- Mahar tidak boleh memberatkan calon suami hingga terjerat utang riba.
- Mempelai wanita berhak menentukan mahar yang bernilai manfaat, baik berupa hafalan Al-Qur'an, emas, maupun alat shalat.

### 2. Mengadakan Walimah yang Berkah
- Sunnah mengadakan walimah sesuai kemampuan (*"Adakanlah walimah walau hanya dengan menyembelih seekor kambing"*).
- Menghindari pemborosan (*israf*) dan pamer kemewahan (*riya'*).
- Mengundang kerabat dekat, tetangga, serta anak-anak yatim dan dhuafa tanpa diskriminasi strata sosial.`,
  },
  {
    id: 4,
    slug: 'komunikasi-pasutri-dan-resolusi-konflik',
    number: 4,
    title: 'Komunikasi Pasutri & Resolusi Konflik',
    subtitle: 'Seni meredam amarah dan membangun empati di masa transisi tahun pertama.',
    readTime: '12 menit',
    isFreePreview: false,
    content: `## Bab 4: Komunikasi Pasutri & Resolusi Konflik

Konflik dalam rumah tangga adalah keniscayaan dua kepala yang disatukan di bawah satu atap. Yang menentukan kelanggengan bukanlah tiadanya pertengkaran, melainkan bagaimana cara pasutri menyelesaikan perbedaan tersebut.

### 1. Prinsip Komunikasi "Aku Merasa" (I-Message)
Hindari kalimat menyalahkan seperti:
- *"Kamu selalu pulang terlambat dan tidak peduli!"*
Gantilah dengan kalimat empati:
- *"Aku merasa cemas dan kesepian ketika kamu pulang larut tanpa kabar."*

### 2. Aturan Emas Saat Berselisih
1. Jangan pernah membawa-bawa nama mertua atau keluarga besar ke dalam perselisihan berdua.
2. Hindari mengungkit kesalahan masa lalu yang sudah saling dimaafkan.
3. Beri jeda wudhu dan shalat dua rakaat ketika tensi emosi memuncak.`,
  },
  {
    id: 5,
    slug: 'manajemen-finansial-keluarga-sakinah',
    number: 5,
    title: 'Manajemen Finansial Keluarga Sakinah',
    subtitle: 'Perencanaan cashflow, nafkah syar’i, dan proteksi dari gaya hidup konsumtif.',
    readTime: '11 menit',
    isFreePreview: false,
    content: `## Bab 5: Manajemen Finansial Keluarga Sakinah

Nafkah adalah kewajiban mutlak suami atas istri dan anak-anaknya. Sebaliknya, harta penghasilan istri adalah milik istri seutuhnya kecuali jika istri secara sukarela membantu kebutuhan rumah tangga dengan ridha dan sedekah.

### 1. Tiga Pos Anggaran Utama
- **Pos Kebutuhan Pokok (50%):** Makanan halal, tempat tinggal, utilitas, dan kesehatan keluarga.
- **Pos Masa Depan & Tabungan Darurat (30%):** Dana darurat 6 bulan pengeluaran dan persiapan persalinan.
- **Pos Sosial & Sedekah (20%):** Sedekah jariyah, berbakti kepada orang tua kedua belah pihak.`,
  },
];

export const VIDEO_COURSES: VideoCourse[] = [
  {
    id: 1,
    slug: 'urgensi-ilmu-pranikah',
    title: 'Urgensi Menuntut Ilmu Sebelum Menikah',
    instructor: 'Ustaz Farhan Abu Rayyan',
    instructorRole: 'Pembina Syariah & Dewan Asatidz',
    duration: '32 Menit',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    description: 'Kajian mendalam tentang mengapa ilmu harus mendahului ucapan dan perbuatan, khususnya dalam memikul amanah aqad pernikahan.',
    keyPoints: [
      'Memahami hak dan kewajiban suami istri secara syar’i',
      'Menjaga lisan dari kalimat talak yang tidak disengaja',
      'Keberkahan nafkah yang halal dan qana’ah',
    ],
  },
  {
    id: 2,
    slug: 'mengatasi-ekspektasi-berlebihan',
    title: 'Menghindari Jebakan Ekspektasi Berlebihan Pranikah',
    instructor: 'Nabila Azzahra, M.Psi.',
    instructorRole: 'Psikolog Klinis & Konselor Keluarga',
    duration: '45 Menit',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    description: 'Mengenali perbedaan antara fantasi romansa drama dengan realitas tanggung jawab berumah tangga di dunia nyata.',
    keyPoints: [
      'Menerima kekurangan fisik dan watak pasangan',
      'Transisi emosi dari fase lajang ke fase pasutri',
      'Membangun kedekatan emosional tanpa drama',
    ],
  },
  {
    id: 3,
    slug: 'perencanaan-keuangan-keluarga-muda',
    title: 'Manajemen Finansial Pasutri Baru Tanpa Riba',
    instructor: 'Ahmad Fauzi, CFP',
    instructorRole: 'Perencana Keuangan Syariah Bersertifikasi',
    duration: '38 Menit',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    description: 'Simulasi praktis mengatur arus kas bulanan, strategi memiliki tempat tinggal halal, dan menyiapkan dana darurat.',
    keyPoints: [
      'Pemisahan hak kepemilikan harta dalam Islam',
      'Menghindari jeratan cicilan konsumtif',
      'Tips mengalokasikan tabungan pendidikan anak sejak dini',
    ],
  },
  {
    id: 4,
    slug: 'fiqih-nadzor-dan-khitbah',
    title: 'Fiqih Nadzor, Khitbah, & Batasan Komunikasi',
    instructor: 'Ustaz Dr. Muhammad Syafiq',
    instructorRole: 'Pakar Fiqih Muamalah & Keluarga',
    duration: '50 Menit',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    description: 'Panduan batas-batas interaksi selama masa taaruf hingga hari akad nikah agar tidak melanggar syariat.',
    keyPoints: [
      'Hukum membatalkan khitbah dan adabnya',
      'Peran sakral wali nasab dalam akad nikah',
      'Menjaga kesucian hati sebelum ijab qabul',
    ],
  },
];

const STORAGE_KEY_READ_CHAPTERS = 'bertemujodoh_read_chapters';
const STORAGE_KEY_WATCHED_VIDEOS = 'bertemujodoh_watched_videos';

export const getReadChapters = (userId: string): number[] => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_READ_CHAPTERS}_${userId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [1]; // Bab 1 default read
};

export const toggleChapterRead = (userId: string, chapterId: number): number[] => {
  const current = getReadChapters(userId);
  let updated: number[];
  if (current.includes(chapterId)) {
    updated = current.filter((id) => id !== chapterId);
  } else {
    updated = [...current, chapterId];
  }
  localStorage.setItem(`${STORAGE_KEY_READ_CHAPTERS}_${userId}`, JSON.stringify(updated));
  return updated;
};

export const getWatchedVideos = (userId: string): number[] => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_WATCHED_VIDEOS}_${userId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
};

export const toggleVideoWatched = (userId: string, videoId: number): number[] => {
  const current = getWatchedVideos(userId);
  let updated: number[];
  if (current.includes(videoId)) {
    updated = current.filter((id) => id !== videoId);
  } else {
    updated = [...current, videoId];
  }
  localStorage.setItem(`${STORAGE_KEY_WATCHED_VIDEOS}_${userId}`, JSON.stringify(updated));
  return updated;
};
