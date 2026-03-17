import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { COLORS, VIDEO, FONTS } from "../theme";
import { MonkeyMascot } from "../components/MonkeyMascot";
import { AnimatedWords } from "../components/AnimatedText";
import { GlowEffect } from "../effects/GlowEffect";
import { LightLeaks } from "../effects/LightLeaks";
import { GrainOverlay } from "../effects/GrainOverlay";

export const OutdoorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dynamic zoom effect
  const zoom = interpolate(frame, [0, 180], [1, 1.15], {
    extrapolateRight: "clamp",
  });

  // Subtle camera shake
  const shakeX = Math.sin(frame * 0.15) * 2;
  const shakeY = Math.cos(frame * 0.12) * 1.5;

  // Scene sub-sections: hiking, trekking, nature
  const section = frame < 60 ? 0 : frame < 120 ? 1 : 2;

  // Cut transitions
  const cutFlash = (cutFrame: number) => {
    const diff = frame - cutFrame;
    if (diff < 0 || diff > 6) return 0;
    return interpolate(diff, [0, 2, 6], [0.6, 0.3, 0], {
      extrapolateRight: "clamp",
    });
  };

  // Mountain/nature background elements
  const mountainColor1 = COLORS.greenDark;
  const mountainColor2 = COLORS.greenHex;

  return (
    <div
      style={{
        width: VIDEO.width,
        height: VIDEO.height,
        background: `linear-gradient(180deg, #2A3A15 0%, ${COLORS.greenDark} 40%, ${COLORS.greenHex} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        position: "relative",
        overflow: "hidden",
        transform: `scale(${zoom}) translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Sky gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "45%",
          background:
            "linear-gradient(180deg, #1A2A10 0%, #3A5525 50%, transparent 100%)",
          zIndex: 1,
        }}
      />

      {/* Mountains - layered */}
      <svg
        style={{ position: "absolute", bottom: "30%", zIndex: 2 }}
        width={VIDEO.width}
        height="800"
        viewBox={`0 0 ${VIDEO.width} 800`}
      >
        {/* Far mountains */}
        <path
          d={`M0 500 L200 200 L400 350 L600 150 L800 300 L${VIDEO.width} 400 L${VIDEO.width} 800 L0 800 Z`}
          fill={mountainColor1}
          opacity={0.6}
        />
        {/* Near mountains */}
        <path
          d={`M0 600 L150 350 L350 500 L540 250 L700 400 L900 300 L${VIDEO.width} 500 L${VIDEO.width} 800 L0 800 Z`}
          fill={mountainColor2}
          opacity={0.8}
        />
        {/* Trees silhouette */}
        {[...Array(15)].map((_, i) => {
          const x = 50 + i * 75;
          const h = 80 + Math.sin(i * 2.3) * 40;
          const sway = Math.sin(frame * 0.02 + i) * 3;
          return (
            <g key={i} transform={`translate(${x + sway}, ${600 - h})`}>
              <polygon
                points={`0,${h} ${20},-10 ${40},${h}`}
                fill={COLORS.greenDark}
                opacity={0.9}
              />
              <polygon
                points={`5,${h * 0.6} ${20},-30 ${35},${h * 0.6}`}
                fill={mountainColor1}
                opacity={0.7}
              />
            </g>
          );
        })}
      </svg>

      {/* Ground / trail */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "35%",
          background: `linear-gradient(180deg, ${COLORS.greenDark} 0%, #2A1F15 100%)`,
          zIndex: 3,
        }}
      />

      {/* Trail path */}
      <svg
        style={{ position: "absolute", bottom: 0, zIndex: 4 }}
        width={VIDEO.width}
        height="600"
        viewBox={`0 0 ${VIDEO.width} 600`}
      >
        <path
          d={`M${VIDEO.width / 2 - 30} 600 Q${VIDEO.width / 2 - 80} 400 ${VIDEO.width / 2 - 150} 200 Q${VIDEO.width / 2 - 200} 50 ${VIDEO.width / 2 - 250} 0`}
          stroke="#8B7355"
          strokeWidth="50"
          fill="none"
          opacity={0.4}
        />
        <path
          d={`M${VIDEO.width / 2 + 30} 600 Q${VIDEO.width / 2 + 20} 400 ${VIDEO.width / 2 - 50} 200 Q${VIDEO.width / 2 - 100} 50 ${VIDEO.width / 2 - 150} 0`}
          stroke="#8B7355"
          strokeWidth="40"
          fill="none"
          opacity={0.3}
        />
      </svg>

      {/* Monkey with backpack */}
      <div
        style={{
          position: "absolute",
          bottom: "25%",
          zIndex: 20,
          transform: `translateY(${Math.sin(frame * 0.08) * 5}px)`,
        }}
      >
        <MonkeyMascot state="energetic" scale={0.9} accessory="backpack" />
      </div>

      {/* Text overlay */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          zIndex: 30,
          width: "100%",
        }}
      >
        <AnimatedWords
          words={["Explore.", "Move.", "Breathe."]}
          fontSize={76}
          color={COLORS.offWhite}
          delay={15}
        />
      </div>

      {/* Motion blur edges */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          boxShadow: `inset 0 0 150px 50px rgba(0,0,0,0.4)`,
          zIndex: 25,
          pointerEvents: "none",
        }}
      />

      {/* Cut flash transitions */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: COLORS.greenHex,
          opacity: cutFlash(60) + cutFlash(120),
          zIndex: 50,
          pointerEvents: "none",
        }}
      />

      <GlowEffect color={COLORS.greenHex} intensity={0.15} position="top" />
      <LightLeaks intensity={0.6} />
      <GrainOverlay intensity={0.04} />
    </div>
  );
};
