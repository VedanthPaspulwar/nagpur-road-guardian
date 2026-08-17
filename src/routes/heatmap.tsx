import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DEFAULT_FILTERS, FiltersBar, applyFilters, type FilterState } from "@/components/traffic/Filters";
import { MapCard } from "@/components/traffic/MapCard";
import { RiskExplainer } from "@/components/traffic/panels";
import { PageHeader, Panel, RiskBadge } from "@/components/traffic/ui-bits";
import { useTraffic } from "@/lib/traffic-store";
import type { ScoredLocation } from "@/lib/traffic-data";

export const Route = createFileRoute("/heatmap")({
  head: () => ({
    meta: [
      { title: "Risk Heatmap | Nagpur Traffic Risk AI" },
      { name: "description", content: "Interactive Nagpur traffic risk heatmap with colour-coded high, medium and low risk junctions." },
      { property: "og:title", content: "Risk Heatmap | Nagpur Traffic Risk AI" },
      { property: "og:description", content: "Colour-coded risk zones across Nagpur junctions with live coverage status." },
    ],
  }),
  component: HeatmapPage,
});

function HeatmapPage() {
  const { locations, deploy } = useTraffic();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sel, setSel] = useState<ScoredLocation | null>(null);
  const visible = applyFilters(locations, filters);
  const current = sel ? (locations.find((l) => l.id === sel.id) ?? null) : null;

  return (
    <div>
      <PageHeader title="Traffic Risk Heatmap" subtitle="Live risk zones across Nagpur, scored by the AI risk model." />
      <FiltersBar value={filters} onChange={setFilters} />
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title="Nagpur City Map">
          <MapCard
            locations={visible}
            height="640px"
            onSelect={setSel}
            onDeploy={(l) => deploy(l.id, Math.max(1, l.recommendedOfficers - l.policeCoverage))}
          />
        </Panel>
        <div className="space-y-6">
          <Panel title="Risk Zones" subtitle={`${visible.length} matching locations`}>
            <ul className="space-y-2">
              {visible.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => setSel(l)}
                    className="w-full rounded-lg border border-border/50 bg-secondary/25 px-3 py-2 text-left transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{l.name}</span>
                      <RiskBadge level={l.riskLevel} score={l.riskScore} />
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {l.policeCoverage}/{l.recommendedOfficers} officers · {l.coverageStatus}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
          {current && (
            <Panel title="Explainable Risk Breakdown">
              <RiskExplainer loc={current} />
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}