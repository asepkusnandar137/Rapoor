import React, { useState, useEffect } from 'react';
import { FileText, Sparkles, Save, Check } from 'lucide-react';
import { MAPEL } from '../data';

interface GeneratorTPViewProps {
  loadSavedTP: (mapelIdx: number, lm: number) => string[];
  saveTP: (mapelIdx: number, lm: number, tps: string[]) => void;
  showToast: (msg: string, color?: 'green' | 'red' | 'orange') => void;
  kelas: string;
}

export default function GeneratorTPView({
  loadSavedTP,
  saveTP,
  showToast,
  kelas
}: GeneratorTPViewProps) {
  const [selectedMapelIdx, setSelectedMapelIdx] = useState<number>(0);
  const [selectedLM, setSelectedLM] = useState<number>(1);
  const [activeTPs, setActiveTPs] = useState<string[]>(['', '', '', '']);
  const [hasGenerated, setHasGenerated] = useState(false);

  const fase = parseInt(kelas, 10) <= 2 ? 'A' : parseInt(kelas, 10) <= 4 ? 'B' : 'C';

  // Load saved TPs if any exist
  useEffect(() => {
    const saved = loadSavedTP(selectedMapelIdx, selectedLM);
    if (saved && saved.length === 4) {
      setActiveTPs(saved);
      setHasGenerated(true);
    } else {
      setActiveTPs(['', '', '', '']);
      setHasGenerated(false);
    }
  }, [selectedMapelIdx, selectedLM]);

  const handleGenerate = () => {
    const mapel = MAPEL[selectedMapelIdx];
    const generated: string[] = [];
    for (let i = 1; i <= 4; i++) {
      generated.push(
        `TP ${selectedLM}.${i}: Peserta didik mampu memahami, menjelaskan, dan mengaplikasikan materi ${mapel} pada Lingkup Materi ${selectedLM} sesuai Fase ${fase} dengan kriteria capaian level ${i}`
      );
    }
    setActiveTPs(generated);
    setHasGenerated(true);
    showToast('Tujuan Pembelajaran berhasil di-generate secara otomatis!');
  };

  const handleTextChange = (idx: number, text: string) => {
    const nextList = [...activeTPs];
    nextList[idx] = text;
    setActiveTPs(nextList);
  };

  const handleSave = () => {
    saveTP(selectedMapelIdx, selectedLM, activeTPs);
    showToast(`Tujuan Pembelajaran (TP) Lingkup Materi ${selectedLM} berhasil disimpan!`);
  };

  // Compile list of all saved TPs for the currently selected subject to display
  const renderAllSavedForSubject = () => {
    const elements: React.ReactNode[] = [];
    for (let lm = 1; lm <= 5; lm++) {
      const saved = loadSavedTP(selectedMapelIdx, lm);
      if (saved && saved.some(t => t.trim().length > 0)) {
        elements.push(
          <div key={lm} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 space-y-1">
            <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Lingkup Materi {lm}</h4>
            <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 mt-1.5">
              {saved.filter(t => t.trim().length > 0).map((tp, i) => (
                <li key={i} className="pl-1 leading-relaxed">{tp}</li>
              ))}
            </ul>
          </div>
        );
      }
    }

    if (elements.length === 0) {
      return (
        <p className="text-xs text-slate-400 font-medium py-2">
          Belum ada Tujuan Pembelajaran yang tersimpan untuk mata pelajaran ini. Silakan pilih nomor Lingkup Materi di atas, lalu klik "Generate TP".
        </p>
      );
    }

    return <div className="space-y-3 mt-2">{elements}</div>;
  };

  return (
    <div className="fade-in space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-slate-700" />
          Generator Tujuan Pembelajaran (TP)
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Generate dan edit deskripsi Tujuan Pembelajaran (TP) untuk dicetak pada deskripsi capaian kompetensi rapor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Generator Controls */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mata Pelajaran</label>
              <select
                value={selectedMapelIdx}
                onChange={(e) => setSelectedMapelIdx(parseInt(e.target.value, 10))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 mt-1.5 text-sm bg-white text-slate-800 font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-hidden cursor-pointer"
              >
                {MAPEL.map((mapel, idx) => (
                  <option key={idx} value={idx}>{mapel}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lingkup Materi (LM)</label>
              <select
                value={selectedLM}
                onChange={(e) => setSelectedLM(parseInt(e.target.value, 10))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 mt-1.5 text-sm bg-white text-slate-800 font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-hidden cursor-pointer"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>Lingkup Materi {num}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Prompt/Generate Command */}
          <div className="flex gap-2 justify-start items-center">
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer border-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Otomatis TP
            </button>
            <span className="text-xs text-slate-400 font-medium">Fase {fase} (Kelas {kelas})</span>
          </div>

          {/* Edit Panel */}
          {hasGenerated && (
            <div className="space-y-3.5 border-t border-slate-100 pt-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Sesuaikan Teks Tujuan Pembelajaran</label>
              <div className="space-y-3">
                {activeTPs.map((tpText, idx) => (
                  <div key={idx} className="bg-slate-50 hover:bg-slate-100/50 p-3 rounded-xl border border-slate-100 transition-colors flex gap-2">
                    <span className="text-xs font-extrabold text-slate-400 shrink-0 select-none mt-1">TP {idx + 1}</span>
                    <textarea
                      value={tpText}
                      onChange={(e) => handleTextChange(idx, e.target.value)}
                      rows={2}
                      className="w-full bg-transparent border-0 font-medium text-xs text-slate-700 resize-none outline-hidden focus:ring-0 mt-0.5"
                      placeholder={`Isi deskripsi tujuan pembelajaran nomor ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-100 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-xs cursor-pointer border-0"
                >
                  <Save className="w-4 h-4" />
                  Simpan TP
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Saved List Sidebar */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 self-start">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b pb-3 mb-3">
            <Check className="w-4 h-4 text-emerald-600" />
            TP Tersimpan
          </h3>
          <p className="text-xs text-slate-500 font-medium mb-2">{MAPEL[selectedMapelIdx]}</p>
          {renderAllSavedForSubject()}
        </div>
      </div>
    </div>
  );
}
