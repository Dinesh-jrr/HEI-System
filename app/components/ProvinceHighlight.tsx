"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { GeoJsonObject, Feature, Polygon, MultiPolygon, Point, FeatureCollection } from "geojson";
import * as turf from "@turf/turf";
import nepalBoundaryRaw from "../../data/nepal-states.json";

const nepalBoundary = nepalBoundaryRaw as FeatureCollection<Polygon | MultiPolygon>;

const GeoJSON = dynamic(() => import("react-leaflet").then((m) => m.GeoJSON), {
  ssr: false,
});

// const nepalBoundary: GeoJsonObject = nepalBoundaryRaw as GeoJsonObject;

interface Branch {
  id: string | number;
  coords: [number, number]; // [lng, lat]
  status: "up" | "down";
  ipAddress?: string;
}

interface ProvinceHighlightProps {
  branches: Branch[];
  blinkingProvinces?: string[];
  downProvinces: string[];
  upProvinces: string[]; // Branches without provinceCode yet
}

// Helper to find province code for a given point coordinate
function findProvinceCode(
  pointCoords: [number, number], // your branch coords [lat, lng]
  provincesFeatures: Feature<Polygon | MultiPolygon, any>[]
): string | null {
  // swap to [lng, lat] for Turf
  const point = turf.point([pointCoords[1], pointCoords[0]]);

  for (const feature of provincesFeatures) {
    if (turf.booleanPointInPolygon(point, feature)) {
      return feature.properties.ADM1_PCODE;
    }
  }

  return null;
}


const ProvinceHighlight: React.FC<ProvinceHighlightProps> = ({ branches,blinkingProvinces }) => {
  const [blinkOn, setBlinkOn] = useState(true);
  const [upProvinces, setUpProvinces] = useState<string[]>([]);
  const [downProvinces, setDownProvinces] = useState<string[]>([]);

  useEffect(() => {
    // Blink interval for green border toggling
    const interval = setInterval(() => setBlinkOn((b) => !b), 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!branches || branches.length === 0) {
      setUpProvinces([]);
      setDownProvinces([]);
      return;
    }

    // Map branches to province codes dynamically using turf
    const provincesFeatures = nepalBoundary.features as Feature<
      Polygon | MultiPolygon,
      any
    >[];

    const withProvinceCode = branches.map((branch) => {
      // turf expects [lng, lat]
      const provinceCode = findProvinceCode(branch.coords, provincesFeatures);
    //   const provinceCode = findProvinceCode([branch.coords[1], branch.coords[0]], provincesFeatures);

      console.log(`Branch id: ${branch.id} coords: ${branch.coords} provinceCode: ${provinceCode}`);
      return { ...branch, provinceCode };
    });

    // Filter out undefined/null province codes and separate up/down
    const upCodes = withProvinceCode
      .filter((b) => b.status === "up" && b.provinceCode)
      .map((b) => b.provinceCode!.trim().toUpperCase());

    const downCodes = withProvinceCode
      .filter((b) => b.status === "down" && b.provinceCode)
      .map((b) => b.provinceCode!.trim().toUpperCase());

    // Remove duplicates using Set
    setUpProvinces(Array.from(new Set(upCodes)));
    setDownProvinces(Array.from(new Set(downCodes)));
  }, [branches]);

  const style = (feature: any) => {
  const provinceCode = feature.properties?.ADM1_PCODE?.trim().toUpperCase() || "";

  // Permanent down provinces
  if (downProvinces.includes(provinceCode)) {
    return { color: "red", weight: 3, fillOpacity: 0.1 };
  }

  // Blink only for pinged provinces
  if (blinkingProvinces?.includes(provinceCode)) {
    return {
      color: blinkOn ? "limegreen" : "transparent",
      weight: 5,
      fillOpacity: 0.1,
    };
  }

  // Default color for all other provinces
  if (upProvinces.includes(provinceCode)) {
    return { color: "#09aacc", weight: 0.5, fillOpacity: 0.1 }; 
  }

  return { color: "#09aacc", weight: 1, fillOpacity: 0.1 };
};



  return (
    <GeoJSON
      key={blinkOn ? "on" : "off"}
      data={nepalBoundary}
      style={style}
    />
  );
};

export default ProvinceHighlight;
