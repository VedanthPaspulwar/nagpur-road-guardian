export type RiskLevel = "high" | "medium" | "low";

export interface TrafficLocation {
  id: string;
  name: string;
  zone: string;
  lat: number;
  lng: number;
  congestion: number; // 0-100
  accidents: number; // recent count
  violations: number; // per hour
  parking: number; // 0-100 illegal parking pressure
  obstruction: number; // 0-100
  pedestrianDensity: number; // 0-100
  weather: number; // 0-100 adverse
  roadWork: number; // 0-100
  events: number; // 0-100
  policeCoverage: number; // officers currently posted
  trend: "up" | "down" | "flat";
}

export interface IncidentRecord {
  id: string;
  type: IncidentType;
  locationId: string;
  locationName: string;
  severity: RiskLevel;
  timestamp: number;
  status: "active" | "resolved";
}

export type IncidentType =
  | "Accident"
  | "Road Obstruction"
  | "Heavy Congestion"
  | "Illegal Parking"
  | "Signal Failure"
  | "Public Event"
  | "Road Work";

export interface Officer {
  id: string;
  name: string;
  status: "available" | "deployed" | "on-leave" | "reserve";
  currentLocation: string;
  assignedArea: string;
}

export interface RiskFactor {
  label: string;
  points: number;
}

export interface ScoredLocation extends TrafficLocation {
  riskScore: number;
  riskLevel: RiskLevel;
  factors: RiskFactor[];
  reasons: string[];
  recommendedOfficers: number;
  incidentCount: number;
  coverageStatus: "unmanned" | "under-covered" | "covered";
}

export const NAGPUR_CENTER: [number, number] = [21.1458, 79.0882];

export const BASE_LOCATIONS: TrafficLocation[] = [
  { id: "sitabuldi", name: "Sitabuldi Junction", zone: "Central Nagpur", lat: 21.1458, lng: 79.0806, congestion: 92, accidents: 4, violations: 26, parking: 70, obstruction: 55, pedestrianDensity: 88, weather: 20, roadWork: 15, events: 30, policeCoverage: 1, trend: "up" },
  { id: "sadar", name: "Sadar Square", zone: "North Nagpur", lat: 21.1637, lng: 79.0762, congestion: 84, accidents: 3, violations: 24, parking: 65, obstruction: 72, pedestrianDensity: 80, weather: 20, roadWork: 25, events: 40, policeCoverage: 1, trend: "up" },
  { id: "mankapur", name: "Mankapur Road", zone: "North-West Nagpur", lat: 21.1866, lng: 79.0587, congestion: 71, accidents: 1, violations: 15, parking: 74, obstruction: 30, pedestrianDensity: 58, weather: 20, roadWork: 35, events: 10, policeCoverage: 1, trend: "up" },
  { id: "dharampeth", name: "Dharampeth Junction", zone: "West Nagpur", lat: 21.1355, lng: 79.0625, congestion: 68, accidents: 1, violations: 13, parking: 55, obstruction: 22, pedestrianDensity: 52, weather: 20, roadWork: 10, events: 15, policeCoverage: 2, trend: "flat" },
  { id: "reshimbagh", name: "Reshimbagh Square", zone: "South Nagpur", lat: 21.1275, lng: 79.1015, congestion: 60, accidents: 1, violations: 11, parking: 40, obstruction: 18, pedestrianDensity: 62, weather: 20, roadWork: 10, events: 20, policeCoverage: 2, trend: "up" },
  { id: "mihan", name: "MIHAN Road", zone: "South-East Nagpur", lat: 21.0333, lng: 79.0553, congestion: 47, accidents: 1, violations: 8, parking: 20, obstruction: 25, pedestrianDensity: 22, weather: 20, roadWork: 45, events: 5, policeCoverage: 1, trend: "flat" },
  { id: "kadbi", name: "Kadbi Chowk", zone: "North Nagpur", lat: 21.1697, lng: 79.0873, congestion: 76, accidents: 2, violations: 19, parking: 58, obstruction: 34, pedestrianDensity: 66, weather: 20, roadWork: 12, events: 12, policeCoverage: 1, trend: "up" },
  { id: "wardhaman", name: "Wardhaman Nagar Square", zone: "East Nagpur", lat: 21.1477, lng: 79.1237, congestion: 63, accidents: 1, violations: 12, parking: 48, obstruction: 20, pedestrianDensity: 45, weather: 20, roadWork: 8, events: 10, policeCoverage: 2, trend: "flat" },
  { id: "manish", name: "Manish Nagar Crossing", zone: "South Nagpur", lat: 21.0968, lng: 79.0553, congestion: 55, accidents: 0, violations: 9, parking: 35, obstruction: 14, pedestrianDensity: 34, weather: 20, roadWork: 18, events: 5, policeCoverage: 1, trend: "down" },
  { id: "airport", name: "Airport Road Junction", zone: "South Nagpur", lat: 21.0925, lng: 79.0562, congestion: 52, accidents: 1, violations: 7, parking: 22, obstruction: 12, pedestrianDensity: 25, weather: 20, roadWork: 10, events: 8, policeCoverage: 1, trend: "flat" },
];

/** Explainable weighted AI risk model. */
export const RISK_WEIGHTS = {
  congestion: 0.28,
  accidents: 5.5,
  violations: 0.75,
  parking: 0.08,
  obstruction: 0.16,
  pedestrianDensity: 0.13,
  weather: 0.06,
  roadWork: 0.07,
  events: 0.08,
  coverageRelief: 5,
} as const;

export function scoreLocation(loc: TrafficLocation, incidents: IncidentRecord[]): ScoredLocation {
  const active = incidents.filter((i) => i.locationId === loc.id && i.status === "active");
  const incidentBoost = active.reduce(
    (sum, i) => sum + (i.severity === "high" ? 9 : i.severity === "medium" ? 5 : 2),
    0,
  );

  const factors: RiskFactor[] = [
    { label: "Traffic congestion", points: loc.congestion * RISK_WEIGHTS.congestion },
    { label: "Recent accidents", points: loc.accidents * RISK_WEIGHTS.accidents },
    { label: "Traffic violations", points: loc.violations * RISK_WEIGHTS.violations },
    { label: "Illegal parking", points: loc.parking * RISK_WEIGHTS.parking },
    { label: "Road obstruction", points: loc.obstruction * RISK_WEIGHTS.obstruction },
    { label: "Pedestrian density", points: loc.pedestrianDensity * RISK_WEIGHTS.pedestrianDensity },
    { label: "Weather conditions", points: loc.weather * RISK_WEIGHTS.weather },
    { label: "Road work", points: loc.roadWork * RISK_WEIGHTS.roadWork },
    { label: "Public events", points: loc.events * RISK_WEIGHTS.events },
  ];
  if (incidentBoost > 0) factors.push({ label: "Live incidents", points: incidentBoost });
  factors.push({ label: "Current police coverage", points: -loc.policeCoverage * RISK_WEIGHTS.coverageRelief });

  const raw = factors.reduce((s, f) => s + f.points, 0);
  const riskScore = Math.max(0, Math.min(100, Math.round(raw)));
  const riskLevel: RiskLevel = riskScore >= 80 ? "high" : riskScore >= 60 ? "medium" : "low";

  const reasons: string[] = [];
  if (loc.congestion >= 70) reasons.push("Heavy congestion");
  if (loc.violations >= 15) reasons.push("Frequent traffic violations");
  if (loc.accidents >= 2) reasons.push("Recent accidents");
  if (loc.pedestrianDensity >= 65) reasons.push("High pedestrian density");
  if (loc.obstruction >= 50) reasons.push("Road obstruction");
  if (loc.parking >= 60) reasons.push("Illegal parking pressure");
  if (loc.roadWork >= 35) reasons.push("Ongoing road work");
  if (active.length) reasons.push(`${active.length} live incident${active.length > 1 ? "s" : ""}`);
  if (!reasons.length) reasons.push("Stable traffic flow");

  const recommendedOfficers =
    riskScore >= 88 ? 4 : riskScore >= 80 ? 3 : riskScore >= 68 ? 2 : riskScore >= 55 ? 1 : 0;

  const coverageStatus =
    loc.policeCoverage === 0
      ? "unmanned"
      : loc.policeCoverage < recommendedOfficers
        ? "under-covered"
        : "covered";

  return {
    ...loc,
    riskScore,
    riskLevel,
    factors,
    reasons,
    recommendedOfficers,
    incidentCount: active.length,
    coverageStatus,
  };
}

/** Greedy limited-resource allocation: highest risk first, never exceeds availability. */
export function allocateOfficers(locations: ScoredLocation[], available: number) {
  const ranked = [...locations].sort((a, b) => b.riskScore - a.riskScore);
  let pool = available;
  return ranked.map((loc) => {
    const gap = Math.max(0, loc.recommendedOfficers - loc.policeCoverage);
    const allocated = Math.min(gap, pool);
    pool -= allocated;
    return { location: loc, gap, allocated, unmet: gap - allocated };
  });
}

export const INCIDENT_TYPES: IncidentType[] = [
  "Accident",
  "Road Obstruction",
  "Heavy Congestion",
  "Illegal Parking",
  "Signal Failure",
  "Public Event",
  "Road Work",
];

const FIRST = ["Amit", "Rahul", "Priya", "Sunil", "Nikhil", "Sneha", "Vijay", "Manish", "Kiran", "Rohit", "Anjali", "Deepak", "Pooja", "Sagar", "Ravi", "Neha", "Ashish", "Meena"];
const LAST = ["Deshmukh", "Wankhede", "Patil", "Bhosale", "Meshram", "Gaikwad", "Thakre", "Kale", "Raut", "Chavan", "Ingle", "Sonawane"];

export function buildOfficers(): Officer[] {
  const areas = BASE_LOCATIONS.map((l) => l.name);
  const officers: Officer[] = [];
  for (let i = 0; i < 100; i++) {
    const status: Officer["status"] =
      i < 58 ? "deployed" : i < 90 ? "available" : i < 96 ? "on-leave" : "reserve";
    const area = areas[i % areas.length] ?? "Sitabuldi Junction";
    const name = `${FIRST[i % FIRST.length] ?? "Officer"} ${LAST[i % LAST.length] ?? "Nagpur"}`;
    officers.push({
      id: `NTP-${(1000 + i).toString()}`,
      name,
      status,
      currentLocation: status === "deployed" ? area : status === "on-leave" ? "—" : "Control Room HQ",
      assignedArea: area,
    });
  }
  return officers;
}

export function initialIncidents(now: number): IncidentRecord[] {
  const mins = (m: number) => now - m * 60_000;
  return [
    { id: "INC-1007", type: "Accident", locationId: "sitabuldi", locationName: "Sitabuldi Junction", severity: "high", timestamp: mins(18), status: "active" },
    { id: "INC-1006", type: "Road Obstruction", locationId: "sadar", locationName: "Sadar Square", severity: "high", timestamp: mins(35), status: "active" },
    { id: "INC-1005", type: "Illegal Parking", locationId: "dharampeth", locationName: "Dharampeth Junction", severity: "medium", timestamp: mins(52), status: "active" },
    { id: "INC-1004", type: "Road Work", locationId: "mankapur", locationName: "Mankapur Road", severity: "low", timestamp: mins(73), status: "active" },
    { id: "INC-1003", type: "Heavy Congestion", locationId: "kadbi", locationName: "Kadbi Chowk", severity: "medium", timestamp: mins(95), status: "active" },
    { id: "INC-1002", type: "Signal Failure", locationId: "wardhaman", locationName: "Wardhaman Nagar Square", severity: "medium", timestamp: mins(120), status: "active" },
    { id: "INC-1001", type: "Public Event", locationId: "reshimbagh", locationName: "Reshimbagh Square", severity: "low", timestamp: mins(150), status: "active" },
    { id: "INC-0999", type: "Accident", locationId: "mihan", locationName: "MIHAN Road", severity: "medium", timestamp: mins(210), status: "resolved" },
    { id: "INC-0998", type: "Illegal Parking", locationId: "manish", locationName: "Manish Nagar Crossing", severity: "low", timestamp: mins(260), status: "resolved" },
  ];
}

export const RISK_COLORS: Record<RiskLevel, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

export function riskLabel(level: RiskLevel) {
  return level === "high" ? "HIGH" : level === "medium" ? "MEDIUM" : "LOW";
}