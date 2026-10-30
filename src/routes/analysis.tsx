import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, DemoBadge, Missing } from "@/components/site";
import { FEATURES, LOCATIONS, MISSIONS, TARGETS, getLocation, type FeatureKey } from "@/lib/data";
import { scoreLocation } from "@/lib/matching";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analysis")({
  validateSearch: (s: Record<string, unknown>): { loc?: string | undefined } => ({
    loc: typeof s["loc"] === "string" ? (s["loc"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Analysis Center — TERRANOVA" },
      { name: "description", content: "Terrain, environment, geology and mission suitability for each Earth analog." },
      { property: "og:title", content: "Analysis Center — TERRANOVA" },
      { property: "og:description", content: "Explore terrain, climate and geology of Earth analog sites." },
    ],
  }),
  component: Analysis,
});

const TABS: { id: string; label: string; keys: FeatureKey[] }[] = [
  { id: "terrain", label: "Terrain", keys: ["roughness", "slope", "regolith", "impact"] },
  { id: "environment", label: "Environment", keys: ["aridity", "cold", "lighting", "sterile"] },
  { id: "geology", label: "Geology", keys: ["basalt", "sediment", "ice", "caves"] },
  { id: "mission", label: "Mission Suitability", keys: [] },
];

function Analysis() {
  const { loc } = Route.useSearch();
  const [id, setId] = useState(getLocation(loc ?? "")?.id ?? "atacama");
  const [tab, setTab] = useState("terrain");
  const l = getLocation(id)!;
  const t = TABS.find((x) => x.id === tab)!;
  const data = t.id === "mission"
    ? MISSIONS.map((m) => ({ name: m.label, value: Math.max(...TARGETS.map((tg) => scoreLocation(tg, l, m.id).similarity)) }))
    : t.keys.map((k) => ({ name: FEATURES[k].label, value: l.profile[k] }));
  return (
    <>
      <PageHeader eyebrow="Analysis" title="Analysis center">Simple overview first; open the details for more. <DemoBadge /></PageHeader>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <select value={id} onChange={(e) => setId(e.target.value)} className="rounded-lg border border-input bg-popover px-3 py-2 text-sm">
            {LOCATIONS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </select>
          {TABS.map((x) => <button key={x.id} onClick={() => setTab(x.id)} className={cn("rounded-full border px-4 py-1.5 text-sm", tab === x.id ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground")}>{x.label}</button>)}
          <Link to="/compare" search={{ ids: id }} className="ml-auto text-sm text-primary">Compare locations →</Link>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <div className="glass p-5">
            <h2 className="text-xl font-bold">{t.label} · {l.name}</h2>
            <p className="text-xs text-muted-foreground">{t.id === "mission" ? "Best similarity (%) to any Moon/Mars target for each mission." : "Ratings 0–1 (0 = none, 1 = a lot)."}</p>
            <div className="mt-4 h-80">
              <ResponsiveContainer>
                <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
                  <XAxis type="number" domain={[0, t.id === "mission" ? 100 : 1]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={130} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Bar dataKey="value" fill="var(--chart-1)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-4">
            <div className="glass p-5 text-sm">
              <p><b>Elevation:</b> {l.climate.elevationM} m</p>
              <p><b>Mean temp:</b> {l.climate.meanTempC !== null ? `${l.climate.meanTempC} °C` : <Missing />}</p>
              <p><b>Precipitation:</b> {l.climate.precipMm !== null ? `${l.climate.precipMm} mm/yr` : <Missing />}</p>
              <p className="mt-2 text-muted-foreground">{t.id === "geology" ? l.geology : t.id === "terrain" ? l.terrainText : l.climate.note}</p>
            </div>
            <details className="glass p-5 text-sm">
              <summary className="cursor-pointer font-semibold">Advanced: what each trait means</summary>
              <ul className="mt-3 space-y-1 text-muted-foreground">{(Object.keys(FEATURES) as FeatureKey[]).map((k) => <li key={k}><b className="text-foreground">{FEATURES[k].label}:</b> {FEATURES[k].help}</li>)}</ul>
            </details>
            <div className="glass relative overflow-hidden p-2">
              <img src="/textures/earth.jpg" alt="World map" className="w-full rounded-lg opacity-80" />
              {LOCATIONS.map((x) => (
                <button key={x.id} title={x.name} onClick={() => setId(x.id)}
                  className={cn("absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background", x.id === id ? "bg-primary glow" : "bg-warning")}
                  style={{ left: `${((x.lon + 180) / 360) * 100}%`, top: `${((90 - x.lat) / 180) * 100}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
