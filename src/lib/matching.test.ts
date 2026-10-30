import { describe, expect, it } from "vitest";
import { scoreLocation, missionWeights } from "./matching";
import { getLocation, getTarget, type EarthLocation } from "./data";

describe("matching engine", () => {
  it("is deterministic (no random scores)", () => {
    const t = getTarget("jezero")!, l = getLocation("death-valley")!;
    expect(scoreLocation(t, l, "geology").similarity).toBe(scoreLocation(t, l, "geology").similarity);
  });

  it("treats missing data as missing, not zero", () => {
    const t = getTarget("gale")!;
    const base = getLocation("atacama")!;
    const withGap: EarthLocation = { ...base, profile: { ...base.profile, cold: null } };
    const r = scoreLocation(t, withGap, "rover");
    expect(r.missing).toContain("Cold");
    expect(r.coverage).toBeLessThan(100);
    expect(r.features.find((f) => f.key === "cold")!.similarity).toBeNull();
  });

  it("identical profiles score 100%", () => {
    const t = getTarget("shackleton")!;
    const l: EarthLocation = { ...getLocation("haughton")!, profile: { ...t.profile } };
    expect(scoreLocation(t, l, "astronaut").similarity).toBe(100);
  });

  it("mission choice increases weight of its key features", () => {
    expect(missionWeights("underground").caves).toBe(5);
    expect(missionWeights("rover").caves).toBe(1);
  });
});
