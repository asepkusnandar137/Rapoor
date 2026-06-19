import React, { useState, useEffect } from 'react';
import { Calculator, Save, Trash2, ArrowRight } from 'lucide-react';
import { Student, SubjectGrade } from '../types';
import { MAPEL } from '../data';

interface RekapNilaiViewProps {
  students: Student[];
  getGradeKey: (siswaIdx: number, mapelIdx: number) => string;
  loadGrade: (key: string) => SubjectGrade;
  saveGrade: (key: string, grade: SubjectGrade) => void;
  deleteGrade: (key: string) => void;
  showToast: (msg: string, color?: 'green' | 'red' | 'orange') => void;
  kelas: string;
  rombel: string;
  semester: string;
}

export default function RekapNilaiView({
  students,
  getGradeKey,
  loadGrade,
  saveGrade,
  deleteGrade,
  showToast,
  kelas,
  rombel,
  semester
}: RekapNilaiViewProps) {
  const [selectedSiswaIdx, setSelectedSiswaIdx] = useState<number>(0);
  const [selectedMapelIdx, setSelectedMapelIdx] = useState<number>(0);
  const [gradeState, setGradeState] = useState<SubjectGrade>({});

  const currentKey = getGradeKey(selectedSiswaIdx, selectedMapelIdx);

  // Sync state when selection changes
  useEffect(() => {
    if (students.length > 0) {
      const loaded = loadGrade(currentKey);
      setGradeState(loaded || {});
    }
  }, [selectedSiswaIdx, selectedMapelIdx, students, currentKey]);

  // If no students, display warning
  if (students.length === 0) {
    return (
      <div className="fade-in space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Rekap Nilai</h2>
          <p className="text-sm text-slate-500 mt-1">Kelas {kelas}{rombel} • Semester {semester}</p>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-400 font-medium shadow-xs">
          Silakan tambahkan data peserta didik terlebih dahulu di menu "Data Peserta Didik".
        </div>
      </div>
    );
  }

  const handleCellChange = (lm: number, tp: number, value: string) => {
    // clamp value between 0 and 100
    let numeric = parseFloat(value);
    if (!isNaN(numeric)) {
      if (numeric < 0) value = '0';
      if (numeric > 100) value = '100';
    }
    const cellKey = `lm${lm}_tp${tp}`;
    setGradeState(prev => ({ ...prev, [cellKey]: value }));
  };

  const handleSpecialChange = (field: 'ats' | 'sas', value: string) => {
    let numeric = parseFloat(value);
    if (!isNaN(numeric)) {
      if (numeric < 0) value = '0';
      if (numeric > 100) value = '100';
    }
    setGradeState(prev => ({ ...prev, [field]: value }));
  };

  // Calculations
  const getLMAverage = (lm: number) => {
    let sum = 0;
    let count = 0;
    for (let tp = 1; tp <= 4; tp++) {
      const cellVal = parseFloat(gradeState[`lm${lm}_tp${tp}`] || '');
      if (!isNaN(cellVal)) {
        sum += cellVal;
        count++;
      }
    }
    if (count === 0) return null;
    return sum / 4; // Out of 4 targets
  };

  let totalLMScore = 0;
  let validLMCount = 0;
  for (let lm = 1; lm <= 5; lm++) {
    const avg = getLMAverage(lm);
    if (avg !== null) {
      totalLMScore += avg;
      validLMCount++;
    }
  }

  const overallLMAvg = validLMCount > 0 ? totalLMScore / 5 : 0;
  const atsScore = parseFloat(gradeState.ats || '');
  const sasScore = parseFloat(gradeState.sas || '');

  const validAts = isNaN(atsScore) ? 0 : atsScore;
  const validSas = isNaN(sasScore) ? 0 : sasScore;

  // Formula: (Rata-Rata LM + ATS + SAS) / 3
  const finalReportGrade = (overallLMAvg + validAts + validSas) / 3;

  const handleSave = () => {
    saveGrade(currentKey, gradeState);
    showToast(`Nilai ${students[selectedSiswaIdx].nama} berhasil disimpan!`);
  };

  const handleReset = () => {
    if (confirm(`Apakah Anda yakin ingin menghapus seluruh nilai ${MAPEL[selectedMapelIdx]} untuk ${students[selectedSiswaIdx].nama}?`)) {
      deleteGrade(currentKey);
      setGradeState({});
      showToast('Nilai kelas berhasil dibersihkan!', 'orange');
    }
  };

  return (
    <div className="fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Calculator className="w-6 h-6 text-slate-700" />
          Rekap Nilai Siswa
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Pengisian nilai lingkup materi (LM), asesmen tengah semester (ATS), dan asesmen akhir semester (SAS).
        </p>
      </div>

      {/* Selectors Panel */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pilih Peserta Didik</label>
          <select
            value={selectedSiswaIdx}
            onChange={(e) => setSelectedSiswaIdx(parseInt(e.target.value, 10))}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1.5 text-sm bg-white text-slate-800 font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-hidden cursor-pointer"
          >
            {students.map((student, idx) => (
              <option key={idx} value={idx}>{student.nama}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pilih Mata Pelajaran</label>
          <select
            value={selectedMapelIdx}
            onChange={(e) => setSelectedMapelIdx(parseInt(e.target.value, 10))}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1.5 text-sm bg-white text-slate-800 font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-hidden cursor-pointer"
          >
            {MAPEL.map((mapel, idx) => (
              <option key={idx} value={idx}>{mapel}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grade Table Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">{MAPEL[selectedMapelIdx]}</h3>
          <span className="text-xs px-3 py-1 bg-slate-100 text-slate-500 font-bold rounded-full">
            Kurikulum Merdeka
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Lingkup Materi</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">TP 1</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">TP 2</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">TP 3</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">TP 4</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center bg-slate-50/50">Rata-rata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {[1, 2, 3, 4, 5].map(lm => {
                const avg = getLMAverage(lm);
                return (
                  <tr key={lm} className="hover:bg-slate-50/20 transition-colors">
                    <td className="px-5 py-3 font-bold text-slate-700">Lingkup Materi {lm}</td>
                    {[1, 2, 3, 4].map(tp => (
                      <td key={tp} className="px-5 py-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={gradeState[`lm${lm}_tp${tp}`] || ''}
                          onChange={(e) => handleCellChange(lm, tp, e.target.value)}
                          placeholder="-"
                          className="w-16 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-2 py-1 text-center font-mono text-sm"
                        />
                      </td>
                    ))}
                    <td className="px-5 py-3 text-center font-bold text-slate-800 bg-slate-50/30">
                      {avg !== null ? avg.toFixed(1) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Lower assessment inputs & Final summary grades */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rata-rata LM (50% dari TP)</label>
              <div className="w-full bg-slate-100 border border-slate-200 text-slate-600 rounded-xl px-4 py-2.5 mt-1 text-sm font-semibold text-center font-mono">
                {overallLMAvg > 0 ? overallLMAvg.toFixed(1) : '0.0'}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nilai ATS (Sumatif Tengah Smt)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={gradeState.ats || ''}
                onChange={(e) => handleSpecialChange('ats', e.target.value)}
                placeholder="-"
                className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 mt-1 text-sm font-semibold text-center font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nilai SAS (Sumatif Akhir Smt)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={gradeState.sas || ''}
                onChange={(e) => handleSpecialChange('sas', e.target.value)}
                placeholder="-"
                className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 mt-1 text-sm font-semibold text-center font-mono"
              />
            </div>
          </div>

          {/* Value result alert */}
          <div className="bg-blue-600 text-white rounded-xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium opacity-90">Kalkulasi Nilai Akhir Rapor:</span>
              <span className="text-xs bg-blue-700/60 font-bold px-2 py-0.5 rounded-full border border-blue-400/30">
                (RataLM + ATS + SAS) / 3
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xl font-black">
              <span>Nilai Rapor</span>
              <ArrowRight className="w-5 h-5 opacity-70" />
              <span className="bg-white text-blue-800 px-3 py-1 rounded-lg text-lg">
                {finalReportGrade > 0 ? finalReportGrade.toFixed(1) : '-'}
              </span>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer border-0"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Nilai
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
    </div>
  );
}
