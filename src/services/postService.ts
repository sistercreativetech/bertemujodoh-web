import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Post, Profile } from '@/types/database';

export const INITIAL_FEED_POSTS: Post[] = [
  {
    id: 'post-1',
    author_id: 'usr-premium-1',
    content:
      'Alhamdulillah, setelah berdiskusi dengan orang tua dan guru ngaji, satu hal yang semakin disadari: kriteria fisik itu penting untuk nadzor, tapi kesamaan manhaj, kejujuran lisan, dan cara mengelola emosi adalah pilar yang menjaga bahtera rumah tangga sampai surga.\n\nSemoga ikhtiar rekan-rekan di sini dilapangkan dan dimudahkan Allah Ta’ala. 🤲',
    media_urls: [],
    tags: ['NadzorSyar’i', 'FiqihPranikah', 'Ikhtiar'],
    likes_count: 38,
    shares_count: 7,
    visibility: 'public',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    author: {
      id: 'usr-premium-1',
      email: 'rizky.pratama@bertemujodoh.my.id',
      full_name: 'Muhammad Rizky Pratama',
      display_name: 'Rizky',
      gender: 'male',
      birth_year: 1996,
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      occupation: 'Software Engineer',
      education: 'S1 Teknik Informatika',
      bio: 'Gemar menuntut ilmu syar’i dan olahraga.',
      avatar_url: null,
      is_verified: true,
      role: 'member',
      privacy_level: 'public',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    user_has_liked: false,
  },
  {
    id: 'post-2',
    author_id: 'usr-free-1',
    content:
      'Catatan refleksi dari Bab 1: "Sembuhkan luka masa lalu sebelum menuntut orang lain menjadi penyembuhmu." Menata hati, memaafkan masa lalu, dan memperbanyak istighfar terasa begitu melegakan sebelum melangkah menyusun CV Taaruf.',
    media_urls: [],
    tags: ['RefleksiHati', 'PersiapanMenikah'],
    likes_count: 52,
    shares_count: 12,
    visibility: 'public',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    author: {
      id: 'usr-free-1',
      email: 'aisyah@bertemujodoh.my.id',
      full_name: 'Aisyah Nurul Fadhilah',
      display_name: 'Aisyah',
      gender: 'female',
      birth_year: 1999,
      city: 'Bandung',
      province: 'Jawa Barat',
      occupation: 'Guru Bahasa Arab & Tahfidz',
      education: 'S1 Pendidikan Bahasa Arab',
      bio: 'Muslimah yang berusaha istiqomah di atas sunnah.',
      avatar_url: null,
      is_verified: true,
      role: 'member',
      privacy_level: 'public',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    user_has_liked: true,
  },
  {
    id: 'post-3',
    author_id: 'usr-admin-1',
    content:
      '📢 Nasehat Syar’i Pekanan dari Dewan Pengawas:\n\n"Bila Anda telah menemukan CV taaruf yang dirasa cocok secara visi dan agama, jangan berlama-lama saling bertukar pesan tanpa kejelasan. Segera libatkan wali dan jadwalkan nadzor resmi didampingi mahram. Mempersingkat celah fitnah adalah kunci keberkahan perkenalan."\n\nBarakallahu fiikum.',
    media_urls: [],
    tags: ['AdabTaaruf', 'PesanAdmin', 'Sakinah'],
    likes_count: 89,
    shares_count: 24,
    visibility: 'public',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    author: {
      id: 'usr-admin-1',
      email: 'admin@bertemujodoh.my.id',
      full_name: 'Ustaz Farhan (Admin Ekosistem)',
      display_name: 'Admin Bertemu Jodoh',
      gender: 'male',
      birth_year: 1988,
      city: 'Jakarta Pusat',
      province: 'DKI Jakarta',
      occupation: 'Pembina & Admin Sistem',
      education: 'S2 Syariah Islamiyah',
      bio: 'Pengawas sistem taaruf syar’i.',
      avatar_url: null,
      is_verified: true,
      role: 'admin',
      privacy_level: 'public',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    user_has_liked: false,
  },
];

const LOCAL_STORAGE_KEY_POSTS = 'bertemujodoh_feed_posts';
const LOCAL_STORAGE_KEY_FOLLOWS = 'bertemujodoh_follows';

export const getStoredLocalPosts = (): Post[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_POSTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_FEED_POSTS;
};

export const saveStoredLocalPosts = (posts: Post[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_POSTS, JSON.stringify(posts));
  } catch (e) {
    console.error(e);
  }
};

export const getStoredFollows = (userId: string): string[] => {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_FOLLOWS}_${userId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
};

export const saveStoredFollows = (userId: string, followingIds: string[]) => {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_FOLLOWS}_${userId}`, JSON.stringify(followingIds));
  } catch (e) {
    console.error(e);
  }
};

export const fetchPosts = async (
  currentUserId?: string,
  filterTab: 'all' | 'following' = 'all'
): Promise<Post[]> => {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from('posts')
        .select(`
          id,
          author_id,
          content,
          media_urls,
          tags,
          likes_count,
          shares_count,
          visibility,
          created_at,
          updated_at,
          author:profiles(*)
        `)
        .order('created_at', { ascending: false });

      if (filterTab === 'following' && currentUserId) {
        const { data: followData } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', currentUserId);

        const followingIds = followData?.map((f) => f.following_id) || [];
        if (followingIds.length === 0) return [];
        query = query.in('author_id', followingIds);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // Fetch like status for current user
        if (currentUserId) {
          const { data: likesData } = await supabase
            .from('post_likes')
            .select('post_id')
            .eq('user_id', currentUserId);

          const likedPostIds = new Set(likesData?.map((l) => l.post_id) || []);
          return (data as any[]).map((post) => {
            const authorData = Array.isArray(post.author) ? post.author[0] : post.author;
            return {
              ...post,
              author: authorData,
              user_has_liked: likedPostIds.has(post.id),
            } as Post;
          });
        }
        return (data as any[]).map((post) => {
          const authorData = Array.isArray(post.author) ? post.author[0] : post.author;
          return {
            ...post,
            author: authorData,
            user_has_liked: false,
          } as Post;
        });
      }
    } catch (err) {
      console.warn('Supabase fetchPosts fallback to local storage:', err);
    }
  }

  // Local fallback
  const posts = getStoredLocalPosts();
  if (filterTab === 'following' && currentUserId) {
    const followingIds = new Set(getStoredFollows(currentUserId));
    return posts.filter((p) => followingIds.has(p.author_id));
  }
  return posts;
};

export const createNewPost = async (
  content: string,
  author: Profile,
  mediaUrls: string[] = [],
  tags: string[] = [],
  visibility: 'public' | 'followers' = 'public'
): Promise<{ post: Post | null; error: string | null }> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          author_id: author.id,
          content,
          media_urls: mediaUrls,
          tags,
          visibility,
        })
        .select(`
          id,
          author_id,
          content,
          media_urls,
          tags,
          likes_count,
          shares_count,
          visibility,
          created_at,
          updated_at,
          author:profiles(*)
        `)
        .single();

      if (error) return { post: null, error: error.message };
      const authorData = Array.isArray(data.author) ? data.author[0] : data.author;
      return {
        post: { ...data, author: authorData, user_has_liked: false } as unknown as Post,
        error: null,
      };
    } catch (err: unknown) {
      return { post: null, error: err instanceof Error ? err.message : 'Gagal membuat postingan' };
    }
  }

  // Local fallback
  const newPost: Post = {
    id: `post-${Date.now()}`,
    author_id: author.id,
    content,
    media_urls: mediaUrls,
    tags,
    likes_count: 0,
    shares_count: 0,
    visibility,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author,
    user_has_liked: false,
  };

  const stored = getStoredLocalPosts();
  const updated = [newPost, ...stored];
  saveStoredLocalPosts(updated);

  return { post: newPost, error: null };
};

export const toggleLike = async (
  postId: string,
  userId: string,
  currentlyLiked: boolean
): Promise<{ liked: boolean; newCount: number }> => {
  const newLiked = !currentlyLiked;

  if (isSupabaseConfigured()) {
    try {
      if (currentlyLiked) {
        await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId);
        try {
          await supabase.rpc('decrement_post_likes', { p_post_id: postId });
        } catch {}
      } else {
        await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
        try {
          await supabase.rpc('increment_post_likes', { p_post_id: postId });
        } catch {}
      }
    } catch (e) {
      console.error('Supabase toggleLike error:', e);
    }
  }

  // Local state update
  const stored = getStoredLocalPosts();
  let updatedCount = 0;
  const updated = stored.map((p) => {
    if (p.id === postId) {
      const likes = Math.max(0, p.likes_count + (newLiked ? 1 : -1));
      updatedCount = likes;
      return { ...p, likes_count: likes, user_has_liked: newLiked };
    }
    return p;
  });
  saveStoredLocalPosts(updated);

  return { liked: newLiked, newCount: updatedCount };
};

export const toggleFollow = async (
  currentUserId: string,
  targetUserId: string,
  currentlyFollowing: boolean
): Promise<boolean> => {
  const nextFollowing = !currentlyFollowing;

  if (isSupabaseConfigured()) {
    try {
      if (currentlyFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', targetUserId);
      } else {
        await supabase
          .from('follows')
          .insert({ follower_id: currentUserId, following_id: targetUserId });
      }
    } catch (e) {
      console.error('Supabase toggleFollow error:', e);
    }
  }

  // Local state update
  const currentList = getStoredFollows(currentUserId);
  let updatedList: string[];
  if (nextFollowing) {
    updatedList = Array.from(new Set([...currentList, targetUserId]));
  } else {
    updatedList = currentList.filter((id) => id !== targetUserId);
  }
  saveStoredFollows(currentUserId, updatedList);

  return nextFollowing;
};

export const deletePost = async (postId: string, userId: string): Promise<boolean> => {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  const stored = getStoredLocalPosts();
  const filtered = stored.filter((p) => p.id !== postId);
  saveStoredLocalPosts(filtered);
  return true;
};
