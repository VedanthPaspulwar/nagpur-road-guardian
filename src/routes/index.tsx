import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DEFAULT_FILTERS, FiltersBar, applyFilters, type FilterState } from "@/components/traffic/Filters";
import { MapCard } from "@/components/traffic/MapCard";
import {
  AiAssistant,
  ComparisonSection,
  HighRiskTable,
  KpiCards,
  RecentIncidents,
  RecommendationsPanel,
  RiskExplainer,
} from "@/components/traffic/panels";
import { Panel, PageHeader } from "@/components/traffic/ui-bits";
import { useTraffic } from "@/lib/traffic-store";
import type { ScoredLocation } from "@/lib/traffic-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Control Room Dashboard | Nagpur Traffic Risk AI" },
      {
        name: "description",
        content:
          "AI traffic risk heatmap and police deployment decision support dashboard for Nagpur city, built on simulated data.",
      },
      { property: "og:title", content: "Control Room Dashboard | Nagpur Traffic Risk AI" },
      {
        property: "og:description",
        content: "Live risk scoring, deployment recommendations and incident monitoring for Nagpur Traffic Police.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { locations, deploy } = useTraffic();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<ScoredLocation | null>(null);
  const visible = applyFilters(locations, filters);
  const current = selected ? (locations.find((l) => l.id === selected.id) ?? null) : null;

  return (
    <div>
      <PageHeader
        title="Traffic Risk & Deployment Control Room"
        subtitle="Nagpur City · Prototype running on simulated / anonymized data — no connection to confidential police systems or live CCTV."
      />
      <FiltersBar value={filters} onChange={setFilters} />
      <KpiCards />

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Nagpur Traffic Risk Heatmap"
          subtitle={`${visible.length} locations shown · click a marker for full risk breakdown`}
        >
          <MapCard
            locations={visible}
            onSelect={setSelected}
            onDeploy={(l) => deploy(l.id, Math.max(1, l.recommendedOfficers - l.policeCoverage))}
          />
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-risk-high" /> High Risk (80–100)</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-risk-medium" /> Medium Risk (60–79)</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-risk-low" /> Low Risk (0–59)</span>
          </div>
        </Panel>

        <div className="space-y-6">
          <RecentIncidents />
          {current && (
            <Panel title="Explainable Risk Breakdown">
              <RiskExplainer loc={current} />
            </Panel>
          )}
          <AiAssistant />
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <RecommendationsPanel />
        <ComparisonSection />
      </div>

      <div className="mt-6">
        <HighRiskTable />
      </div>
    </div>
  );
}
