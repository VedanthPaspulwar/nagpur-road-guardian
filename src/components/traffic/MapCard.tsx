import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import type { ScoredLocation } from "@/lib/traffic-data";

const NagpurMap = lazy(() => import("./NagpurMap"));

function Skeleton({ height }: { height: string }) {
  return (
    <div
      style={{ height }}
      className="grid w-full place-items-center rounded-xl border border-border/60 bg-secondary/30 text-xs text-muted-foreground"
    >
      Loading Nagpur map…
    </div>
  );
}

export function MapCard(props: {
  locations: ScoredLocation[];
  onSelect?: (l: ScoredLocation) => void;
  onDeploy?: (l: ScoredLocation) => void;
  height?: string;
}) {
  const height = props.height ?? "520px";
  return (
    <ClientOnly fallback={<Skeleton height={height} />}>
      <Suspense fallback={<Skeleton height={height} />}>
        <NagpurMap {...props} height={height} />
      </Suspense>
    </ClientOnly>
  );
}