import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { LocationCard, PageHeader } from "@/components/site";
import { LOCATIONS, MISSIONS } from "@/lib/data";

export const Route = createFileRoute("/analogs/")({
  head: () => ({
    meta: [
      { title: "Earth Analog Library — TERRANOVA" },
      { name: "description", content: "Search Earth places that resemble the Moon and Mars, filtered by country, terrain and mission." },
      { property: "og:title", content: "Earth Analog Library — TERRANOVA" },
      { property: "og:description", content: "Searchable library of Moon and Mars analog sites on Earth." },
    ],
  }),
  component: Library,
});

function Library() {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("");
  const [env, setEnv] = useState("");
  const [terrain, setTerrain] = useState("");
  const [mission, setMission] = useState("");
  const uniq = (a: string[]) => [...new Set(a)].sort();
  const list = useMemo(() => LOCATIONS.filter((l) =>
    (!q || `${l.name} ${l.country} ${l.summary} ${l.terrain}`.toLowerCase().includes(q.toLowerCase())) &&
    (!country || l.country === country) && (!env || l.environment === env) &&
    (!terrain || l.terrain === terrain) && (!mission || l.missions.includes(mission as never))), [q, country, env, terrain, mission]);
  const sel = "rounded-lg border border-input bg-popover px-3 py-2 text-sm";
  return (
    <>
      <PageHeader eyebrow="Earth Analogs" title="The analog library">Places on Earth that partly resemble the Moon or Mars.</PageHeader>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass flex flex-wrap items-center gap-3 p-4">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search locations…" className={`${sel} w-full pl-9`} />
          </div>
          <select className={sel} value={country} onChange={(e) => setCountry(e.target.value)}><option value="">All countries</option>{uniq(LOCATIONS.map((l) => l.country)).map((c) => <option key={c}>{c}</option>)}</select>
          <select className={sel} value={env} onChange={(e) => setEnv(e.target.value)}><option value="">All environments</option>{uniq(LOCATIONS.map((l) => l.environment)).map((c) => <option key={c}>{c}</option>)}</select>
          <select className={sel} value={terrain} onChange={(e) => setTerrain(e.target.value)}><option value="">All terrain</option>{uniq(LOCATIONS.map((l) => l.terrain)).map((c) => <option key={c}>{c}</option>)}</select>
          <select className={sel} value={mission} onChange={(e) => setMission(e.target.value)}><option value="">All missions</option>{MISSIONS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}</select>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{list.length} location{list.length === 1 ? "" : "s"}</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((l) => <LocationCard key={l.id} loc={l} />)}</div>
        {list.length === 0 && <p className="glass mt-4 p-8 text-center text-muted-foreground">No locations match these filters.</p>}

        {/* External resource card */}
        <div className="mt-12 mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-4">External Resource</p>
          <a
            href="https://planetary-ivory.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group glass overflow-hidden transition hover:-translate-y-1 hover:glow flex flex-col sm:flex-row items-stretch"
          >
            {/* Icon panel */}
            <div className="flex items-center justify-center bg-primary/10 p-8 sm:w-48 shrink-0">
              <div className="relative">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="26" fill="#1a3a5c" />
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.5" />
                  <ellipse cx="32" cy="32" rx="38" ry="14" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" transform="rotate(-20 32 32)" />
                  <circle cx="32" cy="32" r="10" fill="#1e5fa8" />
                  <circle cx="56" cy="20" r="4" fill="#38bdf8" opacity="0.9" />
                </svg>
              </div>
            </div>
            {/* Text panel */}
            <div className="p-6 flex flex-col justify-center flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Planetary Analogue Explorer</h3>
                <ExternalLink className="h-4 w-4 text-primary opacity-70 group-hover:opacity-100 transition" />
              </div>
              <p className="mt-1 text-xs text-primary uppercase tracking-widest">Mission Control · External Tool</p>
              <p className="mt-3 text-sm text-muted-foreground">
                An interactive mission control tool for exploring planetary analogue sites. Features a Lunar Research Outpost planner with NASA POWER live data integration.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                Visit planetary-ivory.vercel.app <ExternalLink className="h-3 w-3" />
              </span>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
