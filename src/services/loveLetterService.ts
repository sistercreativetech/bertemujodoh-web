export interface LoveLetter {
  id: string;
  author_id: string;
  author_name: string;
  title: string;
  content: string;
  mode: 'private' | 'anonymous_public' | 'pen_name';
  pen_name?: string;
  likes_count: number;
  created_at: string;
  user_has_liked?: boolean;
}

export const SEED_LOVE_LETTERS: LoveLetter[] = [
  {
    id: 'letter-1',
    author_id: 'usr-premium-1',
    author_name: 'Muhammad Rizky Pratama',
    title: 'Untukmu yang Tertulis Indah di Lauhul Mahfudz',
    content:
      'Di sepertiga malam ini, aku menundukkan kepala mendoakan keselamatan dan kebaikan untukmu, di manapun engkau sedang berjuang saat ini.\n\nAku tidak tahu seperti apa wajahmu, bagaimana suaramu, atau jalan mana yang akan mempertemukan kita kelak. Namun satu hal yang kutahu pasti: janji Allah itu nyata. Sembari menunggumu, aku berikhtiar memperbaiki ibadah, menata rezeki yang halal, dan belajar bagaimana memuliakan seorang istri sebagaimana yang dicontohkan Rasulullah ﷺ.\n\nSemoga Allah senantiasa menjagamu dalam ketaatan.',
    mode: 'anonymous_public',
    pen_name: 'Hamba yang Berikhtiar',
    likes_count: 42,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    user_has_liked: false,
  },
  {
    id: 'letter-2',
    author_id: 'usr-free-1',
    author_name: 'Aisyah Nurul Fadhilah',
    title: 'Sebuah Doa Menanti Nakhoda Rumah Tanggaku',
    content:
      'Kepada calon suamiku kelak,\n\nAku bukanlah wanita sesempurna Khadijah, bukan pula secerdas Aisyah. Aku hanyalah seorang muslimah akhir zaman yang senantiasa tertatih berusaha istiqomah.\n\nBila kelak engkau tiba, bimbinglah aku dengan kelembutan. Ingatkan aku saat khilaf dengan cara yang menyejukkan hati. Aku siap menjadi tempatmu berpulang melepas penatnya dunia, dan bersama-sama melangkah menuju jannah-Nya.',
    mode: 'anonymous_public',
    pen_name: 'Pena Shalihah',
    likes_count: 58,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    user_has_liked: true,
  },
];

const LOVE_LETTER_STORAGE_KEY = 'bertemujodoh_love_letters';

export const getAllStoredLetters = (): LoveLetter[] => {
  try {
    const raw = localStorage.getItem(LOVE_LETTER_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return SEED_LOVE_LETTERS;
};

export const saveAllStoredLetters = (letters: LoveLetter[]) => {
  try {
    localStorage.setItem(LOVE_LETTER_STORAGE_KEY, JSON.stringify(letters));
  } catch (e) {
    console.error(e);
  }
};

export const getMyLetters = (userId: string): LoveLetter[] => {
  const all = getAllStoredLetters();
  return all.filter((l) => l.author_id === userId);
};

export const getPublicLetters = (): LoveLetter[] => {
  const all = getAllStoredLetters();
  return all.filter((l) => l.mode === 'anonymous_public' || l.mode === 'pen_name');
};

export const createLetter = (
  userId: string,
  authorName: string,
  title: string,
  content: string,
  mode: LoveLetter['mode'],
  penName?: string
): LoveLetter => {
  const newLetter: LoveLetter = {
    id: `letter-${Date.now()}`,
    author_id: userId,
    author_name: authorName,
    title,
    content,
    mode,
    pen_name: penName || 'Anonim',
    likes_count: 0,
    created_at: new Date().toISOString(),
    user_has_liked: false,
  };

  const all = getAllStoredLetters();
  const updated = [newLetter, ...all];
  saveAllStoredLetters(updated);
  return newLetter;
};

export const deleteLetter = (letterId: string): boolean => {
  const all = getAllStoredLetters();
  const updated = all.filter((l) => l.id !== letterId);
  saveAllStoredLetters(updated);
  return true;
};

export const toggleLikeLetter = (letterId: string): { liked: boolean; newCount: number } => {
  const all = getAllStoredLetters();
  let liked = false;
  let newCount = 0;

  const updated = all.map((l) => {
    if (l.id === letterId) {
      liked = !l.user_has_liked;
      newCount = Math.max(0, l.likes_count + (liked ? 1 : -1));
      return { ...l, user_has_liked: liked, likes_count: newCount };
    }
    return l;
  });

  saveAllStoredLetters(updated);
  return { liked, newCount };
};
