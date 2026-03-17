import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, spring, useVideoConfig } from "remotion";
import { COLORS, VIDEO } from "../theme";
import { RealisticMonkey } from "../components/RealisticMonkey";
import { GrainOverlay } from "../effects/GrainOverlay";

export const ShowcaseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background gradient rotation
  const gradAngle = interpolate(frame, [0, 120], [135, 200], { extrapolateRight: "clamp" });

  // Monkey stands and celebrates
  const monkeyEntrance = spring({
    frame: frame - 5,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  // Brand features
  const features = [
    { icon: "🏔️", text: "PLEIN AIR", desc: "Randonnée, escalade, nature", color: COLORS.greenLight },
    { icon: "🏠", text: "INTÉRIEUR", desc: "Détente, créativité, bien-être", color: COLORS.violetLight },
    { icon: "🎮", text: "GAMING", desc: "Jeux, streams, tournois", color: COLORS.gold },
    { icon: "🍳", text: "CUISINE", desc: "Recettes, partage, saveurs", color: COLORS.greenHex },
  ];

  return (
    <AbsoluteFill>
      {/* Animated gradient bg */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `linear-gradient(${gradAngle}deg, ${COLORS.darkBg} 0%, ${COLORS.violetDark} 40%, ${COLORS.jungleDark} 100%)`,
        }}
      />

      {/* Hex grid pattern */}
      <svg
        width={VIDEO.width}
        height={VIDEO.height}
        style={{ position: "absolute", opacity: 0.1, zIndex: 1 }}
      >
        {[...Array(10)].map((_, row) =>
          [...Array(7)].map((_, col) => {
            const cx = col * 160 + (row % 2) * 80;
            const cy = row * 185;
            const pulse = interpolate(Math.sin(frame * 0.015 + row + col), [-1, 1], [0.2, 0.8]);
            return (
              <polygon
                key={`${row}-${col}`}
                points={hexPoints(cx, cy, 45)}
                fill="none"
                stroke={COLORS.violetLight}
                strokeWidth="1"
                opacity={pulse * 0.4}
              />
            );
          })
        )}
      </svg>

      {/* Monkey - standing, celebrating */}
      <div
        style={{
          position: "absolute",
          top: VIDEO.height * 0.06,
          left: VIDEO.width * 0.5 - 160,
          zIndex: 20,
          opacity: interpolate(monkeyEntrance, [0, 1], [0, 1]),
          transform: `scale(${interpolate(monkeyEntrance, [0, 1], [0.4, 0.8])})`,
        }}
      >
        <RealisticMonkey mode="celebrating" scale={1} />
      </div>

      {/* KAO SOCIETY text */}
      <div
        style={{
          position: "absolute",
          top: VIDEO.height * 0.38,
          width: "100%",
          textAlign: "center",
          zIndex: 30,
        }}
      >
        {(() => {
          const titleEntrance = spring({
            frame: frame - 12,
            fps,
            config: { damping: 14, stiffness: 100 },
          });
          return (
            <div
              style={{
                opacity: interpolate(titleEntrance, [0, 1], [0, 1]),
                transform: `scale(${interpolate(titleEntrance, [0, 1], [0.7, 1])})`,
              }}
            >
              <div style={{
                fontFamily: "'Arial Black', sans-serif",
                fontSize: 95,
                fontWeight: 900,
                letterSpacing: "0.12em",
                color: COLORS.greenLight,
                textShadow: `0 0 50px ${COLORS.greenHex}80`,
              }}>
                KAO
              </div>
              <div style={{
                fontFamily: "'Arial Black', sans-serif",
                fontSize: 60,
                fontWeight: 900,
                letterSpacing: "0.25em",
                color: COLORS.offWhite,
                textShadow: `0 0 30px ${COLORS.violetGlow}`,
                marginTop: -5,
              }}>
                SOCIETY
              </div>
            </div>
          );
        })()}
      </div>

      {/* Feature cards */}
      <div
        style={{
          position: "absolute",
          top: VIDEO.height * 0.54,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          padding: "0 50px",
          zIndex: 30,
        }}
      >
        {features.map((feat, i) => {
          const cardEntrance = spring({
            frame: frame - 25 - i * 10,
            fps,
            config: { damping: 12, stiffness: 100 },
          });
          const cardX = interpolate(cardEntrance, [0, 1], [i % 2 === 0 ? -250 : 250, 0]);
          const cardOpacity = interpolate(cardEntrance, [0, 1], [0, 1]);

          return (
            <div
              key={feat.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "16px 35px",
                borderRadius: 18,
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${feat.color}30`,
                opacity: cardOpacity,
                transform: `translateX(${cardX}px)`,
                width: 520,
              }}
            >
              <span style={{ fontSize: 42 }}>{feat.icon}</span>
              <div>
                <div style={{
                  fontFamily: "'Arial Black', sans-serif",
                  fontSize: 30,
                  fontWeight: 900,
                  color: feat.color,
                  letterSpacing: "0.06em",
                }}>
                  {feat.text}
                </div>
                <div style={{
                  fontFamily: "'Helvetica Neue', sans-serif",
                  fontSize: 18,
                  color: COLORS.cream,
                  opacity: 0.7,
                  marginTop: 2,
                }}>
                  {feat.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Glow behind monkey */}
      <div
        style={{
          position: "absolute",
          top: VIDEO.height * 0.12,
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.violetGlow} 0%, transparent 65%)`,
          opacity: interpolate(Math.sin(frame * 0.03), [-1, 1], [0.15, 0.35]),
          filter: "blur(40px)",
          zIndex: 10,
        }}
      />

      <GrainOverlay intensity={0.025} />
    </AbsoluteFill>
  );
};

function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}
