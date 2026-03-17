import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { COLORS, VIDEO } from "../theme";
import { RealisticMonkey } from "../components/RealisticMonkey";
import { JungleBackground } from "../components/JungleBackground";
import { Fireflies } from "../components/Fireflies";
import { GrainOverlay } from "../effects/GrainOverlay";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const zoom = interpolate(frame, [0, 90], [1.08, 1], { extrapolateRight: "clamp" });

  // Monkey gently breathing/sleeping
  const monkeyOpacity = interpolate(frame, [8, 25], [0, 1], { extrapolateRight: "clamp" });

  // Text
  const textOpacity = interpolate(frame, [35, 55], [0, 1], { extrapolateRight: "clamp" });
  const textY = interpolate(frame, [35, 55], [40, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fadeIn, transform: `scale(${zoom})` }}>
      <JungleBackground timeOfDay="night" />
      <Fireflies count={15} />

      {/* Sleeping monkey */}
      <div
        style={{
          position: "absolute",
          top: VIDEO.height * 0.3,
          left: VIDEO.width * 0.5 - 200,
          opacity: monkeyOpacity,
          zIndex: 20,
        }}
      >
        <RealisticMonkey mode="sleeping" scale={1.15} />
      </div>

      {/* Text */}
      <div
        style={{
          position: "absolute",
          bottom: VIDEO.height * 0.18,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          zIndex: 40,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "'Arial Black', sans-serif",
            fontSize: 68,
            fontWeight: 900,
            color: COLORS.offWhite,
            textTransform: "uppercase",
            textAlign: "center",
            letterSpacing: "0.06em",
            textShadow: `0 0 40px ${COLORS.violetGlow}, 0 4px 20px rgba(0,0,0,0.7)`,
          }}
        >
          Fatigué de
        </div>
        <div
          style={{
            fontFamily: "'Arial Black', sans-serif",
            fontSize: 78,
            fontWeight: 900,
            color: COLORS.greenLight,
            textTransform: "uppercase",
            textAlign: "center",
            letterSpacing: "0.05em",
            textShadow: `0 0 30px ${COLORS.greenHex}80, 0 4px 15px rgba(0,0,0,0.6)`,
          }}
        >
          la routine ?
        </div>
      </div>

      <GrainOverlay intensity={0.04} />
    </AbsoluteFill>
  );
};
