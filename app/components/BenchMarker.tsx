import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { FC } from "react";

interface BenchMarkerProps {
  position: [number, number];
  name: string;
  status: "up" | "down";
  blink?:boolean;
}

const BranchMarker: FC<BenchMarkerProps> = ({ position, name, status,blink=false }) => {
  const isUp = status === "up";
   // Determine the color
  const color = blink 
    ? "yellow"                      // blinking color
    : isUp 
      ? "rgba(0, 255, 0, 1)"       // live/green
      : "rgba(255, 0, 0, 1)";      // down/red

  const glow = blink ? "0 0 25px yellow" : `0 0 18px ${color}`;
  const icon = new L.DivIcon({
    html: `<div style="
      width: 10px; height: 10px; background: ${color};
      border-radius: 50%; box-shadow: ${glow};">
    </div>`,
    className: "",
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });

  return (
    <Marker position={position} icon={icon}>
      <Tooltip permanent direction="top" offset={[10, 0]} className="leaflet-tooltip" >
        <span style={{ 
      backgroundColor: "transparent",  
      color: "white", 
      fontWeight: "bold" 
    }}>{name}</span>
      </Tooltip>
    </Marker>
  );
};

export default BranchMarker;
