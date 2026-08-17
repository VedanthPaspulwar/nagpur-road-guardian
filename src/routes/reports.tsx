import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, FileText, Printer } from "lucide-react";
import { PageHeader, Panel } from "@/components/traffic/ui-bits";
import { useTraffic } from "@/lib/traffic-store";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports | Nagpur Traffic Risk AI" },
      { name: "description", content: "Generate daily risk, deployment, incident and high-risk location reports with CSV export for Nagpur traffic operations." },
      { property: "og:title", content: "Reports | Nagpur Traffic Risk AI" },
      { property: "og:description", content: "Exportable simulated operational reports." },
    ],
  }),
  component: ReportsPage,
});

const REPORTS = [
  { id: "daily", title: "Daily Risk Report", desc: "City-wide risk scores, top junctions and trend deltas." },
  { id: "deployment", title: "Police Deployment Report", desc: "Officer allocation, gaps and override decisions." },
  { id: "incident", title: "Incident Report", desc: "All logged incidents with severity and status." },
  { id: "highrisk", title: "High-Risk Location Report", desc: "Ranked high-risk junctions with contributing factors." },
];

function ReportsPage() {
  const { locations, incidents, availableOfficers, deployedOfficers } = useTraffic();
  const [generated, setGenerated] = useState<string | null>(null);

  const rowsFor = (id: string): string[][] => {
    if (id === "incident")
      return [
        ["ID", "Type", "Location", "Severity", "Status"],
        ...incidents.map((i) => [i.id, i.type, i.locationName, i.severity, i.status]),
      ];
    if (id === "deployment")
      return [
        ["Location", "Risk", "Current", "Recommended", "Gap"],
        ...locations.map((l) => [
          l.name,
          String(l.riskScore),
          String(l.policeCoverage),
          String(l.recommendedOfficers),
          String(Math.max(0, l.recommendedOfficers - l.policeCoverage)),
        ]),
        ["Available officers", String(availableOfficers), "Deployed", String(deployedOfficers), ""],
      ];
    return [
      ["Location", "Zone", "Risk Score", "Risk Level", "Main Reasons"],
      ...locations
        .filter((l) => id !== "highrisk" || l.riskLevel === "high")
        .map((l) => [l.name, l.zone, String(l.riskScore), l.riskLevel, l.reasons.join(" / ")]),
    ];
  };

  const exportCsv = (id: string) => {
    const csv = rowsFor(id)
      .map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${id}-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const preview = generated ? rowsFor(generated) : null;

  return (
    <div>
      <PageHeader title="Reports" subtitle="Operational reports generated from simulated prototype data." />
      <div className="grid gap-4 md:grid-cols-2">
        {REPORTS.map((r) => (
          <Panel key={r.id} title={r.title} subtitle={r.desc}>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setGenerated(r.id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/85"
              >
                <FileText className="size-3.5" /> Generate Report
              </button>
              <button
                onClick={() => exportCsv(r.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyber/50 px-3 py-1.5 text-xs font-semibold text-cyber hover:bg-cyber/10"
              >
                <Download className="size-3.5" /> Export CSV
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs hover:bg-secondary"
              >
                <Printer className="size-3.5" /> Print Report
              </button>
            </div>
          </Panel>
        ))}
      </div>

      {preview && (
        <Panel className="mt-6" title={`Preview — ${REPORTS.find((r) => r.id === generated)?.title}`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-xs">
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className={i === 0 ? "border-b border-border/60 text-left uppercase text-muted-foreground" : "border-b border-border/30"}>
                    {row.map((cell, j) => (
                      <td key={j} className="py-2 pr-3">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}