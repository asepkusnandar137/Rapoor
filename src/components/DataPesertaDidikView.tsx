import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Users, X, Calendar, MapPin, Layers, Download, Upload, FileSpreadsheet, Info, Check, AlertCircle } from 'lucide-react';
import { Student } from '../types';
import { AGAMA_LIST } from '../data';
import * as XLSX from 'xlsx';

interface DataPesertaDidikViewProps {
  students: Student[];
  onSave: (students: Student[]) => void;
  showToast: (msg: string, color?: 'green' | 'red' | 'orange') => void;
  kelas: string;
  rombel: string;
}

export default function DataPesertaDidikView({
  students,
  onSave,
  showToast,
  kelas,
  rombel
}: DataPesertaDidikViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  
  // Excel Import States
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [parsedImport, setParsedImport] = useState<Student[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [excelError, setExcelError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Student>({
    nama: '',
    nis: '',
    nisn: '',
    tempat_lahir: '',
    tgl_lahir: '',
    alamat: '',
    ayah: '',
    ibu: '',
    agama: 'Islam'
  });

  const openAddModal = () => {
    setEditIdx(null);
    setFormData({
      nama: '',
      nis: '',
      nisn: '',
      tempat_lahir: '',
      tgl_lahir: '',
      alamat: '',
      ayah: '',
      ibu: '',
      agama: 'Islam'
    });
    setModalOpen(true);
  };

  const openEditModal = (idx: number, student: Student) => {
    setEditIdx(idx);
    setFormData({ ...student });
    setModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      showToast('Nama Lengkap wajib diisi!', 'red');
      return;
    }
    
    let updatedStudents = [...students];
    if (editIdx !== null) {
      updatedStudents[editIdx] = formData;
      showToast('Data siswa berhasil diperbarui!');
    } else {
      updatedStudents.push(formData);
      showToast('Siswa baru berhasil ditambahkan!');
    }
    
    onSave(updatedStudents);
    setModalOpen(false);
  };

  const handleDelete = (idx: number) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data siswa "${students[idx].nama}"?`)) {
      const updated = students.filter((_, i) => i !== idx);
      onSave(updated);
      showToast('Data siswa berhasil dihapus!', 'orange');
    }
  };

  // Excels integration functions
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Nama Lengkap': 'Ahmad Fauzi',
        'NIS': '2425001',
        'NISN': '0123456789',
        'Tempat Lahir': 'Bandung',
        'Tanggal Lahir (YYYY-MM-DD)': '2013-05-12',
        'Alamat': 'Jl. Diponegoro No. 22, Bandung',
        'Nama Ayah': 'Supriatna',
        'Nama Ibu': 'Siti Aminah',
        'Agama': 'Islam'
      },
      {
        'Nama Lengkap': 'Sofia Caroline',
        'NIS': '2425002',
        'NISN': '0123456790',
        'Tempat Lahir': 'Jakarta',
        'Tanggal Lahir (YYYY-MM-DD)': '2013-08-24',
        'Alamat': 'Jl. Jendral Sudirman Kav. 12, Jakarta',
        'Nama Ayah': 'Andi Wijaya',
        'Nama Ibu': 'Hartati',
        'Agama': 'Kristen'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');
    
    // Set column widths so content is legible
    const wscols = [
      { wch: 25 }, // Nama Lengkap
      { wch: 15 }, // NIS
      { wch: 15 }, // NISN
      { wch: 15 }, // Tempat Lahir
      { wch: 25 }, // Tanggal Lahir (YYYY-MM-DD)
      { wch: 35 }, // Alamat
      { wch: 20 }, // Nama Ayah
      { wch: 20 }, // Nama Ibu
      { wch: 12 }  // Agama
    ];
    worksheet['!cols'] = wscols;

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(fileBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Template_Peserta_Didik_Kelas_${kelas}${rombel}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Template Excel berhasil diunduh!');
  };

  const processFile = (file: File) => {
    setExcelError(null);
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      showToast('Format file harus .xlsx atau .xls!', 'red');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);
        
        if (jsonData.length === 0) {
          showToast('Data dalam file Excel tidak terdeteksi atau kosong!', 'red');
          return;
        }

        const importedStudents: Student[] = jsonData.map((row: any) => {
          const findVal = (possibleKeys: string[]) => {
            for (const key of possibleKeys) {
              const foundKey = Object.keys(row).find(k => k.toLowerCase().trim() === key.toLowerCase().trim());
              if (foundKey) return String(row[foundKey]).trim();
            }
            return '';
          };

          const nama = findVal(['Nama Lengkap', 'Nama', 'Nama Siswa', 'Full Name']);
          const nis = findVal(['NIS', 'Nomor Induk Siswa', 'Nomor Induk']);
          const nisn = findVal(['NISN', 'Nomor Induk Siswa Nasional', 'Nis Nasional']);
          const tempat_lahir = findVal(['Tempat Lahir', 'Tempat']);
          
          let tgl_lahir = findVal(['Tanggal Lahir', 'Tgl Lahir', 'Tanggal Lahir (YYYY-MM-DD)', 'Tanggal Lahir(YYYY-MM-DD)', 'TglLahir', 'Date of Birth']);
          
          // Convert Excel date value to clean YYYY-MM-DD if needed
          if (tgl_lahir && !isNaN(Number(tgl_lahir)) && Number(tgl_lahir) > 10000) {
            try {
              const excelDate = Number(tgl_lahir);
              const date = new Date((excelDate - 25569) * 86400 * 1000);
              tgl_lahir = date.toISOString().split('T')[0];
            } catch {
              // keep value
            }
          } else if (tgl_lahir) {
            // Clean dd/mm/yyyy or dd-mm-yyyy formats to yyyy-mm-dd
            const parts = tgl_lahir.split(/[-/]/);
            if (parts.length === 3) {
              if (parts[2].length === 4) {
                const day = parts[0].padStart(2, '0');
                const month = parts[1].padStart(2, '0');
                const year = parts[2];
                tgl_lahir = `${year}-${month}-${day}`;
              } else if (parts[0].length === 4) {
                const year = parts[0];
                const month = parts[1].padStart(2, '0');
                const day = parts[2].padStart(2, '0');
                tgl_lahir = `${year}-${month}-${day}`;
              }
            }
          }

          const alamat = findVal(['Alamat Lengkap', 'Alamat', 'Address']);
          const ayah = findVal(['Nama Ayah', 'Ayah', 'Father Name', 'Father']);
          const ibu = findVal(['Nama Ibu', 'Ibu', 'Mother Name', 'Mother']);
          
          let agama = findVal(['Agama', 'Religion']);
          if (agama) {
            const matched = AGAMA_LIST.find(a => a.toLowerCase() === agama.toLowerCase());
            if (matched) {
              agama = matched;
            } else {
              agama = 'Islam'; // Default fallback
            }
          } else {
            agama = 'Islam';
          }

          return {
            nama,
            nis,
            nisn,
            tempat_lahir,
            tgl_lahir,
            alamat,
            ayah,
            ibu,
            agama
          };
        });

        // Filter lines that have at least some name
        const validImported = importedStudents.filter(s => s.nama);

        if (validImported.length === 0) {
          showToast('Tidak ada data siswa valid yang ditemukan di file Excel ini!', 'red');
          return;
        }

        setParsedImport(validImported);
        setImportModalOpen(true);
      } catch (err: any) {
        console.error(err);
        showToast('Gagal memproses file Excel: ' + (err.message || ''), 'red');
        setExcelError('Gagal memproses file Excel. Pastikan file tidak rusak.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // Complete Excel Import Integration (Merge/Replace choices)
  const executeImport = (mode: 'merge' | 'replace') => {
    if (mode === 'replace') {
      onSave(parsedImport);
      showToast(`Berhasil mengimpor ${parsedImport.length} siswa (Mengganti seluruh data lama)`);
    } else {
      // Merge: append and skip duplicates based on exact name + NIS matches
      const existingKeySet = new Set(students.map(s => `${s.nama.toLowerCase()}_${s.nis}`));
      const filteredNew = parsedImport.filter(s => !existingKeySet.has(`${s.nama.toLowerCase()}_${s.nis}`));
      
      onSave([...students, ...filteredNew]);
      showToast(`Berhasil menggabungkan ${filteredNew.length} siswa baru!`);
    }
    setImportModalOpen(false);
  };

  const formatDateId = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const months = [
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const day = parseInt(parts[2], 10);
        const monthIndex = parseInt(parts[1], 10) - 1;
        const year = parts[0];
        return `${day} ${months[monthIndex]} ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fade-in space-y-6" id="data-peserta-didik-wrapper">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-slate-700" />
            Data Peserta Didik
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Daftar siswa terdaftar pada Kelas {kelas}{rombel}.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-all shadow-xs cursor-pointer grow-0 select-none border-0"
        >
          <Plus className="w-4.5 h-4.5" />
          Tambah Siswa
        </button>
      </div>

      {/* Excel Options Dashboard Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">1. Unduh Template Excel</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Gunakan file template dengan format kolom yang telah disesuaikan agar proses pembacaan data berjalan lancar.
            </p>
          </div>
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center justify-center gap-2 border border-blue-200 text-blue-700 hover:bg-blue-50/70 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Unduh Template .XLSX
          </button>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`md:col-span-2 border-2 border-dashed rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-all ${
            dragOver
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-slate-200 hover:border-slate-300 bg-white shadow-xs'
          }`}
        >
          <div className="p-3 bg-slate-50 text-slate-400 rounded-full mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-xs text-slate-600 font-bold">
            Pilih atau Tarik File Excel Anda ke Sini
          </p>
          <p className="text-[10px] text-slate-400 mt-1 mb-4">
            Mendukung file berformat .xlsx dan .xls
          </p>
          
          <label className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer select-none">
            <Upload className="w-3.5 h-3.5" />
            Pilih File Excel
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="px-5 py-3 w-16 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">No</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">NIS / NISN</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Tempat / Tgl Lahir</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Agama</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 font-medium">
                    Belum ada data peserta didik untuk kelas ini. Gunakan panel di atas atau klik tombol "+ Tambah Siswa" untuk mengisi data.
                  </td>
                </tr>
              ) : (
                students.map((student, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-400 text-center">{idx + 1}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-800">{student.nama}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">
                      <div>NIS: {student.nis || '-'}</div>
                      <div>NISN: {student.nisn || '-'}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-700">{student.tempat_lahir || '-'}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{formatDateId(student.tgl_lahir)}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                        {student.agama}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(idx, student)}
                          className="p-1 px-2.5 rounded-lg border border-slate-100 text-blue-600 hover:bg-blue-50 hover:border-blue-100 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Ubah
                        </button>
                        <button
                          onClick={() => handleDelete(idx)}
                          className="p-1 px-2.5 rounded-lg border border-slate-100 text-red-600 hover:bg-red-50 hover:border-red-100 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Excel Import Preview Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col fade-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-blue-50/50">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg text-slate-850">
                  Konfirmasi Impor Data Siswa ({parsedImport.length} Siswa)
                </h3>
              </div>
              <button
                onClick={() => setImportModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer border-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Informasi:</span> Silakan tinjau kembali data di bawah ini sebelum memasukkan ke dalam daftar kelas. Anda dapat memilih untuk <span className="font-semibold text-slate-800 underline">menggabungkan</span> (menambahkan siswa baru tanpa menghapus data yang ada sekarang) atau <span className="font-semibold text-slate-850 underline">menimpa seluruh data lama</span>.
                </div>
              </div>

              <div className="border border-slate-150 rounded-xl overflow-hidden max-h-60 overflow-y-auto bg-white">
                <table className="w-full text-left border-collapse text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-150 font-bold text-slate-600 top-0 sticky z-10">
                    <tr>
                      <th className="px-3 py-2 text-center w-10">No</th>
                      <th className="px-3 py-2">Nama</th>
                      <th className="px-3 py-2 w-20">NIS</th>
                      <th className="px-3 py-2 w-24">TTL</th>
                      <th className="px-3 py-2 w-16">Agama</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedImport.map((st, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-center font-bold text-slate-400">{i + 1}</td>
                        <td className="px-3 py-2 font-bold text-slate-800">{st.nama}</td>
                        <td className="px-3 py-2 font-mono">{st.nis || '-'}</td>
                        <td className="px-3 py-2 text-slate-500">
                          {st.tempat_lahir ? `${st.tempat_lahir}, ` : ''}{st.tgl_lahir ? tgl_lahir => formatDateId(st.tgl_lahir) : '-'}
                        </td>
                        <td className="px-3 py-2">
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-slate-100 rounded-md">
                            {st.agama}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:justify-between items-center bg-slate-50/50 gap-3">
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-750 text-xs font-bold rounded-xl transition-all cursor-pointer border-0"
              >
                Kembali / Batal
              </button>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => executeImport('merge')}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer border-0 shadow-xs"
                >
                  Gabungkan Data (Merge)
                </button>
                <button
                  type="button"
                  onClick={() => executeImport('replace')}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer border-0 shadow-xs"
                >
                  Timpa Semua Data (Overwrite)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog for Manual Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all w-full">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col fade-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800">
                {editIdx !== null ? 'Ubah Data Peserta Didik' : 'Tambah Peserta Didik'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer border-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                  placeholder="Contoh: Muhammad Raihan"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">NIS</label>
                  <input
                    type="text"
                    name="nis"
                    value={formData.nis}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                    placeholder="Nomor Induk Siswa"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">NISN</label>
                  <input
                    type="text"
                    name="nisn"
                    value={formData.nisn}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                    placeholder="NIS Nasional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tempat Lahir</label>
                  <input
                    type="text"
                    name="tempat_lahir"
                    value={formData.tempat_lahir}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                    placeholder="Contoh: Bandung"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="tgl_lahir"
                    value={formData.tgl_lahir}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-1.5 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat Lengkap</label>
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                  placeholder="Jl. Merdeka Baru No. 8"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Ayah</label>
                  <input
                    type="text"
                    name="ayah"
                    value={formData.ayah}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                    placeholder="Nama lengkap ayah"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Ibu</label>
                  <input
                    type="text"
                    name="ibu"
                    value={formData.ibu}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 mt-1 text-sm text-slate-800 transition-all outline-hidden"
                    placeholder="Nama lengkap ibu"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Agama</label>
                <select
                  name="agama"
                  value={formData.agama}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 mt-1 text-sm bg-white text-slate-800 transition-all outline-hidden"
                >
                  {AGAMA_LIST.map(religion => (
                    <option key={religion} value={religion}>{religion}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all cursor-pointer border-0"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-xs cursor-pointer border-0"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
