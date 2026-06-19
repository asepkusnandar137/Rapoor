export interface Student {
  nama: string;
  nis: string;
  nisn: string;
  tempat_lahir: string;
  tgl_lahir: string;
  alamat: string;
  ayah: string;
  ibu: string;
  agama: string;
}

export interface SchoolProfile {
  nama: string;
  npsn: string;
  alamat: string;
  desa: string;
  kec: string;
  kab: string;
  prov: string;
  ta: string;
  kodepos: string;
  youtube?: string;
  tiktok?: string;
  instagram?: string;
  whatsapp?: string;
}

export interface GuruProfile {
  guru: string;
  nip_guru: string;
  ks: string;
  nip_ks: string;
}

export interface KepalaSekolahProfile {
  ks: string;
  nip_ks: string;
}

export interface SubjectGrade {
  [key: string]: string; // For lmX_tpY, ats, sas
}

export interface ExtracurricularGrade {
  [key: string]: string; // key: `${siswaIdx}_${ekskulIdx}` -> 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Bimbingan' | ''
}

export interface AttendanceRecord {
  [key: string]: string; // key: 's_0', 'i_0', 'a_0' -> value in days
}

export interface TitiMangsa {
  tempat: string;
  tanggal: string;
}

export interface LearningObjective {
  [key: string]: string[]; // key is mapelIdx_lm
}
