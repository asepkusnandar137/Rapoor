import React, { useState, useEffect } from 'react';
import { Save, Trash2, Award } from 'lucide-react';
import { KepalaSekolahProfile } from '../types';

interface ProfilKepalaSekolahViewProps {
  initialProfile: KepalaSekolahProfile | null;
  onSave: (profile: KepalaSekolahProfile) => void;
  onDelete: () => void;
  showToast: (msg: string, color?: 'green' | 'red' | 'orange') => void;
}

export default function ProfilKepalaSekolahView({
  initialProfile,
  onSave,
  onDelete,
  showToast
}: ProfilKepalaSekolahViewProps) {
  const [formData, setFormData] = useState<KepalaSekolahProfile>({
    ks: '',
    nip_ks: ''
  });

  useEffect(() => {
    if (initialProfile) {
      setFormData(initialProfile);
    } else {
      setFormData({
        ks: '',
        nip_ks: ''
      });
    }
  }, [initialProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    showToast('Profil Kepala Sekolah berhasil disimpan secara global!');
  };

  const handleDelete = () => {
    if (confirm('Apakah Anda yakin ingin menghapus profil kepala sekolah? Ini akan mengosongkan data kepala sekolah di semua kelas.')) {
      onDelete();
      setFormData({
        ks: '',
        nip_ks: ''
      });
      showToast('Profil Kepala Sekolah dikosongkan!', 'orange');
    }
  };

  return (
    <div className="fade-in space-y-6 max-w-2xl" id="profil-ks-view">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Award className="w-6 h-6 text-slate-700 font-bold" />
          Profil Kepala Sekolah
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Atur kepala sekolah penandatangan laporan rapor tingkat satuan pendidikan.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-5">
        <div className="bg-blue-50/50 text-blue-800 p-4 rounded-xl border border-blue-100 text-xs font-semibold">
          💡 Profil Kepala Sekolah disimpan secara <span className="underline">global</span> dan akan otomatis terkoneksi langsung ke semua jenjang kelas, rombel, maupun semester.
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap Kepala Sekolah (dengan gelar)</label>
              <input
                type="text"
                name="ks"
                value={formData.ks}
                onChange={handleChange}
                className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                placeholder="Contoh: Dra. Endang Lestari, M.Pd."
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">NIP Kepala Sekolah</label>
              <input
                type="text"
                name="nip_ks"
                value={formData.nip_ks}
                onChange={handleChange}
                className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                placeholder="NIP: 1974XXXXXXXXXXXXXX"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Reset Profil
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-100 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Simpan Kepala Sekolah
          </button>
        </div>
      </form>
    </div>
  );
}
