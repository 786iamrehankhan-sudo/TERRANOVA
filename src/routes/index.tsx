import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Globe2, Rocket, Target as TargetIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Planet3D } from "@/components/Planet3D";
import { LocationCard } from "@/components/site";
import { LOCATIONS, MISSIONS, PLANETS, TARGETS, type MissionId } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TERRANOVA — Explore Earth. Discover other worlds." },
      { name: "description", content: "Discover Earth's most promising environments for future Moon and Mars missions." },
      { property: "og:title", content: "TERRANOVA — Explore Earth. Discover other worlds." },
      { property: "og:description", content: "Find Earth training grounds that resemble Moon and Mars sites." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 starfield opacity-60" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pt-10 sm:px-6 lg:grid-cols-2 lg:pt-6">
          <div className="z-10 py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">TERRANOVA</p>
            <h1 className="mt-5 text-5xl font-bold leading-[1.05] sm:text-6xl xl:text-7xl">
              EXPLORE EARTH.<br /><span className="text-primary text-glow">DISCOVER OTHER WORLDS.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Discover Earth's most promising environments for future Moon and Mars missions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg"><Link to="/explore">Start exploring <ArrowRight /></Link></Button>
              <Button asChild variant="glass" size="lg"><Link to="/analogs">Find Earth analogs</Link></Button>
            </div>
            <p className="mt-6 text-sm italic text-muted-foreground">Finding Earth's best training grounds for humanity's next giant leap.</p>
          </div>
          <Planet3D planet="earth" rings interactive className="relative aspect-square w-full lg:-mr-24" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Globe2, n: LOCATIONS.length, l: "Earth analog locations" },
            { icon: TargetIcon, n: TARGETS.length, l: "Moon & Mars targets" },
            { icon: Rocket, n: MISSIONS.length, l: "Mission types" },
          ].map((s) => (
            <div key={s.l} className="glass flex items-center gap-4 p-5">
              <s.icon className="h-8 w-8 text-primary" />
              <div><p className="font-display text-3xl font-bold">{s.n}</p><p className="text-sm text-muted-foreground">{s.l}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold">Explore the planets</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {PLANETS.map((p) => (
            <div key={p.id} className="glass overflow-hidden">
              <Planet3D planet={p.id} speed={0.15} className="h-56" />
              <div className="p-5">
                <p className="text-xs uppercase tracking-widest text-primary">{p.tagline}</p>
                <h3 className="mt-1 text-2xl font-bold">{p.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
                <Button asChild variant="glass" size="sm" className="mt-4">
                  <Link to="/explore" search={{ planet: p.id }}>Explore {p.name}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold">Featured Earth locations</h2>
          <Link to="/analogs" className="text-sm text-primary">View all →</Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LOCATIONS.map((l) => <LocationCard key={l.id} loc={l} />)}
        </div>
      </section>

      <QuickMatch />
    </>
  );
}

function QuickMatch() {
  const nav = useNavigate();
  const [planet, setPlanet] = useState<"moon" | "mars">("mars");
  const [target, setTarget] = useState("jezero");
  const [mission, setMission] = useState<MissionId>("rover");
  const sel = "w-full rounded-lg border border-input bg-popover px-3 py-2.5 text-sm";
  return (
    <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
      <div className="glass glow p-6 sm:p-10">
        <h2 className="text-3xl font-bold">Quick AI match</h2>
        <p className="mt-2 text-muted-foreground">Find a place on Earth similar to your selected Moon or Mars location.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <label className="text-sm">Planet
            <select className={sel} value={planet} onChange={(e) => {
              const p = e.target.value as "moon" | "mars"; setPlanet(p);
              setTarget(TARGETS.find((t) => t.planet === p)!.id);
            }}>
              <option value="moon">Moon</option><option value="mars">Mars</option>
            </select>
          </label>
          <label className="text-sm">Target location
            <select className={sel} value={target} onChange={(e) => setTarget(e.target.value)}>
              {TARGETS.filter((t) => t.planet === planet).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
          <label className="text-sm">Mission type
            <select className={sel} value={mission} onChange={(e) => setMission(e.target.value as MissionId)}>
              {MISSIONS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </label>
          <div className="flex items-end">
            <Button variant="hero" size="lg" className="w-full" onClick={() => nav({ to: "/match", search: { target, mission, run: true } })}>
              Find matching places
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
