"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import nepalBoundary from "../../data/nepal-states.json";

export default function MaskLayer({ L }) {
  const map = useMap();
  

  useEffect(() => {
    if (!map || !L || !nepalBoundary) return;

    // Outer world polygon (clockwise)
    const world = [
      [-180, 90],
      [180, 90],
      [180, -90],
      [-180, -90],
      [-180, 90],
    ];

    const worldPolygon = [world];

    // Get Nepal polygons (holes)
    const nepalCoords = nepalBoundary.features.flatMap((feature) => {
      if (feature.geometry.type === "Polygon") {
        return feature.geometry.coordinates.map((ring) => ring);
      }
      if (feature.geometry.type === "MultiPolygon") {
        return feature.geometry.coordinates.flatMap((poly) => poly);
      }
      return [];
    });

    // Inverse mask polygon with world as outer ring and Nepal as holes
    const mask = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          ...worldPolygon,
          ...nepalCoords,
        ],
      },
    };

    // Mask layer (black fill outside Nepal)
    const maskLayer = new L.GeoJSON(mask, {
      style: {
        fillColor: "#000000",
        fillOpacity: 1,
        color: "#000000",
        weight: 0,
      },
      interactive: false,
    });

    // Nepal outline layer
    const nepalOutlineLayer = new L.GeoJSON(nepalBoundary, {
      style: {
        color: "#00ffff",
        weight: 0.8,
        fillOpacity: 0,
      },
      interactive: false,
    });

    maskLayer.addTo(map);
    nepalOutlineLayer.addTo(map);

    // --- Fit map view to Nepal bounds ---
    const nepalLayer = new L.GeoJSON(nepalBoundary);
    const bounds = nepalLayer.getBounds();
    map.fitBounds(bounds, { padding: [20, 20] });

    return () => {
      map.removeLayer(maskLayer);
      map.removeLayer(nepalOutlineLayer);
    };
  }, [map, L]);

  return null;
}