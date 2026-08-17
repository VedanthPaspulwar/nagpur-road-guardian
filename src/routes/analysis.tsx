import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, Panel } from "@/components/traffic/ui-bits";
import { useTraffic } from "@/lib/traffic-store";
import { RISK_COLORS } from "@/lib/traffic-data";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "Risk Analysis | Nagpur Traffic Risk AI" },
      { name: "description", content: "Hourly, daily and location-wise traffic risk analytics for Nagpur with incident, violation and congestion trends." },
      { property: "og:title", content: "Risk Analysis | Nagpur Traffic Risk AI" },
      { property: "og:description", content: "Charts covering risk trends, incidents by hour and incident type distribution." },
    ],
  }),
  component: AnalysisPage,
});

const HOURS = ["06", "08", "10", "12", "14", "16", "18", "20", "22"];

const axis = { stroke: "#94a3b8", fontSize: 11 };
const tooltipStyle = {
  background: "#1b2537",
  border: "1px solid #334155",
  borderRadius: 10,
  color: "#e2e8f0",
  fontSize: 12,
};

function AnalysisPage() {
  const { locations, incidents } = useTraffic();

  const byLocation = locations.map((l) => ({ name: l.name.split(" ")[0], risk: l.riskScore, level: l.riskLevel }));

  const hourly = HOURS.map((h, i) => ({
    hour: `${h}:00`,
    incidents: [3, 9, 6, 5, 4, 7, 11, 6, 3][i],
    congestion: [40, 88, 62, 58, 55, 70, 92, 61, 35][i],
    violations: [5, 18, 12, 10, 9, 14, 21, 11, 6][i],
  }));

  const daily = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
    day: d,
    risk: [71, 74, 69, 78, 83, 88, 66][i],
    accidents: [3, 4, 2, 5, 6, 7, 2][i],
  }));

  const typeCounts = incidents.reduce<Record<string, number>>((acc, i) => {
    acc[i.type] = (acc[i.type] ?? 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  const PIE_COLORS = ["#ef4444", "#f59e0b", "#22c55e", "#38bdf8", "#818cf8", "#f472b6", "#facc15"];

  return (
    <div>
      <PageHeader title="Risk Analysis" subtitle="Trends derived from simulated Nagpur traffic telemetry." />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Risk by Location" subtitle="Current AI risk score per junction">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byLocation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" {...axis} />
              <YAxis domain={[0, 100]} {...axis} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#ffffff10" }} />
              <Bar dataKey="risk" radius={[6, 6, 0, 0]}>
                {byLocation.map((d, i) => (
                  <Cell key={i} fill={RISK_COLORS[d.level]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Incidents by Hour" subtitle="Peak-hour incident concentration">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={hourly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="hour" {...axis} />
              <YAxis {...axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="violations" stroke="#38bdf8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Weekly Risk & Accident Trend">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" {...axis} />
              <YAxis {...axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="risk" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="accidents" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Incident Types" subtitle="Distribution across today's incident log">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel className="xl:col-span-2" title="Hourly Congestion Trend">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={hourly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="hour" {...axis} />
              <YAxis domain={[0, 100]} {...axis} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#ffffff10" }} />
              <Bar dataKey="congestion" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
}