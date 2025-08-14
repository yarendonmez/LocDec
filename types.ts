export interface Source {
  uri: string;
  title: string;
}

export interface Justification {
  [category: string]: string[];
}

export interface AnalysisResult {
  location: string;
  confidence: string;
  justification: Justification;
  sources?: Source[];
}
