import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createNewPost } from '@/services/postService';
import type { Post } from '@/types/database';
import {
  Send,
  Image as ImageIcon,
  Tag,
  Globe,
  Users,
  Sparkles,
  X,
  AlertCircle,
} from 'lucide-react';

interface FeedComposerProps {
  onPostCreated: (post: Post) => void;
}

const POPULAR_TAGS = ['Ikhtiar', 'FiqihPranikah', 'RefleksiHati', 'NadzorSyar’i', 'DoaJodoh'];

export const FeedComposer: React.FC<FeedComposerProps> = ({ onPostCreated }) => {
  const { profile } = useAuth();
  const [content, setContent] = useState('');
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Ikhtiar']);
  const [visibility, setVisibility] = useState<'public' | 'followers'>('public');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!profile) return null;

  const handleAddMedia = () => {
    if (mediaUrlInput.trim()) {
      setMediaUrls([...mediaUrls, mediaUrlInput.trim()]);
      setMediaUrlInput('');
      setShowMediaInput(false);
    }
  };

  const removeMedia = (idx: number) => {
    setMediaUrls(mediaUrls.filter((_, i) => i !== idx));
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await createNewPost(
        content.trim(),
        profile,
        mediaUrls,
        selectedTags,
        visibility
      );

      if (res.post) {
        onPostCreated(res.post);
        setContent('');
        setMediaUrls([]);
        setSelectedTags(['Ikhtiar']);
      } else if (res.error) {
        setErrorMessage(res.error);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Gagal mengirim postingan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#F0E7E9] p-5 shadow-xs space-y-4">
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3 items-start">
          {/* User Mini Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#A95570] to-[#C77B91] flex items-center justify-center text-white font-bold text-xs uppercase shrink-0 shadow-xs">
            {profile.display_name?.charAt(0) || profile.full_name?.charAt(0) || 'U'}
          </div>

          {/* Text Area */}
          <div className="flex-1 space-y-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis nasehat pranikah, catatan ikhtiar, atau hikmah hari ini..."
              rows={3}
              maxLength={1000}
              className="w-full p-3 rounded-2xl bg-[#FFF5F7]/40 border border-[#F0E7E9] text-xs text-[#29252A] placeholder:text-[#777078] focus:outline-none focus:border-[#A95570] focus:bg-white resize-none transition"
            />

            {/* Media Previews */}
            {mediaUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {mediaUrls.map((url, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#F0E7E9]">
                    <img src={url} alt="Media lampiran" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeMedia(i)}
                      className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-black"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Media URL Input popup */}
        {showMediaInput && (
          <div className="p-3 bg-[#FFF5F7] rounded-xl border border-[#F7E6EA] flex gap-2">
            <input
              type="url"
              value={mediaUrlInput}
              onChange={(e) => setMediaUrlInput(e.target.value)}
              placeholder="Tempel tautan URL gambar (https://...)"
              className="flex-1 px-3 py-1.5 rounded-lg border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
            />
            <button
              type="button"
              onClick={handleAddMedia}
              className="px-3 py-1.5 rounded-lg bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b]"
            >
              Lampirkan
            </button>
            <button
              type="button"
              onClick={() => setShowMediaInput(false)}
              className="px-2 py-1.5 text-xs text-[#777078]"
            >
              Batal
            </button>
          </div>
        )}

        {/* Tags Selector */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-[#777078] flex items-center gap-1 font-medium">
            <Tag className="w-3 h-3 text-[#A95570]" /> Tagar:
          </span>
          {POPULAR_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition ${
                  isSelected
                    ? 'bg-[#A95570] text-white shadow-xs'
                    : 'bg-[#FFF5F7] text-[#777078] hover:text-[#A95570]'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex items-center justify-between border-t border-[#F0E7E9] pt-3 text-xs">
          <div className="flex items-center gap-3">
            {/* Attach Image Button */}
            <button
              type="button"
              onClick={() => setShowMediaInput(!showMediaInput)}
              className="flex items-center gap-1.5 text-[#777078] hover:text-[#A95570] transition font-medium"
              title="Lampirkan Gambar"
            >
              <ImageIcon className="w-4 h-4 text-[#A95570]" />
              <span className="hidden sm:inline">Foto</span>
            </button>

            {/* Visibility Selector */}
            <div className="flex items-center gap-1 bg-[#FFF5F7] p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setVisibility('public')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition ${
                  visibility === 'public'
                    ? 'bg-white text-[#A95570] shadow-xs'
                    : 'text-[#777078]'
                }`}
              >
                <Globe className="w-3 h-3" />
                <span>Publik</span>
              </button>
              <button
                type="button"
                onClick={() => setVisibility('followers')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition ${
                  visibility === 'followers'
                    ? 'bg-white text-[#A95570] shadow-xs'
                    : 'text-[#777078]'
                }`}
              >
                <Users className="w-3 h-3" />
                <span>Pengikut</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#777078]">
              {content.length}/1000
            </span>

            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="px-5 py-2 rounded-xl bg-[#A95570] text-white font-semibold text-xs hover:bg-[#92435b] transition shadow-xs flex items-center gap-1.5 disabled:opacity-40"
            >
              {submitting ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Posting</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
