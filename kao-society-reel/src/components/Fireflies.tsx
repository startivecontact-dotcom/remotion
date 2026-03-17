import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS, VIDEO } from "../theme";

interface FirefliesProps {
  count?: number;
  color?: string;
}

export const Fireflies: React.FC<FirefliesProps> = ({
  count = 15,
  color = COLORS.firefly,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: VIDEO.width,
        height: VIDEO.height,
        pointerEvents: "none",
        zIndex: 30,
      }}
    >
      {[...Array(count)].map((_, i) => {
        const seed = (i + 1) * 97.3;
        const baseX = (seed * 5.7) % VIDEO.width;
        const baseY = (seed * 3.3) % VIDEO.height;
        const wanderX = Math.sin(frame * 0.008 + seed) * 60 + Math.sin(frame * 0.015 + seed * 2) * 30;
        const wanderY = Math.cos(frame * 0.006 + seed * 1.5) * 40 + Math.sin(frame * 0.012 + seed * 0.7) * 25;
        const size = 3 + ((seed * 0.5) % 4);
        const glowSize = size * 6;

        const pulse = interpolate(
          Math.sin(frame * 0.04 + seed * 0.8),
          [-1, 1],
          [0.1, 0.9]
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: baseX + wanderX,
              top: baseY + wanderY,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: pulse,
              boxShadow: `0 0 ${glowSize}px ${glowSize / 2}px ${color}`,
              filter: `blur(${1}px)`,
            }}
          />
        );
      })}
    </div>
  );
};
