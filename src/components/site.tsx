import { Link } from "@tanstack/react-router";
import { Menu, Orbit, X, FlaskConical, MapPin } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { EarthLocation } from "@/lib/data";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/analogs", label: "Earth Analogs" },
  { to: "/match", label: "AI Match" },
  { to: "/analysis", label: "Analysis" },
  { to: "/research", label: "Research" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-widest">
          <Orbit className="h-6 w-6 text-primary" />
          TERRANOVA
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground"
              activeProps={{ className: "bg-primary/10 !text-primary" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <button className="lg:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 lg:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} activeOptions={{ exact: n.to === "/" }}
              className="rounded-lg px-3 py-2 text-muted-foreground" activeProps={{ className: "bg-primary/10 !text-primary" }}>
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-muted-foreground">
        <p className="font-display tracking-widest text-foreground">TERRANOVA</p>
        <p className="mt-2 max-w-2xl">
          Earth sites are partial analogs — none fully copies the Moon or Mars. Trait ratings are curated
          demonstration values, not live NASA data. Not affiliated with or endorsed by NASA.
        </p>
      </div>
    </footer>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{title}</h1>
      {children && <div className="mt-4 max-w-2xl text-muted-foreground">{children}</div>}
    </div>
  );
}

export function DemoBadge({ children = "Demonstration data" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning/10 px-2.5 py-0.5 text-[11px] font-medium text-warning">
      <FlaskConical className="h-3 w-3" /> {children}
    </span>
  );
}

export function LocationCard({ loc }: { loc: EarthLocation }) {
  return (
    <Link to="/analogs/$id" params={{ id: loc.id }} className="group glass overflow-hidden transition hover:-translate-y-1 hover:glow">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={loc.image} alt={loc.name} loading="lazy" width={1280} height={768}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-background/70 px-2.5 py-0.5 text-xs backdrop-blur">{loc.environment}</span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{loc.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{loc.country} · {loc.terrain}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{loc.summary}</p>
      </div>
    </Link>
  );
}

export function Missing() {
  return <span className="italic text-muted-foreground">Not available</span>;
}
