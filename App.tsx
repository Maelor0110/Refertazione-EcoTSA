
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { INITIAL_DATA, ExamData, StenosisLevel, MeasurementMethod } from './types';
import VesselInput from './components/VesselInput';
import ReportPreview from './components/ReportPreview';

const App: React.FC = () => {
  const [data, setData] = useState<ExamData>(INITIAL_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [view, setView] = useState<'edit' | 'preview'>('edit');

  const updateVessel = (side: 'right' | 'left', vessel: keyof ExamData['right'], field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        [vessel]: {
          ...prev[side][vessel],
          [field]: value
        }
      }
    }));
  };

  const handleAIConclusions = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Agisci come un medico ecodopplerista esperto. 
        Sintetizza i seguenti dati TSA in un referto clinico professionale (Conclusioni).
        Metodo di misura utilizzato: ${data.measurementMethod}.
        
        DESTRA:
        - ACC: Stenosi ${data.right.acc.stenosis}, IMT: ${data.right.acc.imt}mm
        - Bulbo: Stenosi ${data.right.bulbo.stenosis}, Placca: ${data.right.bulbo.plaqueType}
        - ACI: Stenosi ${data.right.aci.stenosis}, PSV: ${data.right.aci.psv}
        - AV: ${data.right.av.notes || 'Normale'}
        
        SINISTRA:
        - ACC: Stenosi ${data.left.acc.stenosis}, IMT: ${data.left.acc.imt}mm
        - Bulbo: Stenosi ${data.left.bulbo.stenosis}, Placca: ${data.left.bulbo.plaqueType}
        - ACI: Stenosi ${data.left.aci.stenosis}, PSV: ${data.left.aci.psv}
        - AV: ${data.left.av.notes || 'Normale'}

        Focus: simmetria, significatività emodinamica (>50%), morfologia placche e follow-up consigliato (SIUMB).
        Sii diretto, asciutto e professionale. Massimo 100 parole. Usa termini medici appropriati.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setData(prev => ({ ...prev, conclusions: response.text || '' }));
    } catch (error) {
      console.error("AI Error:", error);
      alert("Errore generazione AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`mx-auto ${view === 'edit' ? 'max-w-6xl px-4 py-6' : 'print-full-width'} pb-24 text-slate-900`}>
      <header className="mb-6 flex flex-col md:flex-row items-center justify-between no-print border-b border-slate-200 pb-4 gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight uppercase">Sistema Refertazione TSA</h1>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Configurazione Dati Esame</p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-lg">
          <button 
            onClick={() => setView('edit')}
            className={`px-4 py-1.5 rounded text-xs font-bold uppercase transition-all ${view === 'edit' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            Configurazione
          </button>
          <button 
            onClick={() => setView('preview')}
            className={`px-4 py-1.5 rounded text-xs font-bold uppercase transition-all ${view === 'preview' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            Anteprima Report
          </button>
        </div>
      </header>

      {view === 'edit' ? (
        <div className="space-y-6 no-print">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-2">Dati Identificativi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Medico Refertatore</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:border-blue-400 transition-all font-semibold"
                    value={data.doctorName}
                    onChange={(e) => setData({...data, doctorName: e.target.value})}
                    placeholder="Dott. Nome Cognome"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Nominativo Paziente</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:border-blue-400 transition-all font-semibold"
                    value={data.patientName}
                    onChange={(e) => setData({...data, patientName: e.target.value})}
                    placeholder="Cognome e Nome"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 md:col-span-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Data Nascita</label>
                    <input type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-sm outline-none" value={data.birthDate} onChange={(e) => setData({...data, birthDate: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Data Esame</label>
                    <input type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-sm outline-none" value={data.examDate} onChange={(e) => setData({...data, examDate: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Quesito Diagnostico</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-sm outline-none"
                  value={data.indication}
                  onChange={(e) => setData({...data, indication: e.target.value})}
                  placeholder="Es. Sospetto TIA, Screening vascolare..."
                />
              </div>
            </section>

            <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-2">Protocollo Tecnico</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Analisi Stenosi</label>
                  <div className="flex gap-1 p-1 bg-slate-100 rounded">
                    {(['NASCET', 'ECST'] as MeasurementMethod[]).map(m => (
                      <button 
                        key={m}
                        onClick={() => setData({...data, measurementMethod: m})}
                        className={`flex-1 py-1.5 rounded text-[10px] font-bold transition-all ${data.measurementMethod === m ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Apparato</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs outline-none" value={data.technicalSettings.equipment} onChange={(e) => setData({...data, technicalSettings: {...data.technicalSettings, equipment: e.target.value}})} placeholder="Marca/Modello Ecografo" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Sonda</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs outline-none" value={data.technicalSettings.probe} onChange={(e) => setData({...data, technicalSettings: {...data.technicalSettings, probe: e.target.value}})} placeholder="Sonda" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Angolo θ</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs outline-none" value={data.technicalSettings.angle} onChange={(e) => setData({...data, technicalSettings: {...data.technicalSettings, angle: e.target.value}})} placeholder="Angolo" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-red-700 uppercase tracking-widest px-2 flex items-center gap-2">
                <i className="fas fa-heart-pulse"></i> Distretto Destro
              </h3>
              <div className="space-y-2">
                <VesselInput label="ACC" side="right" vessel="acc" data={data.right.acc} onUpdate={updateVessel} showImt />
                <VesselInput label="Bulbo" side="right" vessel="bulbo" data={data.right.bulbo} onUpdate={updateVessel} />
                <VesselInput label="ACI" side="right" vessel="aci" data={data.right.aci} onUpdate={updateVessel} />
                <VesselInput label="ACE" side="right" vessel="ace" data={data.right.ace} onUpdate={updateVessel} />
                <VesselInput label="Vertebrale" side="right" vessel="av" data={data.right.av} onUpdate={updateVessel} isVertebral />
                <VesselInput label="Succlavia" side="right" vessel="scl" data={data.right.scl} onUpdate={updateVessel} />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-blue-700 uppercase tracking-widest px-2 flex items-center gap-2">
                <i className="fas fa-heart-pulse"></i> Distretto Sinistro
              </h3>
              <div className="space-y-2">
                <VesselInput label="ACC" side="left" vessel="acc" data={data.left.acc} onUpdate={updateVessel} showImt />
                <VesselInput label="Bulbo" side="left" vessel="bulbo" data={data.left.bulbo} onUpdate={updateVessel} />
                <VesselInput label="ACI" side="left" vessel="aci" data={data.left.aci} onUpdate={updateVessel} />
                <VesselInput label="ACE" side="left" vessel="ace" data={data.left.ace} onUpdate={updateVessel} />
                <VesselInput label="Vertebrale" side="left" vessel="av" data={data.left.av} onUpdate={updateVessel} isVertebral />
                <VesselInput label="Succlavia" side="left" vessel="scl" data={data.left.scl} onUpdate={updateVessel} />
              </div>
            </div>
          </div>

          <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sintesi Diagnostica</h2>
              <button 
                onClick={handleAIConclusions}
                disabled={isGenerating}
                className="text-[9px] font-bold uppercase bg-slate-800 text-white px-3 py-1 rounded hover:bg-slate-700 transition-all flex items-center gap-2"
              >
                {isGenerating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-robot"></i>}
                Genera con AI
              </button>
            </div>
            <textarea 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-sm outline-none h-32 focus:border-blue-300 transition-all font-serif"
              value={data.conclusions}
              onChange={(e) => setData({...data, conclusions: e.target.value})}
              placeholder="Inserisci qui le conclusioni cliniche..."
            />
          </section>

          <div className="flex justify-end gap-4 pb-12">
            <button onClick={() => { if(confirm('Eliminare i dati correnti?')) setData(INITIAL_DATA) }} className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors uppercase">Annulla Tutto</button>
            <button 
              onClick={() => setView('preview')}
              className="bg-slate-800 text-white px-8 py-2.5 rounded font-bold text-xs uppercase tracking-widest shadow-md hover:bg-black transition-all"
            >
              Genera Referto Clinico
            </button>
          </div>
        </div>
      ) : (
        <ReportPreview data={data} onEdit={() => setView('edit')} />
      )}
    </div>
  );
};

export default App;
