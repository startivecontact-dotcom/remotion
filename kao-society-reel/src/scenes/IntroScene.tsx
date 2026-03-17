import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { COLORS, VIDEO } from "../theme";
import { MonkeyMascot } from "../components/MonkeyMascot";
import { AnimatedText } from "../components/AnimatedText";
import { GlowEffect } from "../effects/GlowEffect";
import { GrainOverlay } from "../effects/GrainOverlay";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow fade in
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Subtle zoom
  const zoom = interpolate(frame, [0, 90], [1.05, 1], {
    extrapolateRight: "clamp",
  });

  // Breathing effect for ambient
  const breathe = interpolate(Math.sin(frame * 0.03), [-1, 1], [0.95, 1.05]);

  return (
    <div
      style={{
        width: VIDEO.width,
        height: VIDEO.height,
        background: `radial-gradient(ellipse at 50% 40%, ${COLORS.violet} 0%, ${COLORS.violetDark} 50%, ${COLORS.darkBg} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        opacity: fadeIn,
        transform: `scale(${zoom})`,
      }}
    >
      {/* Deep shadow vignette */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
          zIndex: 2,
        }}
      />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 4 + i * 2,
            height: 4 + i * 2,
            borderRadius: "50%",
            background:
              i % 2 === 0 ? COLORS.greenHex : COLORS.violetLight,
            opacity: interpolate(
              Math.sin(frame * 0.02 + i * 1.5),
              [-1, 1],
              [0.05, 0.2]
            ),
            left: `${15 + i * 10}%`,
            top: `${20 + Math.sin(frame * 0.015 + i) * 10}%`,
            filter: "blur(2px)",
            zIndex: 3,
          }}
        />
      ))}

      <GlowEffect color={COLORS.violetLight} intensity={0.25} position="center" />

      {/* Monkey mascot - tired, centered */}
      <div
        style={{
          transform: `scale(${breathe})`,
          zIndex: 10,
          marginBottom: 40,
        }}
      >
        <MonkeyMascot state="tired" scale={1.2} />
      </div>

      {/* Text */}
      <div style={{ zIndex: 10, marginTop: 20 }}>
        <AnimatedText
          text="Tired of routine?"
          fontSize={64}
          color={COLORS.offWhite}
          delay={15}
          style="glow"
        />
      </div>

      <GrainOverlay intensity={0.05} />
    </div>
  );
};
