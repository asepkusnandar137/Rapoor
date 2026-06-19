import React, { useState, useEffect } from 'react';
import { Trophy, Save, Trash2 } from 'lucide-react';
import { Student, ExtracurricularGrade } from '../types';
import { EKSKUL, NILAI_EKSKUL } from '../data';

interface NilaiEkskulViewProps {
  students: Student[];
  initialEkskul: ExtracurricularGrade | null;
  onSave: (ekskul: ExtracurricularGrade) => void;
  onDelete: () => void;
  showToast: (msg: string, color?: 'green' | 'red' | 'orange') => void;
  kelas: string;
  rombel: string;
}

export default function NilaiEkskulView({
  students,
  initialEkskul,
  onSave,
  onDelete,
  showToast,
  kelas,
  rombel
}: NilaiEkskulViewProps) {
  const [evalState, setEvalState] = useState<ExtracurricularGrade>({});

  useEffect(() => {
    if (initialEkskul) {
      setEvalState(initialEkskul);
    } else {
      setEvalState({});
    }
  }, [initialEkskul, kelas, rombel]);

  const handleSelectChange = (studentIdx: number, ekskulIdx: number, val: string) => {
    const key = `${studentIdx}_${ekskulIdx}`;
    setEvalState(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    onSave(evalState);
    showToast('Nilai Ekstrakurikuler berhasil disimpan!');
  };

  const handleClear = () => {
    if (confirm('Apakah Anda yakin ingin menghapus seluruh nilai ekstrakurikuler kelas ini?')) {
      onDelete();
      setEvalState({});
      showToast('Nilai Ekstrakurikuler dibersihkan!', 'orange');
    }
  };

  if (students.length === 0) {
    return (
      <div className="fade-in space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-slate-700" />
            Nilai Ekstrakurikuler
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
          <Trophy className="w-6 h-6 text-slate-700" />
          Nilai Ekstrakurikuler
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Isi nilai partisipasi dan predikat capaian siswa dalam kegiatan ekstrakurikuler Kelas {kelas}{rombel}.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-16 text-center">No</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Peserta Didik</th>
                {EKSKUL.map((ekskulName, idx) => (
                  <th key={idx} className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    {ekskulName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {students.map((student, sIdx) => (
                <tr key={sIdx} className="hover:bg-slate-50/20 transition-colors">
                  <td className="px-5 py-3.5 text-center font-semibold text-slate-400">{sIdx + 1}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-700">{student.nama}</td>
                  {EKSKUL.map((_, eIdx) => {
                    const key = `${sIdx}_${eIdx}`;
                    return (
                      <td key={eIdx} className="px-5 py-3.5 text-center">
                        <select
                          value={evalState[key] || ''}
                          onChange={(e) => handleSelectChange(sIdx, eIdx, e.target.value)}
                          className="border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-2 py-1 bg-white text-xs text-slate-700 font-medium"
                        >
                          <option value="">- Tidak Ikut -</option>
                          {NILAI_EKSKUL.map(pred => (
                            <option key={pred} value={pred}>{pred}</option>
                          ))}
                        </select>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex gap-2 justify-end">
          <button
            onClick={handleClear}
            className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer border-0"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Semua Nilai
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-100 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-xs cursor-pointer border-0"
          >
            <Save className="w-4 h-4" />
            Simpan Nilai
          </button>
        </div>
      </div>
    </div>
  );
}
