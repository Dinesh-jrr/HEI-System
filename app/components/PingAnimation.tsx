import dynamic from "next/dynamic";
import React from "react";
import { Ping, LatLngExpression } from "@/types";

const CircleMarker = dynamic(() => import("react-leaflet").then(m => m.CircleMarker), { ssr: false });



interface SimplePingAnimationProps {
  pings: Ping[];
  interpolateCoords: (from: LatLngExpression, to: LatLngExpression, t: number) => LatLngExpression;
}

const SimplePingAnimation: React.FC<SimplePingAnimationProps> = ({ pings, interpolateCoords }) => {
  return (
    <>
      {pings.map(ping => {
        const currentPoint = interpolateCoords(ping.from, ping.to, ping.progress);
        console.log("The ping status in animation",ping.status);

        const fillColor = ping.status === "up" ? "green" : ping.status === "down" ? "red" : "gray";


        return (
          <CircleMarker
            key={ping.id}
            center={currentPoint}
            radius={4}
            pathOptions={{
              fillColor,
              color:fillColor,
              weight: 1,
              fillOpacity: 1,
              opacity: 1,
            }}
          />
        );
      })}
    </>
  );
};

export default SimplePingAnimation;
