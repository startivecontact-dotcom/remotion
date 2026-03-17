import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { VIDEO } from "../theme";

interface LightLeaksProps {
  color1?: string;
  color2?: string;
  intensity?: number;
}

export const LightLeaks: React.FC<LightLeaksProps> = ({
  color1 = "rgba(123, 141, 62, 0.15)",
  color2 = "rgba(255, 165, 0, 0.1)",
  intensity = 1,
}) => {
  const frame = useCurrentFrame();

  const x1 = interpolate(
    Math.sin(frame * 0.015),
    [-1, 1],
    [-200, VIDEO.width + 200]
  );
  const x2 = interpolate(
    Math.cos(frame * 0.012),
    [-1, 1],
    [VIDEO.width + 200, -200]
  );
  const opacity1 = interpolate(
    Math.sin(frame * 0.02),
    [-1, 1],
    [0, 0.25 * intensity]
  );
  const opacity2 = interpolate(
    Math.cos(frame * 0.018),
    [-1, 1],
    [0, 0.2 * intensity]
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: VIDEO.width,
        height: VIDEO.height,
        pointerEvents: "none",
        zIndex: 95,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: x1,
          width: 400,
          height: 800,
          background: `radial-gradient(ellipse, ${color1} 0%, transparent 70%)`,
          opacity: opacity1,
          filter: "blur(40px)",
          transform: "rotate(-15deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: x2,
          width: 350,
          height: 700,
          background: `radial-gradient(ellipse, ${color2} 0%, transparent 70%)`,
          opacity: opacity2,
          filter: "blur(50px)",
          transform: "rotate(10deg)",
        }}
      />
    </div>
  );
};
