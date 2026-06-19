import React, { useState, useEffect } from 'react';
import { ClipboardList, Save, Trash2 } from 'lucide-react';
import { Student, AttendanceRecord } from '../types';

interface AbsensiViewProps {
  students: Student[];
  initialAbsensi: AttendanceRecord | null;
  onSave: (absensi: AttendanceRecord) => void;
  onDelete: () => void;
  showToast: (msg: string, color?: 'green' | 'red' | 'orange') => void;
  kelas: string;
  rombel: string;
}

export default function AbsensiView({
  students,
  initialAbsensi,
  onSave,
  onDelete,
  showToast,
  kelas,
  rombel
}: AbsensiViewProps) {
  const [absState, setAbsState] = useState<AttendanceRecord>({});

  useEffect(() => {
    if (initialAbsensi) {
      setAbsState(initialAbsensi);
    } else {
      setAbsState({});
    }
  }, [initialAbsensi, kelas, rombel]);

  const handleNoChange = (studentIdx: number, type: 's' | 'i' | 'a', value: string) => {
    let numeric = parseInt(value, 10);
    if (!isNaN(numeric) && numeric < 0) {
      value = '0';
    }
    const key = `${type}_${studentIdx}`;
    setAbsState(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(absState);
    showToast('Data Absensi siswa berhasil disimpan!');
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mengosongkan riwayat ketidakhadiran kelas ini?')) {
      onDelete();
      setAbsState({});
      showToast('Ketidakhadiran dibersihkan', 'orange');
    }
  };

  if (students.length === 0) {
    return (
      <div className="fade-in space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-slate-700" />
            Kehadiran / Absensi
          </h2>
          <p className="text-sm text-slate-500 mt-1">Kelas {kelas}{rombel}</p>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-400 font-medium shadow-xs">
          Silakan tambahkan data peserta didik terlebih dahulu di menu "Data Peserta Didik".
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-slate-700" />
          Kehadiran / Absensi Siswa
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Isi rekapitulasi jumlah hari ketidakhadiran siswa dalam kurun waktu semester ini.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-16 text-center">No</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-32">Sakit (Hari)</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-32">Izin (Hari)</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-32">Tanpa Keterangan / Alpa (Hari)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {students.map((student, idx) => (
                <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                  <td className="px-5 py-3.5 text-center font-semibold text-slate-400">{idx + 1}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-700">{student.nama}</td>
                  
                  <td className="px-5 py-3.5 text-center">
                    <input
                      type="number"
                      min="0"
                      value={absState[`s_${idx}`] || '0'}
                      onChange={(e) => handleNoChange(idx, 's', e.target.value)}
                      className="w-20 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-2 py-1 text-center font-mono text-sm"
                    />
                  </td>

                  <td className="px-5 py-3.5 text-center">
                    <input
                      type="number"
                      min="0"
                      value={absState[`i_${idx}`] || '0'}
                      onChange={(e) => handleNoChange(idx, 'i', e.target.value)}
                      className="w-20 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-2 py-1 text-center font-mono text-sm"
                    />
                  </td>

                  <td className="px-5 py-3.5 text-center">
                    <input
                      type="number"
                      min="0"
                      value={absState[`a_${idx}`] || '0'}
                      onChange={(e) => handleNoChange(idx, 'a', e.target.value)}
                      className="w-20 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-2 py-1 text-center font-mono text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex gap-2 justify-end">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer border-0"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Absensi
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-100 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-xs cursor-pointer border-0"
          >
            <Save className="w-4 h-4" />
            Simpan Absensi
          </button>
        </div>
      </div>
    </div>
  );
}
