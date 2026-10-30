import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  fetchTaarufRequests,
  updateTaarufStatus,
} from '@/services/taarufService';
import type { TaarufRequest } from '@/types/database';
import {
  Inbox,
  Send,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Phone,
  Eye,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Heart,
  MessageSquare,
} from 'lucide-react';

export const TaarufPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [incomingRequests, setIncomingRequests] = useState<TaarufRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<TaarufRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectModalReqId, setRejectModalReqId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadRequests = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { incoming, outgoing } = await fetchTaarufRequests(user.id);
      setIncomingRequests(incoming);
      setOutgoingRequests(outgoing);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [user]);

  const handleAccept = async (requestId: string) => {
    if (confirm('Terima pengajuan taaruf ini untuk melanjutkan ke tahap pertukaran kontak wali & nadzor?')) {
      setUpdatingId(requestId);
      const success = await updateTaarufStatus(requestId, 'accepted', 'Alhamdulillah, kami bersedia melanjutkan ke tahap musyawarah keluarga & nadzor.');
      if (success) {
        await loadRequests();
      }
      setUpdatingId(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectModalReqId) return;
    setUpdatingId(rejectModalReqId);
    const success = await updateTaarufStatus(
      rejectModalReqId,
      'rejected',
      rejectNote.trim() || 'Afwan, setelah istikharah dan bermusyawarah bersama wali, kami belum dapat melanjutkan ke tahap berikutnya. Semoga Allah memberikan jodoh terbaik.'
    );
    if (success) {
      await loadRequests();
      setRejectModalReqId(null);
      setRejectNote('');
    }
    setUpdatingId(null);
  };

  const handleCancelOutgoing = async (requestId: string) => {
    if (confirm('Batalkan pengajuan taaruf ini?')) {
      setUpdatingId(requestId);
      const success = await updateTaarufStatus(requestId, 'cancelled');
      if (success) {
        await loadRequests();
      }
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F0E7E9] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F7E6EA] text-[#A95570] uppercase">
              Sistem Alur Taaruf Syar'i
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Pelibatan Wali & Non-Swipe
            </span>
          </div>
          <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#29252A]">
            Manajemen Pengajuan Taaruf
          </h1>
          <p className="text-xs text-[#777078] max-w-xl">
            Kelola pengajuan minat taaruf yang masuk dan keluar secara bermartabat, terjaga privasi, dan sesuai adab sunnah nabawiyah.
          </p>
        </div>

        <button
          onClick={loadRequests}
          className="p-2.5 rounded-xl border border-[#F0E7E9] text-[#777078] hover:text-[#A95570] hover:bg-[#FFF5F7] transition self-start md:self-center flex items-center gap-1.5 text-xs font-medium"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Perbarui Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#F0E7E9] gap-2 pb-1">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition ${
            activeTab === 'incoming'
              ? 'bg-[#A95570] text-white shadow-xs'
              : 'text-[#777078] hover:bg-[#FFF5F7]'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Pengajuan Masuk ({incomingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('outgoing')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition ${
            activeTab === 'outgoing'
              ? 'bg-[#A95570] text-white shadow-xs'
              : 'text-[#777078] hover:bg-[#FFF5F7]'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Pengajuan Terkirim ({outgoingRequests.length})</span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-[#F0E7E9]">
          <div className="w-10 h-10 border-3 border-[#F7E6EA] border-t-[#A95570] rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#777078]">Memuat daftar pengajuan taaruf...</p>
        </div>
      ) : activeTab === 'incoming' ? (
        /* INCOMING TAB */
        incomingRequests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#F0E7E9] p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#FFF5F7] text-[#A95570] flex items-center justify-center mx-auto">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="font-serif-editorial text-lg font-bold text-[#29252A]">
              Belum Ada Pengajuan Masuk
            </h3>
            <p className="text-xs text-[#777078] max-w-md mx-auto">
              Ketika ada lawan jenis yang mengajukan minat taaruf ke profilmu, surat pengantar dan kontak walinya akan tampil di sini.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {incomingRequests.map((req) => {
              const sender = req.sender;
              const isPending = req.status === 'pending';
              const isAccepted = req.status === 'accepted';
              const isRejected = req.status === 'rejected';

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl border border-[#F0E7E9] p-6 space-y-4 shadow-xs hover:border-[#F7E6EA] transition"
                >
                  {/* Sender Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E7E9] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#A95570] to-[#C77B91] text-white flex items-center justify-center font-bold text-sm uppercase">
                        {sender?.display_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-[#29252A]">
                            {sender?.full_name || 'Anggota Bertemu Jodoh'}
                          </h3>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-[#FFF0F3] text-[#A95570]">
                            {sender?.gender === 'female' ? 'Akhwat' : 'Ikhwan'}
                          </span>
                        </div>
                        <p className="text-xs text-[#777078]">
                          {sender?.occupation || 'Profesional'} • {sender?.city}, {sender?.province}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {isPending && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> Menunggu Keputusan Anda
                        </span>
                      )}
                      {isAccepted && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui (Lanjut Nadzor)
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200 flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5" /> Ditolak dengan Santun
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Introduction Note */}
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-[#A95570] uppercase text-[10px]">
                      Surat Pengantar & Visi Pengirim:
                    </span>
                    <p className="p-3.5 bg-[#FFF5F7] rounded-2xl text-[#29252A] leading-relaxed border border-[#F7E6EA]">
                      "{req.introduction_note}"
                    </p>
                  </div>

                  {/* Wali Contact */}
                  <div className="flex items-center gap-2 text-xs text-[#777078] bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
                    <Phone className="w-4 h-4 text-[#A95570]" />
                    <span>
                      Kontak WhatsApp Wali Pengirim: <strong className="text-[#29252A]">{req.wali_phone}</strong>
                    </span>
                  </div>

                  {/* Action Buttons for Pending Request */}
                  {isPending && (
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#F0E7E9]">
                      <Link
                        to={`/profil/${req.sender_id}`}
                        className="text-xs font-semibold text-[#A95570] hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Pelajari CV Lengkap Pengirim</span>
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          disabled={updatingId === req.id}
                          onClick={() => setRejectModalReqId(req.id)}
                          className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
                        >
                          Tolak dengan Santun
                        </button>

                        <button
                          disabled={updatingId === req.id}
                          onClick={() => handleAccept(req.id)}
                          className="px-5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Terima Taaruf (Lanjut Nadzor)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* OUTGOING TAB */
        outgoingRequests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#F0E7E9] p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#FFF5F7] text-[#A95570] flex items-center justify-center mx-auto">
              <Send className="w-7 h-7" />
            </div>
            <h3 className="font-serif-editorial text-lg font-bold text-[#29252A]">
              Belum Ada Pengajuan Terkirim
            </h3>
            <p className="text-xs text-[#777078] max-w-md mx-auto">
              Jelajahi feed atau direktori untuk menemukan calon pasangan yang sevisi dan kirim pengajuan taaruf pertamamu.
            </p>
            <Link
              to="/daftar-member"
              className="inline-block mt-2 px-5 py-2 rounded-xl bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b]"
            >
              Lihat Profil Anggota
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {outgoingRequests.map((req) => {
              const receiver = req.receiver;
              const isPending = req.status === 'pending';
              const isAccepted = req.status === 'accepted';
              const isRejected = req.status === 'rejected';

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl border border-[#F0E7E9] p-6 space-y-4 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E7E9] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#A95570] to-[#C77B91] text-white flex items-center justify-center font-bold text-sm uppercase">
                        {receiver?.display_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-[#29252A]">
                            Tujuan: {receiver?.full_name || 'Anggota'}
                          </h3>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-[#FFF0F3] text-[#A95570]">
                            {receiver?.gender === 'female' ? 'Akhwat' : 'Ikhwan'}
                          </span>
                        </div>
                        <p className="text-xs text-[#777078]">
                          {receiver?.city}, {receiver?.province}
                        </p>
                      </div>
                    </div>

                    <div>
                      {isPending && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> Menunggu Respon Calon
                        </span>
                      )}
                      {isAccepted && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Diterima! Lanjut ke Nadzor
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5" /> Belum Berjodoh
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-[#777078] text-[10px] uppercase">
                      Surat Pengantar yang Anda Kirim:
                    </span>
                    <p className="p-3 bg-neutral-50 rounded-xl text-[#29252A] leading-relaxed">
                      "{req.introduction_note}"
                    </p>
                  </div>

                  {req.response_note && (
                    <div className="space-y-1 text-xs bg-[#FFF5F7] p-3 rounded-xl border border-[#F7E6EA]">
                      <span className="font-bold text-[#A95570] text-[10px] uppercase">
                        Catatan Balasan dari Pihak Calon / Wali:
                      </span>
                      <p className="text-[#29252A] italic">"{req.response_note}"</p>
                    </div>
                  )}

                  {isPending && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleCancelOutgoing(req.id)}
                        className="text-xs text-rose-600 hover:underline font-semibold"
                      >
                        Batalkan Pengajuan Ini
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

      {/* REJECT WITH ADAB MODAL */}
      {rejectModalReqId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#F0E7E9]">
            <h3 className="font-serif-editorial text-xl font-bold text-[#29252A]">
              Tolak Pengajuan dengan Adab Syar'i
            </h3>
            <p className="text-xs text-[#777078] leading-relaxed">
              Tuliskan pesan penolakan yang santun dan mendoakan kebaikan, agar silaturahmi tetap terjaga dan tidak melukai hati sesama muslim.
            </p>

            <textarea
              rows={3}
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Contoh: Afwan, setelah istikharah dan musyawarah bersama wali, saat ini belum dapat melanjutkan. Semoga Allah mempertemukan dengan pasangan terbaik..."
              className="w-full p-3 rounded-xl border border-[#F0E7E9] text-xs text-[#29252A] focus:outline-none focus:border-[#A95570]"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalReqId(null)}
                className="px-4 py-2 rounded-xl border border-[#F0E7E9] text-xs font-semibold text-[#777078]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
              >
                Kirim Penolakan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
