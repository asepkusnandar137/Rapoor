import React, { useState } from 'react';
import { Printer, Camera, BookOpen } from 'lucide-react';
import { Student, SchoolProfile, GuruProfile, KepalaSekolahProfile, TitiMangsa } from '../types';

interface SampulRaporViewProps {
  students: Student[];
  schoolProfile: SchoolProfile | null;
  guruProfile: GuruProfile | null;
  kepalaSekolah: KepalaSekolahProfile | null;
  titiMangsa: TitiMangsa | null;
  uploadedPhotos: { [key: number]: string };
  kelas: string;
  rombel: string;
  semester: string;
}

export default function SampulRaporView({
  students,
  schoolProfile,
  guruProfile,
  kepalaSekolah,
  titiMangsa,
  uploadedPhotos,
  kelas,
  rombel,
  semester
}: SampulRaporViewProps) {
  const [selectedSiswaIdx, setSelectedSiswaIdx] = useState<number>(0);

  if (students.length === 0) {
    return (
      <div className="fade-in space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-slate-700" />
            Sampul Rapor
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
  const photo = uploadedPhotos[selectedSiswaIdx] || '';

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

  return (
    <div className="fade-in space-y-6">
      {/* Control Panel */}
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
          Cetak Rapor (PDF)
        </button>
      </div>

      {/* Styled Printable Cover Card */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl max-w-2xl mx-auto shadow-md overflow-hidden print-page">
        <div className="p-12 text-center space-y-8">
          {/* Header Sekolah */}
          <div className="border-b-2 border-slate-800 pb-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">
              PEMERINTAH KABUPATEN LEBAK
            </p>
            <p className="text-sm font-black text-slate-800 uppercase tracking-wider leading-relaxed mt-1.5">
              DINAS PENDIDIKAN
            </p>
            <p className="text-base font-black text-blue-900 uppercase tracking-wide leading-relaxed mt-1.5">
              UPTD SATUAN PENDIDIKAN {schoolProfile ? schoolProfile.nama.toUpperCase() : 'NAMA SEKOLAH DASAR'}
            </p>
            <p className="text-xs text-slate-500 font-semibold mt-2 font-mono">
              NPSN: {schoolProfile ? schoolProfile.npsn : '-'}
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              {schoolProfile ? `${schoolProfile.alamat}, Kel. ${schoolProfile.desa}, Kec. ${schoolProfile.kec}, Kab. ${schoolProfile.kab}, Prov. ${schoolProfile.prov} ${schoolProfile.kodepos}` : 'Alamat Sekolah belum diisi'}
            </p>
          </div>

          {/* Judul Rapor */}
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-blue-950 uppercase tracking-wide">
              Laporan Hasil Belajar
            </h1>
            <p className="text-xl font-bold text-blue-800/90 uppercase tracking-widest pl-1">
              Peserta Didik Sekolah Dasar (SD)
            </p>
            <div className="pt-2 flex justify-center gap-4 text-xs font-bold text-slate-500">
              <span className="px-3 py-1 bg-slate-50 border rounded-full">
                Tahun Ajaran: {schoolProfile ? schoolProfile.ta : '-'}
              </span>
              <span className="px-3 py-1 bg-slate-50 border rounded-full">
                Semester: {semester}
              </span>
            </div>
          </div>

          {/* Foto Siswa */}
          <div className="py-2 flex justify-center">
            {photo ? (
              <div className="w-32 h-40 rounded-xl overflow-hidden border-2 border-slate-300 shadow-md transform rotate-[-0.5deg]">
                <img src={photo} alt={activeStudent.nama} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-32 h-40 bg-slate-50 text-slate-300 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 shrink-0 shadow-inner">
                <Camera className="w-8 h-8 opacity-60" />
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Foto 3x4</span>
              </div>
            )}
          </div>

          {/* Data Siswa */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-6 text-left max-w-lg mx-auto shadow-xs text-sm text-slate-700">
            <div className="text-center font-black text-blue-900 text-base uppercase border-b border-slate-200 pb-3 mb-4">
              {activeStudent.nama}
            </div>

            <table className="w-full border-collapse">
              <tbody>
                <tr className="align-baseline">
                  <td className="w-40 font-bold text-slate-500 py-1.5 uppercase text-xs tracking-wider">Nomor Induk Siswa</td>
                  <td className="w-4 text-slate-400 py-1.5">:</td>
                  <td className="font-bold text-slate-800 font-mono text-xs py-1.5">{activeStudent.nis || '-'}</td>
                </tr>
                <tr className="align-baseline">
                  <td className="font-bold text-slate-500 py-1.5 uppercase text-xs tracking-wider">NIS Nasional</td>
                  <td className="text-slate-400 py-1.5">:</td>
                  <td className="font-bold text-slate-800 font-mono text-xs py-1.5">{activeStudent.nisn || '-'}</td>
                </tr>
                <tr className="align-baseline">
                  <td className="font-bold text-slate-500 py-1.5 uppercase text-xs tracking-wider">Rombongan Belajar</td>
                  <td className="text-slate-400 py-1.5">:</td>
                  <td className="font-bold text-slate-800 py-1.5">Kelas {kelas}{rombel}</td>
                </tr>
                <tr className="align-baseline">
                  <td className="font-bold text-slate-500 py-1.5 uppercase text-xs tracking-wider">Tempat, Tgl Lahir</td>
                  <td className="text-slate-400 py-1.5">:</td>
                  <td className="font-semibold text-slate-800 py-1.5">
                    {activeStudent.tempat_lahir || '-'}, {formatDateId(activeStudent.tgl_lahir)}
                  </td>
                </tr>
                <tr className="align-baseline">
                  <td className="font-bold text-slate-500 py-1.5 uppercase text-xs tracking-wider">Alamat Peserta Didik</td>
                  <td className="text-slate-400 py-1.5">:</td>
                  <td className="font-semibold text-slate-800 py-1.5 leading-relaxed">{activeStudent.alamat || '-'}</td>
                </tr>
                <tr className="align-baseline border-t border-dashed border-slate-200 pt-1.5 mt-1.5 block col-span-3">
                  <td className="font-bold text-slate-500 py-1.5 uppercase text-xs tracking-wider w-40 inline-block">Nama Wali / Orang Tua</td>
                  <td className="text-slate-400 py-1.5 w-4 inline-block">:</td>
                  <td className="font-semibold text-slate-800 py-1.5 inline-block">
                    Ayah: <span className="font-bold">{activeStudent.ayah || '-'}</span> • Ibu: <span className="font-bold">{activeStudent.ibu || '-'}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Titi Mangsa & Tanda Tangan */}
          <div className="text-sm pt-8 flex flex-col items-center">
            <div className="text-center w-72">
              <p className="text-slate-600 font-semibold mb-6">
                {titiMangsa ? titiMangsa.tempat : '..........'}, {titiMangsa && titiMangsa.tanggal ? formatDateId(titiMangsa.tanggal) : '...................'}
              </p>
              
              <p className="font-bold text-slate-500 text-xs uppercase tracking-wider">Mengetahui,</p>
              <p className="font-bold text-slate-800 text-xs uppercase tracking-wider mt-0.5">Kepala Sekolah</p>
              
              <div className="h-20 shrink-0"></div> {/* Sign gap */}
              
              <p className="font-bold text-slate-850 border-b border-slate-800 inline-block px-4 pb-0.5">
                {kepalaSekolah ? kepalaSekolah.ks : '...................................................'}
              </p>
              <p className="text-[11px] font-mono text-slate-500 mt-1">
                NIP. {kepalaSekolah ? (kepalaSekolah.nip_ks || '-') : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
