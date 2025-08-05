"use client";

import Image from "next/image";
// import Header from "./components/Header";

import dynamic from "next/dynamic";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

// import L, { LatLngExpression } from "leaflet";
// import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import { toast } from "sonner";
import LeftSidebar from "./components/LeftSidebar";
import RightSide from "./components/RightSide";
import { Branch } from "@/types";

function createIcon(L:any,isUp: boolean) {
  const iconElement = isUp ? (
    <FaCheckCircle color="green" size={24} />
  ) : (
    <FaTimesCircle color="red" size={24} />
  );

  const iconHtml = ReactDOMServer.renderToStaticMarkup(iconElement);

  return new L.DivIcon({
    html: iconHtml,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -25],
  });
}


export default function Home() {
  const [branchStatuses, setBranchStatuses] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const position: LatLngExpression = [28.3949, 84.124];
  const [L, setLeaflet] = useState<any>(null);

  type LatLngExpression = [number, number];

  useEffect(() => {
  (async () => {
    try {
      console.log("Importing leaflet...");
      const leaflet = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      console.log("Leaflet imported:", leaflet);
      setLeaflet(leaflet);
    } catch (error) {
      console.error("Failed to load leaflet", error);
    }
  })();
}, []);

  

 

  



  return (
    <div>
      {/* <Header onAddBranch={handleAddBranch} /> */}

      <div className="flex mt-4 mx-4 gap-4 h-[1000px]">
        <LeftSidebar></LeftSidebar>

        {/* Middle - Maps */}
        <div className="flex-1 bg-gray-100 p-4 rounded-lg space-y-6 overflow-auto">
          <h1 className="text-[15px] font-semibold text-gray-700 mb-1">
            Map of Nepal
          </h1>
          <MapContainer
            center={position}
            zoom={7}
            style={{ height: "400px", borderRadius: "0.5rem", width: "100%" }}
            scrollWheelZoom={false}
            touchZoom={false}
            doubleClickZoom={false}
            zoomControl={false}
            attributionControl={false}
            dragging={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {branchStatuses.map(({ id, name, coords, status }) => (
              <Marker
                key={id}
                position={coords}
                icon={createIcon(L,status === "up")}
                eventHandlers={{
                  click: () => {
                    const branch = branchStatuses.find((b) => b.id === id);
                    if (branch) setSelectedBranch(branch);
                  },
                }}
              >
                <Popup>
                  {name} <br />
                  Status:{" "}
                  <span style={{ color: status === "up" ? "green" : "red" }}>
                    {status.toUpperCase()}
                  </span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <h1 className="text-[15px] font-semibold text-gray-700 mb-1">
            Map of Kathmandu
          </h1>
          <MapContainer
            center={[27.7172, 85.324]}
            zoom={12}
            style={{ height: "400px", borderRadius: "0.5rem", width: "100%" }}
            scrollWheelZoom={false}
            touchZoom={false}
            doubleClickZoom={false}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {branchStatuses.map(({ id, name, coords, status }) => (
              <Marker
                key={id}
                position={coords}
                icon={createIcon(L,status === "up")}
                eventHandlers={{
                  click: () => {
                    const branch = branchStatuses.find((b) => b.id === id);
                    if (branch) setSelectedBranch(branch);
                  },
                }}
              >
                <Popup>
                  {name} <br />
                  Status:{" "}
                  <span style={{ color: status === "up" ? "green" : "red" }}>
                    {status.toUpperCase()}
                  </span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Right Side */}
        {/* <RightSide selectedBranch={selectedBranch} /> */}
      </div>
    </div>
  );
}
