import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel } from "@/components/traffic/ui-bits";
import { useTraffic } from "@/lib/traffic-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/personnel")({
  head: () => ({
    meta: [
      { title: "Personnel | Nagpur Traffic Risk AI" },
      { name: "description", content: "Traffic police personnel roster with availability, deployment status and assigned areas (simulated data)." },
      { property: "og:title", content: "Personnel | Nagpur Traffic Risk AI" },
      { property: "og:description", content: "Force strength, availability and assignment overview." },
    ],
  }),
  component: PersonnelPage,
});

function PersonnelPage() {
  const { officers, availableOfficers, deployedOfficers, onLeave, reserve } = useTraffic();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const rows = officers.filter(
    (o) =>
      (status === "all" || o.status === status) &&
      `${o.id} ${o.name} ${o.assignedArea}`.toLowerCase().includes(q.toLowerCase()),
  );

  const stats = [
    ["Total Officers", officers.length, "text-foreground"],
    ["Available", availableOfficers, "text-chart-2"],
    ["Deployed", deployedOfficers, "text-primary-foreground"],
    ["On Leave", onLeave, "text-muted-foreground"],
    ["Emergency Reserve", reserve, "text-cyber"],
  ] as const;

  return (
    <div>
      <PageHeader title="Personnel" subtitle="Simulated roster — no real officer data is used." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {stats.map(([label, value, cls]) => (
          <div key={label} className="glass-panel p-4">
            <p className="text-[11px] tracking-widest uppercase text-muted-foreground">{label}</p>
            <p className={cn("mt-1.5 text-2xl font-bold tabular-nums", cls)}>{value}</p>
          </div>
        ))}
      </div>

      <Panel
        title="Officer Roster"
        subtitle={`${rows.length} records`}
        action={
          <div className="flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search officer…"
              className="rounded-lg border border-border/60 bg-input/50 px-3 py-1.5 text-xs outline-none focus:border-primary"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-border/60 bg-input/50 px-2 py-1.5 text-xs capitalize"
            >
              {["all", "available", "deployed", "on-leave", "reserve"].map((s) => (
                <option key={s} className="bg-popover capitalize">{s}</option>
              ))}
            </select>
          </div>
        }
      >
        <div className="max-h-[560px] overflow-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="sticky top-0 bg-card/95 backdrop-blur">
              <tr className="border-b border-border/60 text-left text-[11px] tracking-wider uppercase text-muted-foreground">
                <th className="py-2 pr-3">Officer ID</th>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Current Location</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2">Assigned Area</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="border-b border-border/30 hover:bg-secondary/30">
                  <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">{o.id}</td>
                  <td className="py-2 pr-3 font-medium">{o.name}</td>
                  <td className="py-2 pr-3 text-xs">{o.currentLocation}</td>
                  <td
                    className={cn(
                      "py-2 pr-3 text-xs font-semibold capitalize",
                      o.status === "deployed" && "text-primary-foreground",
                      o.status === "available" && "text-risk-low",
                      o.status === "on-leave" && "text-muted-foreground",
                      o.status === "reserve" && "text-cyber",
                    )}
                  >
                    {o.status}
                  </td>
                  <td className="py-2 text-xs">{o.assignedArea}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}