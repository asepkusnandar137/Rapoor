import React, { useState } from 'react';
import { Printer, FileSpreadsheet } from 'lucide-react';
import { Student, SchoolProfile, GuruProfile, KepalaSekolahProfile, TitiMangsa, SubjectGrade, ExtracurricularGrade, AttendanceRecord } from '../types';
import { MAPEL, EKSKUL } from '../data';

interface CetakRaporViewProps {
  students: Student[];
  schoolProfile: SchoolProfile | null;
  guruProfile: GuruProfile | null;
  kepalaSekolah: KepalaSekolahProfile | null;
  titiMangsa: TitiMangsa | null;
  loadGrade: (key: string) => SubjectGrade;
  loadSavedTP: (mapelIdx: number, lm: number) => string[];
  initialEkskul: ExtracurricularGrade | null;
  initialAbsensi: AttendanceRecord | null;
  kelas: string;
  rombel: string;
  semester: string;
}

export default function CetakRaporView({
  students,
  schoolProfile,
  guruProfile,
  kepalaSekolah,
  titiMangsa,
  loadGrade,
  loadSavedTP,
  initialEkskul,
  initialAbsensi,
  kelas,
  rombel,
  semester
}: CetakRaporViewProps) {
  const [selectedSiswaIdx, setSelectedSiswaIdx] = useState<number>(0);

  if (students.length === 0) {
    return (
      <div className="fade-in space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Printer className="w-6 h-6 text-slate-700" />
            Cetak Lembar Rapor
          </h2>
          <p className="text-sm text-slate-500 mt-1">Kelas {kelas}{rombel} • Semester {semester}</p>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-400 font-medium shadow-xs">
          Silakan tambahkan data peserta didik terlebih dahulu di menu "Data Peserta Didik".
        </div>
      </div>
    );
  }

  const activeStudent = students[selectedSiswaIdx];

  const handlePrint = () => {
    window.print();
  };

  const formatDateId = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const day = parseInt(parts[2], 10);
          const mIndex = parseInt(parts[1], 10) - 1;
          const yr = parts[0];
          return `${day} ${months[mIndex]} ${yr}`;
        }
        return dateStr;
      }
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  // Compile subjects grading rows
  const generateSubjectRows = () => {
    return MAPEL.map((subjectName, mapelIdx) => {
      // 1. Load grade
      const gradeKey = `nilai_${selectedSiswaIdx}_${mapelIdx}`;
      const grades = loadGrade(gradeKey) || {};

      // 2. Calculate average of LM
      let totalLMAvg = 0;
      const allTpValues: { lm: number; tp: number; val: number }[] = [];

      for (let lm = 1; lm <= 5; lm++) {
        let lmSum = 0;
        for (let tp = 1; tp <= 4; tp++) {
          const v = parseFloat(grades[`lm${lm}_tp${tp}`] || '');
          const score = isNaN(v) ? 0 : v;
          lmSum += score;
          allTpValues.push({ lm, tp, val: score });
        }
        totalLMAvg += lmSum / 4;
      }

      const overallLMAvg = totalLMAvg / 5;
      const ats = parseFloat(grades.ats || '');
      const sas = parseFloat(grades.sas || '');

      const validAts = isNaN(ats) ? 0 : ats;
      const validSas = isNaN(sas) ? 0 : sas;

      const finalRaporScore = (overallLMAvg + validAts + validSas) / 3;

      // 3. Format description
      // Sort cell grades of target objectives to find highest and lowest
      const sortedTps = allTpValues.filter(x => x.val > 0).sort((a, b) => b.val - a.val);
      let deskripsi = '-';

      if (sortedTps.length >= 2) {
        const highest = sortedTps[0];
        const lowest = sortedTps[sortedTps.length - 1];

        // Retrieve TP text from database
        const savedHighestList = loadSavedTP(mapelIdx, highest.lm);
        const savedLowestList = loadSavedTP(mapelIdx, lowest.lm);

        const textHighest = savedHighestList && savedHighestList[highest.tp - 1] 
          ? savedHighestList[highest.tp - 1] 
          : `Menunjukkan penguasaan materi yang baik pada Lingkup Materi ${highest.lm} sub-kompetensi level ${highest.tp}`;
        
        const textLowest = savedLowestList && savedLowestList[lowest.tp - 1]
          ? savedLowestList[lowest.tp - 1]
          : `Perlu bimbingan lebih lanjut pada materi Lingkup Materi ${lowest.lm} sub-kompetensi level ${lowest.tp}`;

        // Truncate to match neat spacing in report sheet
        const trimH = textHighest.substring(0, 75);
        const trimL = textLowest.substring(0, 75);

        deskripsi = `Menunjukkan pencapaian sangat baik pada: ${trimH}... serta perlu pendampingan berkelanjutan dalam hal: ${trimL}...`;
      } else if (sortedTps.length === 1) {
        deskripsi = `Menunjukkan penguasaan dasar pada materi ${subjectName}. Disarankan penguatan belajar mandiri.`;
      }

      return (
        <tr key={mapelIdx} className="align-baseline border-b border-slate-300">
          <td className="border border-slate-300 px-3 py-2 text-xs text-slate-800">
            {mapelIdx === 11 ? <span className="font-bold">Mulok: </span> : ''}{subjectName}
          </td>
          <td className="border border-slate-300 px-2 py-2 text-center text-sm font-extrabold text-slate-900 bg-slate-50/20 w-16">
            {finalRaporScore > 0 ? finalRaporScore.toFixed(0) : '-'}
          </td>
          <td className="border border-slate-300 px-3 py-2 text-[11px] text-slate-600 leading-relaxed italic max-w-xs">
            {deskripsi}
          </td>
        </tr>
      );
    });
  };

  // Absences count
  const sSakit = initialAbsensi ? (initialAbsensi[`s_${selectedSiswaIdx}`] || '0') : '0';
  const sIzin = initialAbsensi ? (initialAbsensi[`i_${selectedSiswaIdx}`] || '0') : '0';
  const sAlpa = initialAbsensi ? (initialAbsensi[`a_${selectedSiswaIdx}`] || '0') : '0';

  return (
    <div className="fade-in space-y-6">
      {/* Control Actions (Hidden on Print) */}
      <div className="no-print bg-white rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pilih Siswa</label>
          <select
            value={selectedSiswaIdx}
            onChange={(e) => setSelectedSiswaIdx(parseInt(e.target.value, 10))}
            className="w-full sm:w-64 border border-slate-200 rounded-xl px-3 py-2 mt-1.5 text-sm bg-white text-slate-800 font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-hidden cursor-pointer"
          >
            {students.map((student, idx) => (
              <option key={idx} value={idx}>{student.nama}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-xs cursor-pointer border-0 w-full sm:w-auto justify-center select-none"
        >
          <Printer className="w-4 h-4" />
          Cetak Lembar Rapor (PDF)
        </button>
      </div>

      {/* Styled Printable Report Sheet */}
      <div className="bg-white border border-slate-300 rounded-2xl max-w-3xl mx-auto shadow-md overflow-hidden p-10 print-page space-y-6">
        
        {/* Header Block */}
        <div className="text-center border-b pb-4">
          <h2 className="text-md font-bold text-slate-800 uppercase tracking-widest leading-none">
            LAPORAN HASIL BELAJAR PESERTA DIDIK
          </h2>
          <p className="text-[11px] font-semibold text-slate-500 mt-1 uppercase">
            {schoolProfile ? schoolProfile.nama : 'SD Negeri'} • TAHUN AJARAN: {schoolProfile ? schoolProfile.ta : '-'}
          </p>
          <p className="text-[10px] font-bold text-slate-400 pl-0.5 mt-0.5 tracking-wider uppercase">
            Semester: {semester} • Fase {parseInt(kelas, 10) <= 2 ? 'A' : parseInt(kelas, 10) <= 4 ? 'B' : 'C'} (Kelas {kelas}{rombel})
          </p>
        </div>

        {/* Identity Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs font-semibold py-2">
          <div className="space-y-1">
            <div className="flex">
              <span className="w-24 text-slate-500">Nama Siswa</span>
              <span className="w-4 text-slate-400">:</span>
              <span className="text-slate-900 font-bold uppercase">{activeStudent.nama}</span>
            </div>
            <div className="flex">
              <span className="w-24 text-slate-500">NIS / NISN</span>
              <span className="w-4 text-slate-400">:</span>
              <span className="text-slate-850 font-mono">{activeStudent.nis || '-'} / {activeStudent.nisn || '-'}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex">
              <span className="w-24 text-slate-500">Kelas / Rombel</span>
              <span className="w-4 text-slate-400">:</span>
              <span className="text-slate-850">{kelas} {rombel}</span>
            </div>
            <div className="flex">
              <span className="w-24 text-slate-500">Semester</span>
              <span className="w-4 text-slate-400">:</span>
              <span className="text-slate-850">{semester}</span>
            </div>
          </div>
        </div>

        {/* A. Nilai Akademik */}
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">A. NILAI AKADEMIK SUMATIF</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-300 text-xs font-extrabold text-center">
                  <th className="border border-slate-300 px-3 py-2 text-left">Mata Pelajaran</th>
                  <th className="border border-slate-300 px-2 py-2 w-16">Nilai</th>
                  <th className="border border-slate-300 px-3 py-2 text-left">Deskripsi Capaian Kompetensi (Kurikulum Merdeka)</th>
                </tr>
              </thead>
              <tbody>
                {generateSubjectRows()}
              </tbody>
            </table>
          </div>
        </div>

        {/* B. Ekstrakurikuler */}
        <div className="space-y-2 pt-1">
          <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">B. EKSTRAKURIKULER</h3>
          <table className="w-full text-left border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-300 font-extrabold text-center">
                <th className="border border-slate-300 px-4 py-1.5 text-left">Kegiatan Ekstrakurikuler</th>
                <th className="border border-slate-300 px-4 py-1.5 w-40">Predikat</th>
              </tr>
            </thead>
            <tbody>
              {EKSKUL.map((ekskulName, idx) => {
                const val = initialEkskul ? (initialEkskul[`${selectedSiswaIdx}_${idx}`] || '') : '';
                return (
                  <tr key={idx} className="border-b border-slate-300">
                    <td className="border border-slate-300 px-4 py-1.5 text-slate-700 font-semibold">{ekskulName}</td>
                    <td className="border border-slate-300 px-4 py-1.5 text-center font-bold text-slate-800 bg-slate-50/10">
                      {val || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* C. Ketidakhadiran */}
        <div className="space-y-2 pt-1">
          <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">C. KETIDAKHADIRAN</h3>
          <table className="border-collapse border border-slate-300 text-xs w-64">
            <tbody>
              <tr className="border-b border-slate-300">
                <td className="border border-slate-300 px-4 py-1.5 font-semibold text-slate-700 w-32">Sakit</td>
                <td className="border border-slate-300 px-4 py-1.5 text-center font-bold font-mono text-slate-800 w-24">
                  {sSakit} Hari
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="border border-slate-300 px-4 py-1.5 font-semibold text-slate-700">Izin</td>
                <td className="border border-slate-300 px-4 py-1.5 text-center font-bold font-mono text-slate-800">
                  {sIzin} Hari
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="border border-slate-300 px-4 py-1.5 font-semibold text-slate-700">Alpa / Tanpa Keterangan</td>
                <td className="border border-slate-300 px-4 py-1.5 text-center font-bold font-mono text-slate-800">
                  {sAlpa} Hari
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signatures & Release Info Footer */}
        <div className="text-xs pt-8">
          <div className="grid grid-cols-2 gap-8 text-center">
            <div>
              <p className="font-bold text-slate-500 uppercase text-[10px] tracking-wider mb-1">Mengetahui,</p>
              <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mt-0.5">Kepala Sekolah</p>
              
              <div className="h-16 shrink-0"></div> {/* sign gap */}
              
              <p className="font-bold text-slate-850 border-b border-slate-800 inline-block px-4 pb-0.5">
                {kepalaSekolah ? kepalaSekolah.ks : '...................................................'}
              </p>
              <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                NIP. {kepalaSekolah ? (kepalaSekolah.nip_ks || '-') : '-'}
              </p>
            </div>

            <div>
              <p className="text-slate-600 font-semibold mb-1 text-[11px]">
                {titiMangsa ? titiMangsa.tempat : '..........'}, {titiMangsa && titiMangsa.tanggal ? formatDateId(titiMangsa.tanggal) : '...................'}
              </p>
              <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mt-0.5">Guru Kelas {kelas}{rombel}</p>
              
              <div className="h-16 shrink-0"></div> {/* sign gap */}
              
              <p className="font-bold text-slate-850 border-b border-slate-800 inline-block px-4 pb-0.5">
                {guruProfile ? guruProfile.guru : '...................................................'}
              </p>
              <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                NIP. {guruProfile ? (guruProfile.nip_guru || '-') : '-'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
