import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { COLORS, VIDEO } from "../theme";
import { MonkeyMascot } from "../components/MonkeyMascot";
import { JungleBackground } from "../components/JungleBackground";
import { Fireflies } from "../components/Fireflies";
import { GrainOverlay } from "../effects/GrainOverlay";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const zoom = interpolate(frame, [0, 90], [1.1, 1], { extrapolateRight: "clamp" });
  const monkeySlide = interpolate(frame, [10, 40], [50, 0], { extrapolateRight: "clamp" });
  const monkeyOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });

  // Text fade in
  const textOpacity = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" });
  const textY = interpolate(frame, [40, 60], [30, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fadeIn, transform: `scale(${zoom})` }}>
      <JungleBackground timeOfDay="night" />
      <Fireflies count={12} />

      {/* Monkey sleeping on branch */}
      <div
        style={{
          position: "absolute",
          top: VIDEO.height * 0.25 + monkeySlide,
          left: VIDEO.width * 0.5 - 250,
          opacity: monkeyOpacity,
          zIndex: 20,
        }}
      >
        <MonkeyMascot state="sleeping" scale={1.1} />
      </div>

      {/* Title text */}
      <div
        style={{
          position: "absolute",
          bottom: VIDEO.height * 0.22,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 15,
          zIndex: 40,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "'Arial Black', sans-serif",
            fontSize: 72,
            fontWeight: 900,
            color: COLORS.offWhite,
            textTransform: "uppercase",
            textAlign: "center",
            letterSpacing: "0.08em",
            textShadow: `0 0 40px ${COLORS.violetGlow}, 0 4px 20px rgba(0,0,0,0.6)`,
          }}
        >
          Tired of
        </div>
        <div
          style={{
            fontFamily: "'Arial Black', sans-serif",
            fontSize: 80,
            fontWeight: 900,
            color: COLORS.greenLight,
            textTransform: "uppercase",
            textAlign: "center",
            letterSpacing: "0.06em",
            textShadow: `0 0 30px ${COLORS.greenHex}80, 0 4px 15px rgba(0,0,0,0.5)`,
          }}
        >
          routine?
        </div>
      </div>

      <GrainOverlay intensity={0.04} />
    </AbsoluteFill>
  );
};
