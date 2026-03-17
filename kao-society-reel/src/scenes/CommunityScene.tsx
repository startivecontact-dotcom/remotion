import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, spring, useVideoConfig } from "remotion";
import { COLORS, VIDEO } from "../theme";
import { MonkeyMascot } from "../components/MonkeyMascot";
import { Fireflies } from "../components/Fireflies";
import { GrainOverlay } from "../effects/GrainOverlay";

export const CommunityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pulsing ring animation
  const ringPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.9, 1.1]);

  return (
    <AbsoluteFill>
      {/* Dark gradient background */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at 50% 40%, ${COLORS.violetDark} 0%, ${COLORS.darkBg} 70%)`,
        }}
      />

      {/* Concentric rings */}
      <svg
        width={VIDEO.width}
        height={VIDEO.height}
        style={{ position: "absolute", zIndex: 5 }}
      >
        {[...Array(5)].map((_, i) => {
          const r = 100 + i * 80;
          const ringOpacity = interpolate(
            Math.sin(frame * 0.03 + i * 0.8),
            [-1, 1],
            [0.05, 0.15]
          );
          return (
            <circle
              key={i}
              cx={VIDEO.width / 2}
              cy={VIDEO.height * 0.4}
              r={r * ringPulse}
              fill="none"
              stroke={i % 2 === 0 ? COLORS.violetLight : COLORS.greenHex}
              strokeWidth="1.5"
              opacity={ringOpacity}
            />
          );
        })}
      </svg>

      <Fireflies count={10} color={COLORS.violetLight} />

      {/* Three monkeys representing community */}
      {[
        { x: -320, delay: 5, s: 0.6 },
        { x: 0, delay: 0, s: 0.8 },
        { x: 320, delay: 8, s: 0.6 },
      ].map((pos, i) => {
        const entrance = spring({
          frame: frame - pos.delay,
          fps,
          config: { damping: 12, stiffness: 80 },
        });
        const monkeyY = interpolate(entrance, [0, 1], [100, 0]);
        const monkeyOpacity = interpolate(entrance, [0, 1], [0, 1]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: VIDEO.height * 0.22 + monkeyY,
              left: VIDEO.width * 0.5 + pos.x - 190,
              zIndex: 20,
              opacity: monkeyOpacity,
              transform: `scale(${pos.s})`,
            }}
          >
            <MonkeyMascot state="active" scale={1} />
          </div>
        );
      })}

      {/* "JOIN THE TRIBE" text */}
      <div
        style={{
          position: "absolute",
          bottom: VIDEO.height * 0.2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 15,
          zIndex: 40,
        }}
      >
        {(() => {
          const textEntrance = spring({
            frame: frame - 20,
            fps,
            config: { damping: 14, stiffness: 100 },
          });
          const textScale = interpolate(textEntrance, [0, 1], [0.5, 1]);
          const textOpacity = interpolate(textEntrance, [0, 1], [0, 1]);

          return (
            <>
              <div
                style={{
                  fontFamily: "'Arial Black', sans-serif",
                  fontSize: 70,
                  fontWeight: 900,
                  color: COLORS.offWhite,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  textAlign: "center",
                  opacity: textOpacity,
                  transform: `scale(${textScale})`,
                  textShadow: `0 0 40px ${COLORS.violetGlow}, 0 4px 20px rgba(0,0,0,0.5)`,
                }}
              >
                Join the
              </div>
              <div
                style={{
                  fontFamily: "'Arial Black', sans-serif",
                  fontSize: 85,
                  fontWeight: 900,
                  color: COLORS.greenLight,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  textAlign: "center",
                  opacity: textOpacity,
                  transform: `scale(${textScale})`,
                  textShadow: `0 0 30px ${COLORS.greenHex}80, 0 4px 15px rgba(0,0,0,0.5)`,
                }}
              >
                Tribe
              </div>
            </>
          );
        })()}
      </div>

      {/* Connection lines between monkeys */}
      <svg
        width={VIDEO.width}
        height={VIDEO.height}
        style={{ position: "absolute", zIndex: 15 }}
      >
        {[
          { x1: VIDEO.width * 0.22, x2: VIDEO.width * 0.5, y: VIDEO.height * 0.38 },
          { x1: VIDEO.width * 0.5, x2: VIDEO.width * 0.78, y: VIDEO.height * 0.38 },
        ].map((line, i) => {
          const lineProgress = interpolate(frame, [15 + i * 10, 35 + i * 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <line
              key={i}
              x1={line.x1}
              y1={line.y}
              x2={line.x1 + (line.x2 - line.x1) * lineProgress}
              y2={line.y}
              stroke={COLORS.greenHex}
              strokeWidth="2"
              strokeDasharray="8 4"
              opacity={0.4}
            />
          );
        })}
      </svg>

      <GrainOverlay intensity={0.03} />
    </AbsoluteFill>
  );
};
