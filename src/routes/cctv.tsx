import { createFileRoute } from "@tanstack/react-router";
import { Cctv, CircleDot } from "lucide-react";
import feed from "@/assets/cctv-feed.jpg";
import { PageHeader, Panel } from "@/components/traffic/ui-bits";
import { useTraffic } from "@/lib/traffic-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cctv")({
  head: () => ({
    meta: [
      { title: "CCTV Monitor | Nagpur Traffic Risk AI" },
      { name: "description", content: "Simulated CCTV monitoring wall with AI vehicle, pedestrian and violation detection counts for Nagpur junctions." },
      { property: "og:title", content: "CCTV Monitor | Nagpur Traffic Risk AI" },
      { property: "og:description", content: "Prototype camera wall — no real CCTV feeds are used." },
    ],
  }),
  component: CctvPage,
});

function CctvPage() {
  const { locations } = useTraffic();
  const cams = locations.slice(0, 6);

  return (
    <div>
      <PageHeader
        title="CCTV Monitor (Simulated)"
        subtitle="Prototype camera wall using synthetic frames. No real CCTV feed, no facial recognition, no individual profiling."
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cams.map((l, i) => {
          const vehicles = 30 + Math.round(l.congestion * 0.8);
          const peds = 5 + Math.round(l.pedestrianDensity * 0.35);
          const congestion = l.congestion >= 75 ? "HIGH" : l.congestion >= 55 ? "MEDIUM" : "LOW";
          return (
            <Panel
              key={l.id}
              title={`Camera ${String(i + 1).padStart(2, "0")} — ${l.name.split(" ")[0]}`}
              action={
                <span className="flex items-center gap-1 text-[11px] text-risk-low">
                  <CircleDot className="size-3 animate-pulse" /> LIVE
                </span>
              }
            >
              <div className="relative overflow-hidden rounded-lg border border-border/60">
                <img src={feed} alt={`Simulated traffic camera view at ${l.name}`} loading="lazy" width={1024} height={576} className="w-full opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-background/70 px-2 py-0.5 text-[10px] font-mono">
                  <Cctv className="size-3 text-cyber" /> CAM-{String(i + 1).padStart(2, "0")} · {l.zone}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <p className="rounded-lg bg-secondary/40 px-3 py-2">Vehicles <span className="float-right font-bold tabular-nums">{vehicles}</span></p>
                <p className="rounded-lg bg-secondary/40 px-3 py-2">Pedestrians <span className="float-right font-bold tabular-nums">{peds}</span></p>
                <p className="rounded-lg bg-secondary/40 px-3 py-2">Violations <span className="float-right font-bold tabular-nums text-risk-high">{l.violations}</span></p>
                <p className="rounded-lg bg-secondary/40 px-3 py-2">
                  Congestion{" "}
                  <span className={cn("float-right font-bold", congestion === "HIGH" ? "text-risk-high" : congestion === "MEDIUM" ? "text-risk-medium" : "text-risk-low")}>
                    {congestion}
                  </span>
                </p>
              </div>
              <p className="mt-2 text-[11px] text-cyber">AI Detection Status: active · anonymized counts only</p>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}