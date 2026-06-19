import { 
  DEFAULT_SCHOOL_PROFILE, 
  DEFAULT_GURU_PROFILE, 
  DEFAULT_TITI_MANGSA, 
  INITIAL_STUDENTS 
} from './data';

export interface DataRecord {
  type: string;
  kelas: string;
  rombel: string;
  semester: string;
  data: string; // JSON string
}

const STORAGE_KEY = 'rapor_sd_all_data';

export function loadAllData(): DataRecord[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fallback
    }
  }
  
  // Initialize with excellent mock data on first launch
  const initialRecords: DataRecord[] = [
    {
      type: 'profil_sekolah',
      kelas: '',
      rombel: '',
      semester: '',
      data: JSON.stringify(DEFAULT_SCHOOL_PROFILE)
    },
    {
      type: 'profil_guru',
      kelas: '1',
      rombel: 'A',
      semester: 'Ganjil',
      data: JSON.stringify(DEFAULT_GURU_PROFILE)
    },
    {
      type: 'profil_guru',
      kelas: '1',
      rombel: 'A',
      semester: 'Genap',
      data: JSON.stringify(DEFAULT_GURU_PROFILE)
    },
    {
      type: 'titi_mangsa',
      kelas: '1',
      rombel: 'A',
      semester: 'Ganjil',
      data: JSON.stringify(DEFAULT_TITI_MANGSA)
    },
    {
      type: 'titi_mangsa',
      kelas: '1',
      rombel: 'A',
      semester: 'Genap',
      data: JSON.stringify(DEFAULT_TITI_MANGSA)
    },
    {
      type: 'peserta_didik',
      kelas: '1',
      rombel: 'A',
      semester: 'Ganjil',
      data: JSON.stringify(INITIAL_STUDENTS)
    },
    {
      type: 'peserta_didik',
      kelas: '1',
      rombel: 'A',
      semester: 'Genap',
      data: JSON.stringify(INITIAL_STUDENTS)
    }
  ];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRecords));
  return initialRecords;
}

export function saveAllData(data: DataRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
