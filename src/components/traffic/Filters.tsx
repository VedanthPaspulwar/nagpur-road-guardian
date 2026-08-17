import { Search, Zap } from "lucide-react";
import { useTraffic } from "@/lib/traffic-store";
import type { ScoredLocation } from "@/lib/traffic-data";
import { cn } from "@/lib/utils";

export interface FilterState {
  q: string;
  risk: "all" | "high" | "medium" | "low";
  time: string;
  incident: string;
  coverage: "all" | "covered" | "under-covered" | "unmanned";
}

export const DEFAULT_FILTERS: FilterState = {
  q: "",
  risk: "all",
  time: "Live Now",
  incident: "All",
  coverage: "all",
};

export function applyFilters(locations: ScoredLocation[], f: FilterState) {
  return locations.filter((l) => {
    if (f.q && !`${l.name} ${l.zone}`.toLowerCase().includes(f.q.toLowerCase())) return false;
    if (f.risk !== "all" && l.riskLevel !== f.risk) return false;
    if (f.coverage !== "all" && l.coverageStatus !== f.coverage) return false;
    return true;
  });
}

const SELECTS: { key: keyof FilterState; label: string; options: string[] }[] = [
  { key: "risk", label: "Risk Level", options: ["all", "high", "medium", "low"] },
  { key: "time", label: "Time", options: ["Live Now", "Morning Peak", "Afternoon", "Evening Peak", "Night"] },
  {
    key: "incident",
    label: "Incident Type",
    options: ["All", "Accident", "Congestion", "Violation", "Parking", "Obstruction", "Road Work", "Event"],
  },
  { key: "coverage", label: "Police Coverage", options: ["all", "covered", "under-covered", "unmanned"] },
];

export function FiltersBar({
  value,
  onChange,
  showSimulate = true,
}: {
  value: FilterState;
  onChange: (f: FilterState) => void;
  showSimulate?: boolean;
}) {
  const { simulateIncident } = useTraffic();
  return (
    <div className="glass-panel mb-6 flex flex-wrap items-end gap-3 p-4">
      <label className="relative min-w-52 flex-1">
        <span className="mb-1 block text-[11px] tracking-widest uppercase text-muted-foreground">Search</span>
        <Search className="pointer-events-none absolute bottom-2.5 left-3 size-3.5 text-muted-foreground" />
        <input
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
          placeholder="Search junction or zone…"
          className="w-full rounded-lg border border-border/60 bg-input/50 py-2 pr-3 pl-8 text-xs outline-none focus:border-primary"
        />
      </label>
      {SELECTS.map((s) => (
        <label key={s.key} className="min-w-36">
          <span className="mb-1 block text-[11px] tracking-widest uppercase text-muted-foreground">{s.label}</span>
          <select
            value={String(value[s.key])}
            onChange={(e) => onChange({ ...value, [s.key]: e.target.value })}
            className="w-full rounded-lg border border-border/60 bg-input/50 px-3 py-2 text-xs capitalize outline-none focus:border-primary"
          >
            {s.options.map((o) => (
              <option key={o} value={o} className="bg-popover capitalize">
                {o === "all" ? "All" : o}
              </option>
            ))}
          </select>
        </label>
      ))}
      {showSimulate && (
        <button
          onClick={() => simulateIncident()}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 hover:bg-primary/85",
          )}
        >
          <Zap className="size-4" /> + Simulate Incident
        </button>
      )}
    </div>
  );
}