import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, spring, useVideoConfig } from "remotion";
import { COLORS, VIDEO } from "../theme";
import { RealisticMonkey } from "../components/RealisticMonkey";
import { Fireflies } from "../components/Fireflies";
import { GrainOverlay } from "../effects/GrainOverlay";

export const CommunityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ringPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.92, 1.08]);

  // Three monkeys
  const monkeys = [
    { x: -300, delay: 5, s: 0.55, dir: 1 as const },
    { x: 0, delay: 0, s: 0.7, dir: -1 as const },
    { x: 300, delay: 8, s: 0.55, dir: -1 as const },
  ];

  return (
    <AbsoluteFill>
      {/* Dark gradient bg */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at 50% 40%, ${COLORS.violetDark} 0%, ${COLORS.darkBg} 70%)`,
        }}
      />

      {/* Concentric rings */}
      <svg width={VIDEO.width} height={VIDEO.height} style={{ position: "absolute", zIndex: 5 }}>
        {[...Array(6)].map((_, i) => {
          const r = 80 + i * 70;
          const opacity = interpolate(Math.sin(frame * 0.025 + i * 0.7), [-1, 1], [0.04, 0.12]);
          return (
            <circle
              key={i}
              cx={VIDEO.width / 2}
              cy={VIDEO.height * 0.38}
              r={r * ringPulse}
              fill="none"
              stroke={i % 2 === 0 ? COLORS.violetLight : COLORS.greenHex}
              strokeWidth="1.5"
              opacity={opacity}
            />
          );
        })}
      </svg>

      <Fireflies count={12} color={COLORS.violetLight} />

      {/* Three monkeys */}
      {monkeys.map((pos, i) => {
        const entrance = spring({
          frame: frame - pos.delay,
          fps,
          config: { damping: 12, stiffness: 80 },
        });
        const monkeyY = interpolate(entrance, [0, 1], [80, 0]);
        const monkeyOpacity = interpolate(entrance, [0, 1], [0, 1]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: VIDEO.height * 0.2 + monkeyY,
              left: VIDEO.width * 0.5 + pos.x - 160,
              zIndex: 20,
              opacity: monkeyOpacity,
              transform: `scale(${pos.s})`,
            }}
          >
            <RealisticMonkey mode="celebrating" scale={1} direction={pos.dir} />
          </div>
        );
      })}

      {/* Connection lines between monkeys */}
      <svg width={VIDEO.width} height={VIDEO.height} style={{ position: "absolute", zIndex: 15 }}>
        {[
          { x1: VIDEO.width * 0.25, x2: VIDEO.width * 0.5, y: VIDEO.height * 0.38 },
          { x1: VIDEO.width * 0.5, x2: VIDEO.width * 0.75, y: VIDEO.height * 0.38 },
        ].map((line, i) => {
          const progress = interpolate(frame, [12 + i * 10, 30 + i * 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <line
              key={i}
              x1={line.x1}
              y1={line.y}
              x2={line.x1 + (line.x2 - line.x1) * progress}
              y2={line.y}
              stroke={COLORS.greenHex}
              strokeWidth="2.5"
              strokeDasharray="10 5"
              opacity={0.4}
            />
          );
        })}
      </svg>

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
        }}
      >
        {(() => {
          const textEntrance = spring({
            frame: frame - 18,
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
                  fontSize: 66,
                  fontWeight: 900,
                  color: COLORS.offWhite,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  textAlign: "center",
                  opacity: textOpacity,
                  transform: `scale(${textScale})`,
                  textShadow: `0 0 40px ${COLORS.violetGlow}, 0 4px 20px rgba(0,0,0,0.6)`,
                }}
              >
                Rejoins la
              </div>
              <div
                style={{
                  fontFamily: "'Arial Black', sans-serif",
                  fontSize: 82,
                  fontWeight: 900,
                  color: COLORS.greenLight,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  textAlign: "center",
                  opacity: textOpacity,
                  transform: `scale(${textScale})`,
                  textShadow: `0 0 35px ${COLORS.greenHex}80, 0 4px 15px rgba(0,0,0,0.5)`,
                }}
              >
                Tribu
              </div>
            </>
          );
        })()}
      </div>

      <GrainOverlay intensity={0.025} />
    </AbsoluteFill>
  );
};
