import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, spring, useVideoConfig } from "remotion";
import { COLORS, VIDEO } from "../theme";
import { RealisticMonkey } from "../components/RealisticMonkey";
import { JungleBackground } from "../components/JungleBackground";
import { FallingLeaves } from "../components/FallingLeaves";
import { LightRays } from "../components/LightRays";
import { Fireflies } from "../components/Fireflies";
import { GrainOverlay } from "../effects/GrainOverlay";

export const SwingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Monkey walks across the screen
  const walkX = interpolate(frame, [0, 120], [-250, VIDEO.width + 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Background parallax scroll
  const bgScroll = interpolate(frame, [0, 120], [0, -300], { extrapolateRight: "clamp" });

  // Words appear one by one
  const words = [
    { text: "PLEIN AIR", color: COLORS.greenLight },
    { text: "INTÉRIEUR", color: COLORS.violetLight },
    { text: "GAMING", color: COLORS.gold },
    { text: "CUISINE", color: COLORS.greenHex },
  ];

  return (
    <AbsoluteFill>
      <div style={{ transform: `translateX(${bgScroll * 0.2}px)` }}>
        <JungleBackground timeOfDay="day" />
      </div>

      <LightRays direction="top-left" color="rgba(200, 255, 150, 0.06)" intensity={0.7} />
      <FallingLeaves count={18} speed={1.3} />
      <Fireflies count={5} color={COLORS.greenLight} />

      {/* Motion trail behind monkey */}
      {[...Array(5)].map((_, i) => {
        const trailX = walkX - (i + 1) * 60;
        const trailOpacity = interpolate(i, [0, 4], [0.15, 0.02]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: VIDEO.height * 0.38,
              left: trailX,
              zIndex: 18,
              opacity: trailOpacity,
              filter: `blur(${2 + i * 2}px)`,
            }}
          >
            <RealisticMonkey mode="walking" scale={0.85} />
          </div>
        );
      })}

      {/* Walking monkey */}
      <div
        style={{
          position: "absolute",
          top: VIDEO.height * 0.38,
          left: walkX,
          zIndex: 20,
        }}
      >
        <RealisticMonkey mode="walking" scale={0.85} direction={1} />
      </div>

      {/* Dust particles at feet */}
      {frame > 10 && [...Array(6)].map((_, i) => {
        const dustX = walkX + 200 - i * 30 - Math.random() * 10;
        const dustY = VIDEO.height * 0.38 + 420 - i * 8;
        const dustOpacity = interpolate(i, [0, 5], [0.3, 0]);
        return (
          <div
            key={`dust-${i}`}
            style={{
              position: "absolute",
              left: dustX + Math.sin(frame * 0.1 + i) * 5,
              top: dustY - frame * 0.3,
              width: 6 + i * 2,
              height: 6 + i * 2,
              borderRadius: "50%",
              backgroundColor: "rgba(180, 160, 120, 0.3)",
              filter: "blur(2px)",
              opacity: dustOpacity,
              zIndex: 19,
            }}
          />
        );
      })}

      {/* Activity words - big and cinematic */}
      <div
        style={{
          position: "absolute",
          bottom: VIDEO.height * 0.08,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          zIndex: 40,
        }}
      >
        {words.map((word, i) => {
          const wordDelay = 15 + i * 22;
          const entrance = spring({
            frame: frame - wordDelay,
            fps,
            config: { damping: 10, stiffness: 120 },
          });
          const exit = i < words.length - 1
            ? interpolate(frame, [wordDelay + 20, wordDelay + 28], [1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : 1;
          const isActive = frame >= wordDelay && frame < wordDelay + 25;

          return (
            <div
              key={word.text}
              style={{
                fontFamily: "'Arial Black', sans-serif",
                fontSize: isActive ? 68 : 48,
                fontWeight: 900,
                color: isActive ? word.color : COLORS.offWhite,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                opacity: interpolate(entrance, [0, 1], [0, 1]) * exit,
                transform: `translateX(${interpolate(entrance, [0, 1], [i % 2 === 0 ? -80 : 80, 0])}px) scale(${isActive ? 1 : 0.85})`,
                textShadow: isActive
                  ? `0 0 40px ${word.color}80, 0 0 80px ${word.color}30`
                  : "0 3px 10px rgba(0,0,0,0.5)",
                transition: "font-size 0.15s",
              }}
            >
              {word.text}
            </div>
          );
        })}
      </div>

      <GrainOverlay intensity={0.025} />
    </AbsoluteFill>
  );
};
