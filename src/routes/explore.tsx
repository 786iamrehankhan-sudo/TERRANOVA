import { createFileRoute, Link } from "@tanstack/react-router";
import { Planet3D } from "@/components/Planet3D";
import { LocationCard, PageHeader } from "@/components/site";
import { Button } from "@/components/ui/button";
import { LOCATIONS, PLANETS, TARGETS, type PlanetId } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explore")({
  validateSearch: (s: Record<string, unknown>): { planet?: PlanetId | undefined } => ({
    planet: ["earth", "moon", "mars"].includes(s["planet"] as string) ? (s["planet"] as PlanetId) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Explore Earth, Moon & Mars — TerraTwin AI" },
      { name: "description", content: "Spin interactive 3D planets and open Moon and Mars target sites." },
      { property: "og:title", content: "Explore Earth, Moon & Mars — TerraTwin AI" },
      { property: "og:description", content: "Interactive 3D planets with Moon and Mars targets and Earth analogs." },
    ],
  }),
  component: Explore,
});

function Explore() {
  const { planet = "earth" } = Route.useSearch();
  const p = PLANETS.find((x) => x.id === planet)!;
  const targets = TARGETS.filter((t) => t.planet === planet);
  return (
    <>
      <PageHeader eyebrow="Explore" title="Choose a world">Drag the planet to spin it. Scroll to zoom.</PageHeader>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex gap-2">
          {PLANETS.map((x) => (
            <Link key={x.id} to="/explore" search={{ planet: x.id }}
              className={cn("rounded-full border px-5 py-2 font-display text-sm tracking-widest uppercase transition",
                x.id === planet ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>
              {x.name}
            </Link>
          ))}
        </div>
        <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Planet3D key={planet} planet={planet} interactive rings className="glass aspect-square w-full overflow-hidden" />
          <div>
            <p className="text-xs uppercase tracking-widest text-primary">{p.tagline}</p>
            <h2 className="mt-2 text-4xl font-bold">{p.name}</h2>
            <p className="mt-3 text-muted-foreground">{p.text}</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {p.facts.map((f) => (
                <div key={f.label} className="glass p-3"><p className="text-xs text-muted-foreground">{f.label}</p><p className="mt-1 font-semibold">{f.value}</p></div>
              ))}
            </div>
          </div>
        </div>

        {planet === "earth" ? (
          <section className="mt-14">
            <h3 className="text-2xl font-bold">Earth's extreme environments</h3>
            <p className="mt-1 text-muted-foreground">Candidate analog sites — places that partly resemble other worlds.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{LOCATIONS.map((l) => <LocationCard key={l.id} loc={l} />)}</div>
          </section>
        ) : (
          <section className="mt-14">
            <h3 className="text-2xl font-bold">Target sites on the {p.name}</h3>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {targets.map((t) => (
                <div key={t.id} className="glass p-6">
                  <p className="text-xs text-muted-foreground">{t.coords}</p>
                  <h4 className="mt-1 text-2xl font-bold">{t.name}</h4>
                  <p className="mt-2 text-muted-foreground">{t.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button asChild variant="hero" size="sm"><Link to="/explore/$id" params={{ id: t.id }}>View details</Link></Button>
                    <Button asChild variant="glass" size="sm"><Link to="/match" search={{ target: t.id }}>Find Earth match</Link></Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
