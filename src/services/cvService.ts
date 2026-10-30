import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { type CVData, DEFAULT_CV_DATA } from '@/types/cv';
import type { Profile } from '@/types/database';

const CV_STORAGE_PREFIX = 'bertemujodoh_cv_draft_';

export const getSavedCVDraft = (userId: string, profile?: Profile | null): CVData => {
  try {
    const raw = localStorage.getItem(`${CV_STORAGE_PREFIX}${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error(e);
  }

  // Pre-fill with user's profile info if draft doesn't exist yet
  return {
    ...DEFAULT_CV_DATA,
    fullName: profile?.full_name || DEFAULT_CV_DATA.fullName,
    nickname: profile?.display_name || profile?.full_name?.split(' ')[0] || DEFAULT_CV_DATA.nickname,
    gender: profile?.gender || DEFAULT_CV_DATA.gender,
    city: profile?.city || DEFAULT_CV_DATA.city,
    province: profile?.province || DEFAULT_CV_DATA.province,
    currentOccupation: profile?.occupation || DEFAULT_CV_DATA.currentOccupation,
    lastEducation: profile?.education || DEFAULT_CV_DATA.lastEducation,
  };
};

export const saveCVDraft = (userId: string, data: CVData): boolean => {
  try {
    localStorage.setItem(`${CV_STORAGE_PREFIX}${userId}`, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error saving CV draft:', e);
    return false;
  }
};
