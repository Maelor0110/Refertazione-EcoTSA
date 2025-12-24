
import React from 'react';
import { VesselData, ExamData, StenosisLevel } from '../types';

interface Props {
  label: string;
  side: 'right' | 'left';
  vessel: keyof ExamData['right'];
  data: VesselData;
  onUpdate: (side: 'right' | 'left', vessel: keyof ExamData['right'], field: string, value: any) => void;
  isVertebral?: boolean;
  showImt?: boolean;
}

const VesselInput: React.FC<Props> = ({ label, side, vessel, data, onUpdate, isVertebral = false, showImt = false }) => {
  const handleChange = (field: string, value: any) => {
    onUpdate(side, vessel, field, value);
  };

  return (
    <div className="bg-white p-3 rounded border border-slate-100 shadow-sm hover:border-blue-200 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-bold text-slate-800">{label}</h4>
        {showImt && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">IMT (mm):</span>
            <input 
              type="number" 
              step="0.1"
              placeholder="0.8"
              className="w-14 p-1 text-xs border rounded outline-none text-center"
              value={data.imt || ''}
              onChange={(e) => handleChange('imt', parseFloat(e.target.value))}
            />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <select 
          className="p-1.5 text-xs border rounded bg-slate-50 outline-none"
          value={data.stenosis}
          onChange={(e) => handleChange('stenosis', e.target.value as StenosisLevel)}
        >
          <option value="assente">No stenosi</option>
          <option value="<50%">&lt; 50%</option>
          <option value="50-69%">50-69%</option>
          <option value="70-99%">70-99%</option>
          <option value="occlusione">Occlusione</option>
        </select>

        {!isVertebral ? (
          <input 
            type="text" 
            placeholder="Placca (es. fibro-calcifica)"
            className="p-1.5 text-xs border rounded outline-none"
            value={data.plaqueType || ''}
            onChange={(e) => handleChange('plaqueType', e.target.value)}
          />
        ) : (
          <select 
            className="p-1.5 text-xs border rounded bg-slate-50 outline-none"
            value={data.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
          >
            <option value="">Flusso...</option>
            <option value="Ortogrado">Ortogrado</option>
            <option value="Retrogrado">Retrogrado</option>
            <option value="Pendolare">Pendolare</option>
          </select>
        )}

        <div className="flex gap-1">
          <input 
            type="number" 
            placeholder="PSV"
            className="w-full p-1.5 text-xs border rounded outline-none"
            value={data.psv || ''}
            onChange={(e) => handleChange('psv', parseFloat(e.target.value))}
          />
          <input 
            type="number" 
            placeholder="EDV"
            className="w-full p-1.5 text-xs border rounded outline-none"
            value={data.edv || ''}
            onChange={(e) => handleChange('edv', parseFloat(e.target.value))}
          />
        </div>
        
        {!isVertebral && (
          <input 
            type="text" 
            placeholder="Note brevi..."
            className="p-1.5 text-[11px] border rounded outline-none bg-slate-50 italic"
            value={data.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
        )}
      </div>
    </div>
  );
};

export default VesselInput;
