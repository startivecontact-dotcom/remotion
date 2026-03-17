import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, spring, useVideoConfig } from "remotion";
import { COLORS, VIDEO } from "../theme";
import { MonkeyMascot } from "../components/MonkeyMascot";
import { JungleBackground } from "../components/JungleBackground";
import { FallingLeaves } from "../components/FallingLeaves";
import { LightRays } from "../components/LightRays";
import { Fireflies } from "../components/Fireflies";
import { GrainOverlay } from "../effects/GrainOverlay";

export const SwingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Monkey swings across screen
  const swingX = interpolate(frame, [0, 40, 80, 120], [-200, 100, 300, 540], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const swingY = interpolate(frame, [0, 30, 60, 90, 120], [400, 300, 350, 280, 350], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const swingRotation = interpolate(frame, [0, 30, 60, 90, 120], [-15, 5, -10, 8, -5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const swingScale = interpolate(frame, [0, 60, 120], [0.8, 1.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Background scrolls
  const bgScroll = interpolate(frame, [0, 120], [0, -200], { extrapolateRight: "clamp" });

  // Words appear one by one
  const words = ["OUTDOOR", "INDOOR", "GAMING", "COOKING"];
  const wordDelay = 25;

  return (
    <AbsoluteFill>
      <div style={{ transform: `translateX(${bgScroll * 0.3}px)` }}>
        <JungleBackground timeOfDay="day" />
      </div>

      <LightRays direction="top-left" color="rgba(200, 255, 150, 0.06)" intensity={0.8} />
      <FallingLeaves count={15} speed={1.2} />
      <Fireflies count={6} color={COLORS.greenLight} />

      {/* Speed lines / motion blur effect */}
      {frame < 100 && (
        <svg
          width={VIDEO.width}
          height={VIDEO.height}
          style={{ position: "absolute", zIndex: 12, opacity: 0.15 }}
        >
          {[...Array(8)].map((_, i) => {
            const y = 300 + i * 150;
            const len = 200 + Math.sin(frame * 0.1 + i) * 100;
            return (
              <line
                key={i}
                x1={swingX + 250 + 100}
                y1={y}
                x2={swingX + 250 + 100 + len}
                y2={y + Math.sin(i) * 20}
                stroke={COLORS.greenLight}
                strokeWidth="2"
                opacity={interpolate(frame, [0, 30, 90, 120], [0, 0.5, 0.5, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}
              />
            );
          })}
        </svg>
      )}

      {/* Monkey swinging */}
      <div
        style={{
          position: "absolute",
          left: swingX,
          top: swingY,
          zIndex: 20,
          transform: `scale(${swingScale})`,
        }}
      >
        <MonkeyMascot state="swinging" scale={0.9} rotation={swingRotation} />
      </div>

      {/* Activity words appearing */}
      <div
        style={{
          position: "absolute",
          bottom: VIDEO.height * 0.12,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          zIndex: 40,
        }}
      >
        {words.map((word, i) => {
          const entrance = spring({
            frame: frame - 20 - i * wordDelay,
            fps,
            config: { damping: 10, stiffness: 120 },
          });
          const wordOpacity = interpolate(entrance, [0, 1], [0, 1]);
          const wordX = interpolate(entrance, [0, 1], [i % 2 === 0 ? -100 : 100, 0]);
          const isHighlighted = i === Math.floor((frame - 20) / wordDelay) % words.length;

          return (
            <div
              key={word}
              style={{
                fontFamily: "'Arial Black', sans-serif",
                fontSize: isHighlighted ? 64 : 48,
                fontWeight: 900,
                color: isHighlighted ? COLORS.greenLight : COLORS.offWhite,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                opacity: wordOpacity,
                transform: `translateX(${wordX}px)`,
                textShadow: isHighlighted
                  ? `0 0 30px ${COLORS.greenHex}80, 0 0 60px ${COLORS.greenHex}40`
                  : "0 3px 10px rgba(0,0,0,0.5)",
                transition: "font-size 0.3s, color 0.3s",
              }}
            >
              {word}
            </div>
          );
        })}
      </div>

      <GrainOverlay intensity={0.03} />
    </AbsoluteFill>
  );
};
