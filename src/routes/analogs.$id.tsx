import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, AlertTriangle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Missing } from "@/components/site";
import { getLocation, getMission, type DataStatus } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analogs/$id")({
  loader: ({ params }) => {
    const l = getLocation(params.id);
    if (!l) throw notFound();
    return { id: l.id };
  },
  head: ({ loaderData }) => {
    const l = loaderData ? getLocation(loaderData.id) : undefined;
    return {
      meta: [
        { title: l ? `${l.name} — Earth analog · TERRANOVA` : "Location — TERRANOVA" },
        { name: "description", content: l?.summary ?? "Earth analog location." },
        { property: "og:title", content: l ? `${l.name} — TERRANOVA` : "Location" },
        { property: "og:description", content: l?.summary ?? "Earth analog location." },
      ],
    };
  },
  component: LocationPage,
});

const statusStyle: Record<DataStatus, string> = {
  available: "text-success border-success/40 bg-success/10",
  partial: "text-warning border-warning/40 bg-warning/10",
  missing: "text-muted-foreground border-border",
};

function LocationPage() {
  const l = getLocation(Route.useLoaderData().id)!;
  const blocks = [
    { h: "Geography", b: l.geography },
    { h: "Terrain", b: l.terrainText },
    { h: "Geology", b: l.geology },
    { h: "Climate", b: l.climate.note },
  ];
  return (
    <>
      <div className="relative h-[55vh] min-h-[360px] overflow-hidden">
        <img src={l.image} alt={l.name} width={1280} height={768} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6">
          <Link to="/analogs" className="text-sm text-primary">← All locations</Link>
          <h1 className="mt-2 text-5xl font-bold">{l.name}</h1>
          <p className="mt-2 flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" />{l.country} · {l.lat.toFixed(2)}°, {l.lon.toFixed(2)}°</p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="mt-6 max-w-3xl text-lg">{l.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="hero"><Link to="/analysis" search={{ loc: l.id }}>Analyze</Link></Button>
          <Button asChild variant="glass"><Link to="/compare" search={{ ids: l.id }}>Compare</Link></Button>
          <Button asChild variant="glass"><Link to="/match" search={{ locs: l.id }}>Match to Moon/Mars</Link></Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat label="Mean temperature" value={l.climate.meanTempC !== null ? `${l.climate.meanTempC} °C` : null} />
          <Stat label="Yearly rain/snow" value={l.climate.precipMm !== null ? `${l.climate.precipMm} mm` : null} />
          <Stat label="Elevation" value={`${l.climate.elevationM} m`} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Approximate published figures for orientation; check original sources before use.</p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {blocks.map((b) => <div key={b.h} className="glass p-6"><h2 className="text-xl font-bold">{b.h}</h2><p className="mt-2 text-muted-foreground">{b.b}</p></div>)}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="glass p-6">
            <h2 className="text-xl font-bold">Mission uses</h2>
            <ul className="mt-3 space-y-2">{l.missions.map((m) => <li key={m} className="text-sm">🚀 {getMission(m)?.label}</li>)}</ul>
          </div>
          <div className="glass p-6">
            <h2 className="text-xl font-bold">Strengths</h2>
            <ul className="mt-3 space-y-2">{l.strengths.map((s) => <li key={s} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-success" />{s}</li>)}</ul>
          </div>
          <div className="glass p-6">
            <h2 className="text-xl font-bold">Limitations</h2>
            <ul className="mt-3 space-y-2">{l.limitations.map((s) => <li key={s} className="flex gap-2 text-sm"><AlertTriangle className="h-4 w-4 shrink-0 text-warning" />{s}</li>)}</ul>
          </div>
        </div>

        <div className="glass mt-8 p-6">
          <h2 className="text-xl font-bold">Data availability</h2>
          <p className="mt-1 text-sm text-muted-foreground">Public Earth datasets that cover this area. Not live-connected to this app.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {l.datasets.map((d) => <span key={d.name} className={cn("rounded-full border px-3 py-1 text-xs", statusStyle[d.status])}>{d.name} · {d.status}</span>)}
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string | null }) {
  return <div className="glass p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-display text-2xl font-bold">{value ?? <Missing />}</p></div>;
}
