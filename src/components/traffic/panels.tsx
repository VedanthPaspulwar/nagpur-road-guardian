import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Bot,
  Check,
  Clock,
  Minus,
  Send,
  ShieldAlert,
  Sparkles,
  Timer,
  UserCheck,
  X,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Panel, RiskBadge, riskTextClass } from "./ui-bits";
import { useTraffic } from "@/lib/traffic-store";
import type { ScoredLocation } from "@/lib/traffic-data";
import { cn } from "@/lib/utils";

export function KpiCards() {
  const { locations, incidents, availableOfficers, officers, avgResponse } = useTraffic();
  const high = locations.filter((l) => l.riskLevel === "high").length;
  const active = incidents.filter((i) => i.status === "active").length;
  const pct = Math.round((availableOfficers / officers.length) * 100);

  const cards = [
    { label: "High Risk Locations", value: high, note: "↑ 3 from yesterday", color: "text-risk-high", ring: "from-risk-high/25", icon: ShieldAlert },
    { label: "Active Incidents", value: active, note: "↑ 2 from last hour", color: "text-risk-medium", ring: "from-risk-medium/25", icon: AlertTriangle },
    { label: "Available Officers", value: availableOfficers, note: `${pct}% of total force`, color: "text-chart-2", ring: "from-chart-2/25", icon: UserCheck },
    { label: "Avg. Response Time", value: `${avgResponse} min`, note: "↓ 2.1 min improvement", color: "text-risk-low", ring: "from-risk-low/25", icon: Timer },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={cn(
            "glass-panel scanline-top relative overflow-hidden p-5 transition-transform hover:-translate-y-0.5",
          )}
        >
          <div className={cn("absolute -top-16 -right-10 size-40 rounded-full bg-gradient-to-b to-transparent blur-2xl", c.ring)} />
          <div className="relative flex items-start justify-between">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">{c.label}</p>
            <c.icon className={cn("size-5", c.color)} />
          </div>
          <p className={cn("relative mt-3 text-4xl font-bold tabular-nums", c.color)}>{c.value}</p>
          <p className="relative mt-1 text-xs text-muted-foreground">{c.note}</p>
        </div>
      ))}
    </div>
  );
}

export function RecommendationsPanel({ limit = 5 }: { limit?: number }) {
  const { locations, allocation, deploy, reject, decisions, availableOfficers } = useTraffic();
  const [edits, setEdits] = useState<Record<string, number>>({});
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const ranked = locations.filter((l) => l.recommendedOfficers > 0).slice(0, limit);
  const allocMap = new Map(allocation.map((a) => [a.location.id, a]));

  return (
    <Panel
      title="AI Deployment Recommendations"
      subtitle={`Optimised for ${availableOfficers} available officers — highest risk served first`}
      action={<span className="text-[11px] text-cyber">Explainable · Operator override enabled</span>}
    >
      <ol className="space-y-3">
        {ranked.map((loc, i) => {
          const alloc = allocMap.get(loc.id);
          const value = edits[loc.id] ?? loc.recommendedOfficers;
          const decision = decisions[loc.id];
          return (
            <li key={loc.id} className="rounded-xl border border-border/60 bg-secondary/30 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="grid size-6 place-items-center rounded-md bg-primary/25 text-xs font-bold">{i + 1}</span>
                <span className="font-semibold">{loc.name}</span>
                <RiskBadge level={loc.riskLevel} score={loc.riskScore} />
                {loc.coverageStatus !== "covered" && (
                  <span className="rounded-full border border-risk-high/40 bg-risk-high/10 px-2 py-0.5 text-[11px] font-semibold text-risk-high">
                    {loc.coverageStatus === "unmanned" ? "UNMANNED" : "UNDER-COVERED"}
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Reason: {loc.reasons.join(", ")}.</p>
              <p className="mt-1 text-xs">
                <span className="text-cyber">AI Recommendation:</span> Deploy {loc.recommendedOfficers} officer
                {loc.recommendedOfficers > 1 ? "s" : ""} · currently {loc.policeCoverage} posted
                {alloc && alloc.unmet > 0 && (
                  <span className="text-risk-medium"> · {alloc.unmet} unmet (force limit)</span>
                )}
              </p>

              {decision ? (
                <p className={cn("mt-3 text-xs font-semibold", decision.status === "accepted" ? "text-risk-low" : "text-muted-foreground")}>
                  {decision.status === "accepted"
                    ? `✔ Deployment confirmed — ${decision.officers} officer(s) dispatched.`
                    : `✖ Rejected — ${decision.reason}`}
                </p>
              ) : rejecting === loc.id ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <input
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Why are you rejecting this recommendation?"
                    className="min-w-0 flex-1 rounded-lg border border-border/60 bg-input/60 px-3 py-1.5 text-xs outline-none focus:border-primary"
                  />
                  <button
                    onClick={() => {
                      reject(loc.id, reason || "No reason provided");
                      setRejecting(null);
                      setReason("");
                    }}
                    className="rounded-lg bg-risk-high/90 px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-risk-high"
                  >
                    Submit
                  </button>
                  <button onClick={() => setRejecting(null)} className="rounded-lg border border-border/60 px-3 py-1.5 text-xs">
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => deploy(loc.id, loc.recommendedOfficers)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
                  >
                    <Check className="size-3.5" /> Accept
                  </button>
                  <div className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-input/40 px-2 py-1 text-xs">
                    <span className="text-muted-foreground">Modify</span>
                    <button
                      className="px-1.5 text-muted-foreground hover:text-foreground"
                      onClick={() => setEdits((e) => ({ ...e, [loc.id]: Math.max(0, value - 1) }))}
                    >
                      −
                    </button>
                    <span className="w-4 text-center font-semibold tabular-nums">{value}</span>
                    <button
                      className="px-1.5 text-muted-foreground hover:text-foreground"
                      onClick={() => setEdits((e) => ({ ...e, [loc.id]: value + 1 }))}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => deploy(loc.id, value)}
                    className="rounded-lg border border-cyber/50 px-3 py-1.5 text-xs font-semibold text-cyber hover:bg-cyber/10"
                  >
                    Confirm Deployment
                  </button>
                  <button
                    onClick={() => setRejecting(loc.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3.5" /> Reject
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}

export function RiskExplainer({ loc }: { loc: ScoredLocation }) {
  return (
    <div>
      <p className="text-sm font-semibold">Why is {loc.name} {loc.riskLevel} risk?</p>
      <ul className="mt-2 space-y-1.5">
        {loc.factors
          .filter((f) => Math.abs(f.points) >= 0.5)
          .map((f) => (
            <li key={f.label} className="flex items-center gap-3 text-xs">
              <span className="w-40 shrink-0 text-muted-foreground">{f.label}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <span
                  className={cn("block h-full rounded-full", f.points < 0 ? "bg-risk-low" : "bg-primary")}
                  style={{ width: `${Math.min(100, Math.abs(f.points) * 3)}%` }}
                />
              </span>
              <span className={cn("w-12 text-right font-semibold tabular-nums", f.points < 0 ? "text-risk-low" : "text-foreground")}>
                {f.points > 0 ? "+" : ""}
                {Math.round(f.points)}
              </span>
            </li>
          ))}
      </ul>
      <p className="mt-3 text-sm font-semibold">
        Final Risk Score: <span className={riskTextClass(loc.riskLevel)}>{loc.riskScore}/100</span>
      </p>
    </div>
  );
}

export function RecentIncidents({ limit = 5 }: { limit?: number }) {
  const { incidents } = useTraffic();
  return (
    <Panel
      title="Recent Incidents"
      action={
        <Link to="/incidents" className="text-xs font-semibold text-cyber hover:underline">
          View All
        </Link>
      }
    >
      <ul className="space-y-2">
        {incidents.slice(0, limit).map((inc) => (
          <li key={inc.id} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/25 px-3 py-2">
            <span
              className={cn(
                "size-2.5 rounded-full",
                inc.severity === "high" ? "bg-risk-high" : inc.severity === "medium" ? "bg-risk-medium" : "bg-risk-low",
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{inc.type}</p>
              <p className="truncate text-xs text-muted-foreground">{inc.locationName}</p>
            </div>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="size-3" />
              {new Date(inc.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function HighRiskTable() {
  const { locations } = useTraffic();
  const [sel, setSel] = useState<string | null>(null);
  const selected = locations.find((l) => l.id === sel) ?? null;
  const TrendIcon = { up: ArrowUp, down: ArrowDown, flat: Minus };
  return (
    <Panel title="Ranked High-Risk Locations" subtitle="Sorted by AI risk score">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-[11px] tracking-wider uppercase text-muted-foreground">
              <th className="py-2 pr-3">#</th>
              <th className="py-2 pr-3">Location</th>
              <th className="py-2 pr-3">Risk</th>
              <th className="py-2 pr-3">Main Reasons</th>
              <th className="py-2 pr-3">Trend</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((l, i) => {
              const T = TrendIcon[l.trend];
              return (
                <tr key={l.id} className="border-b border-border/30 transition-colors hover:bg-secondary/30">
                  <td className="py-2.5 pr-3 text-muted-foreground">{i + 1}</td>
                  <td className="py-2.5 pr-3 font-medium">{l.name}</td>
                  <td className={cn("py-2.5 pr-3 font-bold tabular-nums", riskTextClass(l.riskLevel))}>{l.riskScore}</td>
                  <td className="py-2.5 pr-3 text-xs text-muted-foreground">{l.reasons.slice(0, 2).join(", ")}</td>
                  <td className="py-2.5 pr-3">
                    <T className={cn("size-4", l.trend === "up" ? "text-risk-high" : l.trend === "down" ? "text-risk-low" : "text-muted-foreground")} />
                  </td>
                  <td className="py-2.5">
                    <button
                      onClick={() => setSel(sel === l.id ? null : l.id)}
                      className="rounded-lg border border-border/60 px-2.5 py-1 text-xs hover:bg-secondary"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="mt-4 rounded-xl border border-cyber/30 bg-secondary/30 p-4">
          <RiskExplainer loc={selected} />
        </div>
      )}
    </Panel>
  );
}

export function ComparisonSection() {
  const { locations, avgResponse } = useTraffic();
  const uncovered = locations.filter((l) => l.riskLevel === "high" && l.coverageStatus !== "covered").length;
  const rows = [
    { label: "Average response time", base: "18.5 min", ai: `${avgResponse} min` },
    { label: "Uncovered high-risk locations", base: "5", ai: String(Math.max(1, uncovered)) },
    { label: "Coverage efficiency", base: "61%", ai: "84%" },
  ];
  return (
    <Panel
      title="Current Deployment vs AI Recommended Deployment"
      subtitle="Simulated prototype metrics — not real Nagpur Police performance data"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-secondary/25 p-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Current (Baseline)</p>
          {rows.map((r) => (
            <div key={r.label} className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{r.label}</span>
              <span className="font-semibold text-risk-medium">{r.base}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-cyber/35 bg-cyber/5 p-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-cyber">AI Recommended</p>
          {rows.map((r) => (
            <div key={r.label} className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{r.label}</span>
              <span className="font-semibold text-risk-low">{r.ai}</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

export function AiAssistant() {
  const { locations, lastChange, availableOfficers, incidents } = useTraffic();
  const [q, setQ] = useState("");
  const [log, setLog] = useState<{ role: "user" | "ai"; text: string }[]>([
    {
      role: "ai",
      text: "Traffic AI Assistant online. Ask me where to deploy officers, why a location is high risk, or what changed after an incident.",
    },
  ]);

  const answer = useMemo(
    () => (question: string) => {
      const s = question.toLowerCase();
      const top = locations[0];
      const named = locations.find((l) => s.includes(l.name.split(" ")[0]!.toLowerCase()));

      if (s.includes("changed") || s.includes("after the accident") || s.includes("incident")) {
        if (lastChange) {
          const loc = locations.find((l) => l.id === lastChange.locationId);
          return `${loc?.name}: a ${lastChange.type.toLowerCase()} was detected. Risk moved from ${lastChange.before} to ${lastChange.after}. The system recommends immediate deployment of ${loc?.recommendedOfficers ?? 0} officers.`;
        }
        return `No new incident has been simulated yet. ${incidents.filter((i) => i.status === "active").length} incidents are currently active across the city.`;
      }
      if (named && (s.includes("why") || s.includes("risk"))) {
        const drivers = named.factors
          .filter((f) => f.points > 6)
          .sort((a, b) => b.points - a.points)
          .slice(0, 3)
          .map((f) => `${f.label.toLowerCase()} (+${Math.round(f.points)})`)
          .join(", ");
        return `${named.name} scores ${named.riskScore}/100 (${named.riskLevel} risk). Main drivers: ${drivers}. Coverage: ${named.policeCoverage} posted vs ${named.recommendedOfficers} recommended — ${named.coverageStatus}.`;
      }
      if (s.includes("deploy") || s.includes("where") || s.includes("officer")) {
        const gaps = locations
          .filter((l) => l.recommendedOfficers > l.policeCoverage)
          .slice(0, 3)
          .map((l) => `${l.name} (+${l.recommendedOfficers - l.policeCoverage})`)
          .join(", ");
        return `${top?.name} has the highest risk score of ${top?.riskScore}/100 and is ${top?.coverageStatus}. Deploy ${top?.recommendedOfficers} officers there first. Next priorities: ${gaps}. ${availableOfficers} officers are available.`;
      }
      if (s.includes("unmanned") || s.includes("cover")) {
        const bad = locations.filter((l) => l.coverageStatus !== "covered");
        return bad.length
          ? `${bad.length} locations need attention: ${bad.map((l) => `${l.name} (${l.coverageStatus})`).join("; ")}.`
          : "All ranked locations currently meet their recommended coverage.";
      }
      return `Top 3 risk locations right now: ${locations
        .slice(0, 3)
        .map((l) => `${l.name} ${l.riskScore}/100`)
        .join(", ")}. Ask about deployment, a specific junction, or recent changes.`;
    },
    [locations, lastChange, availableOfficers, incidents],
  );

  const send = (text: string) => {
    if (!text.trim()) return;
    setLog((l) => [...l, { role: "user", text }, { role: "ai", text: answer(text) }]);
    setQ("");
  };

  const suggestions = [
    "Where should officers be deployed right now?",
    "Why is Sadar high risk?",
    "What changed after the accident?",
  ];

  return (
    <Panel
      title="Traffic AI Assistant"
      subtitle="Answers from live simulated dashboard data"
      action={<Sparkles className="size-4 text-cyber" />}
    >
      <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
        {log.map((m, i) => (
          <div key={i} className={cn("flex gap-2", m.role === "user" && "justify-end")}>
            {m.role === "ai" && <Bot className="mt-0.5 size-4 shrink-0 text-cyber" />}
            <p
              className={cn(
                "max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed",
                m.role === "ai" ? "bg-secondary/50" : "bg-primary/25",
              )}
            >
              {m.text}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="rounded-full border border-cyber/40 px-2.5 py-1 text-[11px] text-cyber hover:bg-cyber/10"
          >
            {s}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(q);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask the Traffic AI…"
          className="min-w-0 flex-1 rounded-lg border border-border/60 bg-input/50 px-3 py-2 text-xs outline-none focus:border-primary"
        />
        <button className="rounded-lg bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/85" aria-label="Send">
          <Send className="size-4" />
        </button>
      </form>
    </Panel>
  );
}