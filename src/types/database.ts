export type Role = 'member' | 'admin' | 'moderator';
export type Gender = 'male' | 'female';
export type PrivacyLevel = 'public' | 'blur_photo' | 'private';

export type MembershipTier = 'free_trial' | '1_month' | '6_months' | '12_months';
export type MembershipStatus = 'active' | 'expired' | 'cancelled' | 'pending';

export type TaarufStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';
export type PostVisibility = 'public' | 'followers' | 'private';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  display_name: string | null;
  gender: Gender;
  birth_year: number;
  city: string;
  province: string;
  occupation: string | null;
  education: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  role: Role;
  privacy_level: PrivacyLevel;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: string;
  user_id: string;
  tier: MembershipTier;
  status: MembershipStatus;
  price: number;
  starts_at: string;
  expires_at: string;
  can_create_cv: boolean;
  can_send_taaruf: boolean;
  can_access_premium: boolean;
  payment_method?: string | null;
  payment_reference?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  content: string;
  media_urls: string[];
  tags: string[];
  likes_count: number;
  shares_count: number;
  visibility: PostVisibility;
  created_at: string;
  updated_at: string;
  author?: Profile;
  user_has_liked?: boolean;
}

export interface PostLike {
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface TaarufRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: TaarufStatus;
  introduction_note?: string | null;
  wali_phone?: string | null;
  response_note?: string | null;
  created_at: string;
  updated_at: string;
  sender?: Profile;
  receiver?: Profile;
}
