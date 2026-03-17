import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS, VIDEO } from "../theme";

interface FallingLeavesProps {
  count?: number;
  speed?: number;
  colors?: string[];
}

export const FallingLeaves: React.FC<FallingLeavesProps> = ({
  count = 12,
  speed = 1,
  colors,
}) => {
  const frame = useCurrentFrame();
  const leafColors = colors || [COLORS.greenHex, COLORS.greenLight, COLORS.greenDark, COLORS.jungleMoss];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: VIDEO.width,
        height: VIDEO.height,
        pointerEvents: "none",
        zIndex: 50,
        overflow: "hidden",
      }}
    >
      {[...Array(count)].map((_, i) => {
        // Deterministic pseudo-random per leaf
        const seed = i * 137.5;
        const startX = (seed * 7.3) % VIDEO.width;
        const startDelay = (seed * 3.1) % 200;
        const fallSpeed = (0.5 + ((seed * 1.7) % 1) * 0.8) * speed;
        const size = 15 + ((seed * 2.3) % 20);
        const rotSpeed = 0.5 + ((seed * 0.7) % 2);
        const swayAmount = 30 + ((seed * 1.1) % 50);
        const swaySpeed = 0.02 + ((seed * 0.3) % 0.03);

        const adjustedFrame = Math.max(0, frame - startDelay);
        const cycleLength = VIDEO.height / fallSpeed + 100;
        const cycleFrame = adjustedFrame % cycleLength;

        const y = cycleFrame * fallSpeed - 50;
        const x = startX + Math.sin(cycleFrame * swaySpeed) * swayAmount;
        const rotation = cycleFrame * rotSpeed;
        const opacity = interpolate(y, [-50, 50, VIDEO.height - 200, VIDEO.height], [0, 0.6, 0.6, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const color = leafColors[i % leafColors.length];

        return (
          <svg
            key={i}
            width={size * 2}
            height={size}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `rotate(${rotation}deg)`,
              opacity,
            }}
            viewBox="0 0 40 20"
          >
            {/* Leaf shape */}
            <path
              d="M0 10 Q10 0 20 2 Q30 0 40 10 Q30 20 20 18 Q10 20 0 10"
              fill={color}
            />
            {/* Leaf vein */}
            <path
              d="M5 10 L35 10"
              stroke={COLORS.greenDark}
              strokeWidth="0.5"
              opacity="0.3"
            />
            <path
              d="M15 6 L20 10 M15 14 L20 10 M25 6 L20 10 M25 14 L20 10"
              stroke={COLORS.greenDark}
              strokeWidth="0.3"
              opacity="0.3"
            />
          </svg>
        );
      })}
    </div>
  );
};
