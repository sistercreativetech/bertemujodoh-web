import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Profile, Membership, Gender } from '@/types/database';

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  gender: Gender;
  birthYear: number;
  city: string;
  province: string;
  occupation?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  membership: Membership | null;
  loading: boolean;
  isConfigured: boolean;
  signUp: (data: SignUpData) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  demoLoginAs: (role: 'free' | 'premium' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo profile fixtures for immediate visual preview when Supabase credentials are pending
const DEMO_PROFILES: Record<'free' | 'premium' | 'admin', { profile: Profile; membership: Membership; user: Partial<User> }> = {
  free: {
    user: { id: 'usr-free-1', email: 'aisyah@bertemujodoh.my.id' },
    profile: {
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
      bio: 'Muslimah yang berusaha istiqomah di atas manhaj salaf. Hobi membaca, mengajar anak-anak, dan baking pastry.',
      avatar_url: null,
      is_verified: true,
      role: 'member',
      privacy_level: 'public',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    membership: {
      id: 'mem-free-1',
      user_id: 'usr-free-1',
      tier: 'free_trial',
      status: 'active',
      price: 0,
      starts_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
      can_create_cv: true,
      can_send_taaruf: false,
      can_access_premium: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  premium: {
    user: { id: 'usr-premium-1', email: 'rizky.pratama@bertemujodoh.my.id' },
    profile: {
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
      bio: 'Pribadi yang tenang, gemar kajian ilmiah fiqih keluarga, dan siap menafkahi lahir batin menuju baiti jannati.',
      avatar_url: null,
      is_verified: true,
      role: 'member',
      privacy_level: 'public',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    membership: {
      id: 'mem-premium-1',
      user_id: 'usr-premium-1',
      tier: '6_months',
      status: 'active',
      price: 89000,
      starts_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 180 * 86400000).toISOString(),
      can_create_cv: true,
      can_send_taaruf: true,
      can_access_premium: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  admin: {
    user: { id: 'usr-admin-1', email: 'admin@bertemujodoh.my.id' },
    profile: {
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
      bio: 'Pengawas sistem taaruf dan moderasi adab syar’i bertemujodoh.my.id',
      avatar_url: null,
      is_verified: true,
      role: 'admin',
      privacy_level: 'public',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    membership: {
      id: 'mem-admin-1',
      user_id: 'usr-admin-1',
      tier: '12_months',
      status: 'active',
      price: 149000,
      starts_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 365 * 86400000).toISOString(),
      can_create_cv: true,
      can_send_taaruf: true,
      can_access_premium: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();
  const isConfigured = isSupabaseConfigured();

  // Load User Profile & Membership from Supabase
  const fetchUserData = async (userId: string) => {
    try {
      // 1. Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!profileError && profileData) {
        setProfile(profileData as Profile);
      }

      // 2. Fetch Active Membership
      const { data: memData, error: memError } = await supabase
        .from('memberships')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!memError && memData) {
        setMembership(memData as Membership);
      }
    } catch (err) {
      console.error('Error fetching profile/membership:', err);
    }
  };

  useEffect(() => {
    // If Supabase credentials are configured, listen to real Auth state
    if (isConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          fetchUserData(session.user.id).finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
          fetchUserData(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setMembership(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Check if user selected demo mode in localStorage
      const savedDemo = localStorage.getItem('bertemujodoh_demo_role') as 'free' | 'premium' | 'admin' | null;
      if (savedDemo && DEMO_PROFILES[savedDemo]) {
        const item = DEMO_PROFILES[savedDemo];
        setUser(item.user as User);
        setProfile(item.profile);
        setMembership(item.membership);
      }
      setLoading(false);
    }
  }, [isConfigured]);

  const signUp = async (data: SignUpData): Promise<{ error: string | null }> => {
    if (!isConfigured) {
      // Fallback in demo mode
      const demoProfile: Profile = {
        id: `usr-${Date.now()}`,
        email: data.email,
        full_name: data.fullName,
        display_name: data.fullName.split(' ')[0],
        gender: data.gender,
        birth_year: data.birthYear,
        city: data.city,
        province: data.province,
        occupation: data.occupation || null,
        education: null,
        bio: null,
        avatar_url: null,
        is_verified: false,
        role: 'member',
        privacy_level: 'public',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const demoMem: Membership = {
        id: `mem-${Date.now()}`,
        user_id: demoProfile.id,
        tier: 'free_trial',
        status: 'active',
        price: 0,
        starts_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
        can_create_cv: true,
        can_send_taaruf: false,
        can_access_premium: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser({ id: demoProfile.id, email: data.email } as User);
      setProfile(demoProfile);
      setMembership(demoMem);
      localStorage.setItem('bertemujodoh_demo_role', 'free');
      return { error: null };
    }

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            gender: data.gender,
            birth_year: data.birthYear,
            city: data.city,
            province: data.province,
            occupation: data.occupation || '',
          },
        },
      });

      if (error) return { error: error.message };
      if (authData.user) {
        setUser(authData.user);
        await fetchUserData(authData.user.id);
      }
      return { error: null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Gagal mendaftar akun' };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!isConfigured) {
      // Demo authentication match
      if (email.includes('admin')) {
        demoLoginAs('admin');
      } else if (email.includes('rizky') || email.includes('premium')) {
        demoLoginAs('premium');
      } else {
        demoLoginAs('free');
      }
      return { error: null };
    }

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error: error.message };
      if (authData.user) {
        setUser(authData.user);
        await fetchUserData(authData.user.id);
      }
      return { error: null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Gagal masuk akun' };
    }
  };

  const signOut = async () => {
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('bertemujodoh_demo_role');
    startTransition(() => {
      setUser(null);
      setProfile(null);
      setMembership(null);
    });
  };

  const refreshProfile = async () => {
    if (user && isConfigured) {
      await fetchUserData(user.id);
    }
  };

  const demoLoginAs = (role: 'free' | 'premium' | 'admin') => {
    const item = DEMO_PROFILES[role];
    setUser(item.user as User);
    setProfile(item.profile);
    setMembership(item.membership);
    localStorage.setItem('bertemujodoh_demo_role', role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        membership,
        loading,
        isConfigured,
        signUp,
        signIn,
        signOut,
        refreshProfile,
        demoLoginAs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
