import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { VIDEO, COLORS } from "../theme";

interface GlowEffectProps {
  color?: string;
  intensity?: number;
  position?: "center" | "top" | "bottom";
}

export const GlowEffect: React.FC<GlowEffectProps> = ({
  color = COLORS.violetLight,
  intensity = 0.3,
  position = "center",
}) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.7, 1]);

  const y =
    position === "top" ? "20%" : position === "bottom" ? "80%" : "50%";

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: VIDEO.width,
        height: VIDEO.height,
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: y,
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity: intensity * pulse,
          filter: "blur(60px)",
        }}
      />
    </div>
  );
};
