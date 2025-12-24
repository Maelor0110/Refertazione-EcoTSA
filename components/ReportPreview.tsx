
import React from 'react';
import { ExamData } from '../types';

interface Props {
  data: ExamData;
  onEdit: () => void;
}

const ReportPreview: React.FC<Props> = ({ data, onEdit }) => {
  const handlePrint = () => {
    // Piccolo ritardo per assicurarsi che il DOM sia stabile
    setTimeout(() => {
        window.print();
    }, 100);
  };

  const VesselRow = ({ label, left, right }: { label: string, left: any, right: any }) => (
    <tr className="border-b border-black last:border-0">
      <td className="py-2 px-3 font-bold text-slate-800 text-[10.5px] bg-slate-50 w-1/4 border-r border-black">{label}</td>
      <td className="py-2 px-3 text-xs border-r border-black w-3/8">
        <div className="flex flex-col gap-0.5">
          <span className={`font-bold ${right.stenosis !== 'assente' && right.stenosis !== '<50%' ? 'text-red-800 uppercase underline' : 'text-black'}`}>
            {right.stenosis === 'assente' ? 'Assenza di stenosi' : `Stenosi ${right.stenosis}`}
          </span>
          {right.imt && <span className="text-[10px] text-black">IMT: <strong>{right.imt} mm</strong></span>}
          {right.plaqueType && <span className="text-[10px] text-slate-700 italic">{right.plaqueType}</span>}
          {right.psv ? (
            <div className="flex gap-2 mt-0.5">
               <span className="text-[10px] font-bold text-black">PSV: {right.psv} cm/s</span>
               {right.edv && <span className="text-[10px] text-slate-700">EDV: {right.edv} cm/s</span>}
            </div>
          ) : null}
          {right.notes && <span className="text-[10px] text-slate-600 leading-tight mt-0.5">{right.notes}</span>}
        </div>
      </td>
      <td className="py-2 px-3 text-xs w-3/8">
        <div className="flex flex-col gap-0.5">
          <span className={`font-bold ${left.stenosis !== 'assente' && left.stenosis !== '<50%' ? 'text-red-800 uppercase underline' : 'text-black'}`}>
            {left.stenosis === 'assente' ? 'Assenza di stenosi' : `Stenosi ${left.stenosis}`}
          </span>
          {left.imt && <span className="text-[10px] text-black">IMT: <strong>{left.imt} mm</strong></span>}
          {left.plaqueType && <span className="text-[10px] text-slate-700 italic">{left.plaqueType}</span>}
          {left.psv ? (
            <div className="flex gap-2 mt-0.5">
               <span className="text-[10px] font-bold text-black">PSV: {left.psv} cm/s</span>
               {left.edv && <span className="text-[10px] text-slate-700">EDV: {left.edv} cm/s</span>}
            </div>
          ) : null}
          {left.notes && <span className="text-[10px] text-slate-600 leading-tight mt-0.5">{left.notes}</span>}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="max-w-4xl mx-auto py-4 print:py-0 print:max-w-none">
      <div className="no-print flex justify-between items-center mb-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <button onClick={onEdit} className="text-slate-500 text-xs font-bold uppercase hover:text-slate-800 flex items-center gap-2">
          <i className="fas fa-chevron-left"></i> Torna ai dati
        </button>
        <button onClick={handlePrint} className="bg-slate-900 text-white px-8 py-2.5 rounded font-black text-xs uppercase tracking-widest shadow hover:bg-black transition-all flex items-center gap-2">
            <i className="fas fa-file-pdf"></i> Stampa Referto / PDF
        </button>
      </div>

      <div className="bg-white p-12 print:p-0 font-serif print:shadow-none min-h-[297mm] text-black leading-snug">
        {/* Intestazione Clinica */}
        <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-8">
          <div className="space-y-1">
            <p className="text-xl font-bold uppercase tracking-tight">{data.doctorName || 'Dott. ________________'}</p>
            <p className="text-[11px] font-medium uppercase text-slate-600">Specialista in Diagnostica Vascolare - Ecocolordoppler</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data del referto</p>
            <p className="text-sm font-bold border-b border-black inline-block">{new Date(data.examDate).toLocaleDateString('it-IT')}</p>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-lg font-bold uppercase tracking-widest border-2 border-black inline-block px-10 py-1">Referto Ecocolordoppler TSA</h2>
        </div>

        {/* Dati Paziente */}
        <div className="grid grid-cols-2 gap-10 mb-8 border border-black p-4">
          <div className="space-y-2">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Paziente</p>
              <p className="font-bold text-base uppercase leading-tight">{data.patientName || '_________________________'}</p>
            </div>
            <div className="text-[12px]">
              Data di nascita: <strong>{data.birthDate ? new Date(data.birthDate).toLocaleDateString('it-IT') : '___/___/___'}</strong>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Quesito Diagnostico</p>
              <p className="text-xs italic leading-tight">{data.indication || 'Non specificato.'}</p>
            </div>
          </div>
        </div>

        {/* Parametri Tecnici */}
        <div className="mb-6 flex gap-6 items-center justify-between text-[11px] border-y border-slate-300 py-2 bg-slate-50/50 px-3">
          <div className="flex gap-4">
            <p>Apparato: <strong>{data.technicalSettings.equipment || 'Digital Ultrasound'}</strong></p>
            <p>Sonda: <strong>{data.technicalSettings.probe}</strong></p>
            <p>θ: <strong>{data.technicalSettings.angle}</strong></p>
          </div>
          <p className="font-bold text-black uppercase">Analisi Stenosi: {data.measurementMethod}</p>
        </div>

        {/* Analisi Segmentale */}
        <div className="mb-10">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-2">Analisi Segmentale</h3>
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr className="bg-slate-100 text-black text-[10px] uppercase font-bold">
                <th className="py-2 px-3 text-left border border-black w-1/4 tracking-widest">Segmento</th>
                <th className="py-2 px-3 text-left border border-black">Destra</th>
                <th className="py-2 px-3 text-left border border-black">Sinistra</th>
              </tr>
            </thead>
            <tbody>
              <VesselRow label="A. Carotide Comune" right={data.right.acc} left={data.left.acc} />
              <VesselRow label="Bulbo Carotideo" right={data.right.bulbo} left={data.left.bulbo} />
              <VesselRow label="A. Carotide Interna" right={data.right.aci} left={data.left.aci} />
              <VesselRow label="A. Carotide Esterna" right={data.right.ace} left={data.left.ace} />
              <VesselRow label="Arteria Vertebrale" right={data.right.av} left={data.left.av} />
              <VesselRow label="Arteria Succlavia" right={data.right.scl} left={data.left.scl} />
            </tbody>
          </table>
        </div>

        {/* Conclusioni */}
        <div className="mb-12">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-black mb-2 flex items-center gap-2">
            Conclusioni Diagnostiche
          </h3>
          <div className="p-5 border border-black bg-white min-h-[160px] text-[13.5px] leading-relaxed whitespace-pre-wrap font-serif">
            {data.conclusions || 'Esame nella norma. Non si evidenziano placche stenosanti emodinamicamente significative (>50%) nei distretti carotideo e vertebrale extracranico bilateralmente. IMT nei limiti per l\'età. Flussi vertebrali regolari per morfologia e direzione (ortogradi).'}
          </div>
        </div>

        {/* Firma */}
        <div className="mt-24 flex justify-end">
          <div className="text-center w-72">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-10">Firma del Medico Esecutore</p>
            <div className="w-full h-px bg-black opacity-20 mb-2"></div>
            <p className="text-base font-bold text-black italic font-serif leading-tight">{data.doctorName || 'Dott. ________________'}</p>
          </div>
        </div>

        {/* Nota Piè di Pagina */}
        <div className="mt-16 text-[8.5px] text-slate-500 uppercase font-medium leading-tight border-t border-slate-200 pt-4 italic">
          Indagine diagnostica eseguita secondo protocolli SIDV/SIUMB.<br/>
          Stenosi calcolata con criterio {data.measurementMethod}.<br/>
          I valori velocimetrici (PSV/EDV) sono espressi in cm/s.
        </div>
      </div>

      <div className="no-print mt-10 flex justify-center pb-10">
          <button onClick={handlePrint} className="bg-black text-white px-12 py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-3">
            <i className="fas fa-print"></i> Stampa Referto / Esporta PDF
          </button>
      </div>
    </div>
  );
};

export default ReportPreview;
