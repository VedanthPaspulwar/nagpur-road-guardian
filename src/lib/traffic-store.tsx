import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BASE_LOCATIONS,
  INCIDENT_TYPES,
  allocateOfficers,
  buildOfficers,
  initialIncidents,
  scoreLocation,
  type IncidentRecord,
  type Officer,
  type RiskLevel,
  type ScoredLocation,
  type TrafficLocation,
} from "./traffic-data";

export interface AppNotification {
  id: string;
  tone: "danger" | "warning" | "success" | "info";
  title: string;
  detail: string;
  timestamp: number;
  read: boolean;
}

interface TrafficState {
  locations: ScoredLocation[];
  rawLocations: TrafficLocation[];
  incidents: IncidentRecord[];
  officers: Officer[];
  notifications: AppNotification[];
  unread: number;
  availableOfficers: number;
  deployedOfficers: number;
  onLeave: number;
  reserve: number;
  avgResponse: number;
  allocation: ReturnType<typeof allocateOfficers>;
  decisions: Record<string, { status: "accepted" | "rejected"; officers?: number; reason?: string }>;
  simulateIncident: (locationId?: string) => void;
  deploy: (locationId: string, officers: number) => void;
  reject: (locationId: string, reason: string) => void;
  markNotificationsRead: () => void;
  pushNotification: (n: Omit<AppNotification, "id" | "timestamp" | "read">) => void;
  lastChange: { locationId: string; before: number; after: number; type: string } | null;
}

const Ctx = createContext<TrafficState | null>(null);

const SEED_TIME = 1755000000000; // stable seed for SSR-safe initial render

let counter = 0;
const nextId = (prefix: string) => `${prefix}-${++counter}-${Math.floor(Math.random() * 9999)}`;

export function TrafficProvider({ children }: { children: ReactNode }) {
  const [rawLocations, setRawLocations] = useState<TrafficLocation[]>(BASE_LOCATIONS);
  const [incidents, setIncidents] = useState<IncidentRecord[]>(() => initialIncidents(SEED_TIME));
  const [officers, setOfficers] = useState<Officer[]>(() => buildOfficers());
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [decisions, setDecisions] = useState<TrafficState["decisions"]>({});
  const [avgResponse, setAvgResponse] = useState(12.4);
  const [lastChange, setLastChange] = useState<TrafficState["lastChange"]>(null);

  const locations = useMemo(
    () =>
      rawLocations
        .map((l) => scoreLocation(l, incidents))
        .sort((a, b) => b.riskScore - a.riskScore),
    [rawLocations, incidents],
  );

  const availableOfficers = officers.filter((o) => o.status === "available").length;
  const deployedOfficers = officers.filter((o) => o.status === "deployed").length;
  const onLeave = officers.filter((o) => o.status === "on-leave").length;
  const reserve = officers.filter((o) => o.status === "reserve").length;

  const allocation = useMemo(
    () => allocateOfficers(locations, availableOfficers),
    [locations, availableOfficers],
  );

  const pushNotification = useCallback<TrafficState["pushNotification"]>((n) => {
    setNotifications((prev) =>
      [{ ...n, id: nextId("ntf"), timestamp: Date.now(), read: false }, ...prev].slice(0, 40),
    );
  }, []);

  const simulateIncident = useCallback<TrafficState["simulateIncident"]>(
    (locationId) => {
      const pool = rawLocations;
      const target =
        pool.find((l) => l.id === locationId) ?? pool[Math.floor(Math.random() * pool.length)];
      if (!target) return;
      const type = INCIDENT_TYPES[Math.floor(Math.random() * INCIDENT_TYPES.length)] ?? "Accident";
      const severity: RiskLevel =
        type === "Accident" || type === "Road Obstruction"
          ? "high"
          : type === "Road Work"
            ? "low"
            : "medium";

      const before = scoreLocation(target, incidents).riskScore;

      const bump = (v: number, amt: number) => Math.min(100, v + amt);
      const updatedRaw: TrafficLocation = {
        ...target,
        trend: "up",
        congestion: bump(target.congestion, severity === "high" ? 10 : 5),
        accidents: type === "Accident" ? target.accidents + 1 : target.accidents,
        obstruction:
          type === "Road Obstruction" || type === "Road Work"
            ? bump(target.obstruction, 15)
            : target.obstruction,
        parking: type === "Illegal Parking" ? bump(target.parking, 15) : target.parking,
        events: type === "Public Event" ? bump(target.events, 25) : target.events,
        violations: type === "Signal Failure" ? target.violations + 6 : target.violations,
      };

      const incident: IncidentRecord = {
        id: nextId("INC"),
        type,
        locationId: target.id,
        locationName: target.name,
        severity,
        timestamp: Date.now(),
        status: "active",
      };

      const nextIncidents = [incident, ...incidents];
      const after = scoreLocation(updatedRaw, nextIncidents).riskScore;

      setRawLocations((prev) => prev.map((l) => (l.id === target.id ? updatedRaw : l)));
      setIncidents(nextIncidents);
      setAvgResponse((r) => Math.round((r + (severity === "high" ? 0.6 : 0.2)) * 10) / 10);
      setLastChange({ locationId: target.id, before, after, type });
      pushNotification({
        tone: severity === "high" ? "danger" : severity === "medium" ? "warning" : "info",
        title: `${type} detected`,
        detail: `${target.name} — risk ${before} → ${after}. AI recommends ${scoreLocation(updatedRaw, nextIncidents).recommendedOfficers} officers.`,
      });
    },
    [rawLocations, incidents, pushNotification],
  );

  const deploy = useCallback<TrafficState["deploy"]>(
    (locationId, count) => {
      const target = rawLocations.find((l) => l.id === locationId);
      if (!target) return;
      const availableNow = officers.filter((o) => o.status === "available");
      const n = Math.max(0, Math.min(count, availableNow.length));
      if (n === 0) {
        pushNotification({
          tone: "warning",
          title: "No officers available",
          detail: `Cannot deploy to ${target.name}. Force fully committed.`,
        });
        return;
      }
      const ids = new Set(availableNow.slice(0, n).map((o) => o.id));
      setOfficers((prev) =>
        prev.map((o) =>
          ids.has(o.id)
            ? { ...o, status: "deployed", currentLocation: target.name, assignedArea: target.name }
            : o,
        ),
      );
      setRawLocations((prev) =>
        prev.map((l) => (l.id === locationId ? { ...l, policeCoverage: l.policeCoverage + n } : l)),
      );
      setAvgResponse((r) => Math.max(8, Math.round((r - n * 0.3) * 10) / 10));
      setDecisions((d) => ({ ...d, [locationId]: { status: "accepted", officers: n } }));
      pushNotification({
        tone: "success",
        title: "Deployment confirmed",
        detail: `${n} officer${n > 1 ? "s" : ""} dispatched to ${target.name}.`,
      });
    },
    [rawLocations, officers, pushNotification],
  );

  const reject = useCallback<TrafficState["reject"]>(
    (locationId, reason) => {
      const target = rawLocations.find((l) => l.id === locationId);
      setDecisions((d) => ({ ...d, [locationId]: { status: "rejected", reason } }));
      pushNotification({
        tone: "info",
        title: "Recommendation rejected",
        detail: `${target?.name ?? locationId} — operator note: ${reason}`,
      });
    },
    [rawLocations, pushNotification],
  );

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const value: TrafficState = {
    locations,
    rawLocations,
    incidents,
    officers,
    notifications,
    unread: notifications.filter((n) => !n.read).length,
    availableOfficers,
    deployedOfficers,
    onLeave,
    reserve,
    avgResponse,
    allocation,
    decisions,
    simulateIncident,
    deploy,
    reject,
    markNotificationsRead,
    pushNotification,
    lastChange,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTraffic() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTraffic must be used inside TrafficProvider");
  return ctx;
}