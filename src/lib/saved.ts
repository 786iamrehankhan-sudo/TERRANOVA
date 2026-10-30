export interface SavedAnalysis {
  id: string;
  createdAt: string;
  targetId: string;
  missionId: string;
  locationIds: string[];
  top: { name: string; similarity: number }[];
}
const KEY = "terratwin.saved";

export function loadSaved(): SavedAnalysis[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function saveAnalysis(a: Omit<SavedAnalysis, "id" | "createdAt">) {
  const all = loadSaved();
  all.unshift({ ...a, id: String(Date.now()), createdAt: new Date().toISOString() });
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 20)));
}
export function deleteSaved(id: string) {
  localStorage.setItem(KEY, JSON.stringify(loadSaved().filter((a) => a.id !== id)));
}
