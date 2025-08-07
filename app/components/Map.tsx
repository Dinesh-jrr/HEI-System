"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Branch } from "@/types";
import MaskLayer from '../components/MaskLayer';


const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((m) => m.Polyline), { ssr: false });
const GeoJSON = dynamic(() => import("react-leaflet").then((m) => m.GeoJSON), { ssr: false });




type LatLngExpression = [number, number];
type Ping = { id: string; from: LatLngExpression; to: LatLngExpression; progress: number };

function createIcon(L: any, isUp: boolean) {
  const color = isUp ? "rgba(0, 255, 0, 1)" : "rgba(255, 0, 0, 1)";
  const glow = isUp ? "0 0 18px rgba(0, 255, 0, 0.9)" : "0 0 18px rgba(255, 0, 0, 0.9)";
  return new L.DivIcon({
    html: `<div style="
      width: 10px; height: 10px; background: ${color};
      border-radius: 50%; box-shadow: ${glow}; border: 2px solid white;">
    </div>`,
    className: "",
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
}

// Helper to interpolate between two coords
function interpolateCoords(from: LatLngExpression, to: LatLngExpression, t: number): LatLngExpression {
  const lat = from[0] + (to[0] - from[0]) * t;
  const lng = from[1] + (to[1] - from[1]) * t;
  return [lat, lng];
}

const LeafletMap = React.memo(
  ({ L, branches, pings, position }: { L: any; branches: Branch[]; pings: Ping[]; position: LatLngExpression }) => (
  

    <MapContainer
    center={[28.3949, 84.1240]} // Center of Nepal
  zoom={7.5}
  style={{ height: "600px", width: "100%", }}
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
zoomSnap={0.5}             // Allows smoother zoom increments
zoomDelta={0.5}            // Smaller zoom jumps on +/- click
wheelDebounceTime={100}    // Debounce scroll zoom (prevents too fast)
minZoom={7.5}                // Prevent zooming too far out
maxZoom={18}   
  // maxBounds={[
  //   [26.347, 80.058], // SW corner of Nepal
  //   [30.447, 88.201], // NE corner of Nepal
  // ]}
>
  <TileLayer
    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
    noWrap={true}
  />

  <MaskLayer L={L}></MaskLayer>


      {/* Branch markers */}
      {branches.map(({ id, name, coords, status }) => (
        <Marker key={id} position={coords} icon={createIcon(L, status === "up")} />
      ))}

      {/* Animated pings */}
      {pings.map((ping)=>{
        const currentPoint =interpolateCoords(ping.from,ping.to,ping.progress);

        //Find the target branch
        const targetBranch= branches.find((b)=> b.coords[0]===ping.to[0] && b.coords[1] ===ping.to[1]);

        //set color based on branch status
        const color= targetBranch?.status==="up"?"#09aacc":"red";

        return(
          <Polyline
          key={ping.id}
          positions={[ping.from,currentPoint]}
          pathOptions={{
            color:color,
            weight:2,
            opacity:0.9,
            
          }}
          />
        )
      })

      }
    </MapContainer>
  )
);

const MapComponent = () => {
  const [branches, setBranches] = useState<Branch[]>([
  {
    id: 1,
    name: "Hattisar",
    // location: "Hattisar",
    status: "up",
    coords: [27.7134, 85.3156],
    ipAddress: "192.168.1.1",
    segments: Array(10).fill(null).map(() => ({
      alive: Math.random() > 0.2,
      checkedAt: new Date().toISOString(),
    })),
    history: [],
  },
  // {
  //   id: 2,
  //   name: "Surkhet",
  //   // location: "Surkhet",
  //   status: "down",
  //   coords: [28.6, 81.6333],
  //   ipAddress: "192.168.1.2",
  //   segments: Array(10).fill(null).map(() => ({
  //     alive: Math.random() > 0.3,
  //     checkedAt: new Date().toISOString(),
  //   })),
  //   history: [],
  // },
  // {
  //   id: 3,
  //   name: "Pokhara",
  //   // location: "Pokhara",
  //   status: "up",
  //   coords: [28.2096, 83.9856],
  //   ipAddress: "192.168.1.3",
  //   segments: Array(10).fill(null).map(() => ({
  //     alive: Math.random() > 0.1,
  //     checkedAt: new Date().toISOString(),
  //   })),
  //   history: [],
  // },
  // {
  //   id: 4,
  //   name: "Biratnagar",
  //   // location: "Biratnagar",
  //   status: "down",
  //   coords: [26.4667, 87.2833],
  //   ipAddress: "192.168.1.4",
  //   segments: Array(10).fill(null).map(() => ({
  //     alive: Math.random() > 0.4,
  //     checkedAt: new Date().toISOString(),
  //   })),
  //   history: [],
  // },
]);


  const [pings, setPings] = useState<Ping[]>([]);
  const [L, setLeaflet] = useState<any>(null);
  const position: LatLngExpression = [28.3949, 84.124];
  const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//   setIsClient(true);
// }, []);

  // Load Leaflet
  useEffect(() => {
    (async () => {
      const leaflet = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      setLeaflet(leaflet);
    })();
  }, []);

  // Add random pings periodically
  useEffect(() => {
    //  if (!isClient) return;  wait for client
    const interval = setInterval(() => {
      if (branches.length < 2) return;

      const fromIndex = Math.floor(Math.random() * branches.length);
      let toIndex = Math.floor(Math.random() * branches.length);
      while (toIndex === fromIndex) toIndex = Math.floor(Math.random() * branches.length);

      const newPing: Ping = {
        id: `${Date.now()}`,
        from: branches[fromIndex].coords,
        to: branches[toIndex].coords,
        progress: 0,
      };
      setPings((prev) => [...prev, newPing]);
    }, 2000);
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
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (!L) return <div style={{ height: "600px" }}>Loading map...</div>;
  return <LeafletMap L={L} branches={branches} pings={pings} position={position} />;
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
