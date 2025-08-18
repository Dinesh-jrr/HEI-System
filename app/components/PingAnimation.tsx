import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Ping, LatLngExpression } from "@/types";

const Polyline = dynamic(() => import("react-leaflet").then(m => m.Polyline), { ssr: false });

interface SimplePingAnimationProps {
  pings: Ping[];
  interpolateCoords: (from: LatLngExpression, to: LatLngExpression, t: number) => LatLngExpression;
}

const SimplePingAnimation: React.FC<SimplePingAnimationProps> = ({ pings, interpolateCoords }) => {
  const [waveT, setWaveT] = useState(0);

  // Animate wave progress (0 → 1 → 0 loop)
  useEffect(() => {
    let frame = 0;
    const animate = () => {
      frame = (frame + 1) % 300; // slow loop
      setWaveT(frame / 300); // progress 0..1
      requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  const fixedColor = "#09aacc"; // fixed ping color

  return (
    <>
      {pings.map((ping) => {
        // Create multiple sweeping "bars" ahead of the ping
        const waves = [0, 0.2, 0.4, 0.6].map((offset, i) => {
          // Wrap around progress
          let t = (ping.progress + waveT + offset) % 1;
          const waveEnd = interpolateCoords(ping.from, ping.to, t);
          const waveStart = interpolateCoords(ping.from, ping.to, Math.max(t - 0.05, 0));

          return (
            <Polyline
              key={`${ping.id}-wave-${i}`}
              positions={[waveStart, waveEnd]}
              pathOptions={{
                color: fixedColor,        // use fixed color
                weight: 8,
                opacity: 0.8 - i * 0.2,   // fading
                dashArray: "10 20",       // radar bar effect
              }}
            />
          );
        });

        return <React.Fragment key={ping.id}>{waves}</React.Fragment>;
      })}
    </>
  );
};

export default SimplePingAnimation;
