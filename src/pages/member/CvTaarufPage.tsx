import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSavedCVDraft, saveCVDraft } from '@/services/cvService';
import { type CVData, DEFAULT_CV_DATA } from '@/types/cv';
import {
  FileText,
  Printer,
  Sparkles,
  Save,
  CheckCircle2,
  RefreshCw,
  User,
  Heart,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Calendar,
  BookOpen,
  Briefcase,
  MapPin,
  Phone,
} from 'lucide-react';

export const CvTaarufPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [cvData, setCvData] = useState<CVData>(DEFAULT_CV_DATA);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [saveStatus, setSaveStatus] = useState<string>('Tersimpan');

  useEffect(() => {
    if (user) {
      const saved = getSavedCVDraft(user.id, profile);
      setCvData(saved);
    }
  }, [user, profile]);

  const handleChange = (field: keyof CVData, value: any) => {
    const updated = { ...cvData, [field]: value };
    setCvData(updated);
    setSaveStatus('Menyimpan...');

    if (user) {
      saveCVDraft(user.id, updated);
      setTimeout(() => setSaveStatus('Tersimpan otomatis'), 500);
    }
  };

  const handleLoadSample = () => {
    if (confirm('Muat data contoh taaruf lengkap untuk pengujian?')) {
      setCvData(DEFAULT_CV_DATA);
      if (user) saveCVDraft(user.id, DEFAULT_CV_DATA);
      setSaveStatus('Data contoh dimuat');
    }
  };

  const handlePrintPDF = () => {
    setViewMode('preview');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const SECTIONS = [
    { title: '1. Data Pribadi', icon: User },
    { title: '2. Fisik & Kesehatan', icon: Heart },
    { title: '3. Ibadah & Manhaj', icon: BookOpen },
    { title: '4. Pendidikan & Finansial', icon: Briefcase },
    { title: '5. Visi Rumah Tangga', icon: Sparkles },
    { title: '6. Kriteria Pasangan', icon: SlidersHorizontal },
    { title: '7. Kontak Wali Nasab', icon: ShieldCheck },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Action Header Bar (Hidden in print) */}
      <div className="print:hidden bg-white p-5 rounded-3xl border border-[#F0E7E9] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F7E6EA] text-[#A95570] uppercase">
              Curriculum Vitae Taaruf Builder
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {saveStatus}
            </span>
          </div>
          <h1 className="font-serif-editorial text-2xl font-bold text-[#29252A]">
            Penyusun CV Taaruf Syar'i
          </h1>
          <p className="text-xs text-[#777078]">
            Lengkapi 7 bagian biodata diri. Data tersimpan otomatis dan siap diekspor menjadi lembar A4 PDF.
          </p>
        </div>

        {/* View Mode & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-3.5 py-2 rounded-xl border border-[#F0E7E9] text-xs font-semibold text-[#777078] hover:bg-neutral-50 transition flex items-center gap-1.5"
            title="Isi form dengan data contoh otomatis"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Isi Data Contoh</span>
          </button>

          {/* Toggle View Mode */}
          <div className="flex bg-[#FFF5F7] p-1 rounded-xl">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'editor'
                  ? 'bg-[#A95570] text-white shadow-xs'
                  : 'text-[#777078] hover:text-[#29252A]'
              }`}
            >
              Formulir
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'preview'
                  ? 'bg-[#A95570] text-white shadow-xs'
                  : 'text-[#777078] hover:text-[#29252A]'
              }`}
            >
              Pratinjau A4
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrintPDF}
            className="px-4 py-2 rounded-xl bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b] transition flex items-center gap-2 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Ekspor PDF</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE: EDITOR */}
      {viewMode === 'editor' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Step Navigation Sidebar (md: 4 cols) */}
          <div className="md:col-span-4 space-y-2">
            <div className="bg-white rounded-3xl border border-[#F0E7E9] p-4 space-y-1 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#777078] block px-3 py-1">
                Tahapan Pengisian:
              </span>
              {SECTIONS.map((sec, idx) => {
                const Icon = sec.icon;
                const isActive = activeTab === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between transition ${
                      isActive
                        ? 'bg-[#A95570] text-white shadow-xs'
                        : 'text-[#29252A] hover:bg-[#FFF5F7]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {sec.title}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Content Area (md: 8 cols) */}
          <div className="md:col-span-8 bg-white rounded-3xl border border-[#F0E7E9] p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Section 0: Data Pribadi */}
            {activeTab === 0 && (
              <div className="space-y-4">
                <h3 className="font-serif-editorial text-lg font-bold text-[#29252A] border-b border-[#F0E7E9] pb-3">
                  1. Data Diri & Identitas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={cvData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Nama Panggilan</label>
                    <input
                      type="text"
                      value={cvData.nickname}
                      onChange={(e) => handleChange('nickname', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Tempat Lahir</label>
                    <input
                      type="text"
                      value={cvData.birthPlace}
                      onChange={(e) => handleChange('birthPlace', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Tanggal Lahir</label>
                    <input
                      type="date"
                      value={cvData.birthDate}
                      onChange={(e) => handleChange('birthDate', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Status Pernikahan</label>
                    <select
                      value={cvData.maritalStatus}
                      onChange={(e) => handleChange('maritalStatus', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    >
                      <option value="Lajang">Lajang (Belum Pernah Menikah)</option>
                      <option value="Duda">Duda</option>
                      <option value="Janda">Janda</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Golongan Darah</label>
                    <input
                      type="text"
                      value={cvData.bloodType}
                      onChange={(e) => handleChange('bloodType', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#29252A] mb-1">Alamat Domisili Lengkap</label>
                  <textarea
                    rows={2}
                    value={cvData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                  />
                </div>
              </div>
            )}

            {/* Section 1: Ciri Fisik */}
            {activeTab === 1 && (
              <div className="space-y-4">
                <h3 className="font-serif-editorial text-lg font-bold text-[#29252A] border-b border-[#F0E7E9] pb-3">
                  2. Gambaran Fisik & Riwayat Kesehatan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Tinggi Badan (cm)</label>
                    <input
                      type="number"
                      value={cvData.height}
                      onChange={(e) => handleChange('height', Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Berat Badan (kg)</label>
                    <input
                      type="number"
                      value={cvData.weight}
                      onChange={(e) => handleChange('weight', Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Warna Kulit</label>
                    <input
                      type="text"
                      value={cvData.skinColor}
                      onChange={(e) => handleChange('skinColor', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                </div>
                <div className="text-xs space-y-3">
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Ciri Khas Fisik</label>
                    <input
                      type="text"
                      value={cvData.distinctiveFeatures}
                      onChange={(e) => handleChange('distinctiveFeatures', e.target.value)}
                      placeholder="Contoh: Mengenakan kacamata, tahi lalat di pipi..."
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Riwayat Medis & Penyakit</label>
                    <textarea
                      rows={2}
                      value={cvData.medicalHistory}
                      onChange={(e) => handleChange('medicalHistory', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Ibadah & Agama */}
            {activeTab === 2 && (
              <div className="space-y-4">
                <h3 className="font-serif-editorial text-lg font-bold text-[#29252A] border-b border-[#F0E7E9] pb-3">
                  3. Ibadah & Karakter Spiritual
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Pelaksanaan Shalat Fardhu</label>
                    <input
                      type="text"
                      value={cvData.shalatFardhu}
                      onChange={(e) => handleChange('shalatFardhu', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Hafalan Al-Qur’an Saat Ini</label>
                    <input
                      type="text"
                      value={cvData.hafalanQuran}
                      onChange={(e) => handleChange('hafalanQuran', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Kajian Rutin & Asatidz Rujukan</label>
                    <input
                      type="text"
                      value={cvData.kajianRutin}
                      onChange={(e) => handleChange('kajianRutin', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Kebiasaan Merokok</label>
                    <select
                      value={cvData.smokingHabit}
                      onChange={(e) => handleChange('smokingHabit', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    >
                      <option value="Tidak Merokok">Tidak Merokok</option>
                      <option value="Pernah / Sudah Berhenti">Pernah / Sudah Berhenti</option>
                      <option value="Merokok">Merokok</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Pendidikan & Finansial */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <h3 className="font-serif-editorial text-lg font-bold text-[#29252A] border-b border-[#F0E7E9] pb-3">
                  4. Pendidikan & Kesiapan Finansial
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Pendidikan Terakhir</label>
                    <input
                      type="text"
                      value={cvData.lastEducation}
                      onChange={(e) => handleChange('lastEducation', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Jurusan / Program Studi</label>
                    <input
                      type="text"
                      value={cvData.major}
                      onChange={(e) => handleChange('major', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Pekerjaan Saat Ini</label>
                    <input
                      type="text"
                      value={cvData.currentOccupation}
                      onChange={(e) => handleChange('currentOccupation', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Rentang Penghasilan Bulanan</label>
                    <input
                      type="text"
                      value={cvData.monthlyIncomeRange}
                      onChange={(e) => handleChange('monthlyIncomeRange', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#29252A] mb-1">Kesiapan Finansial Menikah</label>
                  <textarea
                    rows={2}
                    value={cvData.financialReadiness}
                    onChange={(e) => handleChange('financialReadiness', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                  />
                </div>
              </div>
            )}

            {/* Section 4: Visi Misi */}
            {activeTab === 4 && (
              <div className="space-y-4">
                <h3 className="font-serif-editorial text-lg font-bold text-[#29252A] border-b border-[#F0E7E9] pb-3">
                  5. Visi & Misi Rumah Tangga
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Visi Pernikahan</label>
                    <textarea
                      rows={2}
                      value={cvData.marriageVision}
                      onChange={(e) => handleChange('marriageVision', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Misi / Cara Mencapainya</label>
                    <textarea
                      rows={3}
                      value={cvData.marriageMission}
                      onChange={(e) => handleChange('marriageMission', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#29252A] mb-1">Target Tahun Menikah</label>
                      <input
                        type="text"
                        value={cvData.targetMarriageYear}
                        onChange={(e) => handleChange('targetMarriageYear', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#29252A] mb-1">Kesiapan Pindah Domisili</label>
                      <select
                        value={cvData.willingnessToRelocate}
                        onChange={(e) => handleChange('willingnessToRelocate', e.target.value as any)}
                        className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                      >
                        <option value="Ya, Bersedia">Ya, Bersedia</option>
                        <option value="Dipertimbangkan">Dipertimbangkan</option>
                        <option value="Tidak Bisa">Tidak Bisa</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 5: Kriteria Calon */}
            {activeTab === 5 && (
              <div className="space-y-4">
                <h3 className="font-serif-editorial text-lg font-bold text-[#29252A] border-b border-[#F0E7E9] pb-3">
                  6. Kriteria Calon Pasangan yang Diharapkan
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#29252A] mb-1">Usia Minimal</label>
                      <input
                        type="number"
                        value={cvData.criteriaAgeMin}
                        onChange={(e) => handleChange('criteriaAgeMin', Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#29252A] mb-1">Usia Maksimal</label>
                      <input
                        type="number"
                        value={cvData.criteriaAgeMax}
                        onChange={(e) => handleChange('criteriaAgeMax', Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Karakter & Sifat Idaman</label>
                    <textarea
                      rows={2}
                      value={cvData.criteriaCharacter}
                      onChange={(e) => handleChange('criteriaCharacter', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-rose-700 mb-1">Hal yang Tidak Bisa Ditolerir (Deal-breakers)</label>
                    <textarea
                      rows={2}
                      value={cvData.criteriaDealBreakers}
                      onChange={(e) => handleChange('criteriaDealBreakers', e.target.value)}
                      placeholder="Contoh: Meninggalkan shalat, merokok, suka berbohong..."
                      className="w-full p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 6: Wali Nasab */}
            {activeTab === 6 && (
              <div className="space-y-4">
                <h3 className="font-serif-editorial text-lg font-bold text-[#29252A] border-b border-[#F0E7E9] pb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#A95570]" />
                  7. Kontak Wali Nasab (Kerahasiaan Terjaga)
                </h3>
                <p className="text-xs text-[#777078]">
                  Nomor ini hanya dibuka ketika permohonan taaruf disetujui bersama untuk melanjutkan nadzor.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Nama Wali Nasab</label>
                    <input
                      type="text"
                      value={cvData.waliName}
                      onChange={(e) => handleChange('waliName', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#29252A] mb-1">Hubungan Wali</label>
                    <select
                      value={cvData.waliRelation}
                      onChange={(e) => handleChange('waliRelation', e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    >
                      <option value="Ayah Kandung">Ayah Kandung</option>
                      <option value="Kakek">Kakek</option>
                      <option value="Saudara Laki-laki Kandung">Saudara Laki-laki Kandung</option>
                      <option value="Paman Kandung">Paman Kandung</option>
                      <option value="Wali Hakim">Wali Hakim</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-[#29252A] mb-1">No. WhatsApp / Telepon Wali</label>
                    <input
                      type="tel"
                      value={cvData.waliPhone}
                      onChange={(e) => handleChange('waliPhone', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F0E7E9] focus:outline-none focus:border-[#A95570]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step navigation buttons */}
            <div className="flex items-center justify-between border-t border-[#F0E7E9] pt-4">
              <button
                type="button"
                disabled={activeTab === 0}
                onClick={() => setActiveTab(activeTab - 1)}
                className="px-4 py-2 rounded-xl border border-[#F0E7E9] text-xs font-semibold text-[#777078] hover:bg-neutral-50 disabled:opacity-30"
              >
                Sebelumnya
              </button>
              {activeTab < SECTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab + 1)}
                  className="px-5 py-2 rounded-xl bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b]"
                >
                  Lanjut Bagian Berikutnya
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                >
                  Selesai & Lihat Pratinjau A4
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE: PRATINJAU LEMBAR A4 (PRINT READY) */}
      {viewMode === 'preview' && (
        <div className="space-y-4">
          <div className="print:hidden flex justify-between items-center bg-[#FFF5F7] p-3 rounded-2xl border border-[#F7E6EA] text-xs">
            <span className="text-[#A95570] font-semibold">
              📄 Pratinjau Lembar A4 Siap Cetak & Ekspor PDF
            </span>
            <button
              onClick={() => setViewMode('editor')}
              className="text-xs font-bold text-[#A95570] hover:underline"
            >
              ← Kembali ke Editor
            </button>
          </div>

          {/* Clean Printable A4 Document Sheet */}
          <div className="bg-white rounded-3xl border border-[#F0E7E9] p-8 sm:p-12 max-w-4xl mx-auto shadow-sm print:shadow-none print:border-none print:p-0 space-y-6 text-[#29252A]">
            {/* Basmalah & Official Document Header */}
            <div className="text-center border-b-2 border-[#A95570] pb-4 space-y-1">
              <p className="font-serif text-lg font-bold text-[#A95570]" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
              </p>
              <h2 className="font-serif-editorial text-2xl font-bold uppercase tracking-wider text-[#29252A]">
                BIODATA & CURRICULUM VITAE TAARUF
              </h2>
              <p className="text-[11px] text-[#777078] tracking-widest uppercase">
                bertemujodoh.my.id — Dokumen Resmi Ikhtiar Menuju Pernikahan
              </p>
            </div>

            {/* 1. Identitas & Ciri Fisik Grid */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#A95570] bg-[#FFF5F7] px-3 py-1 rounded-md">
                I. IDENTITAS PRIBADI & GAMBARAN FISIK
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                <div><span className="font-semibold text-[#777078]">Nama Lengkap:</span> {cvData.fullName}</div>
                <div><span className="font-semibold text-[#777078]">Panggilan:</span> {cvData.nickname}</div>
                <div><span className="font-semibold text-[#777078]">Jenis Kelamin:</span> {cvData.gender === 'female' ? 'Wanita (Akhwat)' : 'Pria (Ikhwan)'}</div>
                <div><span className="font-semibold text-[#777078]">Tempat, Tgl Lahir:</span> {cvData.birthPlace}, {cvData.birthDate}</div>
                <div><span className="font-semibold text-[#777078]">Status:</span> {cvData.maritalStatus}</div>
                <div><span className="font-semibold text-[#777078]">Golongan Darah:</span> {cvData.bloodType}</div>
                <div><span className="font-semibold text-[#777078]">Tinggi / Berat:</span> {cvData.height} cm / {cvData.weight} kg</div>
                <div><span className="font-semibold text-[#777078]">Warna Kulit:</span> {cvData.skinColor}</div>
                <div className="col-span-2"><span className="font-semibold text-[#777078]">Ciri Khas Fisik:</span> {cvData.distinctiveFeatures}</div>
                <div className="col-span-2"><span className="font-semibold text-[#777078]">Domisili:</span> {cvData.address}</div>
              </div>
            </div>

            {/* 2. Keagamaan & Ibadah */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#A95570] bg-[#FFF5F7] px-3 py-1 rounded-md">
                II. IBADAH, AGAMA & MANHAJ
              </h3>
              <div className="space-y-1 text-xs">
                <div><span className="font-semibold text-[#777078]">Shalat Wajib:</span> {cvData.shalatFardhu}</div>
                <div><span className="font-semibold text-[#777078]">Hafalan Al-Qur’an:</span> {cvData.hafalanQuran}</div>
                <div><span className="font-semibold text-[#777078]">Kajian Rutin:</span> {cvData.kajianRutin}</div>
                <div><span className="font-semibold text-[#777078]">Asatidz Panutan:</span> {cvData.asatidzFavorit}</div>
                <div><span className="font-semibold text-[#777078]">Kebiasaan Merokok:</span> {cvData.smokingHabit}</div>
              </div>
            </div>

            {/* 3. Pendidikan & Finansial */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#A95570] bg-[#FFF5F7] px-3 py-1 rounded-md">
                III. PENDIDIKAN & PEKERJAAN
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                <div><span className="font-semibold text-[#777078]">Pendidikan:</span> {cvData.lastEducation} - {cvData.major}</div>
                <div><span className="font-semibold text-[#777078]">Pekerjaan:</span> {cvData.currentOccupation}</div>
                <div><span className="font-semibold text-[#777078]">Rentang Penghasilan:</span> {cvData.monthlyIncomeRange}</div>
                <div className="col-span-2"><span className="font-semibold text-[#777078]">Kesiapan Finansial:</span> {cvData.financialReadiness}</div>
              </div>
            </div>

            {/* 4. Visi & Misi Rumah Tangga */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#A95570] bg-[#FFF5F7] px-3 py-1 rounded-md">
                IV. VISI & MISI PERNIKAHAN
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-[#777078] block">Visi Rumah Tangga:</span>
                  <p className="italic bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">{cvData.marriageVision}</p>
                </div>
                <div>
                  <span className="font-semibold text-[#777078] block">Misi Menuju Sakinah:</span>
                  <p className="whitespace-pre-line bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">{cvData.marriageMission}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div><span className="font-semibold text-[#777078]">Target Menikah:</span> {cvData.targetMarriageYear}</div>
                  <div><span className="font-semibold text-[#777078]">Kesiapan Domisili:</span> {cvData.willingnessToRelocate}</div>
                </div>
              </div>
            </div>

            {/* 5. Kriteria Calon Pasangan */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#A95570] bg-[#FFF5F7] px-3 py-1 rounded-md">
                V. KRITERIA CALON PASANGAN
              </h3>
              <div className="space-y-1 text-xs">
                <div><span className="font-semibold text-[#777078]">Rentang Usia:</span> {cvData.criteriaAgeMin} - {cvData.criteriaAgeMax} Tahun</div>
                <div><span className="font-semibold text-[#777078]">Sifat/Karakter yang Diharapkan:</span> {cvData.criteriaCharacter}</div>
                <div><span className="font-semibold text-rose-700">Deal-breakers (Kriteria Mutlak):</span> {cvData.criteriaDealBreakers}</div>
              </div>
            </div>

            {/* 6. Wali Nasab */}
            <div className="space-y-2 border-t border-[#F0E7E9] pt-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#A95570] bg-[#FFF5F7] px-3 py-1 rounded-md">
                VI. KONTAK WALI NASAB
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                <div><span className="font-semibold text-[#777078]">Nama Wali:</span> {cvData.waliName} ({cvData.waliRelation})</div>
                <div><span className="font-semibold text-[#777078]">Kontak WhatsApp:</span> {cvData.waliPhone}</div>
              </div>
            </div>

            {/* Pernyataan Kebenaran Data */}
            <div className="pt-4 border-t border-[#F0E7E9] text-[10px] text-[#777078] text-center italic">
              "Dengan menyebut nama Allah Yang Maha Melihat, saya menyatakan bahwa seluruh keterangan di atas diisi dengan jujur dan sebenar-benarnya tanpa rekayasa demi menjaga keberkahan ikhtiar."
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
