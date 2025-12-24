
export type StenosisLevel = 'assente' | '<50%' | '50-69%' | '70-99%' | 'occlusione';
export type MeasurementMethod = 'NASCET' | 'ECST';

export interface VesselData {
  imt?: number;
  plaqueType?: string;
  stenosis: StenosisLevel;
  psv?: number;
  edv?: number;
  notes?: string;
}

export interface TechnicalSettings {
  equipment: string;
  probe: string;
  angle: string;
  other: string;
}

export interface ExamData {
  patientName: string;
  doctorName: string;
  birthDate: string;
  examDate: string;
  indication: string;
  measurementMethod: MeasurementMethod;
  technicalSettings: TechnicalSettings;
  right: {
    acc: VesselData;
    bulbo: VesselData;
    aci: VesselData;
    ace: VesselData;
    av: VesselData;
    scl: VesselData;
  };
  left: {
    acc: VesselData;
    bulbo: VesselData;
    aci: VesselData;
    ace: VesselData;
    av: VesselData;
    scl: VesselData;
  };
  generalNotes: string;
  conclusions: string;
}

export const INITIAL_VESSEL: VesselData = {
  stenosis: 'assente',
  plaqueType: '',
  notes: ''
};

export const INITIAL_DATA: ExamData = {
  patientName: '',
  doctorName: '',
  birthDate: '',
  examDate: new Date().toISOString().split('T')[0],
  indication: '',
  measurementMethod: 'NASCET',
  technicalSettings: {
    equipment: '',
    probe: 'Lineare 7.5-12 MHz',
    angle: '60°',
    other: ''
  },
  right: {
    acc: { ...INITIAL_VESSEL },
    bulbo: { ...INITIAL_VESSEL },
    aci: { ...INITIAL_VESSEL },
    ace: { ...INITIAL_VESSEL },
    av: { ...INITIAL_VESSEL },
    scl: { ...INITIAL_VESSEL }
  },
  left: {
    acc: { ...INITIAL_VESSEL },
    bulbo: { ...INITIAL_VESSEL },
    aci: { ...INITIAL_VESSEL },
    ace: { ...INITIAL_VESSEL },
    av: { ...INITIAL_VESSEL },
    scl: { ...INITIAL_VESSEL }
  },
  generalNotes: '',
  conclusions: ''
};
