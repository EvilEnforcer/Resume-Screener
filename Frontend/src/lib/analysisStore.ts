import type { AnalysisResult } from "./categories";

export type StoredAnalysis = {
  id: string;
  result: AnalysisResult;
  resumeFilename: string;
  jobTitle: string;
};

const store = new Map<string, StoredAnalysis>();

export function saveAnalysis(a: Omit<StoredAnalysis, "id">): string {
  const id = Math.random().toString(36).slice(2, 10);
  store.set(id, { ...a, id });
  return id;
}

export function getAnalysis(id: string): StoredAnalysis | undefined {
  return store.get(id);
}
