import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel } from "@/components/traffic/ui-bits";
import { RISK_WEIGHTS } from "@/lib/traffic-data";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | Nagpur Traffic Risk AI" },
      { name: "description", content: "Configure risk model weights, alert thresholds and prototype data settings for the Nagpur traffic decision support system." },
      { property: "og:title", content: "Settings | Nagpur Traffic Risk AI" },
      { property: "og:description", content: "Model weights, thresholds and ethics configuration." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [alerts, setAlerts] = useState(true);
  const [autoRecalc, setAutoRecalc] = useState(true);
  const [threshold, setThreshold] = useState(80);

  const weights = Object.entries(RISK_WEIGHTS);

  return (
    <div>
      <PageHeader title="Settings" subtitle="Prototype configuration — changes affect this session only." />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Risk Model Weights" subtitle="Factor multipliers used by the explainable scoring model">
          <ul className="grid gap-2 sm:grid-cols-2">
            {weights.map(([k, v]) => (
              <li key={k} className="flex items-center justify-between rounded-lg bg-secondary/35 px-3 py-2 text-xs">
                <span className="capitalize text-muted-foreground">{k.replace(/([A-Z])/g, " $1")}</span>
                <span className="font-semibold tabular-nums text-cyber">{v}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Operational Preferences">
          <div className="space-y-4 text-sm">
            <label className="flex items-center justify-between gap-4">
              <span>Push high-risk alerts to control room</span>
              <input type="checkbox" checked={alerts} onChange={(e) => setAlerts(e.target.checked)} className="size-4 accent-[var(--color-primary)]" />
            </label>
            <label className="flex items-center justify-between gap-4">
              <span>Auto-recalculate deployment on new incident</span>
              <input type="checkbox" checked={autoRecalc} onChange={(e) => setAutoRecalc(e.target.checked)} className="size-4 accent-[var(--color-primary)]" />
            </label>
            <label className="block">
              <span className="flex items-center justify-between">
                High-risk alert threshold <span className="font-semibold text-risk-high tabular-nums">{threshold}</span>
              </span>
              <input
                type="range"
                min={50}
                max={100}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="mt-2 w-full accent-[var(--color-primary)]"
              />
            </label>
          </div>
        </Panel>

        <Panel className="xl:col-span-2" title="Data & Governance">
          <p className="text-sm text-muted-foreground">
            This prototype runs entirely on simulated / anonymized data. It does not connect to confidential police
            systems, live CCTV feeds, or any personally identifiable record. AI output is decision-support only —
            authorized operators accept, modify or reject every recommendation, and each score is fully explainable.
          </p>
        </Panel>
      </div>
    </div>
  );
}