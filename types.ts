export type SalesScenario = 'COLD_CALL' | 'OFFLINE_EVENT' | 'REFERRAL' | 'FOLLOW_UP' | 'PARTNERSHIP';

export interface FormData {
  companyName: string;
  contactName: string;
  position: string;
  additionalInfo: string;
  scenario: SalesScenario;
}

export interface AnalysisData {
  customerAnalysis: string;
  connectionPoint: string;
  valueProp: string;
}

export interface GeneratedResult {
  script: string;
  analysis: AnalysisData;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}