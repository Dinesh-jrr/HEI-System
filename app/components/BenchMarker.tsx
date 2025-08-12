import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { FC } from "react";

interface BenchMarkerProps {
  position: [number, number];
  name: string;
  status: "up" | "down";
}

const BranchMarker: FC<BenchMarkerProps> = ({ position, name, status }) => {
  const isUp = status === "up";
  const color = isUp ? "rgba(0, 255, 0, 1)" : "rgba(255, 0, 0, 1)";
  const glow = isUp
    ? "0 0 18px rgba(0, 255, 0, 0.9)"
    : "0 0 18px rgba(255, 0, 0, 0.9)";
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
