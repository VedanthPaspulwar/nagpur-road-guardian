import { useEffect, useRef } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import { NAGPUR_CENTER, RISK_COLORS, riskLabel, type ScoredLocation } from "@/lib/traffic-data";

interface Props {
  locations: ScoredLocation[];
  onSelect?: (loc: ScoredLocation) => void;
  onDeploy?: (loc: ScoredLocation) => void;
  height?: string;
}

export default function NagpurMap({ locations, onSelect, onDeploy, height = "520px" }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const handlers = useRef({ onSelect, onDeploy });
  handlers.current = { onSelect, onDeploy };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, { center: NAGPUR_CENTER, zoom: 12, zoomControl: true });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);
      mapRef.current = map;
      layerRef.current = L.layerGroup().addTo(map);
      setTimeout(() => map.invalidateSize(), 200);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !layerRef.current) return;
      const layer = layerRef.current;
      layer.clearLayers();

      for (const loc of locations) {
        const color = RISK_COLORS[loc.riskLevel];
        L.circle([loc.lat, loc.lng], {
          radius: 320 + loc.riskScore * 8,
          color,
          weight: 1,
          fillColor: color,
          fillOpacity: 0.18,
        }).addTo(layer);

        const icon = L.divIcon({
          className: "",
          html: `<div class="risk-marker-dot" style="width:22px;height:22px;background:${color};box-shadow:0 0 0 6px ${color}33, 0 0 18px ${color};"></div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const marker = L.marker([loc.lat, loc.lng], { icon, title: loc.name }).addTo(layer);

        const el = document.createElement("div");
        el.style.minWidth = "250px";
        el.innerHTML = `
          <div style="font-weight:700;font-size:14px;margin-bottom:4px">${loc.name}</div>
          <div style="font-size:12px;color:#9fb3c8">${loc.zone}</div>
          <div style="margin-top:8px;font-size:13px"><b>Risk Score:</b> ${loc.riskScore}/100</div>
          <div style="font-size:13px"><b>Risk Level:</b> <span style="color:${color};font-weight:700">${riskLabel(loc.riskLevel)}</span></div>
          <div style="margin-top:6px;font-size:12px"><b>Reasons</b><ul style="margin:4px 0 0 16px;padding:0">${loc.reasons
            .map((r) => `<li>${r}</li>`)
            .join("")}</ul></div>
          <div style="margin-top:6px;font-size:12px">Incidents: ${loc.incidentCount} · Congestion: ${loc.congestion}% · Violations: ${loc.violations}/hr</div>
          <div style="font-size:12px">Obstruction: ${loc.obstruction >= 40 ? "Yes" : "No"}</div>
          <div style="margin-top:6px;font-size:12px"><b>Current Coverage:</b> ${loc.policeCoverage} officer(s)</div>
          <div style="font-size:12px"><b>Recommended:</b> ${loc.recommendedOfficers} officer(s)</div>
          <div style="margin-top:4px;font-size:12px;font-weight:600;color:${loc.coverageStatus === "covered" ? "#22c55e" : "#f59e0b"}">
            Status: ${loc.coverageStatus === "covered" ? "✔ Covered" : loc.coverageStatus === "unmanned" ? "⚠️ Unmanned" : "⚠️ Under-covered"}
          </div>
          <div style="display:flex;gap:8px;margin-top:10px">
            <button data-act="details" style="flex:1;padding:6px 8px;border-radius:8px;background:#1e293b;color:#e2e8f0;border:1px solid #475569;font-size:12px;cursor:pointer">View Details</button>
            <button data-act="deploy" style="flex:1;padding:6px 8px;border-radius:8px;background:#2563eb;color:#fff;border:none;font-size:12px;cursor:pointer">Deploy Officers</button>
          </div>`;
        el.querySelector('[data-act="details"]')?.addEventListener("click", () =>
          handlers.current.onSelect?.(loc),
        );
        el.querySelector('[data-act="deploy"]')?.addEventListener("click", () =>
          handlers.current.onDeploy?.(loc),
        );
        marker.bindPopup(el);
        marker.on("click", () => handlers.current.onSelect?.(loc));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locations]);

  return <div ref={containerRef} style={{ height }} className="w-full rounded-xl" />;
}