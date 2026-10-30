import { FEATURES, type FeatureKey, type EarthLocation, type MissionId, type Target, MISSIONS } from "./data";

export interface FeatureResult {
  key: FeatureKey;
  label: string;
  weight: number;
  target: number | null;
  site: number | null;
  similarity: number | null; // 0–1, null when data missing
}

export interface MatchResult {
  location: EarthLocation;
  /** Weighted similarity across features where both sides have data (0–100). */
  similarity: number;
  /** Share of mission weight that had data on both sides (0–100). */
  coverage: number;
  /** coverage × site documentation (0–100). Separate from similarity. */
  confidence: number;
  features: FeatureResult[];
  matches: string[];
  differences: string[];
  missing: string[];
  missionFit: boolean;
}

/** Base weight 1 for every feature, plus the mission's extra weights. */
export function missionWeights(mission: MissionId): Record<FeatureKey, number> {
  const m = MISSIONS.find((x) => x.id === mission);
  const out = {} as Record<FeatureKey, number>;
  (Object.keys(FEATURES) as FeatureKey[]).forEach((k) => (out[k] = 1 + (m?.weights[k] ?? 0)));
  return out;
}

export function scoreLocation(target: Target, location: EarthLocation, mission: MissionId): MatchResult {
  const weights = missionWeights(mission);
  let total = 0, covered = 0, acc = 0;
  const features: FeatureResult[] = (Object.keys(FEATURES) as FeatureKey[]).map((key) => {
    const w = weights[key];
    const t = target.profile[key];
    const s = location.profile[key];
    total += w;
    let sim: number | null = null;
    if (t !== null && s !== null) {
      sim = 1 - Math.abs(t - s);
      covered += w;
      acc += sim * w;
    }
    return { key, label: FEATURES[key].label, weight: w, target: t, site: s, similarity: sim };
  });
  const similarity = covered ? (acc / covered) * 100 : 0;
  const coverage = total ? (covered / total) * 100 : 0;
  const confidence = coverage * location.documentation;
  const important = [...features].filter((f) => f.similarity !== null).sort((a, b) => b.weight - a.weight);
  const matches = important.filter((f) => (f.similarity ?? 0) >= 0.8).slice(0, 4).map((f) => f.label);
  const differences = important.filter((f) => (f.similarity ?? 1) < 0.5).slice(0, 4).map((f) => f.label);
  const missing = features.filter((f) => f.similarity === null).map((f) => f.label);
  return {
    location, similarity: round(similarity), coverage: round(coverage), confidence: round(confidence),
    features, matches, differences, missing, missionFit: location.missions.includes(mission),
  };
}

export function rankLocations(target: Target, locations: EarthLocation[], mission: MissionId): MatchResult[] {
  return locations.map((l) => scoreLocation(target, l, mission)).sort((a, b) => b.similarity - a.similarity);
}

const round = (n: number) => Math.round(n * 10) / 10;
