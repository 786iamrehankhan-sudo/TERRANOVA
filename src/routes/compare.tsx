import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, DemoBadge, Missing } from "@/components/site";
import { FEATURES, LOCATIONS, getMission, type FeatureKey } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compare")({
  validateSearch: (s: Record<string, unknown>): { ids?: string | undefined } => ({
    ids: typeof s["ids"] === "string" ? (s["ids"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Compare Earth Analogs — TERRANOVA" },
      { name: "description", content: "Compare Earth analog sites side by side." },
      { property: "og:title", content: "Compare Earth Analogs — TERRANOVA" },
      { property: "og:description", content: "Side-by-side comparison of Moon and Mars analog sites." },
    ],
  }),
  component: Compare,
});

function Compare() {
  const { ids } = Route.useSearch();
  const [sel, setSel] = useState<string[]>(() => {
    const x = (ids ?? "").split(",").filter((i) => LOCATIONS.some((l) => l.id === i));
    return x.length >= 2 ? x : [...new Set([...x, "atacama", "antarctica"])].slice(0, 3);
  });
  const locs = LOCATIONS.filter((l) => sel.includes(l.id));
  return (
    <>
      <PageHeader eyebrow="Compare" title="Side by side">Pick two or more places. <DemoBadge>Curated trait ratings</DemoBadge></PageHeader>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {LOCATIONS.map((l) => (
            <button key={l.id} onClick={() => setSel((s) => s.includes(l.id) ? s.filter((i) => i !== l.id) : [...s, l.id])}
              className={cn("rounded-full border px-3 py-1.5 text-sm", sel.includes(l.id) ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground")}>{l.name}</button>
          ))}
        </div>
        {locs.length < 2 ? <p className="glass mt-6 p-8 text-center text-muted-foreground">Select at least two locations.</p> : (
          <div className="mt-6 overflow-x-auto">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${locs.length}, minmax(240px, 1fr))` }}>
              {locs.map((l) => (
                <div key={l.id} className="glass overflow-hidden">
                  <img src={l.image} alt={l.name} loading="lazy" width={1280} height={768} className="aspect-video w-full object-cover" />
                  <div className="space-y-3 p-4 text-sm">
                    <Link to="/analogs/$id" params={{ id: l.id }} className="text-lg font-bold">{l.name}</Link>
                    <p><b>Terrain:</b> {l.terrainText}</p>
                    <p><b>Environment:</b> {l.climate.meanTempC ?? <Missing />}{l.climate.meanTempC !== null && " °C mean"} · {l.climate.precipMm !== null ? `${l.climate.precipMm} mm/yr` : <Missing />}</p>
                    <p><b>Geology:</b> {l.geology}</p>
                    <p><b>Missions:</b> {l.missions.map((m) => getMission(m)?.label).join(", ")}</p>
                    <div className="space-y-1">
                      {(Object.keys(FEATURES) as FeatureKey[]).map((k) => {
                        const v = l.profile[k];
                        return (
                          <div key={k}>
                            <div className="flex justify-between text-xs text-muted-foreground"><span>{FEATURES[k].label}</span><span>{v ?? "n/a"}</span></div>
                            <div className="h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(v ?? 0) * 100}%` }} /></div>
                          </div>
                        );
                      })}
                    </div>
                    <p><b>Data:</b> {l.datasets.map((d) => `${d.name} (${d.status})`).join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
