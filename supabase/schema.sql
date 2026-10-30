-- ==============================================================================
-- BERTEMUJODOH.MY.ID — PRODUCTION SUPABASE SQL SCHEMA (PHASE 1)
-- ==============================================================================
-- Includes:
-- 1. Profiles Table (1:1 with auth.users)
-- 2. Memberships Table (Free Trial 7 Days, 1 Mo, 6 Mo, 12 Mo)
-- 3. Posts Table (Twitter/Tumblr Feed)
-- 4. Post Likes & Follows Tables
-- 5. Taaruf Requests Table (with Strict Opposite Gender Validation)
-- 6. Automated Trigger for New User Signup (Creates Profile & 7-Day Free Trial)
-- 7. Row Level Security (RLS) & Role-Based Access Control (RBAC)
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    display_name TEXT,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
    birth_year INTEGER NOT NULL,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    occupation TEXT,
    education TEXT,
    bio TEXT,
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin', 'moderator')),
    privacy_level TEXT NOT NULL DEFAULT 'public' CHECK (privacy_level IN ('public', 'blur_photo', 'private')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for searching and filtering
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON public.profiles(gender);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ------------------------------------------------------------------------------
-- 2. MEMBERSHIPS TABLE
-- ------------------------------------------------------------------------------
-- Free Trial: 7 Days (Can create CV, CANNOT send Taaruf requests, CANNOT access premium ebooks/videos)
-- 1 Month: Rp 19.000
-- 6 Months: Rp 89.000 (strike Rp 114.000)
-- 12 Months: Rp 149.000 (strike Rp 228.000)
CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tier TEXT NOT NULL CHECK (tier IN ('free_trial', '1_month', '6_months', '12_months')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'pending')),
    price NUMERIC NOT NULL DEFAULT 0,
    starts_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    expires_at TIMESTAMPTZ NOT NULL,
    can_create_cv BOOLEAN NOT NULL DEFAULT TRUE,
    can_send_taaruf BOOLEAN NOT NULL DEFAULT FALSE,
    can_access_premium BOOLEAN NOT NULL DEFAULT FALSE,
    payment_method TEXT,
    payment_reference TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_memberships_user ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON public.memberships(status);

-- ------------------------------------------------------------------------------
-- 3. POSTS TABLE (Timeline/Feed - Twitter/Tumblr Style)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_urls TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    likes_count INTEGER NOT NULL DEFAULT 0,
    shares_count INTEGER NOT NULL DEFAULT 0,
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'private')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);

-- ------------------------------------------------------------------------------
-- 4. POST LIKES & FOLLOWS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.post_likes (
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.follows (
    follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (follower_id, following_id),
    CONSTRAINT check_cannot_follow_self CHECK (follower_id <> following_id)
);

-- ------------------------------------------------------------------------------
-- 5. TAARUF REQUESTS TABLE (Strict Logic & Workflow)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.taaruf_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
    introduction_note TEXT,
    wali_phone TEXT,
    response_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT check_cannot_taaruf_self CHECK (sender_id <> receiver_id)
);

CREATE INDEX IF NOT EXISTS idx_taaruf_sender ON public.taaruf_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_taaruf_receiver ON public.taaruf_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_taaruf_status ON public.taaruf_requests(status);

-- STRICT GENDER VALIDATION FUNCTION & TRIGGER
CREATE OR REPLACE FUNCTION public.check_opposite_gender_taaruf()
RETURNS TRIGGER AS $$
DECLARE
    sender_gender TEXT;
    receiver_gender TEXT;
BEGIN
    SELECT gender INTO sender_gender FROM public.profiles WHERE id = NEW.sender_id;
    SELECT gender INTO receiver_gender FROM public.profiles WHERE id = NEW.receiver_id;

    IF sender_gender IS NULL OR receiver_gender IS NULL THEN
        RAISE EXCEPTION 'Profil pengirim atau penerima taaruf belum terdaftar.';
    END IF;

    IF sender_gender = receiver_gender THEN
        RAISE EXCEPTION 'Pengajuan taaruf hanya diperbolehkan antara ikhwan dan akhwat (lawan jenis).';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_validate_taaruf_gender ON public.taaruf_requests;
CREATE TRIGGER trigger_validate_taaruf_gender
BEFORE INSERT ON public.taaruf_requests
FOR EACH ROW
EXECUTE FUNCTION public.check_opposite_gender_taaruf();

-- ------------------------------------------------------------------------------
-- 6. AUTOMATIC SIGNUP TRIGGER (Profile + 7-Day Free Trial)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
DECLARE
    user_gender TEXT;
    user_full_name TEXT;
    user_city TEXT;
    user_province TEXT;
    user_birth_year INTEGER;
BEGIN
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'Hamba Allah');
    user_gender := COALESCE(NEW.raw_user_meta_data->>'gender', 'female');
    user_city := COALESCE(NEW.raw_user_meta_data->>'city', 'Jakarta');
    user_province := COALESCE(NEW.raw_user_meta_data->>'province', 'DKI Jakarta');
    user_birth_year := COALESCE((NEW.raw_user_meta_data->>'birth_year')::INTEGER, 1998);

    -- 1. Insert Profile
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        display_name,
        gender,
        birth_year,
        city,
        province,
        occupation,
        education,
        bio,
        role,
        privacy_level
    ) VALUES (
        NEW.id,
        NEW.email,
        user_full_name,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(user_full_name, ' ', 1)),
        user_gender,
        user_birth_year,
        user_city,
        user_province,
        NEW.raw_user_meta_data->>'occupation',
        NEW.raw_user_meta_data->>'education',
        NEW.raw_user_meta_data->>'bio',
        'member',
        'public'
    );

    -- 2. Insert 7-Day Free Trial Membership
    INSERT INTO public.memberships (
        user_id,
        tier,
        status,
        price,
        starts_at,
        expires_at,
        can_create_cv,
        can_send_taaruf,
        can_access_premium
    ) VALUES (
        NEW.id,
        'free_trial',
        'active',
        0,
        now(),
        now() + INTERVAL '7 days',
        TRUE,   -- Free trial can create CV
        FALSE,  -- CANNOT send Taaruf
        FALSE   -- CANNOT access premium ebooks/videos
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_signup();

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) & RBAC POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taaruf_requests ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
-- Anyone (including public/guests) can view basic profile info for directory
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

-- Authenticated users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- MEMBERSHIPS POLICIES
-- Users can view their own membership status; Admins can view all
CREATE POLICY "Users can view their own membership"
ON public.memberships FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

-- POSTS POLICIES
-- Public posts viewable by everyone
CREATE POLICY "Public posts are viewable by all authenticated users"
ON public.posts FOR SELECT
USING (visibility = 'public' OR auth.uid() = author_id OR public.is_admin());

-- Authenticated users can insert their own posts
CREATE POLICY "Authenticated users can create posts"
ON public.posts FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- Authors can update their own posts
CREATE POLICY "Authors can update their own posts"
ON public.posts FOR UPDATE
USING (auth.uid() = author_id);

-- Authors or Admins can delete posts
CREATE POLICY "Authors and admins can delete posts"
ON public.posts FOR DELETE
USING (auth.uid() = author_id OR public.is_admin());

-- POST LIKES POLICIES
CREATE POLICY "Anyone authenticated can view likes"
ON public.post_likes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can like posts"
ON public.post_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their likes"
ON public.post_likes FOR DELETE
USING (auth.uid() = user_id);

-- FOLLOWS POLICIES
CREATE POLICY "Anyone can view follows"
ON public.follows FOR SELECT
USING (true);

CREATE POLICY "Users can follow other profiles"
ON public.follows FOR INSERT
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
ON public.follows FOR DELETE
USING (auth.uid() = follower_id);

-- TAARUF REQUESTS POLICIES
-- Users can view taaruf requests where they are sender or receiver, or admin
CREATE POLICY "Users can view their own taaruf requests"
ON public.taaruf_requests FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id OR public.is_admin());

-- Only users with active paid membership can create taaruf requests
CREATE POLICY "Eligible members can send taaruf requests"
ON public.taaruf_requests FOR INSERT
WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
        SELECT 1 FROM public.memberships
        WHERE user_id = auth.uid()
          AND status = 'active'
          AND can_send_taaruf = TRUE
          AND expires_at > now()
    )
);

-- Receiver can update status (accept/reject); Sender can cancel
CREATE POLICY "Participants can update taaruf requests"
ON public.taaruf_requests FOR UPDATE
USING (auth.uid() = receiver_id OR auth.uid() = sender_id OR public.is_admin());
