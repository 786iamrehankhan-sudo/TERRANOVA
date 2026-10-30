import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import type { PlanetId } from "@/lib/data";

const PlanetScene = lazy(() => import("./three/PlanetScene"));

export function Planet3D(props: { planet?: PlanetId; interactive?: boolean; rings?: boolean; speed?: number; className?: string }) {
  const fallback = (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-2/3 aspect-square rounded-full bg-primary/10 glow animate-pulse" />
    </div>
  );
  return (
    <div className={props.className}>
      <ClientOnly fallback={fallback}>
        <Suspense fallback={fallback}>
          <PlanetScene {...props} />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
