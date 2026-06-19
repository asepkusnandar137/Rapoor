import React, { useState, useEffect } from 'react';
import { Save, Trash2, UserCheck } from 'lucide-react';
import { GuruProfile } from '../types';

interface ProfilGuruViewProps {
  initialProfile: GuruProfile | null;
  onSave: (profile: GuruProfile) => void;
  onDelete: () => void;
  showToast: (msg: string, color?: 'green' | 'red' | 'orange') => void;
  kelas: string;
  rombel: string;
}

export default function ProfilGuruView({
  initialProfile,
  onSave,
  onDelete,
  showToast,
  kelas,
  rombel
}: ProfilGuruViewProps) {
  const [formData, setFormData] = useState<GuruProfile>({
    guru: '',
    nip_guru: '',
    ks: '',
    nip_ks: ''
  });

  useEffect(() => {
    if (initialProfile) {
      setFormData(prev => ({
        ...prev,
        guru: initialProfile.guru || '',
        nip_guru: initialProfile.nip_guru || ''
      }));
    } else {
      setFormData({
        guru: '',
        nip_guru: '',
        ks: '',
        nip_ks: ''
      });
    }
  }, [initialProfile, kelas, rombel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    showToast('Profil Wali Kelas berhasil disimpan!');
  };

  const handleDelete = () => {
    if (confirm('Apakah Anda yakin ingin menghapus profil guru untuk kelas ini?')) {
      onDelete();
      setFormData({
        guru: '',
        nip_guru: '',
        ks: '',
        nip_ks: ''
      });
      showToast('Profil Guru dikosongkan!', 'orange');
    }
  };

  return (
    <div className="fade-in space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-slate-700" />
          Profil Guru Kelas (Wali Kelas)
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Atur wali kelas pendandatangan laporan rapor Kelas {kelas}{rombel}.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-5">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600 font-medium">
          Wali kelas terikat pada kombinasi kelas aktif (<span className="text-blue-600 font-bold">Kelas {kelas}{rombel}</span>). Nilai yang disimpan hanya berlaku pada tingkat kelas ini.
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap Guru (dengan gelar)</label>
              <input
                type="text"
                name="guru"
                value={formData.guru}
                onChange={handleChange}
                className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                placeholder="Contoh: Budi Santoso, S.Pd."
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">NIP Guru</label>
              <input
                type="text"
                name="nip_guru"
                value={formData.nip_guru}
                onChange={handleChange}
                className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                placeholder="NIP: 1985XXXXXXXXXXXXXX"
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
            Reset Guru
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
