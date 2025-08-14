"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import type {
  Feature,
  Polygon,
  MultiPolygon,
  FeatureCollection,
} from "geojson";
import * as turf from "@turf/turf";
import { GeoJSON as LeafletGeoJSONType } from "leaflet";
import nepalBoundaryRaw from "../../data/nepal-states.json";

const nepalBoundary =
  nepalBoundaryRaw as FeatureCollection<Polygon | MultiPolygon>;

const GeoJSON = dynamic(() => import("react-leaflet").then((m) => m.GeoJSON), {
  ssr: false,
});

export interface Branch {
  id: string | number;
  coords: [number, number]; // [lat, lng]
  status: "up" | "down";
  ipAddress?: string;
  provinceCode?: string; // optional, will be computed
}

interface ProvinceHighlightProps {
  branches: Branch[];
  blinkingProvinces?: string[];
  downProvinces: string[];
  upProvinces: string[];
}

// Detect and fix flipped coords if needed
function normalizeCoords(coords: [number, number]): [number, number] {
  const [a, b] = coords;
  const isLikelyLat = a > 20 && a < 40;
  const isLikelyLng = b > 80 && b < 100;

  if (!isLikelyLat && isLikelyLng) {
    return [b, a];
  }
  return coords;
}

// Helper to find province code
function findProvinceCode(
  pointCoords: [number, number],
  provincesFeatures: Feature<Polygon | MultiPolygon, any>[]
): string | null {
  const point = turf.point([pointCoords[1], pointCoords[0]]); // turf expects [lng, lat]
  for (const feature of provincesFeatures) {
    if (turf.booleanPointInPolygon(point, feature)) {
      return feature.properties.ADM1_PCODE;
    }
  }
  return null;
}

const ProvinceHighlight: React.FC<ProvinceHighlightProps> = ({
  branches,
  blinkingProvinces = [],
  upProvinces,
  downProvinces,
}) => {
  const [blinkOn, setBlinkOn] = useState(true);
  const geoJsonRef = useRef<LeafletGeoJSONType>(null);

  // Blink toggle
  useEffect(() => {
    const interval = setInterval(() => setBlinkOn((b) => !b), 500);
    return () => clearInterval(interval);
  }, []);

  // Compute province codes if missing
  const branchesWithProvince = branches.map((b) => {
    if (!b.provinceCode) {
      const fixedCoords = normalizeCoords(b.coords);
      const provinceCode = findProvinceCode(fixedCoords, nepalBoundary.features);
      return { ...b, provinceCode: provinceCode?.toUpperCase() };
    }
    return b;
  });

  // Style function
  const style = (feature: any) => {
    const provinceCode = feature.properties?.ADM1_PCODE?.trim().toUpperCase() || "";

    if (downProvinces.includes(provinceCode)) {
      return { color: "red", weight: 3, fillOpacity: 0.1 };
    }

    if (blinkingProvinces.map((c) => c.toUpperCase()).includes(provinceCode)) {
      
      return { color: blinkOn ? "limegreen" : "transparent", weight: 5, fillOpacity: 0.1 };
    }

    if (upProvinces.includes(provinceCode)) {
      return { color: "transparent", weight: 0.5, fillOpacity: 0.1 };
    }

    return { color: "#09aacc", weight: 1, fillOpacity: 0.1 };
  };

  // Force style refresh on state change
  useEffect(() => {
    if (geoJsonRef.current) {
      geoJsonRef.current.setStyle(style);
    }
  }, [blinkingProvinces, upProvinces, downProvinces, blinkOn]);
  console.log("Blinking province:", blinkingProvinces, "blinkOn:", blinkOn);

  return <GeoJSON ref={geoJsonRef} data={nepalBoundary} style={style} />;
};

export default ProvinceHighlight;
