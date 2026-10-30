import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Palette,
  Users,
  Calendar,
  BookOpen,
  Gift,
  Globe,
  Save,
  ExternalLink,
  Copy,
  Check,
  Smartphone,
  Sparkles,
  Heart,
  Plus,
  Trash2,
  Share2,
} from 'lucide-react';
import {
  invitationService,
  type WeddingInvitation,
  type StoryMilestone,
  type GiftAccount,
} from '@/services/invitationService';

const THEMES = [
  {
    id: 'sakura-blush',
    name: 'Sakura Blush & Rose Gold',
    accent: 'bg-rose-100 text-[#A95570]',
    border: 'border-[#F7E6EA]',
    desc: 'Nuansa lembut merah muda blush dengan kehangatan romantis islami.',
  },
  {
    id: 'emerald-syari',
    name: 'Royal Emerald Syar’i',
    accent: 'bg-emerald-100 text-emerald-800',
    border: 'border-emerald-200',
    desc: 'Hijau zamrud agung dan teduh dengan sentuhan arabesque mewah.',
  },
  {
    id: 'ivory-minimalist',
    name: 'Ivory Pure Monochrome',
    accent: 'bg-stone-200 text-stone-800',
    border: 'border-stone-300',
    desc: 'Desain bersih kontemporer dengan tipografi editorial modern.',
  },
  {
    id: 'terracotta-earth',
    name: 'Terracotta Warmth',
    accent: 'bg-amber-100 text-amber-900',
    border: 'border-amber-200',
    desc: 'Warna tanah hangat bohemian, cocok untuk suasana akad intim.',
  },
];

export const WeddingInvitationBuilderPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [invitation, setInvitation] = useState<WeddingInvitation | null>(null);
  const [activeTab, setActiveTab] = useState<'theme' | 'couple' | 'events' | 'story' | 'gifts' | 'publish'>('theme');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);
  const [previewCover, setPreviewCover] = useState(false);

  // Load invitation on mount
  useEffect(() => {
    if (user?.id) {
      const data = invitationService.getInvitationByUserId(user.id);
      setInvitation(data);
    }
  }, [user]);

  if (!invitation) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Heart className="w-10 h-10 text-[#A95570] mx-auto animate-pulse" />
        <p className="text-xs text-[#777078] mt-2">Memuat Wedding Invitation Builder...</p>
      </div>
    );
  }

  const handleSave = () => {
    invitationService.saveInvitation(invitation);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const updateField = (section: keyof WeddingInvitation, value: unknown) => {
    setInvitation((prev) => {
      if (!prev) return null;
      return { ...prev, [section]: value };
    });
  };

  const updateGroom = (field: string, val: string) => {
    setInvitation((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        groom: { ...prev.groom, [field]: val },
      };
    });
  };

  const updateBride = (field: string, val: string) => {
    setInvitation((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        bride: { ...prev.bride, [field]: val },
      };
    });
  };

  const updateAkad = (field: string, val: string) => {
    setInvitation((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        events: {
          ...prev.events,
          akad: { ...prev.events.akad, [field]: val },
        },
      };
    });
  };

  const updateReception = (field: string, val: string) => {
    setInvitation((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        events: {
          ...prev.events,
          reception: { ...prev.events.reception, [field]: val },
        },
      };
    });
  };

  // Add / remove story milestone
  const handleAddMilestone = () => {
    const newMilestone: StoryMilestone = {
      year: '2026',
      title: 'Momen Istimewa',
      description: 'Tuliskan deskripsi peristiwa...',
    };
    updateField('story', [...invitation.story, newMilestone]);
  };

  const handleRemoveMilestone = (index: number) => {
    const updated = invitation.story.filter((_, i) => i !== index);
    updateField('story', updated);
  };

  const handleUpdateMilestone = (index: number, key: keyof StoryMilestone, val: string) => {
    const updated = invitation.story.map((item, i) => (i === index ? { ...item, [key]: val } : item));
    updateField('story', updated);
  };

  // Add / remove gift bank
  const handleAddGiftAccount = () => {
    const newAcc: GiftAccount = {
      id: `gift-${Date.now()}`,
      bankName: 'Bank Syariah Indonesia (BSI)',
      accountNumber: '1234567890',
      accountHolder: invitation.groom.fullName || 'Nama Pemilik',
    };
    updateField('giftAccounts', [...invitation.giftAccounts, newAcc]);
  };

  const handleRemoveGiftAccount = (id: string) => {
    const updated = invitation.giftAccounts.filter((acc) => acc.id !== id);
    updateField('giftAccounts', updated);
  };

  const handleUpdateGiftAccount = (id: string, key: keyof GiftAccount, val: string) => {
    const updated = invitation.giftAccounts.map((acc) => (acc.id === id ? { ...acc, [key]: val } : acc));
    updateField('giftAccounts', updated);
  };

  const invitationUrl = `${window.location.origin}/undangan/${invitation.slug}`;

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const copyWhatsAppFormat = () => {
    const text = `Assalamu’alaikum Warahmatullahi Wabarakatuh.\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri syukuran pernikahan kami:\n\n*${invitation.groom.nickname} & ${invitation.bride.nickname}*\n\n📅 Akad & Walimah: ${invitation.events.akad.date}\n📍 Lokasi: ${invitation.events.akad.venue}\n\nUntuk detail jadwal acara, peta lokasi, dan konfirmasi kehadiran (RSVP), silakan kunjungi tautan undangan digital kami berikut:\n👉 ${invitationUrl}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu.\n\nWassalamu’alaikum Warahmatullahi Wabarakatuh.\n\n- ${invitation.groom.nickname} & ${invitation.bride.nickname} -`;
    navigator.clipboard.writeText(text);
    setCopiedWa(true);
    setTimeout(() => setCopiedWa(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0E7E9]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7E6EA] text-[#A95570] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Wedding Invitation CMS</span>
          </div>
          <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#29252A]">
            Editor Undangan Digital Pernikahan
          </h1>
          <p className="text-xs text-[#777078] mt-1">
            Kustomisasi tema, data mempelai, jadwal akad, peta Google Maps, dan amplop digital dengan live preview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-4 py-2.5 rounded-xl bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b] transition flex items-center gap-1.5 shadow-sm shadow-[#A95570]/30"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
          <a
            href={invitationUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl border border-[#F0E7E9] bg-white text-xs font-semibold text-[#29252A] hover:bg-[#FFF5F7] transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4 text-[#A95570]" />
            <span>Lihat Publik</span>
          </a>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Alhamdulillah, perubahan undangan berhasil disimpan! Live URL sudah ter-update.</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: CMS EDITORS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#F0E7E9] text-xs font-semibold">
            <button
              onClick={() => setActiveTab('theme')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
                activeTab === 'theme' ? 'bg-[#A95570] text-white' : 'text-[#777078] hover:bg-[#FFF5F7]'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Tema</span>
            </button>
            <button
              onClick={() => setActiveTab('couple')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
                activeTab === 'couple' ? 'bg-[#A95570] text-white' : 'text-[#777078] hover:bg-[#FFF5F7]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Mempelai</span>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
                activeTab === 'events' ? 'bg-[#A95570] text-white' : 'text-[#777078] hover:bg-[#FFF5F7]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Acara & Lokasi</span>
            </button>
            <button
              onClick={() => setActiveTab('story')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
                activeTab === 'story' ? 'bg-[#A95570] text-white' : 'text-[#777078] hover:bg-[#FFF5F7]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Kisah Taaruf</span>
            </button>
            <button
              onClick={() => setActiveTab('gifts')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
                activeTab === 'gifts' ? 'bg-[#A95570] text-white' : 'text-[#777078] hover:bg-[#FFF5F7]'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Amplop Digital</span>
            </button>
            <button
              onClick={() => setActiveTab('publish')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
                activeTab === 'publish' ? 'bg-[#A95570] text-white' : 'text-[#777078] hover:bg-[#FFF5F7]'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Bagikan & Link</span>
            </button>
          </div>

          {/* TAB 1: THEME SELECTOR */}
          {activeTab === 'theme' && (
            <div className="bg-white p-6 rounded-2xl border border-[#F0E7E9] space-y-4">
              <div>
                <h3 className="font-bold text-sm text-[#29252A]">Pilih Tema Undangan</h3>
                <p className="text-xs text-[#777078] mt-0.5">
                  Tampilan warna, ornamen islami, dan font akan disesuaikan seketika di ponsel tamu.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {THEMES.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => updateField('theme', t.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                      invitation.theme === t.id
                        ? 'border-[#A95570] bg-[#FFF5F7]'
                        : 'border-[#F0E7E9] hover:border-gray-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.accent}`}>
                          {t.name}
                        </span>
                        {invitation.theme === t.id && (
                          <Check className="w-4 h-4 text-[#A95570]" />
                        )}
                      </div>
                      <p className="text-xs text-[#777078] pt-1">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: COUPLE DATA */}
          {activeTab === 'couple' && (
            <div className="space-y-6">
              {/* Mempelai Pria */}
              <div className="bg-white p-6 rounded-2xl border border-[#F0E7E9] space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#F7E6EA] text-[#A95570] flex items-center justify-center font-bold text-xs">
                    P
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#29252A]">Mempelai Pria (Calon Suami)</h3>
                    <p className="text-xs text-[#777078]">Informasi nasab dan profil mempelai pria</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#29252A] mb-1">
                      Nama Lengkap & Gelar
                    </label>
                    <input
                      type="text"
                      value={invitation.groom.fullName}
                      onChange={(e) => updateGroom('fullName', e.target.value)}
                      placeholder="Contoh: Muhammad Alif Ramadhan, S.Kom."
                      className="w-full px-3.5 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#29252A] mb-1">
                      Nama Panggilan (Akad)
                    </label>
                    <input
                      type="text"
                      value={invitation.groom.nickname}
                      onChange={(e) => updateGroom('nickname', e.target.value)}
                      placeholder="Contoh: Alif"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#29252A] mb-1">
                      Nama Ayah Kandung
                    </label>
                    <input
                      type="text"
                      value={invitation.groom.fatherName}
                      onChange={(e) => updateGroom('fatherName', e.target.value)}
                      placeholder="Contoh: Bpk. H. Rahmat Hidayat"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#29252A] mb-1">
                      Nama Ibu Kandung
                    </label>
                    <input
                      type="text"
                      value={invitation.groom.motherName}
                      onChange={(e) => updateGroom('motherName', e.target.value)}
                      placeholder="Contoh: Ibu Hj. Siti Nurhaliza"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#29252A] mb-1">
                    Bio Singkat / Keterangan Nasab
                  </label>
                  <input
                    type="text"
                    value={invitation.groom.bio || ''}
                    onChange={(e) => updateGroom('bio', e.target.value)}
                    placeholder="Contoh: Putra pertama dari Bpk. Rahmat & Ibu Siti"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                  />
                </div>
              </div>

              {/* Mempelai Wanita */}
              <div className="bg-white p-6 rounded-2xl border border-[#F0E7E9] space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#F7E6EA] text-[#A95570] flex items-center justify-center font-bold text-xs">
                    W
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#29252A]">Mempelai Wanita (Calon Istri)</h3>
                    <p className="text-xs text-[#777078]">Informasi nasab dan profil mempelai wanita</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#29252A] mb-1">
                      Nama Lengkap & Gelar
                    </label>
                    <input
                      type="text"
                      value={invitation.bride.fullName}
                      onChange={(e) => updateBride('fullName', e.target.value)}
                      placeholder="Contoh: Khadijah Annisa Putri, S.Pd."
                      className="w-full px-3.5 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#29252A] mb-1">
                      Nama Panggilan (Akad)
                    </label>
                    <input
                      type="text"
                      value={invitation.bride.nickname}
                      onChange={(e) => updateBride('nickname', e.target.value)}
                      placeholder="Contoh: Nisa"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#29252A] mb-1">
                      Nama Ayah Kandung
                    </label>
                    <input
                      type="text"
                      value={invitation.bride.fatherName}
                      onChange={(e) => updateBride('fatherName', e.target.value)}
                      placeholder="Contoh: Bpk. Drs. H. Bambang Sutrisno"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#29252A] mb-1">
                      Nama Ibu Kandung
                    </label>
                    <input
                      type="text"
                      value={invitation.bride.motherName}
                      onChange={(e) => updateBride('motherName', e.target.value)}
                      placeholder="Contoh: Ibu Hj. Aminah Wijaya"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#29252A] mb-1">
                    Bio Singkat / Keterangan Nasab
                  </label>
                  <input
                    type="text"
                    value={invitation.bride.bio || ''}
                    onChange={(e) => updateBride('bio', e.target.value)}
                    placeholder="Contoh: Putri kedua dari Bpk. Bambang & Ibu Aminah"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EVENTS & LOCATION */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              {/* Akad Nikah */}
              <div className="bg-white p-6 rounded-2xl border border-[#F0E7E9] space-y-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 uppercase">
                  Akad Nikah
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#29252A] mb-1">Tanggal Akad</label>
                    <input
                      type="date"
                      value={invitation.events.akad.date}
                      onChange={(e) => updateAkad('date', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#29252A] mb-1">Jam Mulai</label>
                    <input
                      type="text"
                      value={invitation.events.akad.startTime}
                      onChange={(e) => updateAkad('startTime', e.target.value)}
                      placeholder="08:00"
                      className="w-full px-3 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#29252A] mb-1">Jam Selesai</label>
                    <input
                      type="text"
                      value={invitation.events.akad.endTime}
                      onChange={(e) => updateAkad('endTime', e.target.value)}
                      placeholder="10:00 WIB"
                      className="w-full px-3 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#29252A] mb-1">Nama Tempat / Masjid</label>
                  <input
                    type="text"
                    value={invitation.events.akad.venue}
                    onChange={(e) => updateAkad('venue', e.target.value)}
                    placeholder="Contoh: Masjid Agung Al-Azhar"
                    className="w-full px-3 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#29252A] mb-1">Alamat Lengkap</label>
                  <input
                    type="text"
                    value={invitation.events.akad.address}
                    onChange={(e) => updateAkad('address', e.target.value)}
                    placeholder="Contoh: Jl. Sisingamangaraja No.1, Selong, Kebayoran Baru, Jakarta Selatan"
                    className="w-full px-3 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#29252A] mb-1">Tautan Google Maps</label>
                  <input
                    type="text"
                    value={invitation.events.akad.mapsUrl}
                    onChange={(e) => updateAkad('mapsUrl', e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full px-3 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                  />
                </div>
              </div>

              {/* Resepsi / Walimah */}
              <div className="bg-white p-6 rounded-2xl border border-[#F0E7E9] space-y-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F7E6EA] text-[#A95570] uppercase">
                  Walimatul ‘Ursy (Resepsi)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#29252A] mb-1">Tanggal Resepsi</label>
                    <input
                      type="date"
                      value={invitation.events.reception.date}
                      onChange={(e) => updateReception('date', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#29252A] mb-1">Jam Mulai</label>
                    <input
                      type="text"
                      value={invitation.events.reception.startTime}
                      onChange={(e) => updateReception('startTime', e.target.value)}
                      placeholder="11:00"
                      className="w-full px-3 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#29252A] mb-1">Jam Selesai</label>
                    <input
                      type="text"
                      value={invitation.events.reception.endTime}
                      onChange={(e) => updateReception('endTime', e.target.value)}
                      placeholder="14:00 WIB"
                      className="w-full px-3 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#29252A] mb-1">Nama Tempat / Gedung</label>
                  <input
                    type="text"
                    value={invitation.events.reception.venue}
                    onChange={(e) => updateReception('venue', e.target.value)}
                    placeholder="Contoh: Grand Ballroom Hotel Madani"
                    className="w-full px-3 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#29252A] mb-1">Alamat Lengkap</label>
                  <input
                    type="text"
                    value={invitation.events.reception.address}
                    onChange={(e) => updateReception('address', e.target.value)}
                    placeholder="Contoh: Jl. Diponegoro No. 10..."
                    className="w-full px-3 py-2 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STORY & QURAN QUOTE */}
          {activeTab === 'story' && (
            <div className="bg-white p-6 rounded-2xl border border-[#F0E7E9] space-y-6">
              <div>
                <h3 className="font-bold text-sm text-[#29252A]">Kisah Perjalanan & Ayat Al-Quran</h3>
                <p className="text-xs text-[#777078] mt-0.5">
                  Bagikan rekam jejak taaruf syar’i dan ayat pedoman keluarga muslim.
                </p>
              </div>

              {/* Ayat */}
              <div className="p-4 rounded-xl bg-[#FFF5F7] border border-[#F7E6EA] space-y-3">
                <span className="text-[10px] font-bold text-[#A95570] uppercase">Kutipan Al-Quran</span>
                <div>
                  <label className="block text-[11px] font-semibold text-[#29252A] mb-1">Teks Arab</label>
                  <input
                    type="text"
                    value={invitation.quoteArabic}
                    onChange={(e) => updateField('quoteArabic', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#F0E7E9] bg-white text-xs font-arabic"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#29252A] mb-1">Terjemahan Indonesia</label>
                  <textarea
                    rows={2}
                    value={invitation.quoteTranslation}
                    onChange={(e) => updateField('quoteTranslation', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#F0E7E9] bg-white text-xs"
                  />
                </div>
              </div>

              {/* Story Milestones */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-[#29252A]">Milestone Kisah Taaruf</h4>
                  <button
                    onClick={handleAddMilestone}
                    className="px-3 py-1.5 rounded-xl bg-[#FFF5F7] text-[#A95570] text-xs font-semibold hover:bg-[#F7E6EA] flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Babak</span>
                  </button>
                </div>

                {invitation.story.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-[#F0E7E9] space-y-2 relative">
                    <button
                      onClick={() => handleRemoveMilestone(idx)}
                      className="absolute top-3 right-3 text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-[#777078]">Tahun</label>
                        <input
                          type="text"
                          value={item.year}
                          onChange={(e) => handleUpdateMilestone(idx, 'year', e.target.value)}
                          className="w-full px-2 py-1 text-xs border rounded-lg"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-semibold text-[#777078]">Judul Peristiwa</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateMilestone(idx, 'title', e.target.value)}
                          className="w-full px-2 py-1 text-xs border rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[#777078]">Deskripsi Singkat</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => handleUpdateMilestone(idx, 'description', e.target.value)}
                        className="w-full px-2 py-1 text-xs border rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AMPLIL DIGITAL / GIFTS */}
          {activeTab === 'gifts' && (
            <div className="bg-white p-6 rounded-2xl border border-[#F0E7E9] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#29252A]">Amplop Digital (Rekening Bank)</h3>
                  <p className="text-xs text-[#777078]">
                    Tamu dapat menyalin nomor rekening untuk memberikan tanda kasih secara cashless.
                  </p>
                </div>
                <button
                  onClick={handleAddGiftAccount}
                  className="px-3 py-1.5 rounded-xl bg-[#FFF5F7] text-[#A95570] text-xs font-semibold hover:bg-[#F7E6EA] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Rekening</span>
                </button>
              </div>

              <div className="space-y-3">
                {invitation.giftAccounts.map((acc) => (
                  <div key={acc.id} className="p-4 rounded-xl border border-[#F0E7E9] space-y-2 relative">
                    <button
                      onClick={() => handleRemoveGiftAccount(acc.id)}
                      className="absolute top-3 right-3 text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-[#777078]">Nama Bank / E-Wallet</label>
                        <input
                          type="text"
                          value={acc.bankName}
                          onChange={(e) => handleUpdateGiftAccount(acc.id, 'bankName', e.target.value)}
                          placeholder="BSI / BCA / Mandiri"
                          className="w-full px-2 py-1.5 text-xs border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[#777078]">Nomor Rekening</label>
                        <input
                          type="text"
                          value={acc.accountNumber}
                          onChange={(e) => handleUpdateGiftAccount(acc.id, 'accountNumber', e.target.value)}
                          placeholder="1234567890"
                          className="w-full px-2 py-1.5 text-xs border rounded-lg font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[#777078]">Atas Nama (Pemilik)</label>
                        <input
                          type="text"
                          value={acc.accountHolder}
                          onChange={(e) => handleUpdateGiftAccount(acc.id, 'accountHolder', e.target.value)}
                          placeholder="Nama lengkap"
                          className="w-full px-2 py-1.5 text-xs border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PUBLISH & SHARE */}
          {activeTab === 'publish' && (
            <div className="bg-white p-6 rounded-2xl border border-[#F0E7E9] space-y-6">
              <div>
                <h3 className="font-bold text-sm text-[#29252A]">Bagikan Undangan Digital</h3>
                <p className="text-xs text-[#777078] mt-0.5">
                  Kelola tautan slug unik Anda dan format pesan siaran WhatsApp ramah tamu.
                </p>
              </div>

              {/* Slug configuration */}
              <div className="p-4 rounded-xl bg-[#FFF5F7] border border-[#F7E6EA] space-y-2">
                <label className="block text-xs font-semibold text-[#29252A]">Kustomisasi Slug URL</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-neutral-100 border border-r-0 border-[#F0E7E9] rounded-l-xl text-xs text-[#777078]">
                    bertemujodoh.my.id/undangan/
                  </span>
                  <input
                    type="text"
                    value={invitation.slug}
                    onChange={(e) => updateField('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    className="flex-1 px-3 py-2 border border-[#F0E7E9] rounded-r-xl text-xs font-medium text-[#29252A] focus:outline-none focus:border-[#A95570]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={copyUrlToClipboard}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-[#F0E7E9] text-xs font-semibold text-[#29252A] hover:bg-neutral-50 transition flex items-center justify-center gap-1.5"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Tautan Tersalin!' : 'Salin Tautan Undangan'}</span>
                  </button>

                  <button
                    onClick={copyWhatsAppFormat}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {copiedWa ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                    <span>{copiedWa ? 'Teks WhatsApp Tersalin!' : 'Salin Format Siaran WhatsApp'}</span>
                  </button>
                </div>

                <a
                  href={invitationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b] transition flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Buka Halaman Undangan di Tab Baru</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LIVE INTERACTIVE PHONE MOCKUP (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="text-center mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-[#29252A] flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#A95570]" />
              Live Phone Preview
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPreviewCover(!previewCover)}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#F0E7E9] text-[11px] font-medium text-[#777078] hover:text-[#A95570]"
              >
                {previewCover ? 'Mode Isi Undangan' : 'Mode Cover Depan'}
              </button>
            </div>
          </div>

          {/* Smartphone Frame Mockup */}
          <div className="w-[310px] sm:w-[340px] h-[640px] mx-auto bg-neutral-900 rounded-[44px] p-3 shadow-2xl border-4 border-neutral-800 relative flex flex-col">
            {/* Phone Speaker & Notch */}
            <div className="w-32 h-4 bg-neutral-900 rounded-b-xl mx-auto absolute top-3 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
              <div className="w-10 h-1 bg-neutral-700 rounded-full" />
            </div>

            {/* Inner Phone Screen */}
            <div className="w-full h-full bg-white rounded-[34px] overflow-y-auto overflow-x-hidden relative text-center text-[#29252A] text-xs">
              {previewCover ? (
                // Mini Cover Mode
                <div className="min-h-full bg-gradient-to-b from-[#7A364E] via-[#A95570] to-[#542133] text-white p-6 flex flex-col justify-between items-center">
                  <span className="text-[10px] uppercase tracking-widest pt-6">Walimatul ‘Ursy</span>
                  <div className="space-y-2">
                    <Heart className="w-8 h-8 mx-auto fill-white/80 animate-pulse" />
                    <h2 className="font-serif-editorial text-2xl font-bold">
                      {invitation.groom.nickname} & {invitation.bride.nickname}
                    </h2>
                    <p className="text-[10px] opacity-80">{invitation.events.akad.date}</p>
                  </div>
                  <button
                    onClick={() => setPreviewCover(false)}
                    className="w-full py-2 bg-white text-[#29252A] rounded-xl text-xs font-bold shadow-md"
                  >
                    Buka Undangan
                  </button>
                </div>
              ) : (
                // Mini Content Mode
                <div className="p-4 space-y-4">
                  {/* Header */}
                  <div className="pt-5 space-y-1">
                    <span className="text-[9px] font-bold text-[#A95570] uppercase">The Wedding of</span>
                    <h3 className="font-serif-editorial text-xl font-bold text-[#29252A]">
                      {invitation.groom.nickname} & {invitation.bride.nickname}
                    </h3>
                    <p className="text-[10px] text-[#777078]">{invitation.events.akad.date}</p>
                  </div>

                  {/* Ayat Quote */}
                  <div className="p-3 bg-[#FFF5F7] rounded-xl border border-[#F7E6EA] text-[10px] space-y-1">
                    <p className="font-arabic text-sm text-[#29252A] leading-relaxed">
                      وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا...
                    </p>
                    <p className="text-[9px] text-[#777078] italic">QS. Ar-Rum: 21</p>
                  </div>

                  {/* Mempelai */}
                  <div className="space-y-2 text-left">
                    <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                      <span className="text-[9px] font-bold text-[#A95570] block">Mempelai Pria</span>
                      <p className="font-bold text-xs">{invitation.groom.fullName || 'Nama Pria'}</p>
                      <p className="text-[10px] text-[#777078]">{invitation.groom.bio}</p>
                    </div>
                    <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                      <span className="text-[9px] font-bold text-[#A95570] block">Mempelai Wanita</span>
                      <p className="font-bold text-xs">{invitation.bride.fullName || 'Nama Wanita'}</p>
                      <p className="text-[10px] text-[#777078]">{invitation.bride.bio}</p>
                    </div>
                  </div>

                  {/* Akad Card */}
                  <div className="p-3 bg-white rounded-xl border border-[#F0E7E9] shadow-xs text-left space-y-1">
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Akad Nikah
                    </span>
                    <p className="font-bold text-xs pt-1">{invitation.events.akad.venue}</p>
                    <p className="text-[10px] text-[#777078]">{invitation.events.akad.address}</p>
                  </div>

                  {/* RSVP Mock */}
                  <div className="p-3 bg-[#FFF5F7]/50 rounded-xl border border-[#F7E6EA] text-center space-y-1">
                    <span className="text-[10px] font-bold text-[#A95570]">RSVP & Doa</span>
                    <p className="text-[9px] text-[#777078]">
                      {invitation.rsvps.length} Tamu Telah Mengirimkan Doa
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
