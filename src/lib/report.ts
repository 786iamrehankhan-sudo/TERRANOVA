import type { MatchResult } from "./matching";
import { getMission, getTarget, SOURCES } from "./data";

export async function downloadReport(opts: { targetId: string; missionId: string; results: MatchResult[] }) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const target = getTarget(opts.targetId);
  const mission = getMission(opts.missionId);
  let y = 18;
  const line = (text: string, size = 10, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const rows = doc.splitTextToSize(text, 180);
    rows.forEach((r: string) => {
      if (y > 280) { doc.addPage(); y = 18; }
      doc.text(r, 15, y);
      y += size * 0.5 + 1.5;
    });
  };
  line("TERRANOVA — Earth Analog Report", 16, true);
  line(`Generated ${new Date().toLocaleString()}`, 9);
  y += 3;
  line(`Planetary target: ${target?.name} (${target?.planet === "moon" ? "Moon" : "Mars"}, ${target?.coords})`, 11, true);
  line(`Mission type: ${mission?.label}`, 11, true);
  line(`Earth locations compared: ${opts.results.map((r) => r.location.name).join(", ")}`);
  y += 3;
  line("Matching scores", 13, true);
  opts.results.forEach((r, i) => {
    line(`${i + 1}. ${r.location.name}, ${r.location.country}`, 11, true);
    line(`Similarity ${r.similarity}%  ·  Data coverage ${r.coverage}%  ·  Confidence ${r.confidence}%  ·  Listed for this mission: ${r.missionFit ? "Yes" : "No"}`);
    line(`Why it matches: ${r.matches.join(", ") || "No strong matches"}`);
    line(`Important differences: ${r.differences.join(", ") || "None major"}`);
    line(`Missing information: ${r.missing.join(", ") || "None"}`);
    y += 2;
  });
  line("Methodology", 13, true);
  line("Each place is described by 12 simple traits (dryness, cold, roughness, volcanic rock, impact features, ground ice, etc.) rated 0–1 from published field-analog literature. For each trait, similarity = 1 − |target − site|. Traits are weighted (base 1, plus extra weight for traits that matter to the chosen mission). Similarity is the weighted average over traits with data on both sides. Coverage is the share of weight with data. Confidence = coverage × how well the site is documented.");
  line("Limitations", 13, true);
  line("Trait ratings are curated demonstration values, not instrument measurements or NASA data. Earth sites are partial analogs only: none reproduces low gravity, vacuum or thin CO2 atmosphere, or space radiation. Live dataset connections are not implemented. TERRANOVA is not endorsed by NASA.");
  line("Data sources (reference only, not live-connected)", 13, true);
  SOURCES.forEach((s) => line(`${s.name} — ${s.url}`));
  doc.save(`terranova-${opts.targetId}-${opts.missionId}.pdf`);
}
