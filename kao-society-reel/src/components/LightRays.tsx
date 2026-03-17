import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { VIDEO } from "../theme";

interface LightRaysProps {
  direction?: "top" | "top-right" | "top-left";
  color?: string;
  intensity?: number;
}

export const LightRays: React.FC<LightRaysProps> = ({
  direction = "top-right",
  color = "rgba(255, 220, 130, 0.08)",
  intensity = 1,
}) => {
  const frame = useCurrentFrame();

  const rotation =
    direction === "top-right" ? -25 : direction === "top-left" ? 25 : 0;

  const sway = Math.sin(frame * 0.006) * 3;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: VIDEO.width,
        height: VIDEO.height,
        pointerEvents: "none",
        zIndex: 15,
        overflow: "hidden",
      }}
    >
      {[...Array(6)].map((_, i) => {
        const rayWidth = 80 + i * 40;
        const rayOpacity = interpolate(
          Math.sin(frame * 0.01 + i * 1.2),
          [-1, 1],
          [0.02, 0.1]
        ) * intensity;
        const xOffset = 100 + i * 150;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: -200,
              left: xOffset + sway * (i + 1),
              width: rayWidth,
              height: VIDEO.height + 400,
              background: `linear-gradient(180deg, ${color} 0%, transparent 80%)`,
              transform: `rotate(${rotation + sway + i * 2}deg)`,
              transformOrigin: "top center",
              opacity: rayOpacity,
              filter: "blur(15px)",
            }}
          />
        );
      })}
    </div>
  );
};
