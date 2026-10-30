import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/site";
import { Button } from "@/components/ui/button";
import { DATASETS, LOCATIONS, SOURCES, getMission, getTarget, type MissionId } from "@/lib/data";
import { rankLocations } from "@/lib/matching";
import { downloadReport } from "@/lib/report";
import { deleteSaved, loadSaved, type SavedAnalysis } from "@/lib/saved";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research & Reports — TERRANOVA" },
      { name: "description", content: "Saved analyses, PDF reports, data sources and methodology." },
      { property: "og:title", content: "Research & Reports — TERRANOVA" },
      { property: "og:description", content: "Saved analyses, reports, data sources and methodology." },
    ],
  }),
  component: Research,
});

function Research() {
  const [saved, setSaved] = useState<SavedAnalysis[]>([]);
  useEffect(() => setSaved(loadSaved()), []);
  const report = (a: SavedAnalysis) => downloadReport({
    targetId: a.targetId, missionId: a.missionId,
    results: rankLocations(getTarget(a.targetId)!, LOCATIONS.filter((l) => a.locationIds.includes(l.id)), a.missionId as MissionId),
  });
  return (
    <>
      <PageHeader eyebrow="Research" title="Research & reports">Your saved analyses, sources and how scores work.</PageHeader>
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6">
        <section>
          <h2 className="text-2xl font-bold">Saved analyses</h2>
          <p className="text-xs text-muted-foreground">Stored in this browser only.</p>
          {saved.length === 0 ? (
            <p className="glass mt-4 p-6 text-muted-foreground">Nothing saved yet. <Link to="/match" className="text-primary">Run an AI match →</Link></p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {saved.map((a) => (
                <div key={a.id} className="glass p-5">
                  <p className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</p>
                  <h3 className="font-bold">{getTarget(a.targetId)?.name} · {getMission(a.missionId)?.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.top.map((t) => `${t.name} ${t.similarity}%`).join(" · ")}</p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="hero" onClick={() => report(a)}><Download /> PDF</Button>
                    <Button size="sm" variant="glass" asChild><Link to="/compare" search={{ ids: a.locationIds.slice(0, 3).join(",") }}>Compare</Link></Button>
                    <Button size="sm" variant="ghost" onClick={() => { deleteSaved(a.id); setSaved(loadSaved()); }}><Trash2 /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        <section>
          <h2 className="text-2xl font-bold">Scientific data sources</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {SOURCES.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="glass block p-5 hover:glow">
                <p className="font-display text-lg font-bold">{s.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.provides}</p>
                <p className="mt-2 text-xs text-warning">Reference only — not connected live</p>
              </a>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DATASETS.map((d) => <div key={d.name} className="glass p-4 text-sm"><b>{d.name}</b> <span className="text-xs text-primary">{d.body}</span><p className="text-muted-foreground">{d.what}</p></div>)}
          </div>
        </section>
        <section className="glass p-6">
          <h2 className="text-2xl font-bold">Methodology & limitations</h2>
          <p className="mt-3 text-muted-foreground">Each place gets 12 simple trait ratings (0–1) curated from published field-analog literature. For each trait, similarity = 1 − |target − site|. Every trait has weight 1, plus extra weight for traits important to the chosen mission. Similarity is the weighted average over traits where both sides have data; coverage is the share of weight with data; confidence = coverage × site documentation. Missing data is skipped, never treated as zero.</p>
          <p className="mt-3 text-muted-foreground">Limits: ratings are demonstration values, not instrument measurements or NASA data. No Earth site reproduces low gravity, vacuum, a thin CO₂ atmosphere or space radiation. TERRANOVA is not endorsed by NASA.</p>
        </section>
      </div>
    </>
  );
}
