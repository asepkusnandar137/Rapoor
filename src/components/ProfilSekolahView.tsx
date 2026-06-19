import React, { useState, useEffect } from 'react';
import { Save, Trash2, School, Youtube, Instagram, MessageSquare, Video } from 'lucide-react';
import { SchoolProfile } from '../types';

interface ProfilSekolahViewProps {
  initialProfile: SchoolProfile | null;
  onSave: (profile: SchoolProfile) => void;
  onDelete: () => void;
  showToast: (msg: string, color?: 'green' | 'red' | 'orange') => void;
}

export default function ProfilSekolahView({
  initialProfile,
  onSave,
  onDelete,
  showToast
}: ProfilSekolahViewProps) {
  const [formData, setFormData] = useState<SchoolProfile>({
    nama: '',
    npsn: '',
    alamat: '',
    desa: '',
    kec: '',
    kab: '',
    prov: '',
    ta: '2024/2025',
    kodepos: '',
    youtube: '',
    tiktok: '',
    instagram: '',
    whatsapp: ''
  });

  useEffect(() => {
    if (initialProfile) {
      setFormData({
        nama: initialProfile.nama || '',
        npsn: initialProfile.npsn || '',
        alamat: initialProfile.alamat || '',
        desa: initialProfile.desa || '',
        kec: initialProfile.kec || '',
        kab: initialProfile.kab || '',
        prov: initialProfile.prov || '',
        ta: initialProfile.ta || '2024/2025',
        kodepos: initialProfile.kodepos || '',
        youtube: initialProfile.youtube || '',
        tiktok: initialProfile.tiktok || '',
        instagram: initialProfile.instagram || '',
        whatsapp: initialProfile.whatsapp || ''
      });
    }
  }, [initialProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      showToast('Nama Sekolah wajib diisi!', 'red');
      return;
    }
    onSave(formData);
    showToast('Profil Sekolah & Media Sosial berhasil disimpan!');
  };

  const handleDelete = () => {
    if (confirm('Apakah Anda yakin ingin menghapus profil sekolah ini beserta media sosialnya?')) {
      onDelete();
      setFormData({
        nama: '',
        npsn: '',
        alamat: '',
        desa: '',
        kec: '',
        kab: '',
        prov: '',
        ta: '2024/2025',
        kodepos: '',
        youtube: '',
        tiktok: '',
        instagram: '',
        whatsapp: ''
      });
      showToast('Profil Sekolah dikosongkan!', 'orange');
    }
  };

  return (
    <div className="fade-in space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <School className="w-6 h-6 text-slate-700" />
          Profil Sekolah & Tahun Ajaran
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Atur informasi identitas sekolah umum yang akan dicetak di dalam lembar rapor.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-5">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Sekolah</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 mt-1 text-sm text-slate-800 transition-all outline-hidden"
              placeholder="Contoh: SD Negeri Rancaekek 3"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">NPSN</label>
            <input
              type="text"
              name="npsn"
              value={formData.npsn}
              onChange={handleChange}
              className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 mt-1 text-sm text-slate-800 transition-all outline-hidden"
              placeholder="Contoh: 10234567"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat Sekolah</label>
            <input
              type="text"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 mt-1 text-sm text-slate-800 transition-all outline-hidden"
              placeholder="Contoh: Jl. Raya Pendidikan No. 12"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kelurahan / Desa</label>
              <input
                type="text"
                name="desa"
                value={formData.desa}
                onChange={handleChange}
                className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                placeholder="Rancaekek Wetan"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kecamatan</label>
              <input
                type="text"
                name="kec"
                value={formData.kec}
                onChange={handleChange}
                className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                placeholder="Rancaekek"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kabupaten / Kota</label>
              <input
                type="text"
                name="kab"
                value={formData.kab}
                onChange={handleChange}
                className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                placeholder="Bandung"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Provinsi</label>
              <input
                type="text"
                name="prov"
                value={formData.prov}
                onChange={handleChange}
                className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                placeholder="Jawa Barat"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tahun Ajaran</label>
              <input
                type="text"
                name="ta"
                value={formData.ta}
                onChange={handleChange}
                className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                placeholder="2024/2025"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kode Pos</label>
              <input
                type="text"
                name="kodepos"
                value={formData.kodepos}
                onChange={handleChange}
                className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                placeholder="40394"
              />
            </div>
          </div>

          {/* Media Sosial Sekolah */}
          <div className="border-t border-slate-100 pt-5 mt-2 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-blue-600 rounded-xs"></span>
                Media Sosial Sekolah
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tambahkan profil atau link media sosial resmi sekolah.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1 text-slate-600">
                  <Youtube className="w-4 h-4 text-red-600" />
                  YouTube Link / Channel
                </label>
                <input
                  type="text"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleChange}
                  className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                  placeholder="https://youtube.com/c/nama_sekolah"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1 text-slate-600">
                  <Instagram className="w-4 h-4 text-pink-600" />
                  Instagram Username
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                  placeholder="Contoh: @sdn_lebak_3"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1 text-slate-600">
                  <Video className="w-4 h-4 text-slate-800" />
                  TikTok Link / Username
                </label>
                <input
                  type="text"
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleChange}
                  className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                  placeholder="Contoh: @sdn_lebak3_official"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1 text-slate-600">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  WhatsApp Sekolah
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                  placeholder="Contoh: 08123456789"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Profil
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-100 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
