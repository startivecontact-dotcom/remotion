import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { COLORS, VIDEO } from "../theme";
import { MonkeyMascot } from "../components/MonkeyMascot";
import { GlitchEffect } from "../effects/GlitchEffect";
import { GrainOverlay } from "../effects/GrainOverlay";

export const AwakeningScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Beat drop flash
  const flashOpacity = interpolate(frame, [0, 5, 15], [1, 0.8, 0], {
    extrapolateRight: "clamp",
  });

  // Screen shake on beat drop
  const shakeX =
    frame < 20 ? Math.sin(frame * 15) * interpolate(frame, [0, 20], [12, 0]) : 0;
  const shakeY =
    frame < 20 ? Math.cos(frame * 12) * interpolate(frame, [0, 20], [8, 0]) : 0;

  // Background transition from violet to green flash
  const bgProgress = interpolate(frame, [0, 30, 60, 90], [0, 1, 0.6, 0.3], {
    extrapolateRight: "clamp",
  });

  // Monkey awakening - scale pop
  const monkeyScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 6, stiffness: 150, mass: 0.5 },
  });

  const monkeyState = frame < 30 ? "tired" : frame < 60 ? "awakening" : "energetic";

  // Zoom burst
  const zoom = interpolate(frame, [0, 10, 40], [1, 1.15, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: VIDEO.width,
        height: VIDEO.height,
        background: `radial-gradient(ellipse at 50% 50%, ${COLORS.violet} 0%, ${COLORS.darkBg} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        transform: `scale(${zoom}) translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Green flash on beat drop */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle, ${COLORS.greenHex} 0%, ${COLORS.greenDark} 60%, transparent 100%)`,
          opacity: flashOpacity * 0.7,
          zIndex: 15,
        }}
      />

      {/* Radial burst lines */}
      {frame < 30 &&
        [...Array(12)].map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const len = interpolate(frame, [0, 15], [0, 600], {
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 3,
                height: len,
                background: i % 2 === 0 ? COLORS.greenHex : COLORS.violetLight,
                opacity: interpolate(frame, [0, 10, 30], [0, 0.5, 0], {
                  extrapolateRight: "clamp",
                }),
                transform: `rotate(${angle}rad) translateY(-50%)`,
                transformOrigin: "top center",
                zIndex: 12,
              }}
            />
          );
        })}

      {/* Monkey waking up */}
      <div
        style={{
          zIndex: 20,
          transform: `scale(${0.8 + monkeyScale * 0.5})`,
        }}
      >
        <MonkeyMascot state={monkeyState} scale={1.3} />
      </div>

      <GlitchEffect intensity={1.5} duration={25} startFrame={0} />
      <GrainOverlay intensity={0.08} />
    </div>
  );
};
