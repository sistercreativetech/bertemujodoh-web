import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Volume2,
  VolumeX,
  Send,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  Gift,
  Share2,
  MessageCircle,
  ArrowLeft,
} from 'lucide-react';
import { invitationService, type WeddingInvitation, type RsvpEntry } from '@/services/invitationService';

export const WeddingInvitationViewPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('to') || 'Tamu Kehormatan & Sahabat';

  const [invitation, setInvitation] = useState<WeddingInvitation | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState(guestName !== 'Tamu Kehormatan & Sahabat' ? guestName : '');
  const [rsvpStatus, setRsvpStatus] = useState<'hadir' | 'tidak' | 'ragu'>('hadir');
  const [rsvpCount, setRsvpCount] = useState<number>(1);
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Load invitation
  useEffect(() => {
    const data = invitationService.getInvitationBySlug(slug || 'alif-dan-nisa');
    setInvitation(data || invitationService.getInvitationBySlug('alif-dan-nisa'));
  }, [slug]);

  // Audio tone generator fallback for background music ambient
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let oscillator: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;

    if (isPlayingAudio) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtx = new AudioContextClass();
        // Gentle ambient drone tone (Solfeggio 432Hz or soft flute simulation)
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(432, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime); // very subtle
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
      } catch (err) {
        console.warn('Web Audio not allowed or failed:', err);
      }
    }

    return () => {
      try {
        if (oscillator) oscillator.stop();
        if (audioCtx) audioCtx.close();
      } catch (e) {
        // ignore
      }
    };
  }, [isPlayingAudio]);

  // Countdown timer calculations
  const targetDate = useMemo(() => {
    if (!invitation?.events.akad.date) return new Date('2026-11-22T08:00:00');
    return new Date(`${invitation.events.akad.date}T${invitation.events.akad.startTime || '08:00'}:00`);
  }, [invitation]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    setIsPlayingAudio(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyBank = (id: string, num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedBankId(id);
    setTimeout(() => setCopiedBankId(null), 2500);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitation || !rsvpName.trim()) return;

    setIsSubmittingRsvp(true);
    setTimeout(() => {
      const updated = invitationService.addRsvp(invitation.slug, {
        name: rsvpName,
        attendance: rsvpStatus,
        guestCount: rsvpCount,
        message: rsvpMessage.trim() || 'Semoga Allah memberkahi pernikahan kalian.',
      });
      if (updated) {
        setInvitation(updated);
      }
      setIsSubmittingRsvp(false);
      setRsvpSuccess(true);
      setRsvpMessage('');
    }, 600);
  };

  // Google Calendar URL generator
  const googleCalendarUrl = useMemo(() => {
    if (!invitation) return '#';
    const title = encodeURIComponent(invitation.title);
    const details = encodeURIComponent(
      `Walimatul 'Ursy ${invitation.groom.nickname} & ${invitation.bride.nickname}. Merupakan kehormatan bagi kami atas kehadiran Bapak/Ibu/Saudara/i.`
    );
    const location = encodeURIComponent(invitation.events.akad.venue + ', ' + invitation.events.akad.address);
    // Format YYYYMMDDTHHmmSSZ
    const dateClean = (invitation.events.akad.date || '20261122').replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateClean}T010000Z/${dateClean}T060000Z`;
  }, [invitation]);

  if (!invitation) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md space-y-4">
          <Heart className="w-12 h-12 text-[#A95570] mx-auto animate-pulse" />
          <h2 className="text-xl font-bold text-[#29252A]">Undangan Tidak Ditemukan</h2>
          <p className="text-xs text-[#777078]">
            Mohon periksa kembali tautan undangan atau buat undangan baru Anda di BertemuJodoh.
          </p>
          <Link
            to="/undangan-builder"
            className="inline-block px-5 py-2.5 rounded-xl bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b]"
          >
            Buat Undangan Digital Saya
          </Link>
        </div>
      </div>
    );
  }

  // Theme configuration styles
  const isEmerald = invitation.theme === 'emerald-syari';
  const isTerracotta = invitation.theme === 'terracotta-earth';
  const isIvory = invitation.theme === 'ivory-minimalist';

  const themeClasses = isEmerald
    ? {
        bgCover: 'bg-gradient-to-b from-emerald-900 via-teal-900 to-emerald-950 text-emerald-50',
        bgBody: 'bg-[#F4F9F6]',
        primaryBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/30',
        badge: 'bg-emerald-100 text-emerald-800',
        accentText: 'text-emerald-700',
        cardBorder: 'border-emerald-100',
      }
    : isTerracotta
    ? {
        bgCover: 'bg-gradient-to-b from-amber-950 via-orange-950 to-stone-900 text-amber-50',
        bgBody: 'bg-[#FBF8F5]',
        primaryBtn: 'bg-[#C26D53] hover:bg-[#A85840] text-white shadow-[#C26D53]/30',
        badge: 'bg-amber-100 text-amber-800',
        accentText: 'text-[#C26D53]',
        cardBorder: 'border-amber-100',
      }
    : isIvory
    ? {
        bgCover: 'bg-gradient-to-b from-stone-900 via-neutral-900 to-stone-950 text-stone-50',
        bgBody: 'bg-[#FAFAF9]',
        primaryBtn: 'bg-stone-800 hover:bg-stone-900 text-white shadow-stone-800/30',
        badge: 'bg-stone-200 text-stone-800',
        accentText: 'text-stone-800',
        cardBorder: 'border-stone-200',
      }
    : {
        // Default: Sakura Blush
        bgCover: 'bg-gradient-to-b from-[#7A364E] via-[#A95570] to-[#542133] text-pink-50',
        bgBody: 'bg-[#FFF7F9]',
        primaryBtn: 'bg-[#A95570] hover:bg-[#92435b] text-white shadow-[#A95570]/30',
        badge: 'bg-[#F7E6EA] text-[#A95570]',
        accentText: 'text-[#A95570]',
        cardBorder: 'border-[#F7E6EA]',
      };

  return (
    <div className={`min-h-screen ${themeClasses.bgBody} font-sans selection:bg-[#A95570]/20`}>
      {/* 1. COVER OVERLAY (Opens upon click) */}
      {!isOpen && (
        <div className={`fixed inset-0 z-50 ${themeClasses.bgCover} flex flex-col items-center justify-between p-6 sm:p-12 text-center transition-all duration-700`}>
          {/* Top Decor */}
          <div className="pt-4 space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-white/10 backdrop-blur-md">
              Walimatul ‘Ursy
            </span>
            <p className="text-xs tracking-wider opacity-80 uppercase">
              The Wedding Celebration of
            </p>
          </div>

          {/* Couple Names */}
          <div className="space-y-4 max-w-lg">
            <div className="w-16 h-16 mx-auto rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg animate-pulse">
              <Heart className="w-8 h-8 fill-white/80" />
            </div>
            <h1 className="font-serif-editorial text-4xl sm:text-6xl font-bold tracking-wide drop-shadow-md">
              {invitation.groom.nickname} <span className="font-light italic">&</span> {invitation.bride.nickname}
            </h1>
            <p className="text-xs sm:text-sm opacity-90">
              {new Date(invitation.events.akad.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Recipient & Open Button */}
          <div className="w-full max-w-sm space-y-4 pb-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-1">
              <p className="text-[11px] uppercase tracking-wider opacity-75">
                Kepada Yth. Bapak/Ibu/Saudara/i:
              </p>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                {guestName}
              </h2>
              <p className="text-[10px] opacity-75 italic">
                *Mohon maaf jika ada kesalahan penulisan nama/gelar
              </p>
            </div>

            <button
              onClick={handleOpenInvitation}
              className="w-full py-3.5 px-6 rounded-2xl bg-white text-[#29252A] font-bold text-sm shadow-xl hover:bg-neutral-100 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#A95570]" />
              <span>Buka Undangan Digital</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. MAIN INVITATION CONTENT (Scrollable, mobile-optimized container) */}
      <div className="max-w-xl mx-auto bg-white min-h-screen shadow-2xl relative overflow-hidden pb-24 border-x border-[#F0E7E9]">
        {/* Floating Top Floating Bar */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-4 py-2.5 border-b border-[#F0E7E9] flex items-center justify-between">
          <Link
            to="/undangan"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#777078] hover:text-[#A95570]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Katalog</span>
          </Link>
          <span className="font-serif-editorial text-sm font-bold text-[#29252A]">
            {invitation.groom.nickname} & {invitation.bride.nickname}
          </span>
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className={`p-2 rounded-full border transition ${
              isPlayingAudio ? 'bg-[#FFF5F7] border-[#F7E6EA] text-[#A95570]' : 'bg-gray-100 text-gray-500'
            }`}
            title={isPlayingAudio ? 'Jeda Audio' : 'Putar Audio'}
          >
            {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Hero Section */}
        <div className={`p-8 sm:p-12 text-center space-y-4 border-b ${themeClasses.cardBorder} relative overflow-hidden bg-gradient-to-b from-[#FFF5F7]/40 to-transparent`}>
          <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${themeClasses.badge}`}>
            Walimatul ‘Ursy
          </span>

          <div className="space-y-2">
            <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#29252A]">
              {invitation.groom.nickname} & {invitation.bride.nickname}
            </h1>
            <p className="text-xs sm:text-sm text-[#777078]">
              {new Date(invitation.events.akad.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Countdown Widget */}
          <div className="grid grid-cols-4 gap-2 pt-4 max-w-xs mx-auto">
            <div className="bg-[#FFF5F7] p-2.5 rounded-2xl border border-[#F7E6EA] text-center">
              <span className="block font-bold text-lg text-[#29252A]">{timeLeft.days}</span>
              <span className="text-[10px] text-[#777078] uppercase">Hari</span>
            </div>
            <div className="bg-[#FFF5F7] p-2.5 rounded-2xl border border-[#F7E6EA] text-center">
              <span className="block font-bold text-lg text-[#29252A]">{timeLeft.hours}</span>
              <span className="text-[10px] text-[#777078] uppercase">Jam</span>
            </div>
            <div className="bg-[#FFF5F7] p-2.5 rounded-2xl border border-[#F7E6EA] text-center">
              <span className="block font-bold text-lg text-[#29252A]">{timeLeft.minutes}</span>
              <span className="text-[10px] text-[#777078] uppercase">Menit</span>
            </div>
            <div className="bg-[#FFF5F7] p-2.5 rounded-2xl border border-[#F7E6EA] text-center">
              <span className="block font-bold text-lg text-[#29252A]">{timeLeft.seconds}</span>
              <span className="text-[10px] text-[#777078] uppercase">Detik</span>
            </div>
          </div>
        </div>

        {/* Islamic Greeting & Ayat */}
        <div className="p-6 sm:p-8 text-center space-y-4 border-b border-[#F0E7E9]">
          <p className="font-serif-editorial text-lg text-[#29252A]">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-xs text-[#777078] leading-relaxed">
            Assalamu’alaikum Warahmatullahi Wabarakatuh
          </p>
          <p className="text-xs text-[#777078] leading-relaxed">
            Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta’ala, kami bermaksud menyelenggarakan syukuran pernikahan putra-putri kami:
          </p>

          <div className="p-5 rounded-2xl bg-[#FFF5F7]/60 border border-[#F7E6EA] space-y-3">
            <p className="font-arabic text-xl sm:text-2xl text-[#29252A] leading-loose">
              {invitation.quoteArabic}
            </p>
            <p className="text-xs text-[#777078] italic leading-relaxed">
              "{invitation.quoteTranslation}"
            </p>
            <span className="inline-block text-[11px] font-bold text-[#A95570]">
              ({invitation.quoteSource})
            </span>
          </div>
        </div>

        {/* Mempelai Section */}
        <div className="p-6 sm:p-8 space-y-8 border-b border-[#F0E7E9]">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A95570]">
              Kedua Mempelai
            </span>
            <h2 className="font-serif-editorial text-2xl font-bold text-[#29252A]">
              Maha Suci Allah Yang Menyatukan
            </h2>
          </div>

          {/* Groom (Pria) */}
          <div className="bg-[#FFF5F7]/30 p-5 rounded-3xl border border-[#F7E6EA] text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F7E6EA] text-[#A95570] flex items-center justify-center font-bold text-xl font-serif-editorial border-2 border-white shadow-sm">
              {invitation.groom.nickname.charAt(0)}
            </div>
            <h3 className="font-serif-editorial text-lg font-bold text-[#29252A]">
              {invitation.groom.fullName}
            </h3>
            <p className="text-xs text-[#777078]">
              {invitation.groom.bio || `Putra dari ${invitation.groom.fatherName} & ${invitation.groom.motherName}`}
            </p>
            {invitation.groom.instagram && (
              <span className="inline-block text-[11px] text-[#A95570] font-medium">
                {invitation.groom.instagram}
              </span>
            )}
          </div>

          {/* Divider with Heart */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex-1 h-px bg-[#F0E7E9]" />
            <div className="w-8 h-8 rounded-full bg-[#FFF5F7] border border-[#F7E6EA] flex items-center justify-center text-[#A95570]">
              <Heart className="w-4 h-4 fill-[#A95570]" />
            </div>
            <div className="flex-1 h-px bg-[#F0E7E9]" />
          </div>

          {/* Bride (Wanita) */}
          <div className="bg-[#FFF5F7]/30 p-5 rounded-3xl border border-[#F7E6EA] text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F7E6EA] text-[#A95570] flex items-center justify-center font-bold text-xl font-serif-editorial border-2 border-white shadow-sm">
              {invitation.bride.nickname.charAt(0)}
            </div>
            <h3 className="font-serif-editorial text-lg font-bold text-[#29252A]">
              {invitation.bride.fullName}
            </h3>
            <p className="text-xs text-[#777078]">
              {invitation.bride.bio || `Putri dari ${invitation.bride.fatherName} & ${invitation.bride.motherName}`}
            </p>
            {invitation.bride.instagram && (
              <span className="inline-block text-[11px] text-[#A95570] font-medium">
                {invitation.bride.instagram}
              </span>
            )}
          </div>
        </div>

        {/* Rangkaian Acara (Akad & Resepsi) */}
        <div className="p-6 sm:p-8 space-y-6 border-b border-[#F0E7E9]">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A95570]">
              Waktu & Tempat
            </span>
            <h2 className="font-serif-editorial text-2xl font-bold text-[#29252A]">
              Rangkaian Acara
            </h2>
          </div>

          {/* Akad Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#F0E7E9] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 uppercase">
                {invitation.events.akad.title}
              </span>
              <Calendar className="w-4 h-4 text-[#A95570]" />
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#29252A]">
                {new Date(invitation.events.akad.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </h4>
              <p className="text-xs text-[#777078] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Pukul {invitation.events.akad.startTime} - {invitation.events.akad.endTime}
              </p>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl space-y-1">
              <p className="text-xs font-semibold text-[#29252A] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#A95570]" />
                {invitation.events.akad.venue}
              </p>
              <p className="text-[11px] text-[#777078] leading-relaxed">
                {invitation.events.akad.address}
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <a
                href={invitation.events.akad.mapsUrl || 'https://maps.google.com'}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 rounded-xl bg-[#FFF5F7] text-[#A95570] text-xs font-semibold text-center hover:bg-[#F7E6EA] transition flex items-center justify-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                Petunjuk Lokasi (Maps)
              </a>
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-xl border border-[#F0E7E9] text-xs font-semibold text-[#777078] hover:bg-neutral-50 transition flex items-center justify-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5" />
                Kalender
              </a>
            </div>
          </div>

          {/* Resepsi Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#F0E7E9] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F7E6EA] text-[#A95570] uppercase">
                {invitation.events.reception.title}
              </span>
              <Calendar className="w-4 h-4 text-[#A95570]" />
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#29252A]">
                {new Date(invitation.events.reception.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </h4>
              <p className="text-xs text-[#777078] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Pukul {invitation.events.reception.startTime} - {invitation.events.reception.endTime}
              </p>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl space-y-1">
              <p className="text-xs font-semibold text-[#29252A] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#A95570]" />
                {invitation.events.reception.venue}
              </p>
              <p className="text-[11px] text-[#777078] leading-relaxed">
                {invitation.events.reception.address}
              </p>
            </div>

            <a
              href={invitation.events.reception.mapsUrl || 'https://maps.google.com'}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 rounded-xl bg-[#FFF5F7] text-[#A95570] text-xs font-semibold text-center hover:bg-[#F7E6EA] transition flex items-center justify-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5" />
              Petunjuk Lokasi Resepsi (Google Maps)
            </a>
          </div>
        </div>

        {/* Cerita Taaruf / Story Milestones */}
        {invitation.story && invitation.story.length > 0 && (
          <div className="p-6 sm:p-8 space-y-6 border-b border-[#F0E7E9]">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A95570]">
                Kisah Kami
              </span>
              <h2 className="font-serif-editorial text-2xl font-bold text-[#29252A]">
                Perjalanan Taaruf Menuju Halal
              </h2>
            </div>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#F7E6EA]">
              {invitation.story.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-[#A95570] ring-4 ring-white" />
                  <div className="bg-[#FFF5F7]/40 p-4 rounded-2xl border border-[#F7E6EA] space-y-1">
                    <span className="text-[10px] font-bold text-[#A95570] uppercase">
                      {item.year}
                    </span>
                    <h4 className="font-bold text-xs text-[#29252A]">{item.title}</h4>
                    <p className="text-xs text-[#777078] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RSVP Form & Guest Wishes Feed */}
        <div className="p-6 sm:p-8 space-y-6 border-b border-[#F0E7E9]">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A95570]">
              Konfirmasi & Doa
            </span>
            <h2 className="font-serif-editorial text-2xl font-bold text-[#29252A]">
              RSVP Kehadiran & Doa Restu
            </h2>
            <p className="text-xs text-[#777078]">
              Konfirmasikan kehadiran Anda untuk membantu panitia walimah mempersiapkan hidangan.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRsvpSubmit} className="bg-[#FFF5F7]/30 p-5 rounded-3xl border border-[#F7E6EA] space-y-4">
            {rsvpSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Alhamdulillah! Konfirmasi kehadiran dan doa Anda telah tersimpan.</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                Nama Lengkap Anda
              </label>
              <input
                type="text"
                required
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                placeholder="Contoh: Ahmad Fauzi & Istri"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0E7E9] bg-white text-xs text-[#29252A] focus:outline-none focus:border-[#A95570]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#29252A] mb-1">
                  Konfirmasi Kehadiran
                </label>
                <select
                  value={rsvpStatus}
                  onChange={(e) => setRsvpStatus(e.target.value as 'hadir' | 'tidak' | 'ragu')}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#F0E7E9] bg-white text-xs text-[#29252A] focus:outline-none focus:border-[#A95570]"
                >
                  <option value="hadir">InsyaAllah Hadir</option>
                  <option value="tidak">Mohon Maaf Belum Bisa</option>
                  <option value="ragu">Masih Ragu / Belum Pasti</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#29252A] mb-1">
                  Jumlah Orang
                </label>
                <select
                  value={rsvpCount}
                  onChange={(e) => setRsvpCount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#F0E7E9] bg-white text-xs text-[#29252A] focus:outline-none focus:border-[#A95570]"
                >
                  <option value={1}>1 Orang</option>
                  <option value={2}>2 Orang</option>
                  <option value={3}>3 Orang</option>
                  <option value={4}>4 Orang</option>
                  <option value={5}>5+ Orang (Keluarga)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                Doa & Ucapan untuk Mempelai
              </label>
              <textarea
                rows={3}
                value={rsvpMessage}
                onChange={(e) => setRsvpMessage(e.target.value)}
                placeholder="Tuliskan doa kebaikan dan ucapan selamat..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#F0E7E9] bg-white text-xs text-[#29252A] focus:outline-none focus:border-[#A95570]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingRsvp}
              className={`w-full py-3 rounded-xl ${themeClasses.primaryBtn} text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmittingRsvp ? 'Mengirim...' : 'Kirim Konfirmasi & Doa'}</span>
            </button>
          </form>

          {/* Doa Feed List */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-xs text-[#29252A] flex items-center justify-between">
              <span>Doa Dari Sahabat & Kerabat ({invitation.rsvps?.length || 0})</span>
              <MessageCircle className="w-3.5 h-3.5 text-[#A95570]" />
            </h4>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {invitation.rsvps?.map((r) => (
                <div key={r.id} className="p-3.5 rounded-2xl bg-white border border-[#F0E7E9] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#29252A]">{r.name}</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-semibold ${
                        r.attendance === 'hadir'
                          ? 'bg-emerald-50 text-emerald-700'
                          : r.attendance === 'tidak'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {r.attendance === 'hadir' ? 'Hadir' : r.attendance === 'tidak' ? 'Berhalangan' : 'Ragu'}
                    </span>
                  </div>
                  <p className="text-xs text-[#777078] leading-relaxed italic">
                    "{r.message}"
                  </p>
                  <p className="text-[9px] text-[#A95570] pt-1">
                    {new Date(r.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Amplop Digital (Hadiah Pernikahan) */}
        {invitation.giftAccounts && invitation.giftAccounts.length > 0 && (
          <div className="p-6 sm:p-8 space-y-6 border-b border-[#F0E7E9]">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A95570]">
                Tanda Kasih
              </span>
              <h2 className="font-serif-editorial text-2xl font-bold text-[#29252A]">
                Amplop Digital & Kado
              </h2>
              <p className="text-xs text-[#777078] leading-relaxed">
                Doa restu Anda merupakan karunia terindah bagi kami. Namun jika ingin memberikan tanda kasih secara cashless, Anda dapat menggunakan rekening di bawah ini:
              </p>
            </div>

            <div className="space-y-3">
              {invitation.giftAccounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-white p-4 rounded-2xl border border-[#F0E7E9] shadow-sm flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-[#A95570] uppercase">
                      {account.bankName}
                    </span>
                    <p className="font-mono text-sm font-bold text-[#29252A] tracking-wider">
                      {account.accountNumber}
                    </p>
                    <p className="text-xs text-[#777078]">
                      a.n {account.accountHolder}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopyBank(account.id, account.accountNumber)}
                    className="px-3 py-2 rounded-xl bg-[#FFF5F7] text-[#A95570] text-xs font-semibold hover:bg-[#F7E6EA] transition flex items-center gap-1.5 shrink-0"
                  >
                    {copiedBankId === account.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Rekening</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Syar'i Etiquette Notice */}
        <div className="p-6 sm:p-8 text-center space-y-3 bg-[#FFF5F7]/30 border-b border-[#F0E7E9]">
          <h4 className="font-bold text-xs text-[#29252A] uppercase tracking-wider">
            Adab Menghadiri Walimatul ‘Ursy
          </h4>
          <p className="text-xs text-[#777078] leading-relaxed max-w-md mx-auto">
            Demi menjaga adab islami dan kenyamanan bersama, area duduk tamu ikhwan (pria) dan akhwat (wanita) dipisahkan. Disarankan mengenakan busana muslim/muslimah yang sopan dan menutup aurat.
          </p>
        </div>

        {/* Footer Doa Barakallah */}
        <div className="p-8 text-center space-y-4">
          <p className="font-arabic text-lg text-[#29252A]">
            بَارَكَ اللهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
          </p>
          <p className="text-xs text-[#777078] italic">
            "Semoga Allah memberkahimu di waktu bahagia dan memberkahimu di waktu susah, serta mengumpulkan kalian berdua dalam kebaikan." (HR. Abu Dawud)
          </p>
          <div className="pt-2">
            <span className="text-[10px] text-[#777078] uppercase tracking-widest font-semibold">
              Dibuat dengan cinta via <Link to="/" className="text-[#A95570] underline">bertemujodoh.my.id</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
