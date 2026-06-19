import { Student, SchoolProfile, GuruProfile, TitiMangsa } from './types';

export const MAPEL = [
  'Pendidikan Agama Islam dan Budi Pekerti',
  'Pendidikan Pancasila',
  'Bahasa Indonesia',
  'IPAS',
  'Matematika',
  'Seni Rupa',
  'Seni Tari',
  'Seni Teater',
  'Seni Musik',
  'PJOK',
  'Bahasa Inggris',
  'Bahasa Sunda dan Sastra'
];

export const EKSKUL = ['Pramuka', 'Olahraga', 'Seni'];

export const NILAI_EKSKUL = ['Sangat Baik', 'Baik', 'Cukup', 'Perlu Bimbingan'];

export const AGAMA_LIST = [
  'Islam',
  'Kristen',
  'Katolik',
  'Hindu',
  'Buddha',
  'Konghucu'
];

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  nama: 'SD Negeri Sukamaju 1',
  npsn: '20234567',
  alamat: 'Jl. Merdeka No. 45',
  desa: 'Sukamaju',
  kec: 'Cibeunying',
  kab: 'Bandung',
  prov: 'Jawa Barat',
  ta: '2024/2025',
  kodepos: '40123'
};

export const DEFAULT_GURU_PROFILE: GuruProfile = {
  guru: 'Budi Santoso, S.Pd.',
  nip_guru: '198503112010011005',
  ks: 'Dra. Endang Lestari, M.Pd.',
  nip_ks: '197408221998032001'
};

export const DEFAULT_TITI_MANGSA: TitiMangsa = {
  tempat: 'Bandung',
  tanggal: '2025-06-20'
};

export const INITIAL_STUDENTS: Student[] = [
  {
    nama: 'Aditya Pratama',
    nis: '2425001',
    nisn: '3124567891',
    tempat_lahir: 'Bandung',
    tgl_lahir: '2014-04-12',
    alamat: 'Jl. Kenanga No. 10',
    ayah: 'Heri Pratama',
    ibu: 'Siti Aminah',
    agama: 'Islam'
  },
  {
    nama: 'Chandra Wijaya',
    nis: '2425002',
    nisn: '3124567892',
    tempat_lahir: 'Bandung',
    tgl_lahir: '2014-08-25',
    alamat: 'Gg. Masjid No. 4',
    ayah: 'Ahmad Wijaya',
    ibu: 'Dewi Lestari',
    agama: 'Islam'
  },
  {
    nama: 'Siti Rahmawati',
    nis: '2425003',
    nisn: '3124567893',
    tempat_lahir: 'Sumedang',
    tgl_lahir: '2014-01-05',
    alamat: 'Kp. Baru RT 02 RW 05',
    ayah: 'Maman Suraman',
    ibu: 'Rati',
    agama: 'Islam'
  }
];
