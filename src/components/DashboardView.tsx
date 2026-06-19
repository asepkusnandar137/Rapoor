import React from 'react';
import { Users, BookOpen, School, GraduationCap, Youtube, Instagram, MessageSquare, Video } from 'lucide-react';
import { MAPEL } from '../data';
import { Student, SchoolProfile } from '../types';

interface DashboardViewProps {
  students: Student[];
  schoolProfile: SchoolProfile | null;
  kelas: string;
  rombel: string;
  semester: string;
}

export default function DashboardView({
  students,
  schoolProfile,
  kelas,
  rombel,
  semester
}: DashboardViewProps) {
  // Helpers to format social links
  const getYoutubeLink = (val?: string) => {
    if (!val) return null;
    if (val.startsWith('http://') || val.startsWith('https://')) return val;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(val)}`;
  };

  const getInstagramLink = (val?: string) => {
    if (!val) return null;
    if (val.startsWith('http://') || val.startsWith('https://')) return val;
    const clean = val.startsWith('@') ? val.substring(1) : val;
    return `https://instagram.com/${clean}`;
  };

  const getTiktokLink = (val?: string) => {
    if (!val) return null;
    if (val.startsWith('http://') || val.startsWith('https://')) return val;
    const clean = val.startsWith('@') ? val : `@${val}`;
    return `https://tiktok.com/${clean}`;
  };

  const getWhatsappLink = (val?: string) => {
    if (!val) return null;
    if (val.startsWith('http://') || val.startsWith('https://')) return val;
    const cleanDigits = val.replace(/\D/g, '');
    let formatted = cleanDigits;
    if (cleanDigits.startsWith('0')) {
      formatted = '62' + cleanDigits.substring(1);
    }
    return `https://wa.me/${formatted}`;
  };

  const youtubeUrl = getYoutubeLink(schoolProfile?.youtube);
  const instagramUrl = getInstagramLink(schoolProfile?.instagram);
  const tiktokUrl = getTiktokLink(schoolProfile?.tiktok);
  const whatsappUrl = getWhatsappLink(schoolProfile?.whatsapp);

  const hasSocials = youtubeUrl || instagramUrl || tiktokUrl || whatsappUrl;
  return (
    <div className="fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">
          Informasi Kelas {kelas}{rombel} • Semester {semester}
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 flex items-center gap-4 hover:shadow-sm transition-all duration-200">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-800">{students.length}</p>
            <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Siswa Terdaftar</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 flex items-center gap-4 hover:shadow-sm transition-all duration-200">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-800">{MAPEL.length}</p>
            <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Mata Pelajaran</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 flex items-center gap-4 hover:shadow-sm transition-all duration-200">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <School className="w-6 h-6" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800 truncate max-w-[180px]">
              {schoolProfile ? schoolProfile.nama : 'Belum diisi'}
            </p>
            <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Profil Sekolah</p>
          </div>
        </div>
      </div>

      {/* Course List Card */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-slate-500" />
          <h3 className="font-bold text-slate-800 text-base">Daftar Mata Pelajaran</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {MAPEL.map((subject, idx) => (
            <div
              key={idx}
              className="text-sm bg-slate-50 text-slate-700 font-medium rounded-xl px-4 py-3 border border-slate-100 flex items-center gap-3 hover:bg-slate-100/50 transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">
                {idx + 1}
              </span>
              <span className="truncate" title={subject}>
                {subject}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Media Sosial & Informasi Kontak */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            <h3 className="font-bold text-slate-850 text-base">Media Sosial & Informasi Sekolah</h3>
          </div>
          <span className="text-[10px] font-mono bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md">
            OFFICIAL CHANNELS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* YouTube Card */}
          <a
            href={youtubeUrl || 'https://www.youtube.com'}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3.5 p-4 rounded-xl border transition-all duration-300 group ${
              youtubeUrl 
                ? 'border-red-100 bg-red-50/20 hover:bg-red-50/50 hover:border-red-300' 
                : 'border-slate-100 bg-slate-50/40 hover:bg-slate-50'
            }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
              youtubeUrl ? 'bg-red-500 text-white shadow-xs shadow-red-200' : 'bg-slate-200 text-slate-400'
            }`}>
              <Youtube className="w-5.5 h-5.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-none">YouTube</p>
              <p className="text-sm font-black text-slate-800 tracking-tight truncate mt-1">
                {schoolProfile?.youtube ? 'Kanal Resmi' : 'Belum diatur'}
              </p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {schoolProfile?.youtube ? schoolProfile.youtube : 'Ketuk untuk konfigurasi'}
              </p>
            </div>
          </a>

          {/* Instagram Card */}
          <a
            href={instagramUrl || 'https://instagram.com'}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3.5 p-4 rounded-xl border transition-all duration-300 group ${
              instagramUrl 
                ? 'border-pink-100 bg-pink-50/20 hover:bg-pink-50/50 hover:border-pink-300' 
                : 'border-slate-100 bg-slate-50/40 hover:bg-slate-50'
            }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
              instagramUrl ? 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-violet-600 text-white shadow-xs' : 'bg-slate-200 text-slate-400'
            }`}>
              <Instagram className="w-5.5 h-5.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-none">Instagram</p>
              <p className="text-sm font-black text-slate-800 tracking-tight truncate mt-1">
                {schoolProfile?.instagram ? schoolProfile.instagram : 'Belum diatur'}
              </p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {schoolProfile?.instagram ? 'Kunjungi Instagram' : 'Ketuk untuk konfigurasi'}
              </p>
            </div>
          </a>

          {/* TikTok Card */}
          <a
            href={tiktokUrl || 'https://tiktok.com'}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3.5 p-4 rounded-xl border transition-all duration-300 group ${
              tiktokUrl 
                ? 'border-slate-200 bg-slate-100/20 hover:bg-slate-100/50 hover:border-slate-400' 
                : 'border-slate-100 bg-slate-50/40 hover:bg-slate-50'
            }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
              tiktokUrl ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-200 text-slate-400'
            }`}>
              <Video className="w-5.5 h-5.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-none">TikTok</p>
              <p className="text-sm font-black text-slate-800 tracking-tight truncate mt-1">
                {schoolProfile?.tiktok ? schoolProfile.tiktok : 'Belum diatur'}
              </p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {schoolProfile?.tiktok ? 'Kunjungi TikTok' : 'Ketuk untuk konfigurasi'}
              </p>
            </div>
          </a>

          {/* WhatsApp Card */}
          <a
            href={whatsappUrl || 'https://wa.me'}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3.5 p-4 rounded-xl border transition-all duration-300 group ${
              whatsappUrl 
                ? 'border-emerald-100 bg-emerald-50/20 hover:bg-emerald-50/50 hover:border-emerald-300' 
                : 'border-slate-100 bg-slate-50/40 hover:bg-slate-50'
            }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
              whatsappUrl ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-200' : 'bg-slate-200 text-slate-400'
            }`}>
              <MessageSquare className="w-5.5 h-5.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-none">WhatsApp</p>
              <p className="text-sm font-black text-slate-800 tracking-tight truncate mt-1">
                {schoolProfile?.whatsapp ? schoolProfile.whatsapp : 'Belum diatur'}
              </p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {schoolProfile?.whatsapp ? 'Hubungi WhatsApp' : 'Ketuk untuk konfigurasi'}
              </p>
            </div>
          </a>
        </div>

        {!hasSocials && (
          <div className="bg-blue-50/40 border border-blue-100/60 p-3.5 rounded-xl text-xs text-blue-800 flex items-start gap-2.5">
            <span className="text-sm font-semibold">💡 Info:</span>
            <p className="leading-relaxed font-semibold">
              Kanal media sosial resmi di atas belum diisi. Anda dapat menambahkan tautan Youtube, Instagram, Tiktok, dan nomor WhatsApp sekolah Anda secara langsung di menu <strong className="underline">Profil Sekolah</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
