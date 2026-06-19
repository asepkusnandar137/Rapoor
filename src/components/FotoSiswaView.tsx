import React, { useState } from 'react';
import { Camera, Upload, X, Check, FileImage } from 'lucide-react';
import { Student } from '../types';

interface FotoSiswaViewProps {
  students: Student[];
  uploadedPhotos: { [key: number]: string };
  onSavePhoto: (studentIdx: number, base64Data: string) => void;
  showToast: (msg: string, color?: 'green' | 'red' | 'orange') => void;
  kelas: string;
  rombel: string;
}

export default function FotoSiswaView({
  students,
  uploadedPhotos,
  onSavePhoto,
  showToast,
  kelas,
  rombel
}: FotoSiswaViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudentIdx, setSelectedStudentIdx] = useState<number | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (students.length === 0) {
    return (
      <div className="fade-in space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Camera className="w-6 h-6 text-slate-700" />
            Foto Profil Siswa
          </h2>
          <p className="text-sm text-slate-500 mt-1">Kelas {kelas}{rombel}</p>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-400 font-medium shadow-xs">
          Silakan tambahkan data peserta didik terlebih dahulu di menu "Data Peserta Didik".
        </div>
      </div>
    );
  }

  const handleOpenModal = (idx: number) => {
    setSelectedStudentIdx(idx);
    setPhotoPreview(uploadedPhotos[idx] || '');
    setSelectedFile(null);
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Ukuran file terlalu besar (maksimal 2MB)', 'red');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPhotoPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (selectedStudentIdx === null) return;
    if (!photoPreview) {
      showToast('Silakan pilih berkas foto terlebih dahulu', 'orange');
      return;
    }

    onSavePhoto(selectedStudentIdx, photoPreview);
    showToast(`Foto profil ${students[selectedStudentIdx].nama} berhasil disimpan!`);
    setModalOpen(false);
  };

  return (
    <div className="fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Camera className="w-6 h-6 text-slate-700" />
          Foto Profil Siswa
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Kelola pasfoto ukuran 3x4 berwarna siswa untuk dicetak pada lembaran Sampul Rapor Kelas {kelas}{rombel}.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {students.map((student, idx) => {
          const photo = uploadedPhotos[idx] || '';
          return (
            <div
              key={idx}
              onClick={() => handleOpenModal(idx)}
              className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group/card flex flex-col items-center p-5 text-center"
            >
              {/* Avatar holder */}
              <div className="relative w-28 h-36 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-inner flex items-center justify-center shrink-0 group-hover/card:border-blue-300 transition-colors">
                {photo ? (
                  <img src={photo} alt={student.nama} className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-10 h-10 text-slate-300 group-hover/card:text-blue-400 group-hover/card:scale-110 transition-all duration-300" />
                )}
                {photo && (
                  <span className="absolute top-1 right-1 bg-emerald-500 text-white p-0.5 rounded-full">
                    <Check className="w-3 h-3 font-bold" />
                  </span>
                )}
              </div>

              <div className="mt-4 w-full">
                <p className="text-sm font-bold text-slate-800 truncate leading-snug group-hover/card:text-blue-600 transition-colors">
                  {student.nama}
                </p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">NIS: {student.nis || '-'}</p>
              </div>

              <div className="mt-3.5 w-full bg-slate-50 text-slate-500 font-bold group-hover/card:bg-blue-50 group-hover/card:text-blue-600 text-[11px] uppercase tracking-wider py-1.5 rounded-lg transition-colors border-0">
                {photo ? 'Ganti Foto' : 'Unggah Foto'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Modal Dialog */}
      {modalOpen && selectedStudentIdx !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col fade-in">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-sm text-slate-800">
                Unggah Foto - {students[selectedStudentIdx].nama}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer border-0"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col items-center space-y-5">
              {/* Photo Preview Canvas */}
              <div className="w-28 h-36 bg-slate-55 border border-slate-200 rounded-xl overflow-hidden shadow-inner flex items-center justify-center relative">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview pasfoto" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-12 h-12 text-slate-300" />
                )}
              </div>

              {/* Upload Form triggers */}
              <div className="w-full space-y-2">
                <label className="text-xs font-bold text-slate-400 block text-center uppercase tracking-wider">Pilih Pasfoto Berwarna</label>
                
                <div className="relative w-full border border-dashed border-slate-200 bg-slate-50/55 hover:bg-slate-50 hover:border-blue-300 transition-all py-6 rounded-xl text-center flex flex-col items-center justify-center cursor-pointer group">
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <span className="text-xs font-semibold text-slate-500 mt-2 block group-hover:text-slate-600 transition-colors">
                    {selectedFile ? selectedFile.name : 'Klik untuk Telusuri File'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
                
                <span className="text-[10px] text-slate-400 text-center font-medium block leading-relaxed pt-1 select-none">
                  Format yang didukung: JPG, PNG. Ukuran maksimal file adalah 2MB.
                </span>
              </div>

              {/* Action buttons */}
              <div className="w-full pt-4 border-t border-slate-100 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer border-0"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer border-0"
                >
                  Simpan Foto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
