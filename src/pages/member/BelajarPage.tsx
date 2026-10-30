import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  BOOK_CHAPTERS,
  VIDEO_COURSES,
  getReadChapters,
  toggleChapterRead,
  getWatchedVideos,
  toggleVideoWatched,
  type Chapter,
  type VideoCourse,
} from '@/services/learningService';
import { UpgradeModal } from '@/components/membership/UpgradeModal';
import {
  BookOpen,
  PlayCircle,
  Lock,
  CheckCircle2,
  Sparkles,
  Clock,
  ChevronRight,
  Eye,
  X,
  Type,
  Sun,
  Moon,
  Coffee,
  ArrowRight,
  Check,
} from 'lucide-react';

export const BelajarPage: React.FC = () => {
  const { user, membership } = useAuth();
  const [activeTab, setActiveTab] = useState<'book' | 'video'>('book');
  const [readChapters, setReadChapters] = useState<number[]>(user ? getReadChapters(user.id) : [1]);
  const [watchedVideos, setWatchedVideos] = useState<number[]>(user ? getWatchedVideos(user.id) : []);

  // E-Reader Reader State
  const [activeReadingChapter, setActiveReadingChapter] = useState<Chapter | null>(null);
  const [readerTheme, setReaderTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  // Active Video State
  const [activeVideo, setActiveVideo] = useState<VideoCourse | null>(VIDEO_COURSES[0]);

  // Upgrade Modal
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const isPremium = membership?.can_access_premium;

  const handleOpenChapter = (chap: Chapter) => {
    if (!chap.isFreePreview && !isPremium) {
      setUpgradeModalOpen(true);
      return;
    }
    setActiveReadingChapter(chap);
  };

  const handleToggleRead = (chapterId: number) => {
    if (!user) return;
    const updated = toggleChapterRead(user.id, chapterId);
    setReadChapters(updated);
  };

  const handleToggleWatch = (videoId: number) => {
    if (!user) return;
    const updated = toggleVideoWatched(user.id, videoId);
    setWatchedVideos(updated);
  };

  const totalItems = BOOK_CHAPTERS.length + VIDEO_COURSES.length;
  const completedItems = readChapters.length + watchedVideos.length;
  const progressPercent = Math.min(100, Math.round((completedItems / totalItems) * 100));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Overall Progress Banner */}
      <div className="bg-white rounded-3xl border border-[#F0E7E9] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F7E6EA] text-[#A95570] uppercase">
                Kurikulum Ilmu Pranikah
              </span>
              {isPremium ? (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Akses Premium Terbuka Penuh
                </span>
              ) : (
                <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Free Trial (Bab 1 Terbuka)
                </span>
              )}
            </div>
            <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#29252A]">
              Perpustakaan & Video Kajian Pranikah
            </h1>
            <p className="text-xs sm:text-sm text-[#777078]">
              Bekali dirimu dengan kurikulum 15 bab ilmu pernikahan dan kajian video bersama pakar keluarga islami.
            </p>
          </div>

          {!isPremium && (
            <button
              onClick={() => setUpgradeModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b] transition flex items-center gap-2 shadow-xs shrink-0 self-start md:self-center"
            >
              <Sparkles className="w-4 h-4" />
              <span>Buka Seluruh Materi (Upgrade)</span>
            </button>
          )}
        </div>

        {/* Learning Progress Bar */}
        <div className="pt-2 border-t border-[#F0E7E9] space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-[#A95570]">
              Progres Belajar: {completedItems} dari {totalItems} Materi Selesai
            </span>
            <span className="text-[#29252A] font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-[#FFF5F7] rounded-full overflow-hidden border border-[#F7E6EA]">
            <div
              className="h-full bg-gradient-to-r from-[#C77B91] to-[#A95570] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#F0E7E9] gap-2 pb-1">
        <button
          onClick={() => setActiveTab('book')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition ${
            activeTab === 'book'
              ? 'bg-[#A95570] text-white shadow-xs'
              : 'text-[#777078] hover:bg-[#FFF5F7]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Buku Panduan Pranikah ({BOOK_CHAPTERS.length} Bab)</span>
        </button>

        <button
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition ${
            activeTab === 'video'
              ? 'bg-[#A95570] text-white shadow-xs'
              : 'text-[#777078] hover:bg-[#FFF5F7]'
          }`}
        >
          <PlayCircle className="w-4 h-4" />
          <span>Video Kajian & E-Course ({VIDEO_COURSES.length} Modul)</span>
        </button>
      </div>

      {/* TAB CONTENT 1: BUKU PANDUAN ONLINE */}
      {activeTab === 'book' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BOOK_CHAPTERS.map((chap) => {
            const isCompleted = readChapters.includes(chap.id);
            const isLocked = !chap.isFreePreview && !isPremium;

            return (
              <div
                key={chap.id}
                onClick={() => handleOpenChapter(chap)}
                className={`bg-white rounded-3xl border transition p-5 flex flex-col justify-between space-y-4 cursor-pointer group ${
                  isLocked
                    ? 'border-[#F0E7E9] opacity-85 hover:border-amber-200'
                    : 'border-[#F0E7E9] hover:border-[#F7E6EA] hover:shadow-md'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-[#FFF5F7] text-[#A95570]">
                      Bab {chap.number}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#777078] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#A95570]" /> {chap.readTime}
                      </span>
                      {isLocked ? (
                        <span className="p-1 text-amber-500 bg-amber-50 rounded-lg">
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                      ) : isCompleted ? (
                        <span className="p-1 text-emerald-600 bg-emerald-50 rounded-lg" title="Sudah Dibaca">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <h3 className="font-serif-editorial text-base font-bold text-[#29252A] group-hover:text-[#A95570] transition">
                    {chap.title}
                  </h3>
                  <p className="text-xs text-[#777078] leading-relaxed line-clamp-2">
                    {chap.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0E7E9] flex items-center justify-between text-xs">
                  <span className={`text-[11px] font-semibold ${chap.isFreePreview ? 'text-emerald-600' : isLocked ? 'text-amber-600' : 'text-[#A95570]'}`}>
                    {chap.isFreePreview ? 'Gratis (Preview)' : isLocked ? 'Terkunci (Paket Premium)' : 'Buka E-Reader'}
                  </span>
                  <span className="text-xs font-semibold text-[#A95570] group-hover:translate-x-1 transition flex items-center gap-1">
                    Baca <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT 2: VIDEO KAJIAN */}
      {activeTab === 'video' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Active Video Player Column (lg: 8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {activeVideo && (
              <div className="bg-white rounded-3xl border border-[#F0E7E9] overflow-hidden shadow-xs space-y-4">
                {/* Responsive Video Container */}
                <div className="relative aspect-video bg-neutral-900 w-full flex items-center justify-center">
                  {isPremium ? (
                    <iframe
                      src={activeVideo.videoEmbedUrl}
                      title={activeVideo.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="text-center p-6 space-y-3 text-white">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto text-amber-400">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif-editorial text-lg font-bold">Video Terkunci Khusus Member Premium</h4>
                      <p className="text-xs text-white/80 max-w-sm mx-auto">
                        Upgrade ke paket 1 Bulan (Rp 19rb) atau 6 Bulan (Rp 89rb) untuk menonton seluruh video kajian berkualitas HD.
                      </p>
                      <button
                        onClick={() => setUpgradeModalOpen(true)}
                        className="px-5 py-2 rounded-xl bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b]"
                      >
                        Buka Akses Video
                      </button>
                    </div>
                  )}
                </div>

                {/* Video Info & Controls */}
                <div className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E7E9] pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-[#A95570] uppercase">
                        Pemateri: {activeVideo.instructor} ({activeVideo.instructorRole})
                      </span>
                      <h2 className="font-serif-editorial text-xl font-bold text-[#29252A] mt-0.5">
                        {activeVideo.title}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleWatch(activeVideo.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition self-start sm:self-center ${
                        watchedVideos.includes(activeVideo.id)
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-[#FFF5F7] text-[#A95570] hover:bg-[#A95570] hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{watchedVideos.includes(activeVideo.id) ? 'Selesai Ditonton' : 'Tandai Selesai'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-[#777078] leading-relaxed">
                    {activeVideo.description}
                  </p>

                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                    <span className="text-xs font-bold text-[#29252A] block">Poin-poin Kunci Kajian:</span>
                    <ul className="space-y-1.5 text-xs text-[#777078]">
                      {activeVideo.keyPoints.map((pt, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#A95570]" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Playlist Sidebar (lg: 4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-serif-editorial text-sm font-bold text-[#29252A] px-1">
              Daftar Modul Kajian ({VIDEO_COURSES.length})
            </h3>
            <div className="space-y-2">
              {VIDEO_COURSES.map((vid) => {
                const isSelected = activeVideo?.id === vid.id;
                const isWatched = watchedVideos.includes(vid.id);

                return (
                  <div
                    key={vid.id}
                    onClick={() => setActiveVideo(vid)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#A95570] bg-[#FFF5F7]'
                        : 'border-[#F0E7E9] bg-white hover:border-[#F7E6EA]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#F0E7E9] flex items-center justify-center shrink-0 text-[#A95570]">
                      <PlayCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#777078]">{vid.duration}</span>
                        {isWatched && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Selesai
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs text-[#29252A] line-clamp-2">
                        {vid.title}
                      </h4>
                      <p className="text-[10px] text-[#777078]">{vid.instructor}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ONLINE E-READER MODAL / DRAWER */}
      {activeReadingChapter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className={`rounded-3xl max-w-3xl w-full p-6 sm:p-10 space-y-6 relative shadow-2xl transition-all my-8 ${
              readerTheme === 'sepia'
                ? 'bg-[#FBF0D9] text-[#5F4B32]'
                : readerTheme === 'dark'
                ? 'bg-neutral-900 text-neutral-200'
                : 'bg-white text-[#29252A]'
            }`}
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between border-b pb-4 border-black/10 dark:border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A95570]">
                E-Reader • Bab {activeReadingChapter.number}
              </span>

              {/* Reader Controls: Theme & Font Size */}
              <div className="flex items-center gap-3">
                {/* Themes */}
                <div className="flex bg-black/5 dark:bg-white/10 p-1 rounded-xl gap-1">
                  <button
                    onClick={() => setReaderTheme('light')}
                    className={`p-1.5 rounded-lg text-xs ${readerTheme === 'light' ? 'bg-white text-[#29252A] shadow-xs' : 'text-[#777078]'}`}
                    title="Mode Terang"
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setReaderTheme('sepia')}
                    className={`p-1.5 rounded-lg text-xs ${readerTheme === 'sepia' ? 'bg-[#5F4B32] text-white shadow-xs' : 'text-[#777078]'}`}
                    title="Mode Sepia (Nyaman untuk Mata)"
                  >
                    <Coffee className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setReaderTheme('dark')}
                    className={`p-1.5 rounded-lg text-xs ${readerTheme === 'dark' ? 'bg-neutral-800 text-white shadow-xs' : 'text-[#777078]'}`}
                    title="Mode Gelap"
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Font Size */}
                <div className="flex bg-black/5 dark:bg-white/10 p-1 rounded-xl text-xs font-bold gap-1">
                  <button
                    onClick={() => setFontSize('sm')}
                    className={`px-2 py-0.5 rounded-lg ${fontSize === 'sm' ? 'bg-white dark:bg-neutral-800 shadow-xs' : 'opacity-60'}`}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSize('base')}
                    className={`px-2 py-0.5 rounded-lg ${fontSize === 'base' ? 'bg-white dark:bg-neutral-800 shadow-xs' : 'opacity-60'}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('lg')}
                    className={`px-2 py-0.5 rounded-lg ${fontSize === 'lg' ? 'bg-white dark:bg-neutral-800 shadow-xs' : 'opacity-60'}`}
                  >
                    A+
                  </button>
                </div>

                <button
                  onClick={() => setActiveReadingChapter(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reading Content */}
            <article
              className={`space-y-4 font-normal leading-relaxed whitespace-pre-line ${
                fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base leading-loose' : 'text-sm'
              }`}
            >
              {activeReadingChapter.content}
            </article>

            {/* Footer Navigation */}
            <div className="pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
              <button
                onClick={() => handleToggleRead(activeReadingChapter.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  readChapters.includes(activeReadingChapter.id)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#A95570] text-white hover:bg-[#92435b]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{readChapters.includes(activeReadingChapter.id) ? 'Selesai Dibaca ✓' : 'Tandai Bab Selesai'}</span>
              </button>

              <button
                onClick={() => setActiveReadingChapter(null)}
                className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold"
              >
                Tutup Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />
    </div>
  );
};
