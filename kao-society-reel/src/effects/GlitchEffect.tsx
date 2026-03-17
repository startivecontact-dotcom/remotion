import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { VIDEO, COLORS } from "../theme";

interface GlitchEffectProps {
  intensity?: number;
  duration?: number; // frames
  startFrame?: number;
}

export const GlitchEffect: React.FC<GlitchEffectProps> = ({
  intensity = 1,
  duration = 15,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame > duration) return null;

  const progress = localFrame / duration;
  const glitchOpacity = interpolate(progress, [0, 0.3, 0.7, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Random-looking offsets based on frame
  const offset1 = Math.sin(localFrame * 7.3) * 20 * intensity;
  const offset2 = Math.cos(localFrame * 5.1) * 15 * intensity;
  const sliceHeight = 40 + Math.sin(localFrame * 3) * 30;
  const sliceY = (localFrame * 137) % (VIDEO.height - sliceHeight);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: VIDEO.width,
        height: VIDEO.height,
        pointerEvents: "none",
        zIndex: 90,
        opacity: glitchOpacity,
      }}
    >
      {/* Horizontal glitch slices */}
      {[0, 1, 2].map((i) => {
        const y = (sliceY + i * 200) % VIDEO.height;
        const h = sliceHeight * (0.5 + i * 0.3);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: y,
              left: offset1 * (i + 1) * 0.5,
              width: VIDEO.width,
              height: h,
              background:
                i % 2 === 0
                  ? `rgba(123, 141, 62, ${0.15 * intensity})`
                  : `rgba(79, 56, 114, ${0.2 * intensity})`,
              mixBlendMode: "screen",
            }}
          />
        );
      })}

      {/* Color channel split lines */}
      <div
        style={{
          position: "absolute",
          top: sliceY,
          left: 0,
          width: VIDEO.width,
          height: 3,
          background: COLORS.greenHex,
          opacity: 0.6 * intensity,
          transform: `translateX(${offset2}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: sliceY + 80,
          left: 0,
          width: VIDEO.width,
          height: 2,
          background: COLORS.violetLight,
          opacity: 0.5 * intensity,
          transform: `translateX(${-offset2}px)`,
        }}
      />

      {/* Flash */}
      {localFrame < 3 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: VIDEO.width,
            height: VIDEO.height,
            background: COLORS.greenHex,
            opacity: interpolate(localFrame, [0, 3], [0.7, 0], {
              extrapolateRight: "clamp",
            }),
          }}
        />
      )}
    </div>
  );
};
