import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { ComparisonSection, RecommendationsPanel } from "@/components/traffic/panels";
import { PageHeader, Panel, riskTextClass } from "@/components/traffic/ui-bits";
import { useTraffic } from "@/lib/traffic-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/deployment")({
  head: () => ({
    meta: [
      { title: "Deployment Planner | Nagpur Traffic Risk AI" },
      { name: "description", content: "Optimised police personnel allocation planner that prioritises the highest-risk Nagpur junctions within available force limits." },
      { property: "og:title", content: "Deployment Planner | Nagpur Traffic Risk AI" },
      { property: "og:description", content: "Officer gap analysis, priority allocation and manual override controls." },
    ],
  }),
  component: DeploymentPage,
});

function DeploymentPage() {
  const { locations, availableOfficers, deployedOfficers, allocation, simulateIncident } = useTraffic();
  const required = locations.reduce((s, l) => s + Math.max(0, l.recommendedOfficers - l.policeCoverage), 0);

  const stats = [
    { label: "Available Officers", value: availableOfficers, cls: "text-chart-2" },
    { label: "Currently Deployed", value: deployedOfficers, cls: "text-primary-foreground" },
    { label: "Officers Required", value: required, cls: "text-risk-high" },
  ];

  return (
    <div>
      <PageHeader
        title="Personnel Deployment Planner"
        subtitle="Greedy risk-priority allocation — never allocates more officers than are available."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="glass-panel p-5">
            <p className="text-xs tracking-widest uppercase text-muted-foreground">{s.label}</p>
            <p className={cn("mt-2 text-3xl font-bold tabular-nums", s.cls)}>{s.value}</p>
          </div>
        ))}
      </div>

      <Panel title="Allocation Table" subtitle="Risk-ranked officer gap analysis">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-[11px] tracking-wider uppercase text-muted-foreground">
                <th className="py-2 pr-3">Location</th>
                <th className="py-2 pr-3">Risk</th>
                <th className="py-2 pr-3">Current</th>
                <th className="py-2 pr-3">Recommended</th>
                <th className="py-2 pr-3">Difference</th>
                <th className="py-2 pr-3">AI Allocation</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {allocation.map(({ location: l, gap, allocated }) => (
                <tr key={l.id} className="border-b border-border/30 hover:bg-secondary/30">
                  <td className="py-2.5 pr-3 font-medium">{l.name}</td>
                  <td className={cn("py-2.5 pr-3 font-bold tabular-nums", riskTextClass(l.riskLevel))}>{l.riskScore}</td>
                  <td className="py-2.5 pr-3 tabular-nums">{l.policeCoverage}</td>
                  <td className="py-2.5 pr-3 tabular-nums">{l.recommendedOfficers}</td>
                  <td className={cn("py-2.5 pr-3 tabular-nums", gap > 0 ? "text-risk-high" : "text-risk-low")}>
                    {gap > 0 ? `+${gap}` : "0"}
                  </td>
                  <td className="py-2.5 pr-3 tabular-nums text-cyber">{allocated}</td>
                  <td className="py-2.5 text-xs">
                    {l.riskLevel === "high" && l.coverageStatus !== "covered" ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-risk-high">
                        <AlertTriangle className="size-3.5" /> HIGH PRIORITY —{" "}
                        {l.coverageStatus === "unmanned" ? "CURRENTLY UNMANNED" : "UNDER-COVERED"}
                      </span>
                    ) : l.coverageStatus === "covered" ? (
                      <span className="text-risk-low">Covered</span>
                    ) : (
                      <span className="text-risk-medium">Under-covered</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => simulateIncident()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/85"
        >
          + Simulate Incident &amp; Recalculate
        </button>
      </Panel>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <RecommendationsPanel limit={6} />
        <ComparisonSection />
      </div>
    </div>
  );
}