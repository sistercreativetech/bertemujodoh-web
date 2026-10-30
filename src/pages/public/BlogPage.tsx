import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Clock, Tag, ArrowRight, Search } from 'lucide-react';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
}

const ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'adab-taaruf-sesuai-sunnah',
    title: 'Adab dan Tahapan Taaruf Syar’i: Panduan Menghindari Jebakan Pacaran Terselubung',
    excerpt: 'Bagaimana menjaga hati, peran penting perantara dan wali nasab, serta batas komunikasi agar ikhtiar tetap dalam naungan ridha Allah.',
    category: 'Fiqih Taaruf',
    readTime: '6 menit baca',
    date: '28 Oktober 2026',
    author: 'Ustaz Farhan Abu Rayyan',
  },
  {
    id: 'art-2',
    slug: 'pertanyaan-krusial-saat-nadzor',
    title: '25 Pertanyaan Krusial yang Wajib Diajukan Sebelum Sepakat Menuju Khitbah',
    excerpt: 'Daftar pertanyaan mendalam mengenai visi tauhid, pengelolaan finansial, relasi dengan mertua, hingga kesiapan menghadapi konflik rumah tangga.',
    category: 'Psikologi Pranikah',
    readTime: '8 menit baca',
    date: '24 Oktober 2026',
    author: 'Nabila Azzahra, M.Psi.',
  },
  {
    id: 'art-3',
    slug: 'manajemen-finansial-pernikahan-realistis',
    title: 'Menata Finansial Menjelang Akad: Antara Mahar Syar’i dan Realita Biaya Resepsi',
    excerpt: 'Strategi mengalokasikan tabungan agar tidak boncos di pesta pernikahan dan tetap memiliki modal kuat memulai kehidupan mandiri berdua.',
    category: 'Finansial Keluarga',
    readTime: '7 menit baca',
    date: '19 Oktober 2026',
    author: 'Ahmad Fauzi, CFP',
  },
  {
    id: 'art-4',
    slug: 'sembuhkan-luka-masa-lalu',
    title: 'Menyembuhkan Inner Child dan Luka Masa Lalu Sebelum Memasuki Pintu Pernikahan',
    excerpt: 'Mengapa kestabilan emosi dan penerimaan diri menjadi prasyarat utama sebelum menuntut kesempurnaan dari pasangan.',
    category: 'Pengembangan Diri',
    readTime: '5 menit baca',
    date: '15 Oktober 2026',
    author: 'dr. Haniyyah Sp.KJ',
  },
];

export const BlogPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Fiqih Taaruf', 'Psikologi Pranikah', 'Finansial Keluarga', 'Pengembangan Diri'];

  const filtered = ARTICLES.filter((a) => {
    const matchCat = selectedCategory === 'all' || a.category === selectedCategory;
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7E6EA] text-[#A95570] text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Artikel Editorial Islami</span>
        </div>
        <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#29252A]">
          Khazanah Ilmu Pranikah & Bimbingan Keluarga
        </h1>
        <p className="text-xs sm:text-sm text-[#777078] leading-relaxed">
          Bekal ilmu, adab, psikologi, dan finansial dari asatidz, psikolog, serta pakar keuangan untuk memantapkan langkahmu menuju mahligai sakinah.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-[#F0E7E9]">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === c
                  ? 'bg-[#A95570] text-white shadow-xs'
                  : 'bg-[#FFF5F7] text-[#777078] hover:text-[#29252A]'
              }`}
            >
              {c === 'all' ? 'Semua Topik' : c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#777078] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul artikel..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((art) => (
          <article
            key={art.id}
            className="bg-white rounded-3xl border border-[#F0E7E9] p-6 hover:border-[#F7E6EA] hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#777078]">
                <span className="font-semibold text-[#A95570] bg-[#FFF5F7] px-2.5 py-1 rounded-full">
                  {art.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {art.readTime}
                </span>
              </div>

              <h2 className="font-serif-editorial text-xl font-bold text-[#29252A] hover:text-[#A95570] transition leading-snug cursor-pointer">
                {art.title}
              </h2>

              <p className="text-xs text-[#777078] leading-relaxed line-clamp-3">
                {art.excerpt}
              </p>
            </div>

            <div className="border-t border-[#F0E7E9] pt-4 flex items-center justify-between text-xs text-[#777078]">
              <div className="space-y-0.5">
                <span className="font-medium text-[#29252A] block">{art.author}</span>
                <span className="text-[11px]">{art.date}</span>
              </div>
              <span className="text-xs font-semibold text-[#A95570] inline-flex items-center gap-1 hover:underline cursor-pointer">
                Baca Artikel <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
