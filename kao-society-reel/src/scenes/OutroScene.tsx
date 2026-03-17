import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, spring, useVideoConfig } from "remotion";
import { COLORS, VIDEO } from "../theme";
import { RealisticMonkey } from "../components/RealisticMonkey";
import { Fireflies } from "../components/Fireflies";
import { GrainOverlay } from "../effects/GrainOverlay";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance
  const logoEntrance = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const logoScale = interpolate(logoEntrance, [0, 1], [0.3, 1]);
  const logoOpacity = interpolate(logoEntrance, [0, 1], [0, 1]);

  // Monkey
  const monkeyEntrance = spring({ frame: frame - 6, fps, config: { damping: 10, stiffness: 100 } });

  // CTA pulse
  const ctaPulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.96, 1.04]);
  const ctaGlow = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.5, 1]);

  // Social
  const socialEntrance = spring({ frame: frame - 28, fps, config: { damping: 14, stiffness: 100 } });

  // Fade out
  const fadeOut = interpolate(frame, [72, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* BG */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at 50% 35%, ${COLORS.violet} 0%, ${COLORS.violetDark} 35%, ${COLORS.darkBg} 100%)`,
        }}
      />

      {/* Glow pulse */}
      <div
        style={{
          position: "absolute",
          top: "22%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800 * logoScale,
          height: 800 * logoScale,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.violetGlow} 0%, transparent 60%)`,
          opacity: 0.25 * ctaGlow,
          filter: "blur(60px)",
        }}
      />

      <Fireflies count={8} color={COLORS.gold} />

      {/* Monkey */}
      <div
        style={{
          position: "absolute",
          top: VIDEO.height * 0.06,
          left: VIDEO.width * 0.5 - 140,
          zIndex: 20,
          opacity: interpolate(monkeyEntrance, [0, 1], [0, 1]),
          transform: `scale(${interpolate(monkeyEntrance, [0, 1], [0.4, 0.6])})`,
        }}
      >
        <RealisticMonkey mode="standing" scale={1} />
      </div>

      {/* KAO SOCIETY */}
      <div
        style={{
          position: "absolute",
          top: VIDEO.height * 0.4,
          width: "100%",
          textAlign: "center",
          zIndex: 30,
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <div style={{
          fontFamily: "'Arial Black', sans-serif",
          fontSize: 105,
          fontWeight: 900,
          letterSpacing: "0.15em",
          color: COLORS.greenLight,
          textShadow: `0 0 50px ${COLORS.greenHex}80, 0 0 100px ${COLORS.greenHex}40`,
        }}>
          KAO
        </div>
        <div style={{
          fontFamily: "'Arial Black', sans-serif",
          fontSize: 58,
          fontWeight: 900,
          letterSpacing: "0.3em",
          color: COLORS.offWhite,
          textShadow: `0 0 30px ${COLORS.violetGlow}`,
          marginTop: -8,
        }}>
          SOCIETY
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          top: VIDEO.height * 0.57,
          width: "100%",
          textAlign: "center",
          zIndex: 30,
        }}
      >
        {(() => {
          const tagEntrance = spring({ frame: frame - 18, fps, config: { damping: 14, stiffness: 100 } });
          return (
            <div style={{
              fontFamily: "'Helvetica Neue', sans-serif",
              fontSize: 30,
              color: COLORS.cream,
              opacity: interpolate(tagEntrance, [0, 1], [0, 0.8]),
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}>
              Plein air · Intérieur · Gaming · Cuisine
            </div>
          );
        })()}
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          bottom: VIDEO.height * 0.24,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          zIndex: 30,
          opacity: interpolate(socialEntrance, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(socialEntrance, [0, 1], [25, 0])}px)`,
        }}
      >
        <div
          style={{
            padding: "22px 65px",
            borderRadius: 50,
            background: `linear-gradient(135deg, ${COLORS.greenHex}, ${COLORS.greenLight})`,
            boxShadow: `0 0 ${30 * ctaGlow}px ${COLORS.greenHex}60, 0 8px 25px rgba(0,0,0,0.3)`,
            transform: `scale(${ctaPulse})`,
          }}
        >
          <span style={{
            fontFamily: "'Arial Black', sans-serif",
            fontSize: 38,
            fontWeight: 900,
            color: COLORS.white,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}>
            Suis-nous
          </span>
        </div>
      </div>

      {/* Handle */}
      <div
        style={{
          position: "absolute",
          bottom: VIDEO.height * 0.13,
          width: "100%",
          textAlign: "center",
          zIndex: 30,
          opacity: interpolate(socialEntrance, [0, 1], [0, 0.7]),
        }}
      >
        <div style={{
          fontFamily: "'Helvetica Neue', sans-serif",
          fontSize: 32,
          color: COLORS.offWhite,
          letterSpacing: "0.04em",
        }}>
          @kao.society
        </div>
      </div>

      <GrainOverlay intensity={0.025} />
    </AbsoluteFill>
  );
};
