"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Branch } from "@/types";

// Dynamically import React-Leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });

type LatLngExpression = [number, number];

// Create glowing marker icon
function createIcon(L: any, isUp: boolean) {
  const color = isUp ? "rgba(0, 255, 0, 1)" : "rgba(255, 0, 0, 1)";
  const glow = isUp ? "0 0 18px rgba(0, 255, 0, 0.9)" : "0 0 18px rgba(255, 0, 0, 0.9)";
  const iconHtml = `
    <div style="
      width: 20px;
      height: 20px;
      background: ${color};
      border-radius: 50%;
      box-shadow: ${glow};
      border: 2px solid white;
    "></div>
  `;
  return new L.DivIcon({
    html: iconHtml,
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
}

// Memoized map to prevent remounts
const LeafletMap = React.memo(({ L, branches, position }: { L: any; branches: Branch[]; position: LatLngExpression }) => (
  <MapContainer
    key={`map-${Date.now()}`} // force a fresh instance to avoid reuse errors
    center={position}
    zoom={7}
    style={{ height: "600px", width: "100%" }}
    scrollWheelZoom={false}
    touchZoom={false}
    doubleClickZoom={false}
    zoomControl={false}
    attributionControl={false}
    dragging={false}
  >
    {/* Dark theme tiles */}
    <TileLayer
      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
    />

    {/* Markers */}
    {branches.map(({ id, name, coords, status }) => (
      <Marker key={id} position={coords} icon={createIcon(L, status === "up")}>
        <Popup>
          <div style={{ fontSize: "16px", fontWeight: "bold", color: "#fff" }}>
            {name}
            <div
              style={{
                marginTop: "5px",
                display: "inline-block",
                padding: "3px 6px",
                borderRadius: "6px",
                background: status === "up" ? "rgba(0, 200, 0, 0.2)" : "rgba(200, 0, 0, 0.2)",
                color: status === "up" ? "#00ff00" : "#ff4d4d",
                fontWeight: "bold",
              }}
            >
              {status.toUpperCase()}
            </div>
          </div>
        </Popup>
      </Marker>
    ))}
  </MapContainer>
));

const MapComponent = () => {
  const [branchStatuses, setBranchStatuses] = useState<Branch[]>([]);
  const [L, setLeaflet] = useState<any>(null);
  const position: LatLngExpression = [28.3949, 84.124]; // Center (Nepal)

  useEffect(() => {
    (async () => {
      try {
        const leaflet = await import("leaflet");
        await import("leaflet/dist/leaflet.css");
        setLeaflet(leaflet);
      } catch (error) {
        console.error("Failed to load leaflet", error);
      }
    })();
  }, []);

  if (!L) return <div style={{ height: "600px" }}>Loading map...</div>; // Loading state

  return (
    <div>
      <LeafletMap L={L} branches={branchStatuses} position={position} />

      {/* Global styles for seamless dark UI */}
      <style jsx global>{`
        .leaflet-container {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .leaflet-popup-content {
          color: #f8f8f8 !important;
          font-weight: 600;
          font-size: 15px;
        }
        .leaflet-popup-content-wrapper {
          background: #111 !important;
          border-radius: 8px;
          border: 1px solid #333;
        }
        .leaflet-popup-tip {
          background: #111 !important;
        }
      `}</style>
    </div>
  );
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
