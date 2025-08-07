"use client";

import Image from "next/image";
// import Header from "./components/Header";

import dynamic from "next/dynamic";

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

// import L, { LatLngExpression } from "leaflet";
// import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import { toast } from "sonner";
import LeftSidebar from "./components/LeftSidebar";
import RightSide from "./components/RightSide";
import { Branch } from "@/types";
import MapComponent from "./components/Map";
import RightSidebar from "./components/RightSide";

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
    <div>
      {/* <Header onAddBranch={handleAddBranch} /> */}

      <div className="flex  gap-1 h-[730px]">
        <LeftSidebar></LeftSidebar>
        <div className="flex-1 bg-black-100/80 p-4  space-y-6 overflow-auto">
          <h2 className="text-[30px] text-white w-full text-center mt-2 text-bold">
            NETWORK OPERATION CENTER
          </h2>
          <div className="h-6000px w-full">
              <MapComponent></MapComponent>
          </div>
          
        </div>

        {/* Right Side */}
        {/* <RightSidebar></RightSidebar> */}
      </div>
    </div>
  );
}
