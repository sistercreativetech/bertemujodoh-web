import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toggleLike, toggleFollow, deletePost } from '@/services/postService';
import type { Post } from '@/types/database';
import {
  Heart,
  Share2,
  Trash2,
  UserPlus,
  UserCheck,
  CheckCircle2,
  Lock,
  Globe,
  Users,
  Send,
  MessageCircle,
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  isFollowingAuthor: boolean;
  onPostDeleted: (postId: string) => void;
  onFollowToggled: (targetUserId: string, nextStatus: boolean) => void;
  onOpenUpgradeModal?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  isFollowingAuthor,
  onPostDeleted,
  onFollowToggled,
  onOpenUpgradeModal,
}) => {
  const { user, profile: myProfile, membership } = useAuth();
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [hasLiked, setHasLiked] = useState(Boolean(post.user_has_liked));
  const [sharesCount, setSharesCount] = useState(post.shares_count);
  const [isCopied, setIsCopied] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isFollowing, setIsFollowing] = useState(isFollowingAuthor);
  const [deleting, setDeleting] = useState(false);

  const author = post.author;
  const isOwnPost = user?.id === post.author_id;
  const isAdmin = myProfile?.role === 'admin';
  const isOppositeGender = myProfile && author ? myProfile.gender !== author.gender : false;

  const formatTimeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)}m yang lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}j yang lalu`;
    return `${Math.floor(diff / 86400)} hari yang lalu`;
  };

  const handleLike = async () => {
    if (!user || isLiking) return;
    setIsLiking(true);

    const prevLiked = hasLiked;
    const prevCount = likesCount;

    // Optimistic update
    setHasLiked(!prevLiked);
    setLikesCount(Math.max(0, prevCount + (prevLiked ? -1 : 1)));

    try {
      const res = await toggleLike(post.id, user.id, prevLiked);
      setHasLiked(res.liked);
      setLikesCount(res.newCount);
    } catch (e) {
      // Revert on error
      setHasLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin + `/dashboard#${post.id}`);
    setIsCopied(true);
    setSharesCount((prev) => prev + 1);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleToggleFollow = async () => {
    if (!user || isOwnPost) return;
    const nextStatus = !isFollowing;
    setIsFollowing(nextStatus);
    onFollowToggled(post.author_id, nextStatus);
    await toggleFollow(user.id, post.author_id, isFollowing);
  };

  const handleDelete = async () => {
    if (!user) return;
    if (confirm('Hapus postingan refleksi ini?')) {
      setDeleting(true);
      const success = await deletePost(post.id, user.id);
      if (success) {
        onPostDeleted(post.id);
      }
      setDeleting(false);
    }
  };

  return (
    <article
      id={post.id}
      className="bg-white rounded-3xl border border-[#F0E7E9] hover:border-[#F7E6EA] hover:shadow-xs transition p-5 sm:p-6 space-y-4"
    >
      {/* Header: Author Info and Follow Button */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to={`/profil/${post.author_id}`}
            className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#A95570] to-[#C77B91] flex items-center justify-center text-white font-bold text-sm uppercase shrink-0 shadow-xs hover:scale-105 transition"
          >
            {author?.display_name?.charAt(0) || author?.full_name?.charAt(0) || 'U'}
          </Link>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                to={`/profil/${post.author_id}`}
                className="font-bold text-xs sm:text-sm text-[#29252A] hover:text-[#A95570] transition"
              >
                {author?.full_name || 'Anggota Bertemu Jodoh'}
              </Link>
              {author?.is_verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#A95570] fill-[#F7E6EA]" />
              )}
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  author?.gender === 'female' ? 'bg-[#FFF0F3] text-[#A95570]' : 'bg-blue-50 text-blue-700'
                }`}
              >
                {author?.gender === 'female' ? 'Akhwat' : 'Ikhwan'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#777078] mt-0.5">
              <span>{author?.occupation || 'Profesional'}</span>
              <span>•</span>
              <span>{author?.city}</span>
              <span>•</span>
              <span>{formatTimeAgo(post.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Top Right Controls (Follow / Delete) */}
        <div className="flex items-center gap-2">
          {!isOwnPost && user && (
            <button
              onClick={handleToggleFollow}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                isFollowing
                  ? 'bg-neutral-100 text-[#777078] hover:bg-neutral-200'
                  : 'bg-[#FFF5F7] text-[#A95570] hover:bg-[#F7E6EA]'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mengikuti</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Ikuti</span>
                </>
              )}
            </button>
          )}

          {(isOwnPost || isAdmin) && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
              title="Hapus Postingan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Post Text Content */}
      <div className="text-xs sm:text-sm text-[#29252A] leading-relaxed whitespace-pre-line font-normal">
        {post.content}
      </div>

      {/* Media Attachments */}
      {post.media_urls && post.media_urls.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          {post.media_urls.map((imgUrl, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-[#F0E7E9] max-h-72 bg-neutral-100">
              <img src={imgUrl} alt="Lampiran postingan" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Tags Chips */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {post.tags.map((t, idx) => (
            <span
              key={idx}
              className="text-[10px] font-semibold text-[#A95570] bg-[#FFF5F7] px-2 py-0.5 rounded-full"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Footer Toolbar: Like, Share, & Taaruf Shortcut */}
      <div className="border-t border-[#F0E7E9] pt-3 flex items-center justify-between text-xs text-[#777078]">
        <div className="flex items-center gap-6">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 font-medium transition ${
              hasLiked ? 'text-[#A95570]' : 'hover:text-[#A95570]'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition ${
                hasLiked ? 'fill-[#A95570] text-[#A95570] scale-110' : ''
              }`}
            />
            <span>{likesCount}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 font-medium hover:text-[#A95570] transition"
            title="Bagikan & Salin Tautan"
          >
            <Share2 className="w-4 h-4" />
            <span>{isCopied ? 'Tersalin!' : sharesCount}</span>
          </button>
        </div>

        {/* Opposite Gender Taaruf Shortcut */}
        {!isOwnPost && isOppositeGender && (
          <div className="flex items-center gap-2">
            {membership?.can_send_taaruf ? (
              <Link
                to={`/profil/${post.author_id}`}
                className="px-3 py-1.5 rounded-xl bg-[#FFF5F7] text-[#A95570] font-semibold text-[11px] hover:bg-[#A95570] hover:text-white transition flex items-center gap-1.5"
              >
                <Send className="w-3 h-3" />
                <span>Pelajari Profil & Taaruf</span>
              </Link>
            ) : (
              <button
                onClick={onOpenUpgradeModal}
                className="px-3 py-1.5 rounded-xl bg-[#FFF5F7] text-[#A95570] font-semibold text-[11px] hover:bg-[#A95570] hover:text-white transition flex items-center gap-1.5"
              >
                <Lock className="w-3 h-3" />
                <span>Buka Akses Taaruf</span>
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
