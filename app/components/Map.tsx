"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Branch } from "@/types";
import MaskLayer from "../components/MaskLayer";
import CyberPingAnimation from "./PingAnimation";
import { Ping, LatLngExpression } from "@/types";

const BranchMarker = dynamic(() => import("./BenchMarker"), { ssr: false });
const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
);

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});

const GeoJSON = dynamic(() => import("react-leaflet").then((m) => m.GeoJSON), {
  ssr: false,
});

const sourceCoords: LatLngExpression = [27.7172, 85.324];




function createSourceIcon(L: any) {
  return new L.DivIcon({
    html: `
      <div style="
        width: 30px; height: 30px; /* adjust size */
        border-radius: 50%; 
        overflow: hidden;
        box-shadow: 0 0 10px #09aacc;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <img 
          src="/logo.png" 
          alt="Logo" 
          style="width: 24px; height: 24px; object-fit: contain;" 
        />
      </div>`,
    className: "",
    iconSize: [30, 30], // match div size
    iconAnchor: [15, 15], // center the icon
  });
}

// Helper to interpolate between two coords
function interpolateCoords(
  from: LatLngExpression,
  to: LatLngExpression,
  t: number
): LatLngExpression {
  const lat = from[0] + (to[0] - from[0]) * t;
  const lng = from[1] + (to[1] - from[1]) * t;
  return [lat, lng];
}

const LeafletMap = React.memo(
  ({
    L,
    branches,
    pings,
    position,
  }: {
    L: any;
    branches: Branch[];
    pings: Ping[];
    position: LatLngExpression;
  }) => (
    <MapContainer
      center={[28.3949, 84.124]} // Center of Nepal
      zoom={12}
      style={{ height: "100%", width: "100%", borderRadius: "3px" }}
      zoomControl={false}
      maxBounds={[
        [26.347, 80.058],
        [30.447, 88.201],
      ]}
      maxBoundsViscosity={1.0}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      boxZoom={false}
      keyboard={false}
      attributionControl={false}
      // touchZoom={true}           // Enable pinch-to-zoom
      zoomSnap={0.5} // Allows smoother zoom increments
      zoomDelta={0.5} // Smaller zoom jumps on +/- click
      wheelDebounceTime={100} // Debounce scroll zoom (prevents too fast)
      minZoom={7.5} // Prevent zooming too far out
      maxZoom={18}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        noWrap={true}
      />

      <MaskLayer L={L}></MaskLayer>

      <Marker position={sourceCoords} icon={createSourceIcon(L)}>
        {/* <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
    <div className=" text-black font-semibold whitespace-nowrap">
      Main Server
    </div>
  </Tooltip> */}
      </Marker>

      {branches.map((branch) => (
        <BranchMarker
          key={branch.id}
          position={branch.coords}
          name={branch.name}
          status={branch.status}
        />
      ))}

      <CyberPingAnimation pings={pings} interpolateCoords={interpolateCoords} />
    </MapContainer>
  )
);

const MapComponent = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  // const [ping,setPing]=useState<Ping[]>([]);
  const [pings, setPings] = useState<Ping[]>([]);
  const [L, setLeaflet] = useState<any>(null);
  const position: LatLngExpression = [28.3949, 84.124];
  const [isClient, setIsClient] = useState(false);

  // Load Leaflet
  useEffect(() => {
    (async () => {
      const leaflet = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      setLeaflet(leaflet);
    })();
  }, []);

  //fetch the branches
  useEffect(() => {
    async function fetchBranches() {
      try {
        const res = await fetch("http://localhost:3000/api/branch-status");
        if (!res.ok) {
          const text = await res.text();
          console.error("Error response:", text);
          throw new Error(`Failed to fetch branches, status: ${res.status}`);
        }
        const data = await res.json();
        setBranches(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    fetchBranches();
  }, []);

  useEffect(() => {
    if (branches.length === 0) return;

    // fixed source location

    const pingAllBranches = async () => {
      for (const branch of branches) {
        const pingId = `${branch.id}-${Date.now()}`;

        // Start ping animation from source to branch
          setPings((prev) => [
  ...prev,
  {
    id: pingId,
    from: sourceCoords,
    to: branch.coords,
    progress: 0,
    status: "up",
  },
]);

        try {
          const res = await fetch("/api/ping", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ipAddress: branch.ipAddress }),
          });
          const data = await res.json();

          // Update ping status and latency for animation
          setPings((prev) =>
            prev.map((p) =>
              p.id === pingId
                ? { ...p, status: data.status, latency: data.latency }
                : p
            )
          );
        } catch (error) {
          setPings((prev) =>
            prev.map((p) => (p.id === pingId ? { ...p, status: "down" } : p))
          );
        }

        // Optional: Add a small delay between pings to stagger animations
        await new Promise((resolve) => setTimeout(resolve, 300000));
      }
    };

    // Run immediately and then every 5 minutes
    pingAllBranches();
    const interval = setInterval(pingAllBranches, 350000); // 5 minutes

    return () => clearInterval(interval);
  }, [branches]);

  // Animate pings
  useEffect(() => {
    const interval = setInterval(() => {
      setPings((prev) =>
        prev
          .map((p) => ({ ...p, progress: p.progress + 0.05 }))
          .filter((p) => p.progress <= 1)
      );
    }, 110);
    return () => clearInterval(interval);
  }, []);

  if (!L) return <div style={{ height: "600px" }}>Loading map...</div>;
  return (
    <LeafletMap L={L} branches={branches} pings={pings} position={position} />
  );
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
