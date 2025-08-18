import { Marker } from "react-leaflet";
import L from "leaflet";
import { FC } from "react";

interface BenchMarkerProps {
  position: [number, number];
  name: string;
  status: "up" | "down";
  blink?: boolean;
}

const BranchMarker: FC<BenchMarkerProps> = ({
  position,
  name,
  status,
  blink = false,
}) => {
  const isUp = status === "up";

  // Determine the color
  const color = blink
    ? "yellow" // blinking color
    : isUp
    ? "rgba(0, 255, 0, 1)" // live/green
    : "rgba(255, 0, 0, 1)"; // down/red

  const glow = blink ? "0 0 25px yellow" : `0 0 18px ${color}`;

  // Create icon with name included
  const icon = new L.DivIcon({
    html: `
      <div style="display: flex; flex-direction:column; align-items: center; gap: 5px; width:20px">
        <div style="
          width: 10px; height: 10px;
          background: ${color};
          border-radius: 50%;
          box-shadow: ${glow};
        "></div>
        <span style="
          color: white;
          font-weight: bold;
          font-size: 12px;
          white-space: nowrap;
        ">${
        name || ""}</span>
      </div>
    `,
    className: "",
    iconSize: [100, 20], // adjust depending on text length
    iconAnchor: [5, 5],
  });

  return <Marker position={position} icon={icon} />;
};

export default BranchMarker;
