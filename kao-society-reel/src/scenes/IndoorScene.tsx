import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { COLORS, VIDEO } from "../theme";
import { MonkeyMascot } from "../components/MonkeyMascot";
import { AnimatedWords } from "../components/AnimatedText";
import { GlowEffect } from "../effects/GlowEffect";
import { GrainOverlay } from "../effects/GrainOverlay";

export const IndoorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fast cuts: 3 sub-scenes (gaming, board games, cooking)
  const section = frame < 60 ? 0 : frame < 120 ? 1 : 2;

  // Cut flash
  const cutFlash = (cutFrame: number) => {
    const diff = frame - cutFrame;
    if (diff < 0 || diff > 5) return 0;
    return interpolate(diff, [0, 2, 5], [0.8, 0.3, 0], {
      extrapolateRight: "clamp",
    });
  };

  // Neon pulse
  const neonPulse = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.5, 1]
  );

  // Current accessory based on section
  const accessory =
    section === 0 ? "gamepad" as const : section === 1 ? null : "apron" as const;

  return (
    <div
      style={{
        width: VIDEO.width,
        height: VIDEO.height,
        background: `radial-gradient(ellipse at 50% 60%, ${COLORS.violet} 0%, ${COLORS.violetDark} 40%, ${COLORS.darkBg} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Neon grid floor */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "50%",
          perspective: "800px",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: "rotateX(60deg)",
            transformOrigin: "center top",
            background: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 98px,
                ${COLORS.violetLight}40 98px,
                ${COLORS.violetLight}40 100px
              ),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 98px,
                ${COLORS.violetLight}30 98px,
                ${COLORS.violetLight}30 100px
              )
            `,
            opacity: neonPulse * 0.4,
          }}
        />
      </div>

      {/* Neon border glow lines */}
      {[...Array(4)].map((_, i) => {
        const isVertical = i >= 2;
        const pos = i % 2 === 0 ? "0%" : "100%";
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              ...(isVertical
                ? {
                    top: 0,
                    [i === 2 ? "left" : "right"]: 0,
                    width: 3,
                    height: "100%",
                  }
                : {
                    [i === 0 ? "top" : "bottom"]: 0,
                    left: 0,
                    width: "100%",
                    height: 3,
                  }),
              background: COLORS.violetLight,
              opacity: neonPulse * 0.3,
              boxShadow: `0 0 20px ${COLORS.violetLight}, 0 0 40px ${COLORS.violetGlow}`,
              zIndex: 30,
            }}
          />
        );
      })}

      {/* Section-specific backgrounds */}
      {section === 0 && (
        <>
          {/* Gaming - screen glow effect */}
          <div
            style={{
              position: "absolute",
              top: "15%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 500,
              height: 350,
              background: `linear-gradient(135deg, ${COLORS.violetDark} 0%, ${COLORS.violet} 100%)`,
              borderRadius: 20,
              border: `3px solid ${COLORS.violetLight}60`,
              boxShadow: `0 0 60px ${COLORS.violetGlow}, inset 0 0 40px rgba(0,0,0,0.3)`,
              zIndex: 5,
              opacity: 0.8,
            }}
          >
            {/* Screen flicker */}
            <div
              style={{
                width: "100%",
                height: "100%",
                background: `linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.03) 50%)`,
                backgroundSize: "100% 4px",
                borderRadius: 20,
              }}
            />
          </div>
        </>
      )}

      {section === 1 && (
        <>
          {/* Board game table */}
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translateX(-50%) perspective(500px) rotateX(20deg)",
              width: 600,
              height: 400,
              background: `linear-gradient(135deg, #3D2B1F 0%, #5C4033 100%)`,
              borderRadius: 15,
              boxShadow: `0 20px 60px rgba(0,0,0,0.5)`,
              zIndex: 5,
            }}
          >
            {/* Game pieces */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 30,
                  height: 30,
                  borderRadius: i % 2 === 0 ? "50%" : "4px",
                  background:
                    i % 3 === 0
                      ? COLORS.greenHex
                      : i % 3 === 1
                        ? COLORS.violetLight
                        : COLORS.offWhite,
                  left: `${20 + i * 13}%`,
                  top: `${30 + Math.sin(i * 1.5) * 15}%`,
                  boxShadow: `0 4px 10px rgba(0,0,0,0.3)`,
                  transform: `rotate(${frame * 0.5 + i * 60}deg)`,
                }}
              />
            ))}
          </div>
        </>
      )}

      {section === 2 && (
        <>
          {/* Kitchen counter */}
          <div
            style={{
              position: "absolute",
              bottom: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "80%",
              height: 200,
              background: `linear-gradient(180deg, #4A4A4A 0%, #333 100%)`,
              borderRadius: "10px 10px 0 0",
              zIndex: 5,
            }}
          >
            {/* Steam particles */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  left: `${30 + i * 10}%`,
                  top: -30 - Math.sin(frame * 0.05 + i) * 20,
                  filter: "blur(8px)",
                  opacity: interpolate(
                    Math.sin(frame * 0.04 + i * 2),
                    [-1, 1],
                    [0.1, 0.4]
                  ),
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Monkey */}
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          zIndex: 20,
        }}
      >
        <MonkeyMascot state="energetic" scale={0.85} accessory={accessory} />
      </div>

      {/* Text overlay */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          zIndex: 30,
          width: "100%",
        }}
      >
        <AnimatedWords
          words={["Play.", "Chill.", "Create."]}
          fontSize={76}
          color={COLORS.offWhite}
          delay={10}
        />
      </div>

      {/* Cut transitions */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: COLORS.violetLight,
          opacity: cutFlash(60) + cutFlash(120),
          zIndex: 50,
          pointerEvents: "none",
        }}
      />

      <GlowEffect color={COLORS.violetLight} intensity={0.3} position="center" />
      <GrainOverlay intensity={0.05} />
    </div>
  );
};
