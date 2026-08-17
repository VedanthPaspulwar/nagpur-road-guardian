import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, RiskBadge } from "@/components/traffic/ui-bits";
import { useTraffic } from "@/lib/traffic-store";
import { INCIDENT_TYPES } from "@/lib/traffic-data";

export const Route = createFileRoute("/incidents")({
  head: () => ({
    meta: [
      { title: "Incidents | Nagpur Traffic Risk AI" },
      { name: "description", content: "Live incident log for Nagpur traffic operations with severity, location and automatic risk recalculation." },
      { property: "og:title", content: "Incidents | Nagpur Traffic Risk AI" },
      { property: "og:description", content: "Simulated incident feed driving dynamic risk and deployment updates." },
    ],
  }),
  component: IncidentsPage,
});

function IncidentsPage() {
  const { incidents, simulateIncident, locations, lastChange } = useTraffic();
  const [type, setType] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const rows = incidents.filter(
    (i) => (type === "All" || i.type === type) && (status === "All" || i.status === status),
  );

  return (
    <div>
      <PageHeader title="Incident Monitoring" subtitle="Every simulated incident recalculates risk scores and deployment recommendations." />

      {lastChange && (
        <div className="glass-panel mb-6 border-l-4 border-l-risk-high p-4 text-sm">
          <span className="font-semibold text-risk-high">Latest impact:</span>{" "}
          {locations.find((l) => l.id === lastChange.locationId)?.name} — {lastChange.type} raised risk from{" "}
          {lastChange.before} to {lastChange.after}.
        </div>
      )}

      <div className="glass-panel mb-6 flex flex-wrap items-end gap-3 p-4">
        <label className="min-w-40">
          <span className="mb-1 block text-[11px] tracking-widest uppercase text-muted-foreground">Type</span>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg border border-border/60 bg-input/50 px-3 py-2 text-xs">
            {["All", ...INCIDENT_TYPES].map((t) => (
              <option key={t} className="bg-popover">{t}</option>
            ))}
          </select>
        </label>
        <label className="min-w-40">
          <span className="mb-1 block text-[11px] tracking-widest uppercase text-muted-foreground">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-lg border border-border/60 bg-input/50 px-3 py-2 text-xs capitalize">
            {["All", "active", "resolved"].map((t) => (
              <option key={t} className="bg-popover capitalize">{t}</option>
            ))}
          </select>
        </label>
        <button
          onClick={() => simulateIncident()}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/85"
        >
          + Simulate Incident
        </button>
      </div>

      <Panel title="Incident Log" subtitle={`${rows.length} records`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-[11px] tracking-wider uppercase text-muted-foreground">
                <th className="py-2 pr-3">ID</th>
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3">Location</th>
                <th className="py-2 pr-3">Severity</th>
                <th className="py-2 pr-3">Time</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((i) => (
                <tr key={i.id} className="border-b border-border/30 hover:bg-secondary/30">
                  <td className="py-2.5 pr-3 font-mono text-xs text-muted-foreground">{i.id}</td>
                  <td className="py-2.5 pr-3 font-medium">{i.type}</td>
                  <td className="py-2.5 pr-3">{i.locationName}</td>
                  <td className="py-2.5 pr-3"><RiskBadge level={i.severity} /></td>
                  <td className="py-2.5 pr-3 tabular-nums text-xs text-muted-foreground">
                    {new Date(i.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className={i.status === "active" ? "py-2.5 text-risk-medium" : "py-2.5 text-muted-foreground"}>{i.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}