export interface ImageRenderedDetails {
  imageIndex: number;
  series: number;
  imageSource: string;
  patientInfo: PatientInfo;
  loadDelay: number;
}

export interface PatientInfo {
  name: string;
  id: string;
}