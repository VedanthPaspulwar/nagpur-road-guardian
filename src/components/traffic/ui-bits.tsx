import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/traffic-data";
import type { ReactNode } from "react";

export function RiskBadge({ level, score }: { level: RiskLevel; score?: number }) {
  const map = {
    high: "bg-risk-high/15 text-risk-high border-risk-high/40",
    medium: "bg-risk-medium/15 text-risk-medium border-risk-medium/40",
    low: "bg-risk-low/15 text-risk-low border-risk-low/40",
  } as const;
  const dot = { high: "bg-risk-high", medium: "bg-risk-medium", low: "bg-risk-low" } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        map[level],
      )}
    >
      <span className={cn("size-1.5 rounded-full", dot[level])} />
      {level} {score !== undefined ? `· ${score}` : ""}
    </span>
  );
}

export function Panel({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("glass-panel scanline-top overflow-hidden", className)}>
      {(title || action) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
          <div>
            {title && <h2 className="text-sm font-semibold tracking-wider uppercase">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export function riskTextClass(level: RiskLevel) {
  return level === "high" ? "text-risk-high" : level === "medium" ? "text-risk-medium" : "text-risk-low";
}