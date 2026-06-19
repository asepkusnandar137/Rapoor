import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  School, 
  UserCheck, 
  Users, 
  Calculator, 
  Trophy, 
  ClipboardList, 
  FileText, 
  Calendar, 
  BookOpen, 
  Printer, 
  TableProperties, 
  Camera,
  ChevronDown,
  Sparkles,
  AlertCircle,
  Award
} from 'lucide-react';

import { loadAllData, saveAllData, DataRecord } from './utils';
import { 
  Student, 
  SchoolProfile, 
  GuruProfile, 
  KepalaSekolahProfile,
  TitiMangsa, 
  SubjectGrade, 
  ExtracurricularGrade, 
  AttendanceRecord 
} from './types';

// Import Modular Views
import DashboardView from './components/DashboardView';
import ProfilSekolahView from './components/ProfilSekolahView';
import ProfilGuruView from './components/ProfilGuruView';
import ProfilKepalaSekolahView from './components/ProfilKepalaSekolahView';
import DataPesertaDidikView from './components/DataPesertaDidikView';
import RekapNilaiView from './components/RekapNilaiView';
import NilaiEkskulView from './components/NilaiEkskulView';
import AbsensiView from './components/AbsensiView';
import GeneratorTPView from './components/GeneratorTPView';
import TitiMangsaView from './components/TitiMangsaView';
import SampulRaporView from './components/SampulRaporView';
import CetakRaporView from './components/CetakRaporView';
import RekapitulasiNilaiView from './components/RekapitulasiNilaiView';
import FotoSiswaView from './components/FotoSiswaView';

type PageID = 
  | 'dashboard'
  | 'profil_sekolah'
  | 'profil_guru'
  | 'profil_ks'
  | 'peserta_didik'
  | 'rekap_nilai'
  | 'ekskul'
  | 'absensi'
  | 'tp_generator'
  | 'titi_mangsa'
  | 'sampul'
  | 'cetak'
  | 'rekapitulasi'
  | 'foto_siswa';

interface ToastState {
  message: string;
  color: 'green' | 'red' | 'orange';
}

export default function App() {
  // Navigation & Filtering Context State
  const [currentPage, setCurrentPage] = useState<PageID>('dashboard');
  const [currentKelas, setCurrentKelas] = useState<string>('1');
  const [currentRombel, setCurrentRombel] = useState<string>('A');
  const [currentSemester, setCurrentSemester] = useState<string>('Ganjil');

  // Master Data records containing everything
  const [allData, setAllData] = useState<DataRecord[]>([]);

  // Toast Status state
  const [toast, setToast] = useState<ToastState | null>(null);

  // Load database once on first paint
  useEffect(() => {
    const loaded = loadAllData();
    setAllData(loaded);
  }, []);

  // Sync to local storage whenever master data changes
  useEffect(() => {
    if (allData.length > 0) {
      saveAllData(allData);
    }
  }, [allData]);

  // Toast triggering engine
  const showToast = (message: string, color: 'green' | 'red' | 'orange' = 'green') => {
    setToast({ message, color });
    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  // --- CONTEXT SENSITIVE DATABASE GETTERS/SETTERS ---

  // Get active student body list
  const activeStudents = useMemo<Student[]>(() => {
    const rec = allData.find(
      r => r.type === 'peserta_didik' && r.kelas === currentKelas && r.rombel === currentRombel && r.semester === currentSemester
    );
    if (rec) {
      try {
        return JSON.parse(rec.data) as Student[];
      } catch {
        return [];
      }
    }
    return [];
  }, [allData, currentKelas, currentRombel, currentSemester]);

  // Get current School Profile
  const activeSchoolProfile = useMemo<SchoolProfile | null>(() => {
    const rec = allData.find(r => r.type === 'profil_sekolah');
    if (rec) {
      try {
        return JSON.parse(rec.data) as SchoolProfile;
      } catch {
        return null;
      }
    }
    return null;
  }, [allData]);

  // Get current Classroom Teacher / Principal profiles
  const activeGuruProfile = useMemo<GuruProfile | null>(() => {
    const rec = allData.find(
      r => r.type === 'profil_guru' && r.kelas === currentKelas && r.rombel === currentRombel && r.semester === currentSemester
    );
    if (rec) {
      try {
        return JSON.parse(rec.data) as GuruProfile;
      } catch {
        return null;
      }
    }
    return null;
  }, [allData, currentKelas, currentRombel, currentSemester]);

  // Get current global Kepala Sekolah profile
  const activeKepalaSekolah = useMemo<KepalaSekolahProfile | null>(() => {
    const rec = allData.find(
      r => r.type === 'profil_ks' && r.kelas === '' && r.rombel === '' && r.semester === ''
    );
    if (rec) {
      try {
        return JSON.parse(rec.data) as KepalaSekolahProfile;
      } catch {
        return null;
      }
    }
    // Fallback/migration: if we have any profil_guru record that has a ks name, let's use it as default
    const fallbackRec = allData.find(r => r.type === 'profil_guru');
    if (fallbackRec) {
      try {
        const parsed = JSON.parse(fallbackRec.data);
        if (parsed.ks) {
          return {
            ks: parsed.ks,
            nip_ks: parsed.nip_ks || ''
          };
        }
      } catch {
        // ignore
      }
    }
    // Static default
    return {
      ks: 'Dra. Endang Lestari, M.Pd.',
      nip_ks: '197408221998032001'
    };
  }, [allData]);

  // Get current classroom's report release date
  const activeTitiMangsa = useMemo<TitiMangsa | null>(() => {
    const rec = allData.find(
      r => r.type === 'titi_mangsa' && r.kelas === currentKelas && r.rombel === currentRombel && r.semester === currentSemester
    );
    if (rec) {
      try {
        return JSON.parse(rec.data) as TitiMangsa;
      } catch {
        return null;
      }
    }
    return null;
  }, [allData, currentKelas, currentRombel, currentSemester]);

  // Get current extracurriculars grading state
  const activeEkskul = useMemo<ExtracurricularGrade | null>(() => {
    const rec = allData.find(
      r => r.type === 'ekskul' && r.kelas === currentKelas && r.rombel === currentRombel && r.semester === currentSemester
    );
    if (rec) {
      try {
        return JSON.parse(rec.data) as ExtracurricularGrade;
      } catch {
        return null;
      }
    }
    return null;
  }, [allData, currentKelas, currentRombel, currentSemester]);

  // Get current absences record
  const activeAbsensi = useMemo<AttendanceRecord | null>(() => {
    const rec = allData.find(
      r => r.type === 'absensi' && r.kelas === currentKelas && r.rombel === currentRombel && r.semester === currentSemester
    );
    if (rec) {
      try {
        return JSON.parse(rec.data) as AttendanceRecord;
      } catch {
        return null;
      }
    }
    return null;
  }, [allData, currentKelas, currentRombel, currentSemester]);

  // Find base64 uploaded student photos
  const activePhotos = useMemo<{ [key: number]: string }>(() => {
    const rec = allData.find(
      r => r.type === 'uploaded_photos' && r.kelas === currentKelas && r.rombel === currentRombel && r.semester === currentSemester
    );
    if (rec) {
      try {
        return JSON.parse(rec.data) as { [key: number]: string };
      } catch {
        return {};
      }
    }
    return {};
  }, [allData, currentKelas, currentRombel, currentSemester]);

  // Generic record saver helper
  const saveRecord = (type: string, dataObj: any, isGlobal: boolean = false) => {
    const jsonStr = JSON.stringify(dataObj);
    setAllData(prev => {
      const copy = [...prev];
      const matchIdx = copy.findIndex(
        r => 
          r.type === type && 
          (isGlobal ? (r.kelas === '' && r.rombel === '' && r.semester === '') : (r.kelas === currentKelas && r.rombel === currentRombel && r.semester === currentSemester))
      );

      const record: DataRecord = {
        type,
        kelas: isGlobal ? '' : currentKelas,
        rombel: isGlobal ? '' : currentRombel,
        semester: isGlobal ? '' : currentSemester,
        data: jsonStr
      };

      if (matchIdx >= 0) {
        copy[matchIdx] = record;
      } else {
        copy.push(record);
      }
      return copy;
    });
  };

  // Generic record deleter helper
  const deleteRecord = (type: string, isGlobal: boolean = false) => {
    setAllData(prev => {
      return prev.filter(
        r => 
          !(r.type === type && 
            (isGlobal ? (r.kelas === '' && r.rombel === '' && r.semester === '') : (r.kelas === currentKelas && r.rombel === currentRombel && r.semester === currentSemester)))
      );
    });
  };

  // Specific load/save methods for student subject grades
  const getGradeKey = (siswaIdx: number, mapelIdx: number) => {
    // Unique type key to track grades per student-subject combination
    return `nilai_${siswaIdx}_${mapelIdx}`;
  };

  const loadGrade = (gradeKey: string): SubjectGrade => {
    const rec = allData.find(
      r => r.type === gradeKey && r.kelas === currentKelas && r.rombel === currentRombel && r.semester === currentSemester
    );
    if (rec) {
      try {
        return JSON.parse(rec.data) as SubjectGrade;
      } catch {
        return {};
      }
    }
    return {};
  };

  const saveGrade = (gradeKey: string, grade: SubjectGrade) => {
    saveRecord(gradeKey, grade);
  };

  const deleteGrade = (gradeKey: string) => {
    deleteRecord(gradeKey);
  };

  // Specific load/save methods for Learning Objectives (TP)
  const loadSavedTP = (mapelIdx: number, lm: number): string[] => {
    const key = `tp_${mapelIdx}_${lm}`;
    const rec = allData.find(r => r.type === key); // TP can be globally configured per subject scope
    if (rec) {
      try {
        return JSON.parse(rec.data) as string[];
      } catch {
        return [];
      }
    }
    return [];
  };

  const saveTP = (mapelIdx: number, lm: number, tps: string[]) => {
    const key = `tp_${mapelIdx}_${lm}`;
    saveRecord(key, tps, true); // Share TPs globally across classes for course standardization!
  };

  // Handle saving student portraits
  const saveStudentPhoto = (studentIdx: number, base64Data: string) => {
    const updatedPhotos = { ...activePhotos, [studentIdx]: base64Data };
    saveRecord('uploaded_photos', updatedPhotos);
  };

  // Sidebar link items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profil_sekolah', label: 'Profil Sekolah', icon: School },
    { id: 'profil_guru', label: 'Profil Guru', icon: UserCheck },
    { id: 'profil_ks', label: 'Profil Kepala Sekolah', icon: Award },
    { id: 'peserta_didik', label: 'Data Peserta Didik', icon: Users },
    { id: 'rekap_nilai', label: 'Rekap Nilai', icon: Calculator },
    { id: 'ekskul', label: 'Nilai Ekstrakurikuler', icon: Trophy },
    { id: 'absensi', label: 'Absensi Siswa', icon: ClipboardList },
    { id: 'tp_generator', label: 'Generator TP', icon: FileText },
    { id: 'titi_mangsa', label: 'Titi Mangsa', icon: Calendar },
    { id: 'sampul', label: 'Sampul Rapor', icon: BookOpen },
    { id: 'cetak', label: 'Cetak Rapor', icon: Printer },
    { id: 'rekapitulasi', label: 'Rekapitulasi Nilai', icon: TableProperties },
    { id: 'foto_siswa', label: 'Foto Siswa', icon: Camera },
  ] as const;

  // Active view content component router
  const renderActiveView = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardView
            students={activeStudents}
            schoolProfile={activeSchoolProfile}
            kelas={currentKelas}
            rombel={currentRombel}
            semester={currentSemester}
          />
        );
      case 'profil_sekolah':
        return (
          <ProfilSekolahView
            initialProfile={activeSchoolProfile}
            onSave={(p) => saveRecord('profil_sekolah', p, true)}
            onDelete={() => deleteRecord('profil_sekolah', true)}
            showToast={showToast}
          />
        );
      case 'profil_guru':
        return (
          <ProfilGuruView
            initialProfile={activeGuruProfile}
            onSave={(g) => saveRecord('profil_guru', g)}
            onDelete={() => deleteRecord('profil_guru')}
            showToast={showToast}
            kelas={currentKelas}
            rombel={currentRombel}
          />
        );
      case 'profil_ks':
        return (
          <ProfilKepalaSekolahView
            initialProfile={activeKepalaSekolah}
            onSave={(k) => saveRecord('profil_ks', k, true)}
            onDelete={() => deleteRecord('profil_ks', true)}
            showToast={showToast}
          />
        );
      case 'peserta_didik':
        return (
          <DataPesertaDidikView
            students={activeStudents}
            onSave={(list) => saveRecord('peserta_didik', list)}
            showToast={showToast}
            kelas={currentKelas}
            rombel={currentRombel}
          />
        );
      case 'rekap_nilai':
        return (
          <RekapNilaiView
            students={activeStudents}
            getGradeKey={getGradeKey}
            loadGrade={loadGrade}
            saveGrade={saveGrade}
            deleteGrade={deleteGrade}
            showToast={showToast}
            kelas={currentKelas}
            rombel={currentRombel}
            semester={currentSemester}
          />
        );
      case 'ekskul':
        return (
          <NilaiEkskulView
            students={activeStudents}
            initialEkskul={activeEkskul}
            onSave={(e) => saveRecord('ekskul', e)}
            onDelete={() => deleteRecord('ekskul')}
            showToast={showToast}
            kelas={currentKelas}
            rombel={currentRombel}
          />
        );
      case 'absensi':
        return (
          <AbsensiView
            students={activeStudents}
            initialAbsensi={activeAbsensi}
            onSave={(a) => saveRecord('absensi', a)}
            onDelete={() => deleteRecord('absensi')}
            showToast={showToast}
            kelas={currentKelas}
            rombel={currentRombel}
          />
        );
      case 'tp_generator':
        return (
          <GeneratorTPView
            loadSavedTP={loadSavedTP}
            saveTP={saveTP}
            showToast={showToast}
            kelas={currentKelas}
          />
        );
      case 'titi_mangsa':
        return (
          <TitiMangsaView
            initialTiti={activeTitiMangsa}
            onSave={(t) => saveRecord('titi_mangsa', t)}
            showToast={showToast}
            kelas={currentKelas}
            rombel={currentRombel}
            semester={currentSemester}
          />
        );
      case 'sampul':
        return (
          <SampulRaporView
            students={activeStudents}
            schoolProfile={activeSchoolProfile}
            guruProfile={activeGuruProfile}
            kepalaSekolah={activeKepalaSekolah}
            titiMangsa={activeTitiMangsa}
            uploadedPhotos={activePhotos}
            kelas={currentKelas}
            rombel={currentRombel}
            semester={currentSemester}
          />
        );
      case 'cetak':
        return (
          <CetakRaporView
            students={activeStudents}
            schoolProfile={activeSchoolProfile}
            guruProfile={activeGuruProfile}
            kepalaSekolah={activeKepalaSekolah}
            titiMangsa={activeTitiMangsa}
            loadGrade={loadGrade}
            loadSavedTP={loadSavedTP}
            initialEkskul={activeEkskul}
            initialAbsensi={activeAbsensi}
            kelas={currentKelas}
            rombel={currentRombel}
            semester={currentSemester}
          />
        );
      case 'rekapitulasi':
        return (
          <RekapitulasiNilaiView
            students={activeStudents}
            schoolProfile={activeSchoolProfile}
            guruProfile={activeGuruProfile}
            kepalaSekolah={activeKepalaSekolah}
            titiMangsa={activeTitiMangsa}
            loadGrade={loadGrade}
            kelas={currentKelas}
            rombel={currentRombel}
            semester={currentSemester}
          />
        );
      case 'foto_siswa':
        return (
          <FotoSiswaView
            students={activeStudents}
            uploadedPhotos={activePhotos}
            onSavePhoto={saveStudentPhoto}
            showToast={showToast}
            kelas={currentKelas}
            rombel={currentRombel}
          />
        );
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50/50">
      
      {/* Sidebar (Hidden during browser Print) */}
      <aside className="no-print w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
        
        {/* Sidebar Header Brand */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-base font-black">
              📊
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-wide">Aplikasi Rapor SD</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Kurikulum Merdeka</p>
            </div>
          </div>

          {/* Context Selective Roster Filter */}
          <div className="mt-4 pt-1.5 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <select
                  aria-label="Kelas"
                  value={currentKelas}
                  onChange={(e) => {
                    setCurrentKelas(e.target.value);
                    showToast(`Konteks kelas diubah ke Kelas ${e.target.value}${currentRombel}`);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg pl-2 pr-7 py-1.5 text-[11px] font-bold text-slate-300 appearance-none outline-hidden cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map(k => (
                    <option key={k} value={k}>Kelas {k}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-2.5 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  aria-label="Rombel"
                  value={currentRombel}
                  onChange={(e) => {
                    setCurrentRombel(e.target.value);
                    showToast(`Konteks kelas diubah ke Kelas ${currentKelas}${e.target.value}`);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg pl-2.5 pr-7 py-1.5 text-[11px] font-bold text-slate-300 appearance-none outline-hidden cursor-pointer"
                >
                  {['A', 'B'].map(r => (
                    <option key={r} value={r}>Rombel {r}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div className="relative">
              <select
                aria-label="Semester"
                value={currentSemester}
                onChange={(e) => {
                  setCurrentSemester(e.target.value);
                  showToast(`Konteks semester diubah ke Smt ${e.target.value}`);
                }}
                className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg pl-3 pr-7 py-1.5 text-[11px] font-bold text-slate-300 appearance-none outline-hidden cursor-pointer"
              >
                {['Ganjil', 'Genap'].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Navigation items list */}
        <nav className="flex-1 overflow-y-auto p-2.5 space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold leading-relaxed flex items-center gap-2.5 transition-all select-none cursor-pointer border-0 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/10' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Branding Footer info */}
        <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 font-bold space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Aktif Terdaftar:</span>
          </div>
          <div className="font-mono bg-slate-800/40 p-1.5 rounded-lg border border-slate-800/70 text-[9px]">
            SDN: Kelas {currentKelas}{currentRombel} Smt {currentSemester}
          </div>
        </div>
      </aside>

      {/* Main Panel Surface */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 main-content-layout">
        {renderActiveView()}
      </main>

      {/* Floating Alert Messages container */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-white text-xs font-bold font-sans animate-fade-in ${
          toast.color === 'green' ? 'bg-emerald-600 border-emerald-500 shadow-emerald-950/20' :
          toast.color === 'red' ? 'bg-rose-600 border-rose-500 shadow-rose-950/20' :
          'bg-amber-500 border-amber-400 shadow-amber-950/20'
        }`}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
}
