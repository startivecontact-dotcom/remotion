import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, spring, useVideoConfig } from "remotion";
import { COLORS, VIDEO } from "../theme";
import { RealisticMonkey } from "../components/RealisticMonkey";
import { JungleBackground } from "../components/JungleBackground";
import { LightRays } from "../components/LightRays";
import { Fireflies } from "../components/Fireflies";
import { GrainOverlay } from "../effects/GrainOverlay";

export const WakeUpScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Night -> Dawn transition
  const dawnProgress = interpolate(frame, [0, 50], [0, 1], { extrapolateRight: "clamp" });

  // Light rays grow
  const raysIntensity = interpolate(frame, [15, 50], [0, 1.5], { extrapolateRight: "clamp" });

  // Screen shake when waking
  const shake = frame > 10 && frame < 30
    ? Math.sin(frame * 2.5) * interpolate(frame, [10, 20, 30], [0, 3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Energy burst flash
  const flash = frame > 50 && frame < 65
    ? interpolate(frame, [50, 55, 65], [0, 0.35, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Text
  const textEntrance = spring({
    frame: frame - 45,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <AbsoluteFill style={{ transform: `translateX(${shake}px)` }}>
      {/* Night fading */}
      <div style={{ opacity: 1 - dawnProgress }}>
        <JungleBackground timeOfDay="night" />
      </div>
      {/* Dawn appearing */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: dawnProgress }}>
        <JungleBackground timeOfDay="dawn" />
      </div>

      <div style={{ opacity: raysIntensity }}>
        <LightRays direction="top-right" intensity={raysIntensity} />
      </div>

      <Fireflies count={8} color={COLORS.gold} />

      {/* Monkey waking up */}
      <div
        style={{
          position: "absolute",
          top: VIDEO.height * 0.3,
          left: VIDEO.width * 0.5 - 200,
          zIndex: 20,
        }}
      >
        <RealisticMonkey mode="waking" scale={1.15} />
      </div>

      {/* Energy burst */}
      {frame > 48 && (
        <div
          style={{
            position: "absolute",
            top: VIDEO.height * 0.42,
            left: VIDEO.width * 0.5,
            transform: "translate(-50%, -50%)",
            width: interpolate(frame, [48, 75], [0, 700], { extrapolateRight: "clamp" }),
            height: interpolate(frame, [48, 75], [0, 700], { extrapolateRight: "clamp" }),
            borderRadius: "50%",
            background: `radial-gradient(circle, ${COLORS.goldGlow} 0%, transparent 70%)`,
            opacity: interpolate(frame, [48, 58, 75], [0, 0.5, 0.1], { extrapolateRight: "clamp" }),
            zIndex: 15,
          }}
        />
      )}

      {/* Text */}
      <div
        style={{
          position: "absolute",
          bottom: VIDEO.height * 0.18,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          zIndex: 40,
          opacity: interpolate(textEntrance, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(textEntrance, [0, 1], [50, 0])}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "'Arial Black', sans-serif",
            fontSize: 72,
            fontWeight: 900,
            color: COLORS.gold,
            textTransform: "uppercase",
            textAlign: "center",
            letterSpacing: "0.05em",
            textShadow: `0 0 35px ${COLORS.goldGlow}, 0 4px 15px rgba(0,0,0,0.6)`,
          }}
        >
          Réveille-toi.
        </div>
        <div
          style={{
            fontFamily: "'Arial Black', sans-serif",
            fontSize: 56,
            fontWeight: 900,
            color: COLORS.offWhite,
            textTransform: "uppercase",
            textAlign: "center",
            letterSpacing: "0.04em",
            textShadow: "0 3px 15px rgba(0,0,0,0.6)",
          }}
        >
          Évolue.
        </div>
      </div>

      {/* Flash overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.gold,
          opacity: flash,
          zIndex: 100,
          mixBlendMode: "overlay",
        }}
      />

      <GrainOverlay intensity={0.03} />
    </AbsoluteFill>
  );
};
