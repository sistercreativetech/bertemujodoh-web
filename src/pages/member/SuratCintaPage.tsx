import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  getMyLetters,
  getPublicLetters,
  createLetter,
  deleteLetter,
  toggleLikeLetter,
  type LoveLetter,
} from '@/services/loveLetterService';
import {
  Mail,
  Lock,
  Globe,
  PenTool,
  Plus,
  Heart,
  Trash2,
  X,
  Sparkles,
  BookOpen,
  Calendar,
  Send,
} from 'lucide-react';

export const SuratCintaPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'my' | 'public'>('my');
  const [myLetters, setMyLetters] = useState<LoveLetter[]>([]);
  const [publicLetters, setPublicLetters] = useState<LoveLetter[]>([]);

  // Composer Modal State
  const [composerOpen, setComposerOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<LoveLetter['mode']>('private');
  const [penName, setPenName] = useState('');

  const loadLetters = () => {
    if (user) {
      setMyLetters(getMyLetters(user.id));
    }
    setPublicLetters(getPublicLetters());
  };

  useEffect(() => {
    loadLetters();
  }, [user]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !content.trim()) return;

    createLetter(
      user.id,
      profile?.full_name || 'Anggota Bertemu Jodoh',
      title.trim(),
      content.trim(),
      mode,
      penName.trim() || undefined
    );

    setTitle('');
    setContent('');
    setPenName('');
    setMode('private');
    setComposerOpen(false);
    loadLetters();
  };

  const handleDelete = (letterId: string) => {
    if (confirm('Hapus surat ini dari jurnal Anda?')) {
      deleteLetter(letterId);
      loadLetters();
    }
  };

  const handleLike = (letterId: string) => {
    toggleLikeLetter(letterId);
    loadLetters();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-[#F0E7E9] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7E6EA] text-[#A95570] text-xs font-semibold">
            <Mail className="w-3.5 h-3.5" />
            <span>Jurnal Hati Digital</span>
          </div>
          <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#29252A]">
            Surat Cinta untuk Jodoh Impian
          </h1>
          <p className="text-xs text-[#777078] max-w-xl">
            Ruang privat untuk menuliskan doa, refleksi, dan harapan bagi calon pendamping hidupmu kelak. Bisa disimpan untuk diri sendiri atau dibagikan secara anonim.
          </p>
        </div>

        <button
          onClick={() => setComposerOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b] transition flex items-center gap-2 shadow-xs shrink-0 self-start md:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Surat Baru</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#F0E7E9] gap-2 pb-1">
        <button
          onClick={() => setActiveTab('my')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition ${
            activeTab === 'my'
              ? 'bg-[#A95570] text-white shadow-xs'
              : 'text-[#777078] hover:bg-[#FFF5F7]'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Jurnal Surat Saya ({myLetters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('public')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition ${
            activeTab === 'public'
              ? 'bg-[#A95570] text-white shadow-xs'
              : 'text-[#777078] hover:bg-[#FFF5F7]'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Galeri Surat Inspiratif Anonim ({publicLetters.length})</span>
        </button>
      </div>

      {/* LIST OF LETTERS */}
      {activeTab === 'my' ? (
        myLetters.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#F0E7E9] p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#FFF5F7] text-[#A95570] flex items-center justify-center mx-auto">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="font-serif-editorial text-lg font-bold text-[#29252A]">
              Jurnal Surat Anda Masih Kosong
            </h3>
            <p className="text-xs text-[#777078] max-w-md mx-auto">
              Tuliskan doa atau unek-unek hatimu untuk belahan jiwa yang saat ini masih dirahasiakan Allah di Lauhul Mahfudz.
            </p>
            <button
              onClick={() => setComposerOpen(true)}
              className="mt-2 px-5 py-2 rounded-xl bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b]"
            >
              Mulai Menulis
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myLetters.map((letter) => (
              <div
                key={letter.id}
                className="bg-white rounded-3xl border border-[#F0E7E9] p-6 space-y-4 hover:border-[#F7E6EA] hover:shadow-xs transition flex flex-col justify-between relative group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#777078] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#A95570]" />
                      {new Date(letter.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>

                    {/* Mode Tag */}
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                        letter.mode === 'private'
                          ? 'bg-neutral-100 text-[#777078]'
                          : letter.mode === 'anonymous_public'
                          ? 'bg-[#FFF0F3] text-[#A95570]'
                          : 'bg-purple-50 text-purple-700'
                      }`}
                    >
                      {letter.mode === 'private' ? (
                        <>
                          <Lock className="w-3 h-3" /> Hanya Saya
                        </>
                      ) : letter.mode === 'anonymous_public' ? (
                        <>
                          <Globe className="w-3 h-3" /> Anonim Publik
                        </>
                      ) : (
                        <>
                          <PenTool className="w-3 h-3" /> {letter.pen_name}
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="font-serif-editorial text-lg font-bold text-[#29252A]">
                    {letter.title}
                  </h3>

                  <p className="text-xs text-[#29252A] leading-relaxed whitespace-pre-line italic line-clamp-5 bg-[#FFF5F7]/30 p-3.5 rounded-2xl border border-[#F7E6EA]">
                    "{letter.content}"
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F0E7E9] flex items-center justify-between">
                  <span className="text-[11px] text-[#777078] flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-[#A95570] fill-[#F7E6EA]" />
                    {letter.likes_count} Mengaminkan
                  </span>

                  <button
                    onClick={() => handleDelete(letter.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg transition"
                    title="Hapus Surat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* PUBLIC INSPIRATION GALLERY */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {publicLetters.map((letter) => (
            <div
              key={letter.id}
              className="bg-white rounded-3xl border border-[#F0E7E9] p-6 space-y-4 hover:border-[#F7E6EA] hover:shadow-xs transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#A95570] bg-[#FFF5F7] px-2.5 py-0.5 rounded-full">
                    ✍️ {letter.pen_name || 'Hamba Allah (Anonim)'}
                  </span>
                  <span className="text-[10px] text-[#777078]">
                    {new Date(letter.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>

                <h3 className="font-serif-editorial text-lg font-bold text-[#29252A]">
                  {letter.title}
                </h3>

                <p className="text-xs text-[#29252A] leading-relaxed whitespace-pre-line italic bg-[#FFF5F7]/30 p-4 rounded-2xl border border-[#F7E6EA]">
                  "{letter.content}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0E7E9] flex items-center justify-between">
                <button
                  onClick={() => handleLike(letter.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold transition ${
                    letter.user_has_liked ? 'text-[#A95570]' : 'text-[#777078] hover:text-[#A95570]'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${letter.user_has_liked ? 'fill-[#A95570] text-[#A95570]' : ''}`}
                  />
                  <span>{letter.likes_count} Orang Mengaminkan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COMPOSER MODAL */}
      {composerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 relative shadow-2xl border border-[#F0E7E9] my-8 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setComposerOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold text-[#A95570] uppercase">
                Goresan Tinta Ikhtiar
              </span>
              <h3 className="font-serif-editorial text-2xl font-bold text-[#29252A]">
                Tulis Surat untuk Jodoh Impian
              </h3>
              <p className="text-xs text-[#777078]">
                Tumpahkan harapan, doa, dan kalimat terindah yang ingin kamu sampaikan kelak saat akad tiba.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#29252A] mb-1">Judul Surat</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Sepucuk Doa di Sepertiga Malam untukmu..."
                  className="w-full p-2.5 rounded-xl border border-[#F0E7E9] text-xs text-[#29252A] focus:outline-none focus:border-[#A95570]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#29252A] mb-1">Isi Surat / Refleksi</label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan isi suratmu dengan tulus dari lubuk hati..."
                  className="w-full p-3 rounded-2xl border border-[#F0E7E9] text-xs text-[#29252A] focus:outline-none focus:border-[#A95570]"
                />
              </div>

              {/* PRIVACY TOGGLES */}
              <div className="space-y-2">
                <label className="block font-semibold text-[#29252A]">Pilihan Privasi:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label
                    className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition ${
                      mode === 'private'
                        ? 'border-[#A95570] bg-[#FFF5F7] text-[#A95570]'
                        : 'border-[#F0E7E9] text-[#777078] hover:bg-neutral-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="privacy_mode"
                      checked={mode === 'private'}
                      onChange={() => setMode('private')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                      <Lock className="w-3.5 h-3.5" /> Hanya Saya
                    </div>
                    <span className="text-[10px] leading-tight">100% privat, hanya Anda yang dapat membacanya.</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition ${
                      mode === 'anonymous_public'
                        ? 'border-[#A95570] bg-[#FFF5F7] text-[#A95570]'
                        : 'border-[#F0E7E9] text-[#777078] hover:bg-neutral-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="privacy_mode"
                      checked={mode === 'anonymous_public'}
                      onChange={() => setMode('anonymous_public')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                      <Globe className="w-3.5 h-3.5" /> Publik Anonim
                    </div>
                    <span className="text-[10px] leading-tight">Tampil di galeri inspirasi tanpa nama penulis.</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition ${
                      mode === 'pen_name'
                        ? 'border-[#A95570] bg-[#FFF5F7] text-[#A95570]'
                        : 'border-[#F0E7E9] text-[#777078] hover:bg-neutral-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="privacy_mode"
                      checked={mode === 'pen_name'}
                      onChange={() => setMode('pen_name')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                      <PenTool className="w-3.5 h-3.5" /> Nama Pena
                    </div>
                    <span className="text-[10px] leading-tight">Gunakan nama samaran pilihan Anda.</span>
                  </label>
                </div>
              </div>

              {mode === 'pen_name' && (
                <div>
                  <label className="block font-semibold text-[#29252A] mb-1">Nama Pena / Samaran</label>
                  <input
                    type="text"
                    required
                    value={penName}
                    onChange={(e) => setPenName(e.target.value)}
                    placeholder="Contoh: Musafir Cinta, Pena Shalihah..."
                    className="w-full p-2.5 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-[#F0E7E9] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setComposerOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#F0E7E9] text-xs font-semibold text-[#777078]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b] transition shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Simpan ke Jurnal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
