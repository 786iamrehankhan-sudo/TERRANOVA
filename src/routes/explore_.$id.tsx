import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Planet3D } from "@/components/Planet3D";
import { LocationCard, DemoBadge } from "@/components/site";
import { Button } from "@/components/ui/button";
import { getTarget, LOCATIONS, MISSIONS } from "@/lib/data";
import { rankLocations } from "@/lib/matching";

export const Route = createFileRoute("/explore_/$id")({
  loader: ({ params }) => {
    const t = getTarget(params.id);
    if (!t) throw notFound();
    return t;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} — TerraTwin AI` : "Target — TerraTwin AI" },
      { name: "description", content: loaderData?.summary ?? "Planetary target details." },
      { property: "og:title", content: loaderData ? `${loaderData.name} — TerraTwin AI` : "Target" },
      { property: "og:description", content: loaderData?.summary ?? "Planetary target details." },
    ],
  }),
  component: TargetPage,
});

function TargetPage() {
  const t = Route.useLoaderData();
  const related = rankLocations(t, LOCATIONS, "rover").slice(0, 3);
  const sections = [
    { h: "Overview", b: t.overview },
    { h: "Terrain", b: t.terrain },
    { h: "Surface", b: t.surface },
    { h: "Why scientists care", b: t.science },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <Link to="/explore" search={{ planet: t.planet }} className="text-sm text-primary">← Back to {t.planet === "moon" ? "Moon" : "Mars"}</Link>
      <div className="mt-4 grid items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">{t.planet === "moon" ? "Moon" : "Mars"} · {t.coords}</p>
          <h1 className="mt-2 text-5xl font-bold">{t.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t.summary}</p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {t.facts.map((f) => <div key={f.label} className="glass p-3"><p className="text-xs text-muted-foreground">{f.label}</p><p className="mt-1 text-sm font-semibold">{f.value}</p></div>)}
          </div>
          <Button asChild variant="hero" size="lg" className="mt-6"><Link to="/match" search={{ target: t.id }}>Find Earth matches</Link></Button>
        </div>
        <Planet3D planet={t.planet} interactive className="glass aspect-square overflow-hidden" />
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {sections.map((s) => <div key={s.h} className="glass p-6"><h2 className="text-xl font-bold">{s.h}</h2><p className="mt-2 text-muted-foreground">{s.b}</p></div>)}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Available datasets</h2>
        <p className="mt-1 text-sm text-muted-foreground">Public sources where real measurements for this site can be found. Not live-connected to this app.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {t.datasets.map((d) => <div key={d.name} className="glass p-4"><p className="font-display text-lg font-bold">{d.name}</p><p className="text-sm text-muted-foreground">{d.what}</p><p className="mt-2 text-xs text-primary">{d.source}</p></div>)}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-center gap-3"><h2 className="text-2xl font-bold">Related Earth analogs</h2><DemoBadge>Rover testing, curated traits</DemoBadge></div>
        <div className="mt-4 grid gap-5 md:grid-cols-3">{related.map((r) => <LocationCard key={r.location.id} loc={r.location} />)}</div>
      </section>
    </div>
  );
}
