import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { VIDEO } from "../theme";

export const GrainOverlay: React.FC<{ intensity?: number }> = ({
  intensity = 0.06,
}) => {
  const frame = useCurrentFrame();

  // Generate pseudo-random grain pattern using SVG turbulence
  const seed = frame % 10;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: VIDEO.width,
        height: VIDEO.height,
        pointerEvents: "none",
        zIndex: 100,
        mixBlendMode: "overlay",
        opacity: intensity,
      }}
    >
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter={`url(#grain-${seed})`}
          opacity="1"
        />
      </svg>
    </div>
  );
};
