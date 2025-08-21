"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Branch } from "@/types";
import MaskLayer from "../components/MaskLayer";
import CyberPingAnimation from "./PingAnimation";
import { Ping, LatLngExpression } from "@/types";
import ProvinceHighlight from "./ProvinceHighlight";
import { toast } from "sonner";

// Map.tsx (top)
import * as turf from "@turf/turf";
import nepalBoundaryRaw from "../../data/nepal-states.json";
import type {
  Feature,
  Polygon,
  MultiPolygon,
  FeatureCollection,
} from "geojson";

// Cast raw JSON to proper type
const nepalBoundary = nepalBoundaryRaw as FeatureCollection<
  Polygon | MultiPolygon
>;

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

// Animation settings
const PROGRESS_INCREMENT = 0.05; // how much progress per tick
const TICK_INTERVAL = 100; // ms per tick
const BLINK_DURATION = 2000; // ms of blinking after hit

// Derived travel time (time for wave to go from source → branch)
const travelTime = (1 / PROGRESS_INCREMENT) * TICK_INTERVAL;
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
    pingedProvinces,
    branchStatuses,
  }: {
    L: any;
    branches: Branch[];
    pings: Ping[];
    position: LatLngExpression;
    pingedProvinces: Set<string>;
    branchStatuses: { [id: number]: "up" | "down" };
  }) => (
    <MapContainer
      center={[28.3949, 84.124]} // Center of Nepal
      zoom={12}
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "3px",
        borderColor: "green",
      }}
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
      zoomSnap={0.7} // Allows smoother zoom increments
      zoomDelta={0.5} // Smaller zoom jumps on +/- click
      wheelDebounceTime={100}
      maxZoom={18}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        noWrap={true}
      />

      <MaskLayer L={L}></MaskLayer>

      <Marker position={sourceCoords} icon={createSourceIcon(L)}></Marker>

      {/* <ProvinceHighlight
  branches={branches.map(branch => ({
    ...branch,
    status: branchStatuses[branch.id] || branch.status, // live status
  }))}
  blinkingProvinces={[...pingedProvinces]} // convert Set → array
  upProvinces={branches
    .filter(branch => (branchStatuses[branch.id] || branch.status) === "up")
    .map(branch => {
      if (branch.provinceCode) return branch.provinceCode;
      const point = turf.point([branch.coords[1], branch.coords[0]]);
      const feature = nepalBoundary.features.find(f =>
        f?.geometry && turf.booleanPointInPolygon(point, f)
      );
      return feature?.properties?.ADM1_PCODE?.trim().toUpperCase();
    })
    .filter(Boolean) as string[]}
  downProvinces={branches
    .filter(branch => (branchStatuses[branch.id] || branch.status) === "down")
    .map(branch => {
      if (branch.provinceCode) return branch.provinceCode;
      const point = turf.point([branch.coords[1], branch.coords[0]]);
      const feature = nepalBoundary.features.find(f =>
        f?.geometry && turf.booleanPointInPolygon(point, f)
      );
      return feature?.properties?.ADM1_PCODE?.trim().toUpperCase();
    })
    .filter(Boolean) as string[]}
/> */}

      {branches.map((branch) => {
        // Find the latest ping for this branch by ID
        const branchPing = pings.find((p) => p.branchId === branch.id);
        const status = branchPing ? branchPing.status : branch.status;
        // console.log(status)
        // console.log(branchPing)

        return (
          <BranchMarker
            key={branch.id}
            position={branch.coords}
            name={branch.name}
            status={branchStatuses[branch.id] || branch.status}
            blink={pingedProvinces.has(branch.provinceCode!)}
          />
        );
      })}
      <CyberPingAnimation pings={pings} interpolateCoords={interpolateCoords} />
    </MapContainer>
  )
);

const MapComponent = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [pings, setPings] = useState<Ping[]>([]);
  const [L, setLeaflet] = useState<any>(null);
  const position: LatLngExpression = [28.3949, 84.124];
  const [isClient, setIsClient] = useState(false);
  const [pingedProvinces, setPingedProvinces] = useState<Set<string>>(new Set());
  const hasPinged = useRef(false);
  const [branchStatuses, setBranchStatuses] = useState<{
    [id: string]: "up" | "down";
  }>({});
  const retryIntervals: Record<string, NodeJS.Timeout> = {}; 
    

  // Load Leaflet
  useEffect(() => {
    (async () => {
      const leaflet = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      setLeaflet(leaflet);
    })();
  }, []);
  // 1. Fetch branches on mount or interval
  useEffect(() => {
    async function fetchBranches() {
      const res = await fetch("http://localhost:3000/api/branch-status");
      const data = await res.json();
      console.log(data);
      setBranches(data);
    }
    fetchBranches();
    const interval = setInterval(fetchBranches, 5 * 60 * 1000); // every 5 minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!branches.length) return;
    // hasPinged.current = true;

    let isCancelled = false;
    

    const pingAllBranches = async () => {
      for (const branch of branches) {
        if (isCancelled) break;

        const pingId = `${branch.id}-${Date.now()}`;

        // Add a ping animation object
        setPings((prev) => [
          ...prev,
          {
            id: pingId,
            branchId: branch.id,
            from: sourceCoords,
            to: branch.coords,
            progress: 0,
            status: branch.status,
          },
        ]);

        try {
          const res = await fetch("/api/ping", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ipAddress: branch.ipAddress }),
          });
          const data = await res.json();

          const newStatus: "up" | "down" = data.alive ? "up" : "down";

          // Update branch live status
          setBranchStatuses((prev) => ({ ...prev, [branch.id]: newStatus }));

          // Example extra info
          const latency = data.latency; // e.g., in ms from API response
          const timestamp = new Date().toLocaleTimeString(); // current time

          if (newStatus === "up") {
            
            toast.success(`${branch.name} is up`, {
              description: `Latency: ${latency} ms   \nTime: ${timestamp}`,
              position: "top-center",
            });

         // ✅ Stop retrying if it's back up
        if (retryIntervals[branch.id]) {
          clearInterval(retryIntervals[branch.id]);
          delete retryIntervals[branch.id];
        }

          } else {

            toast.error(`${branch.name} is down`, {
              description: `Latency: ${latency} ms || \nTime: ${timestamp}\nCheck connectivity.`,
              position: "top-right",
              duration: Infinity,
              style: {
                border: "1px solid red",
                backgroundColor: "#ffe5e5",
                color: "#900",
              },
            });

            

            if (!retryIntervals[branch.id]) {
          retryIntervals[branch.id] = setInterval(() => {
            // pingAllBranches(branch.id);
            
          }, 60 * 1000); // 1 minute
        }
          }
      
          

          // Update ping object with the new status
          setPings((prev) =>
            prev.map((p) => (p.id === pingId ? { ...p, status: newStatus } : p))
          );

         

          // Wait for wave to reach branch before blinking
          setTimeout(() => {
            setPingedProvinces((prev) => {
              const copy = new Set(prev);
              // copy.add(provinceCode!);
              return copy;
            });

            // Remove blink after duration
            setTimeout(() => {
              setPingedProvinces((prev) => {
                const copy = new Set(prev);
                // copy.delete(provinceCode!);
                return copy;
              });
            }, BLINK_DURATION);
          }, travelTime); // dynamically calculated travel time
        } catch (error) {
          console.error("Ping failed for branch", branch.name, error);

          // Mark as down if ping failed
          setBranchStatuses((prev) => ({ ...prev, [branch.id]: "down" }));
          setPings((prev) =>
            prev.map((p) => (p.id === pingId ? { ...p, status: "down" } : p))
          );
        }

        // Small delay between pings
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    };

    pingAllBranches();

    return () => {
      isCancelled = true;
    };
  }, [branches]);

  // run only when branches change

  // Animate pings
  useEffect(() => {
    const interval = setInterval(() => {
      setPings((prev) =>
        prev
          .map((p) => ({ ...p, progress: p.progress + PROGRESS_INCREMENT }))
          .filter((p) => p.progress <= 1)
      );
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  if (!L) return <div style={{ height: "600px" }}>Loading map...</div>;
  return (
    <LeafletMap
      L={L}
      branches={branches}
      pings={pings}
      position={position}
      pingedProvinces={pingedProvinces}
      branchStatuses={branchStatuses}
    />
  );
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
