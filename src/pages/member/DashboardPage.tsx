import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchPosts, getStoredFollows } from '@/services/postService';
import type { Post } from '@/types/database';
import { FeedComposer } from '@/components/feed/FeedComposer';
import { PostCard } from '@/components/feed/PostCard';
import { SidebarProfile } from '@/components/feed/SidebarProfile';
import { SidebarTrending } from '@/components/feed/SidebarTrending';
import { UpgradeModal } from '@/components/membership/UpgradeModal';
import {
  Globe,
  Users,
  Sparkles,
  Inbox,
  Filter,
  X,
  RefreshCw,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'following'>('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [followsList, setFollowsList] = useState<string[]>([]);

  const loadData = async (tab: 'all' | 'following') => {
    setLoading(true);
    try {
      const data = await fetchPosts(user?.id, tab);
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      const follows = getStoredFollows(user.id);
      setFollowsList(follows);
    }
    loadData(activeTab);
  }, [user, activeTab]);

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(posts.filter((p) => p.id !== postId));
  };

  const handleFollowToggled = (targetUserId: string, nextStatus: boolean) => {
    if (nextStatus) {
      setFollowsList((prev) => [...prev, targetUserId]);
    } else {
      setFollowsList((prev) => prev.filter((id) => id !== targetUserId));
    }
    if (activeTab === 'following') {
      loadData('following');
    }
  };

  // Filter posts by tag if tag is selected
  const displayedPosts = selectedTagFilter
    ? posts.filter((p) => p.tags?.some((t) => t.toLowerCase() === selectedTagFilter.toLowerCase()))
    : posts;

  const myPostsCount = posts.filter((p) => p.author_id === user?.id).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* 3-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile Card & Membership (lg: 3.5 cols) */}
        <aside className="lg:col-span-3 order-2 lg:order-1 sticky top-24">
          <SidebarProfile
            onOpenUpgradeModal={() => setUpgradeModalOpen(true)}
            postsCount={myPostsCount}
            followingCount={followsList.length}
          />
        </aside>

        {/* Center Column: Feed Timeline (lg: 6 cols) */}
        <main className="lg:col-span-6 order-1 lg:order-2 space-y-5">
          {/* Timeline Feed Stream Tabs */}
          <div className="bg-white rounded-2xl border border-[#F0E7E9] p-1.5 flex items-center justify-between shadow-xs">
            <div className="flex gap-1 w-full sm:w-auto">
              <button
                onClick={() => {
                  setActiveTab('all');
                  setSelectedTagFilter(null);
                }}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'all'
                    ? 'bg-[#A95570] text-white shadow-xs'
                    : 'text-[#777078] hover:text-[#29252A] hover:bg-[#FFF5F7]'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Untuk Anda (Global)</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('following');
                  setSelectedTagFilter(null);
                }}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'following'
                    ? 'bg-[#A95570] text-white shadow-xs'
                    : 'text-[#777078] hover:text-[#29252A] hover:bg-[#FFF5F7]'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Mengikuti ({followsList.length})</span>
              </button>
            </div>

            <button
              onClick={() => loadData(activeTab)}
              className="hidden sm:flex p-2 text-[#777078] hover:text-[#A95570] hover:bg-[#FFF5F7] rounded-xl transition"
              title="Perbarui Feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Active Tag Filter Indicator */}
          {selectedTagFilter && (
            <div className="bg-[#FFF5F7] p-2.5 px-4 rounded-xl border border-[#F7E6EA] flex items-center justify-between text-xs">
              <span className="text-[#A95570] font-semibold flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Menyaring tagar: #{selectedTagFilter}
              </span>
              <button
                onClick={() => setSelectedTagFilter(null)}
                className="text-[#777078] hover:text-[#29252A] flex items-center gap-1 text-[11px]"
              >
                <X className="w-3.5 h-3.5" /> Hapus Saringan
              </button>
            </div>
          )}

          {/* Twitter / Tumblr Composer */}
          <FeedComposer onPostCreated={handlePostCreated} />

          {/* Feed Post List */}
          {loading ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-[#F0E7E9]">
              <div className="w-10 h-10 rounded-full border-3 border-[#F7E6EA] border-t-[#A95570] animate-spin mx-auto" />
              <p className="text-xs font-medium text-[#777078]">Memuat linimasa refleksi...</p>
            </div>
          ) : displayedPosts.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-[#F0E7E9] p-6">
              <div className="w-12 h-12 rounded-full bg-[#FFF5F7] text-[#A95570] flex items-center justify-center mx-auto">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="font-serif-editorial text-base font-bold text-[#29252A]">
                {activeTab === 'following'
                  ? 'Belum ada postingan dari anggota yang Anda ikuti'
                  : 'Belum ada postingan pada topik ini'}
              </h3>
              <p className="text-xs text-[#777078] max-w-sm mx-auto">
                {activeTab === 'following'
                  ? 'Kunjungi tab "Untuk Anda" untuk menemukan penulis nasehat pranikah dan ikuti akun mereka.'
                  : 'Jadilah yang pertama membagikan refleksi atau doa ikhtiar hari ini.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isFollowingAuthor={followsList.includes(post.author_id)}
                  onPostDeleted={handlePostDeleted}
                  onFollowToggled={handleFollowToggled}
                  onOpenUpgradeModal={() => setUpgradeModalOpen(true)}
                />
              ))}
            </div>
          )}
        </main>

        {/* Right Column: Trending Topics & Daily Doa (lg: 3 cols) */}
        <aside className="lg:col-span-3 order-3 hidden lg:block sticky top-24">
          <SidebarTrending onSelectTag={(tag) => setSelectedTagFilter(tag)} />
        </aside>
      </div>

      {/* Upgrade Modal for Instant Package Activation */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />
    </div>
  );
};
