import React from 'react';
import { Printer, TableProperties } from 'lucide-react';
import { Student, SchoolProfile, GuruProfile, KepalaSekolahProfile, TitiMangsa, SubjectGrade } from '../types';
import { MAPEL } from '../data';

interface RekapitulasiNilaiViewProps {
  students: Student[];
  schoolProfile: SchoolProfile | null;
  guruProfile: GuruProfile | null;
  kepalaSekolah: KepalaSekolahProfile | null;
  titiMangsa: TitiMangsa | null;
  loadGrade: (key: string) => SubjectGrade;
  kelas: string;
  rombel: string;
  semester: string;
}

export default function RekapitulasiNilaiView({
  students,
  schoolProfile,
  guruProfile,
  kepalaSekolah,
  titiMangsa,
  loadGrade,
  kelas,
  rombel,
  semester
}: RekapitulasiNilaiViewProps) {

  if (students.length === 0) {
    return (
      <div className="fade-in space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <TableProperties className="w-6 h-6 text-slate-700" />
            Rekapitulasi Nilai Kelas
          </h2>
          <p className="text-sm text-slate-500 mt-1">Kelas {kelas}{rombel} • Semester {semester}</p>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-400 font-medium shadow-xs">
          Silakan tambahkan data peserta didik terlebih dahulu di menu "Data Peserta Didik".
        </div>
      </div>
    );
  }

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

  // Pre-calculate final grades of students across subjects
  const studentLedger = students.map((student, studentIdx) => {
    const subjectGrades: { [key: number]: number } = {};
    let totalScoreSum = 0;

    MAPEL.forEach((_, mapelIdx) => {
      const key = `nilai_${studentIdx}_${mapelIdx}`;
      const grades = loadGrade(key) || {};

      let totalLMScore = 0;
      for (let lm = 1; lm <= 5; lm++) {
        let lmSum = 0;
        for (let tp = 1; tp <= 4; tp++) {
          lmSum += parseFloat(grades[`lm${lm}_tp${tp}`] || '0');
        }
        totalLMScore += lmSum / 4;
      }

      const overallLMAvg = totalLMScore / 5;
      const ats = parseFloat(grades.ats || '0');
      const sas = parseFloat(grades.sas || '0');

      const finalScore = (overallLMAvg + ats + sas) / 3;
      subjectGrades[mapelIdx] = finalScore;
      totalScoreSum += finalScore;
    });

    const averageScore = totalScoreSum / MAPEL.length;
    return {
      nama: student.nama,
      grades: subjectGrades,
      average: averageScore
    };
  });

  return (
    <div className="fade-in space-y-6">
      {/* Action panel (hidden on print) */}
      <div className="no-print bg-white rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <TableProperties className="w-5 h-5 text-slate-700" />
            Rekapitulasi Capaian Nilai Kelas {kelas}{rombel}
          </h2>
          <p className="text-xs text-slate-550 mt-1">
            Unduh atau cetak ledger nilai rapor gabungan seluruh mata pelajaran.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-xs cursor-pointer border-0 w-full sm:w-auto justify-center select-none"
        >
          <Printer className="w-4 h-4" />
          Cetak Rekap Nilai (PDF)
        </button>
      </div>

      {/* Styled Table Ledgers (printable) */}
      <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-xs overflow-hidden print-page space-y-6">
        <div className="text-center border-b pb-4">
          <h2 className="text-base font-white font-black text-slate-800 uppercase tracking-widest leading-none">
            REKAPITULASI HASIL BELAJAR SISWA
          </h2>
          <p className="text-[11px] font-semibold text-slate-500 uppercase mt-1">
            {schoolProfile ? schoolProfile.nama : 'SD Negeri'} • TAHUN AJARAN: {schoolProfile ? schoolProfile.ta : '-'}
          </p>
          <p className="text-[10px] font-bold text-slate-400 pl-0.5 mt-0.5 uppercase">
            KELAS / ROMBEL: {kelas} {rombel} • SEMESTER: {semester}
          </p>
        </div>

        {/* Ledger Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-300 font-extrabold text-center">
                <th className="border border-slate-300 px-2 py-2 w-10">No</th>
                <th className="border border-slate-300 px-3 py-2 text-left w-48">Nama Siswa</th>
                {MAPEL.map((mapel, index) => {
                  const label = mapel.substring(0, 12);
                  return (
                    <th
                      key={index}
                      className="border border-slate-300 px-1 py-2 text-center text-[10px]"
                      style={{ minWidth: '45px' }}
                      title={mapel}
                    >
                      {label}..
                    </th>
                  );
                })}
                <th className="border border-slate-300 px-2 py-2 text-center w-20 bg-blue-55/40 font-black">RATA</th>
              </tr>
            </thead>
            <tbody>
              {studentLedger.map((row, sIdx) => (
                <tr key={sIdx} className="border-b border-slate-300 hover:bg-slate-50/10 h-10">
                  <td className="border border-slate-300 px-2 py-1 text-center text-slate-400 font-bold">{sIdx + 1}</td>
                  <td className="border border-slate-300 px-3 py-1 font-bold text-slate-800 text-left">{row.nama}</td>
                  {MAPEL.map((_, mIdx) => {
                    const sc = row.grades[mIdx];
                    return (
                      <td key={mIdx} className="border border-slate-300 px-1 py-1 text-center font-mono font-semibold text-slate-700">
                        {sc > 0 ? sc.toFixed(0) : '-'}
                      </td>
                    );
                  })}
                  <td className="border border-slate-300 px-2 py-1 text-center font-black text-blue-900 bg-blue-50/20 text-sm">
                    {row.average > 0 ? row.average.toFixed(1) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footers Signed release */}
        <div className="text-xs pt-8">
          <div className="grid grid-cols-2 gap-8 text-center">
            <div>
              <p className="font-bold text-slate-500 uppercase text-[10px] tracking-wider mb-1">Mengetahui,</p>
              <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mt-0.5">Kepala Sekolah</p>
              
              <div className="h-16 shrink-0"></div>
              
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
              
              <div className="h-16 shrink-0"></div>
              
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
