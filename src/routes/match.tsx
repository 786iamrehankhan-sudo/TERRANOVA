import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, Save, Info, ChevronDown } from "lucide-react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { toast } from "sonner";
import { PageHeader, DemoBadge } from "@/components/site";
import { Button } from "@/components/ui/button";
import { LOCATIONS, MISSIONS, TARGETS, getTarget, type MissionId } from "@/lib/data";
import { rankLocations, type MatchResult } from "@/lib/matching";
import { downloadReport } from "@/lib/report";
import { saveAnalysis } from "@/lib/saved";
import { cn } from "@/lib/utils";

interface S { target?: string | undefined; mission?: MissionId | undefined; locs?: string | undefined; run?: boolean | undefined }

export const Route = createFileRoute("/match")({
  validateSearch: (s: Record<string, unknown>): S => ({
    target: typeof s["target"] === "string" ? s["target"] : undefined,
    mission: MISSIONS.some((m) => m.id === s["mission"]) ? (s["mission"] as MissionId) : undefined,
    locs: typeof s["locs"] === "string" ? s["locs"] : undefined,
    run: s["run"] === true || s["run"] === "true" ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "AI Match — Find Earth places like the Moon or Mars · TerraTwin AI" },
      { name: "description", content: "Pick a Moon or Mars site and a mission, and get ranked Earth analogs with explained scores." },
      { property: "og:title", content: "AI Match — TerraTwin AI" },
      { property: "og:description", content: "Explainable matching of Earth analogs to Moon and Mars targets." },
    ],
  }),
  component: Match,
});

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="glass p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">Step {n}</p>
      <h3 className="mt-1 text-lg font-bold">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}
const chip = (on: boolean) => cn("rounded-full border px-3 py-1.5 text-sm transition", on ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground");

function Match() {
  const s = Route.useSearch();
  const initT = getTarget(s["target"] ?? "") ?? TARGETS[2]!;
  const [planet, setPlanet] = useState<"moon" | "mars">(initT.planet);
  const [target, setTarget] = useState(initT.id);
  const [mission, setMission] = useState<MissionId>(s["mission"] ?? "rover");
  const [locs, setLocs] = useState<string[]>(() => {
    const ids = (s["locs"] ?? "").split(",").filter((id) => LOCATIONS.some((l) => l.id === id));
    return ids.length ? (ids.length === 1 ? LOCATIONS.map((l) => l.id) : ids) : LOCATIONS.map((l) => l.id);
  });
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const run = () => {
    if (!locs.length) { toast.error("Pick at least one Earth location."); return; }
    setLoading(true);
    setTimeout(() => {
      setResults(rankLocations(getTarget(target)!, LOCATIONS.filter((l) => locs.includes(l.id)), mission));
      setLoading(false);
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 50);
    }, 450);
  };
  useEffect(() => { if (s["run"]) run(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => setResults(null), [target, mission, locs]);

  return (
    <>
      <PageHeader eyebrow="AI Match" title="Find your Earth twin">
        Five quick steps. We compare 12 simple traits and explain every score.
      </PageHeader>
      <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 lg:grid-cols-2">
        <Step n={1} title="Choose a planet">
          <div className="flex gap-2">{(["moon", "mars"] as const).map((p) => (
            <button key={p} className={chip(planet === p)} onClick={() => { setPlanet(p); setTarget(TARGETS.find((t) => t.planet === p)!.id); }}>{p === "moon" ? "Moon" : "Mars"}</button>
          ))}</div>
        </Step>
        <Step n={2} title="Choose a target">
          <div className="flex flex-wrap gap-2">{TARGETS.filter((t) => t.planet === planet).map((t) => (
            <button key={t.id} className={chip(target === t.id)} onClick={() => setTarget(t.id)}>{t.name}</button>
          ))}</div>
        </Step>
        <Step n={3} title="Choose your mission">
          <div className="flex flex-wrap gap-2">{MISSIONS.map((m) => (
            <button key={m.id} title={m.short} className={chip(mission === m.id)} onClick={() => setMission(m.id)}>{m.label}</button>
          ))}</div>
          <p className="mt-2 text-xs text-muted-foreground">{MISSIONS.find((m) => m.id === mission)?.short}</p>
        </Step>
        <Step n={4} title="Select Earth locations">
          <div className="flex flex-wrap gap-2">{LOCATIONS.map((l) => (
            <button key={l.id} className={chip(locs.includes(l.id))} onClick={() => setLocs((x) => x.includes(l.id) ? x.filter((i) => i !== l.id) : [...x, l.id])}>{l.name}</button>
          ))}</div>
          <button className="mt-2 text-xs text-primary" onClick={() => setLocs(locs.length === LOCATIONS.length ? [] : LOCATIONS.map((l) => l.id))}>
            {locs.length === LOCATIONS.length ? "Clear all" : "Select all"}
          </button>
        </Step>
        <div className="lg:col-span-2">
          <Button variant="hero" size="lg" className="h-14 w-full text-base" onClick={run} disabled={loading}>
            {loading ? "Analyzing…" : "Step 5 · Find matching places"}
          </Button>
        </div>
      </div>
      {results && <Results results={results} target={target} mission={mission} />}
    </>
  );
}

function Results({ results, target, mission }: { results: MatchResult[]; target: string; mission: MissionId }) {
  const t = getTarget(target)!;
  const top = results.slice(0, 3);
  const radar = useMemo(() => results[0]!.features.map((f) => {
    const row: Record<string, string | number | null> = { trait: f.label, [t.name]: f.target };
    top.forEach((r) => (row[r.location.name] = r.features.find((x) => x.key === f.key)!.site));
    return row;
  }), [results]); // eslint-disable-line react-hooks/exhaustive-deps
  const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

  return (
    <section id="results" className="mx-auto mt-14 max-w-7xl scroll-mt-20 px-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold">Best matches for {t.name}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            Mission: {MISSIONS.find((m) => m.id === mission)?.label} <DemoBadge>Curated traits, not measurements</DemoBadge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="glass" onClick={() => { saveAnalysis({ targetId: target, missionId: mission, locationIds: results.map((r) => r.location.id), top: results.slice(0, 3).map((r) => ({ name: r.location.name, similarity: r.similarity })) }); toast.success("Saved to Research"); }}><Save /> Save</Button>
          <Button asChild variant="glass"><Link to="/compare" search={{ ids: top.map((r) => r.location.id).join(",") }}>Compare top</Link></Button>
          <Button variant="hero" onClick={() => downloadReport({ targetId: target, missionId: mission, results }).then(() => toast.success("Report downloaded"))}><Download /> PDF report</Button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          {results.map((r, i) => <ResultCard key={r.location.id} r={r} rank={i + 1} />)}
        </div>
        <div className="glass h-fit p-5 lg:sticky lg:top-20">
          <h3 className="font-bold">Trait profile: target vs top matches</h3>
          <p className="text-xs text-muted-foreground">0 = none, 1 = a lot.</p>
          <div className="h-[420px]">
            <ResponsiveContainer>
              <RadarChart data={radar} outerRadius="72%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 1]} tick={false} axisLine={false} />
                <Radar name={t.name} dataKey={t.name} stroke="var(--foreground)" fill="var(--foreground)" fillOpacity={0.08} strokeDasharray="4 3" />
                {top.map((r, i) => <Radar key={r.location.id} name={r.location.name} dataKey={r.location.name} stroke={colors[i]} fill={colors[i]} fillOpacity={0.12} />)}
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <details className="mt-2 text-sm text-muted-foreground">
            <summary className="flex cursor-pointer items-center gap-1 text-foreground"><Info className="h-4 w-4" /> How is the score calculated?</summary>
            <p className="mt-2">For each trait: similarity = 1 − |target − site|. Every trait has weight 1, plus extra weight for traits that matter to your mission. <b>Similarity</b> is the weighted average over traits with data on both sides. <b>Coverage</b> is how much of the weight had data. <b>Confidence</b> = coverage × how well the site is documented. Missing data is skipped, never counted as zero.</p>
          </details>
        </div>
      </div>
    </section>
  );
}

function ResultCard({ r, rank }: { r: MatchResult; rank: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("glass overflow-hidden", rank === 1 && "glow border-primary/50")}>
      <div className="flex gap-4 p-4">
        <img src={r.location.image} alt="" loading="lazy" width={1280} height={768} className="h-24 w-32 shrink-0 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground">#{rank} · {r.location.country}</p>
              <h4 className="text-lg font-bold">{r.location.name}</h4>
            </div>
            <p className="font-display text-3xl font-bold text-primary">{r.similarity}%</p>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
            <Bar label="Data coverage" v={r.coverage} />
            <Bar label="Confidence" v={r.confidence} />
          </div>
          <p className="mt-2 text-xs">{r.missionFit ? <span className="text-success">✓ Used for this mission type</span> : <span className="text-muted-foreground">Not commonly used for this mission</span>}</p>
        </div>
      </div>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-center gap-1 border-t border-border py-2 text-xs text-primary">
        {open ? "Hide" : "Why this score?"} <ChevronDown className={cn("h-3 w-3 transition", open && "rotate-180")} />
      </button>
      {open && (
        <div className="grid gap-3 border-t border-border p-4 text-sm sm:grid-cols-2">
          <div><p className="font-semibold text-success">Why it matches</p><p className="text-muted-foreground">{r.matches.join(", ") || "No strong matches"}</p></div>
          <div><p className="font-semibold text-warning">Important differences</p><p className="text-muted-foreground">{r.differences.join(", ") || "None major"}</p></div>
          <div><p className="font-semibold">Available data</p><p className="text-muted-foreground">{r.location.datasets.filter((d) => d.status !== "missing").map((d) => d.name).join(", ")}</p></div>
          <div><p className="font-semibold">Missing information</p><p className="text-muted-foreground">{r.missing.join(", ") || "None"}</p></div>
          <div className="sm:col-span-2"><Link to="/analogs/$id" params={{ id: r.location.id }} className="text-primary">View location details →</Link></div>
        </div>
      )}
    </div>
  );
}

function Bar({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="flex justify-between text-muted-foreground"><span>{label}</span><span>{v}%</span></div>
      <div className="mt-1 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${v}%` }} /></div>
    </div>
  );
}
