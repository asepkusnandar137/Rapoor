import React, { useState, useEffect } from 'react';
import { Calendar, Save } from 'lucide-react';
import { TitiMangsa } from '../types';

interface TitiMangsaViewProps {
  initialTiti: TitiMangsa | null;
  onSave: (titi: TitiMangsa) => void;
  showToast: (msg: string, color?: 'green' | 'red' | 'orange') => void;
  kelas: string;
  rombel: string;
  semester: string;
}

export default function TitiMangsaView({
  initialTiti,
  onSave,
  showToast,
  kelas,
  rombel,
  semester
}: TitiMangsaViewProps) {
  const [formData, setFormData] = useState<TitiMangsa>({
    tempat: 'Bandung',
    tanggal: ''
  });

  useEffect(() => {
    if (initialTiti) {
      setFormData(initialTiti);
    } else {
      setFormData({
        tempat: 'Bandung',
        tanggal: ''
      });
    }
  }, [initialTiti, kelas, rombel, semester]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    showToast('Titi Mangsa Rapor berhasil disimpan!');
  };

  return (
    <div className="fade-in space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Calendar className="w-6 h-6 text-slate-700" />
          Titi Mangsa Rapor
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Atur lokasi kabupaten/kota dan tanggal penerbitan penyerahan buku laporan hasil belajar.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-5">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600 font-medium leading-relaxed">
          Titi Mangsa ditampilkan pada pojok kanan bawah lembaran rapor di atas tanda tangan Wali Kelas dan Kepala Sekolah.
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tempat Penerbitan (Kabupaten / Kota)</label>
            <input
              type="text"
              name="tempat"
              value={formData.tempat}
              onChange={(e) => setFormData(prev => ({ ...prev, tempat: e.target.value }))}
              className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 mt-1 text-sm text-slate-800 transition-all outline-hidden"
              placeholder="Contoh: Bandung"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Penerbitan</label>
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={(e) => setFormData(prev => ({ ...prev, tanggal: e.target.value }))}
              className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-1.5 mt-1 text-sm text-slate-800 transition-all outline-hidden"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-100 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-xs cursor-pointer border-0"
          >
            <Save className="w-4 h-4" />
            Simpan Titi Mangsa
          </button>
        </div>
      </form>
    </div>
  );
}
