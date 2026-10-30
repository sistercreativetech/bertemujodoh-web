import React, { useState } from 'react';
import { Tag, BookOpen, Heart, Copy, Check } from 'lucide-react';

interface SidebarTrendingProps {
  onSelectTag?: (tag: string) => void;
}

export const SidebarTrending: React.FC<SidebarTrendingProps> = ({ onSelectTag }) => {
  const [copiedDoa, setCopiedDoa] = useState(false);

  const trendingTopics = [
    { tag: 'NadzorSyar’i', count: 142 },
    { tag: 'FiqihPranikah', count: 98 },
    { tag: 'RefleksiHati', count: 85 },
    { tag: 'MaharSederhana', count: 64 },
    { tag: 'AdabTaaruf', count: 57 },
  ];

  const doaText =
    'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا\n\n"Ya Tuhan kami, anugerahkanlah kepada kami pasangan dan keturunan kami sebagai penyejuk hati (kami), dan jadikanlah kami pemimpin bagi orang-orang yang bertakwa." (QS. Al-Furqan: 74)';

  const handleCopyDoa = () => {
    navigator.clipboard?.writeText(doaText);
    setCopiedDoa(true);
    setTimeout(() => setCopiedDoa(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Trending Topics Card */}
      <div className="bg-white rounded-3xl border border-[#F0E7E9] p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#A95570]" />
          <h3 className="font-serif-editorial text-sm font-bold text-[#29252A]">
            Topik Hangat Pranikah
          </h3>
        </div>

        <div className="space-y-2.5">
          {trendingTopics.map((item) => (
            <div
              key={item.tag}
              onClick={() => onSelectTag?.(item.tag)}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FFF5F7] transition cursor-pointer text-xs group"
            >
              <div>
                <span className="font-bold text-[#29252A] group-hover:text-[#A95570] transition">
                  #{item.tag}
                </span>
                <span className="text-[10px] text-[#777078] block">Diskusi Komunitas</span>
              </div>
              <span className="text-[10px] font-semibold text-[#A95570] bg-[#F7E6EA] px-2 py-0.5 rounded-full">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Doa & Adab Card */}
      <div className="bg-gradient-to-br from-[#FFF5F7] to-[#FCEEF1] rounded-3xl border border-[#F7E6EA] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A95570] flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> Doa Menjemput Jodoh
          </span>
          <button
            onClick={handleCopyDoa}
            className="text-[10px] text-[#777078] hover:text-[#A95570] flex items-center gap-1 font-medium bg-white/70 px-2 py-0.5 rounded-md"
            title="Salin Doa"
          >
            {copiedDoa ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-600 font-bold">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>

        <p className="font-serif-editorial text-sm font-bold text-[#29252A] leading-relaxed text-right font-serif" dir="rtl">
          رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا
        </p>

        <p className="text-[11px] text-[#777078] leading-relaxed italic">
          "Ya Tuhan kami, anugerahkanlah kepada kami pasangan dan keturunan kami sebagai penyejuk hati, dan jadikanlah kami pemimpin bagi orang-orang yang bertakwa."
        </p>
        <span className="text-[10px] text-[#A95570] font-semibold block">
          — QS. Al-Furqan: 74
        </span>
      </div>
    </div>
  );
};
