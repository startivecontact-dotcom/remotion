import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, spring, useVideoConfig } from "remotion";
import { COLORS, VIDEO } from "../theme";
import { MonkeyMascot } from "../components/MonkeyMascot";
import { GrainOverlay } from "../effects/GrainOverlay";

export const ShowcaseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animated gradient background
  const gradAngle = interpolate(frame, [0, 120], [135, 180], { extrapolateRight: "clamp" });

  // Hexagon grid pattern animation
  const gridOpacity = interpolate(frame, [0, 20], [0, 0.15], { extrapolateRight: "clamp" });

  // Monkey pops in
  const monkeyEntrance = spring({
    frame: frame - 5,
    fps,
    config: { damping: 10, stiffness: 80 },
  });
  const monkeyScale = interpolate(monkeyEntrance, [0, 1], [0.3, 0.75]);
  const monkeyOpacity = interpolate(monkeyEntrance, [0, 1], [0, 1]);

  // Brand features
  const features = [
    { icon: "🏔️", text: "OUTDOOR", color: COLORS.greenLight },
    { icon: "🏠", text: "INDOOR", color: COLORS.violetLight },
    { icon: "🎮", text: "GAMING", color: COLORS.gold },
    { icon: "🍳", text: "COOKING", color: COLORS.greenHex },
  ];

  return (
    <AbsoluteFill>
      {/* Animated gradient background */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `linear-gradient(${gradAngle}deg, ${COLORS.darkBg} 0%, ${COLORS.violetDark} 40%, ${COLORS.jungleDark} 100%)`,
        }}
      />

      {/* Geometric pattern overlay */}
      <svg
        width={VIDEO.width}
        height={VIDEO.height}
        style={{ position: "absolute", opacity: gridOpacity, zIndex: 1 }}
      >
        {[...Array(12)].map((_, row) =>
          [...Array(8)].map((_, col) => {
            const cx = col * 150 + (row % 2) * 75;
            const cy = row * 170;
            const pulse = interpolate(
              Math.sin(frame * 0.02 + row + col),
              [-1, 1],
              [0.3, 1]
            );
            return (
              <polygon
                key={`${row}-${col}`}
                points={hexPoints(cx, cy, 40)}
                fill="none"
                stroke={COLORS.violetLight}
                strokeWidth="1"
                opacity={pulse * 0.3}
              />
            );
          })
        )}
      </svg>

      {/* Monkey mascot - top center */}
      <div
        style={{
          position: "absolute",
          top: VIDEO.height * 0.08,
          left: VIDEO.width * 0.5 - 190,
          zIndex: 20,
          opacity: monkeyOpacity,
          transform: `scale(${monkeyScale})`,
        }}
      >
        <MonkeyMascot state="active" scale={1} />
      </div>

      {/* KAO SOCIETY text */}
      <div
        style={{
          position: "absolute",
          top: VIDEO.height * 0.42,
          width: "100%",
          textAlign: "center",
          zIndex: 30,
        }}
      >
        {(() => {
          const titleEntrance = spring({
            frame: frame - 15,
            fps,
            config: { damping: 14, stiffness: 100 },
          });
          return (
            <div
              style={{
                fontFamily: "'Arial Black', sans-serif",
                fontSize: 90,
                fontWeight: 900,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                opacity: interpolate(titleEntrance, [0, 1], [0, 1]),
                transform: `scale(${interpolate(titleEntrance, [0, 1], [0.8, 1])})`,
              }}
            >
              <span style={{ color: COLORS.greenLight, textShadow: `0 0 40px ${COLORS.greenHex}80` }}>
                KAO
              </span>
              <br />
              <span style={{ color: COLORS.offWhite, textShadow: `0 0 30px ${COLORS.violetGlow}` }}>
                SOCIETY
              </span>
            </div>
          );
        })()}
      </div>

      {/* Feature cards */}
      <div
        style={{
          position: "absolute",
          top: VIDEO.height * 0.58,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          padding: "0 60px",
          zIndex: 30,
        }}
      >
        {features.map((feat, i) => {
          const cardEntrance = spring({
            frame: frame - 30 - i * 12,
            fps,
            config: { damping: 12, stiffness: 100 },
          });
          const cardX = interpolate(cardEntrance, [0, 1], [i % 2 === 0 ? -200 : 200, 0]);
          const cardOpacity = interpolate(cardEntrance, [0, 1], [0, 1]);

          return (
            <div
              key={feat.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "18px 40px",
                borderRadius: 20,
                background: `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)`,
                border: `1px solid ${feat.color}40`,
                backdropFilter: "blur(10px)",
                opacity: cardOpacity,
                transform: `translateX(${cardX}px)`,
                width: 500,
              }}
            >
              <span style={{ fontSize: 44 }}>{feat.icon}</span>
              <span
                style={{
                  fontFamily: "'Arial Black', sans-serif",
                  fontSize: 36,
                  fontWeight: 900,
                  color: feat.color,
                  letterSpacing: "0.08em",
                }}
              >
                {feat.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Glow behind monkey */}
      <div
        style={{
          position: "absolute",
          top: VIDEO.height * 0.15,
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.violetGlow} 0%, transparent 70%)`,
          opacity: interpolate(Math.sin(frame * 0.03), [-1, 1], [0.2, 0.4]),
          filter: "blur(40px)",
          zIndex: 10,
        }}
      />

      <GrainOverlay intensity={0.03} />
    </AbsoluteFill>
  );
};

function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}
