import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { COLORS, VIDEO, FONTS } from "../theme";
import { MonkeyMascot } from "../components/MonkeyMascot";
import { AnimatedText } from "../components/AnimatedText";
import { GlowEffect } from "../effects/GlowEffect";
import { GrainOverlay } from "../effects/GrainOverlay";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background mix animation
  const gradientAngle = interpolate(frame, [0, 90], [135, 180]);

  // Logo entrance
  const logoScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 8, stiffness: 80, mass: 1 },
  });

  // Monkey entrance
  const monkeyEntrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  // CTA pulse
  const ctaPulse = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.95, 1.05]
  );

  // CTA entrance
  const ctaEntrance = spring({
    frame: frame - 50,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <div
      style={{
        width: VIDEO.width,
        height: VIDEO.height,
        background: `linear-gradient(${gradientAngle}deg, ${COLORS.greenDark} 0%, ${COLORS.violet} 50%, ${COLORS.violetDark} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,0,0,0.4) 100%)`,
          zIndex: 2,
        }}
      />

      {/* Animated rings */}
      {[...Array(4)].map((_, i) => {
        const ringScale = spring({
          frame: frame - 10 - i * 8,
          fps,
          config: { damping: 15, stiffness: 60 },
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "38%",
              left: "50%",
              width: 200 + i * 120,
              height: 200 + i * 120,
              borderRadius: "50%",
              border: `2px solid ${i % 2 === 0 ? COLORS.greenHex : COLORS.violetLight}`,
              opacity: interpolate(ringScale, [0, 1], [0, 0.15 - i * 0.03]),
              transform: `translate(-50%, -50%) scale(${ringScale})`,
              zIndex: 3,
            }}
          />
        );
      })}

      {/* Monkey - stylish and energetic */}
      <div
        style={{
          zIndex: 20,
          transform: `scale(${monkeyEntrance * 1.1})`,
          opacity: monkeyEntrance,
          marginBottom: 20,
        }}
      >
        <MonkeyMascot state="energetic" scale={1.1} accessory="sunglasses" />
      </div>

      {/* KAO SOCIETY Logo Text */}
      <div
        style={{
          zIndex: 20,
          transform: `scale(${logoScale})`,
          opacity: logoScale,
          textAlign: "center",
          marginTop: 10,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 88,
            fontWeight: 900,
            color: COLORS.white,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            textShadow: `0 0 40px ${COLORS.violetGlow}, 0 0 80px ${COLORS.violetGlow}, 0 4px 20px rgba(0,0,0,0.5)`,
            lineHeight: 1,
          }}
        >
          KAO
        </div>
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 88,
            fontWeight: 900,
            color: COLORS.white,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            textShadow: `0 0 40px ${COLORS.violetGlow}, 0 0 80px ${COLORS.violetGlow}, 0 4px 20px rgba(0,0,0,0.5)`,
            lineHeight: 1,
            marginTop: 5,
          }}
        >
          SOCIETY
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          zIndex: 20,
          marginTop: 25,
        }}
      >
        <AnimatedText
          text="Outdoor & Indoor Experiences"
          fontSize={32}
          color={COLORS.offWhite}
          delay={25}
          style="bold"
        />
      </div>

      {/* Separator line */}
      <div
        style={{
          width: interpolate(
            spring({ frame: frame - 35, fps, config: { damping: 15 } }),
            [0, 1],
            [0, 300]
          ),
          height: 2,
          background: `linear-gradient(90deg, ${COLORS.greenHex}, ${COLORS.violetLight})`,
          marginTop: 30,
          zIndex: 20,
          opacity: 0.7,
        }}
      />

      {/* CTA Button */}
      <div
        style={{
          zIndex: 20,
          marginTop: 35,
          transform: `scale(${ctaEntrance * ctaPulse})`,
          opacity: ctaEntrance,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 36,
            fontWeight: 700,
            color: COLORS.white,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "18px 60px",
            border: `3px solid ${COLORS.white}`,
            borderRadius: 50,
            background: `linear-gradient(135deg, ${COLORS.greenHex}40, ${COLORS.violet}40)`,
            boxShadow: `0 0 30px ${COLORS.violetGlow}, 0 0 60px rgba(123, 141, 62, 0.2)`,
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          Follow Us
        </div>
      </div>

      <GlowEffect color={COLORS.violetLight} intensity={0.25} position="center" />
      <GlowEffect color={COLORS.greenHex} intensity={0.15} position="bottom" />
      <GrainOverlay intensity={0.04} />
    </div>
  );
};
