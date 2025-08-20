"use client";

import dynamic from "next/dynamic";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import MapComponent from "./components/Map";
import { Toaster } from "sonner";

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
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});

function createIcon(L: any, isUp: boolean) {
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
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col">
        {/* Responsive Map Container */}
        <div className="w-full h-screen">
          <MapComponent />
        </div>
      </main>
    </div>
  );
}
