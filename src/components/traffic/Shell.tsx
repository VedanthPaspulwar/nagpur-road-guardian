import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Camera,
  CloudSun,
  FileText,
  LayoutDashboard,
  Map,
  Menu,
  Radio,
  Settings,
  Shield,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTraffic } from "@/lib/traffic-store";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/heatmap", label: "Risk Heatmap", icon: Map },
  { to: "/analysis", label: "Risk Analysis", icon: BarChart3 },
  { to: "/deployment", label: "Deployment Planner", icon: Shield },
  { to: "/incidents", label: "Incidents", icon: AlertTriangle },
  { to: "/cctv", label: "CCTV Monitor", icon: Camera },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/personnel", label: "Personnel", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Clock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="font-mono tabular-nums">{now ?? "--:--:--"}</span>;
}

function NotificationBell() {
  const { notifications, unread, markNotificationsRead } = useTraffic();
  const [open, setOpen] = useState(false);
  const toneColor = {
    danger: "text-risk-high",
    warning: "text-risk-medium",
    success: "text-risk-low",
    info: "text-cyber",
  } as const;
  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!open) markNotificationsRead();
        }}
        className="relative rounded-lg border border-border/60 bg-secondary/50 p-2 transition-colors hover:bg-secondary"
        aria-label="Notifications"
      >
        <Bell className="size-4" />
        {unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex size-4.5 min-w-4.5 items-center justify-center rounded-full bg-risk-high px-1 text-[10px] font-bold text-primary-foreground">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="glass-panel absolute right-0 z-1000 mt-2 max-h-96 w-80 overflow-y-auto p-2">
          <p className="px-2 py-1.5 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
            Notifications
          </p>
          {notifications.length === 0 && (
            <p className="px-2 py-4 text-sm text-muted-foreground">No alerts yet. Simulate an incident to see live alerts.</p>
          )}
          {notifications.map((n) => (
            <div key={n.id} className="rounded-lg px-2 py-2 hover:bg-secondary/60">
              <p className={cn("text-sm font-medium", toneColor[n.tone])}>{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.detail}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuickStats() {
  const { locations, incidents, availableOfficers, deployedOfficers } = useTraffic();
  const rows = [
    ["Total Junctions", "126"],
    ["High Risk Locations", String(locations.filter((l) => l.riskLevel === "high").length + 8)],
    ["Active Incidents", String(incidents.filter((i) => i.status === "active").length)],
    ["Available Officers", String(availableOfficers)],
    ["Deployed Officers", String(deployedOfficers)],
  ];
  return (
    <div className="mt-4 rounded-xl border border-border/60 bg-secondary/30 p-3">
      <p className="mb-2 text-[11px] font-semibold tracking-widest uppercase text-cyber">Quick Stats</p>
      <dl className="space-y-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between text-xs">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="flex min-h-screen w-full">
      {open && (
        <div className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-68 flex-col border-r border-border/60 bg-sidebar/95 p-4 transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary/20 text-primary glow-ring">
            <Shield className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-wide">Nagpur Traffic Police</p>
            <p className="text-[11px] text-cyber">AI Decision Support</p>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="size-5" />
          </button>
        </div>

        <nav className="mt-6 flex-1 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  active
                    ? "bg-primary/20 font-semibold text-primary-foreground shadow-[inset_2px_0_0_var(--color-cyber)]"
                    : "text-muted-foreground hover:translate-x-0.5 hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <QuickStats />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur-xl">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-risk-low">
            <span className="size-2 animate-pulse rounded-full bg-risk-low" /> System Online
          </div>
          <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            <Activity className="size-3.5" /> <Clock />
          </div>
          <div className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
            <CloudSun className="size-3.5" /> 32°C · Clear
          </div>
          <div className="hidden items-center gap-1.5 text-xs text-muted-foreground lg:flex">
            <Radio className="size-3.5 text-cyber" /> Data Source: Simulated / Anonymized
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-right text-xs sm:block">
              <span className="block font-semibold">Operator</span>
              <span className="block text-muted-foreground">Control Room</span>
            </span>
            <NotificationBell />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-6">{children}</main>

        <footer className="border-t border-border/60 px-4 py-6 md:px-6">
          <div className="glass-panel p-5">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-cyber">Privacy &amp; Ethics</h3>
            <ul className="mt-2 grid gap-1 text-xs text-muted-foreground md:grid-cols-2">
              <li>• Uses simulated / anonymized data only.</li>
              <li>• No confidential police information required.</li>
              <li>• No facial recognition, no individual-level profiling.</li>
              <li>• AI recommendations are decision-support only.</li>
              <li>• Authorized operators retain final control.</li>
              <li>• Every recommendation is explainable; manual override always available.</li>
            </ul>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">Nagpur Traffic Police — AI Decision Support System</span>{" "}
              · AI Powered • Safer Roads
            </p>
            <p>
              Data Source: Simulated Data · System Status: <span className="text-risk-low">● Online</span> · Prototype
              v1.0
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}