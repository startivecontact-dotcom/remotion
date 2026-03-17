import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, spring, useVideoConfig } from "remotion";
import { COLORS, VIDEO } from "../theme";
import { MonkeyMascot } from "../components/MonkeyMascot";
import { Fireflies } from "../components/Fireflies";
import { GrainOverlay } from "../effects/GrainOverlay";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance
  const logoEntrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const logoScale = interpolate(logoEntrance, [0, 1], [0.3, 1]);
  const logoOpacity = interpolate(logoEntrance, [0, 1], [0, 1]);

  // Monkey entrance
  const monkeyEntrance = spring({
    frame: frame - 8,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  // CTA button pulse
  const ctaPulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.95, 1.05]);
  const ctaGlow = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.5, 1]);

  // Social handles entrance
  const socialEntrance = spring({
    frame: frame - 30,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Fade out at end
  const fadeOut = interpolate(frame, [70, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Background */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at 50% 35%, ${COLORS.violet} 0%, ${COLORS.violetDark} 35%, ${COLORS.darkBg} 100%)`,
        }}
      />

      {/* Animated background pulse */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800 * logoScale,
          height: 800 * logoScale,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.violetGlow} 0%, transparent 60%)`,
          opacity: 0.3 * ctaGlow,
          filter: "blur(60px)",
        }}
      />

      <Fireflies count={8} color={COLORS.gold} />

      {/* Monkey mascot */}
      <div
        style={{
          position: "absolute",
          top: VIDEO.height * 0.08,
          left: VIDEO.width * 0.5 - 175,
          zIndex: 20,
          opacity: interpolate(monkeyEntrance, [0, 1], [0, 1]),
          transform: `scale(${interpolate(monkeyEntrance, [0, 1], [0.5, 0.7])})`,
        }}
      >
        <MonkeyMascot state="active" scale={1} />
      </div>

      {/* KAO SOCIETY Logo */}
      <div
        style={{
          position: "absolute",
          top: VIDEO.height * 0.42,
          width: "100%",
          textAlign: "center",
          zIndex: 30,
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <div
          style={{
            fontFamily: "'Arial Black', sans-serif",
            fontSize: 100,
            fontWeight: 900,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          <span style={{
            color: COLORS.greenLight,
            textShadow: `0 0 50px ${COLORS.greenHex}80, 0 0 100px ${COLORS.greenHex}40`,
          }}>
            KAO
          </span>
        </div>
        <div
          style={{
            fontFamily: "'Arial Black', sans-serif",
            fontSize: 55,
            fontWeight: 900,
            letterSpacing: "0.3em",
            color: COLORS.offWhite,
            textShadow: `0 0 30px ${COLORS.violetGlow}`,
            marginTop: -10,
          }}
        >
          SOCIETY
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          top: VIDEO.height * 0.58,
          width: "100%",
          textAlign: "center",
          zIndex: 30,
        }}
      >
        {(() => {
          const tagEntrance = spring({
            frame: frame - 20,
            fps,
            config: { damping: 14, stiffness: 100 },
          });
          return (
            <div
              style={{
                fontFamily: "'Helvetica Neue', sans-serif",
                fontSize: 32,
                color: COLORS.cream,
                opacity: interpolate(tagEntrance, [0, 1], [0, 0.8]),
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Outdoor · Indoor · Gaming · Cooking
            </div>
          );
        })()}
      </div>

      {/* CTA Button */}
      <div
        style={{
          position: "absolute",
          bottom: VIDEO.height * 0.25,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          zIndex: 30,
          opacity: interpolate(socialEntrance, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(socialEntrance, [0, 1], [30, 0])}px)`,
        }}
      >
        <div
          style={{
            padding: "22px 60px",
            borderRadius: 50,
            background: `linear-gradient(135deg, ${COLORS.greenHex}, ${COLORS.greenLight})`,
            boxShadow: `0 0 ${30 * ctaGlow}px ${COLORS.greenHex}60, 0 8px 25px rgba(0,0,0,0.3)`,
            transform: `scale(${ctaPulse})`,
          }}
        >
          <span
            style={{
              fontFamily: "'Arial Black', sans-serif",
              fontSize: 36,
              fontWeight: 900,
              color: COLORS.white,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Follow us
          </span>
        </div>
      </div>

      {/* Social handle */}
      <div
        style={{
          position: "absolute",
          bottom: VIDEO.height * 0.14,
          width: "100%",
          textAlign: "center",
          zIndex: 30,
          opacity: interpolate(socialEntrance, [0, 1], [0, 0.7]),
        }}
      >
        <div
          style={{
            fontFamily: "'Helvetica Neue', sans-serif",
            fontSize: 30,
            color: COLORS.offWhite,
            letterSpacing: "0.05em",
          }}
        >
          @kao.society
        </div>
      </div>

      <GrainOverlay intensity={0.03} />
    </AbsoluteFill>
  );
};
