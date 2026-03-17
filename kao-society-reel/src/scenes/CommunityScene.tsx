import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { COLORS, VIDEO } from "../theme";
import { AnimatedText } from "../components/AnimatedText";
import { GlowEffect } from "../effects/GlowEffect";
import { LightLeaks } from "../effects/LightLeaks";
import { GrainOverlay } from "../effects/GrainOverlay";

// Simple person silhouette
const PersonSilhouette: React.FC<{
  x: number;
  delay: number;
  color: string;
  scale?: number;
}> = ({ x, delay, color, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  const bounce = Math.sin((frame - delay) * 0.08) * 5;
  const wave = Math.sin((frame - delay) * 0.06 + x * 0.01) * 3;

  return (
    <g
      transform={`translate(${x}, 0) scale(${scale * entrance})`}
      opacity={entrance}
    >
      {/* Head */}
      <circle cy={-60 + bounce} cx={0} r={25} fill={color} />
      {/* Body */}
      <rect
        x={-18}
        y={-35 + bounce}
        width={36}
        height={70}
        rx={12}
        fill={color}
      />
      {/* Arms waving */}
      <line
        x1={-18}
        y1={-15 + bounce}
        x2={-35 + wave}
        y2={-40 + wave * 2}
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <line
        x1={18}
        y1={-15 + bounce}
        x2={35 - wave}
        y2={-35 - wave}
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
      />
      {/* Legs */}
      <line
        x1={-10}
        y1={35 + bounce}
        x2={-15}
        y2={75 + bounce}
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <line
        x1={10}
        y1={35 + bounce}
        x2={15}
        y2={75 + bounce}
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
      />
    </g>
  );
};

export const CommunityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Alternating green/violet background
  const colorShift = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0, 1]
  );

  const bgColor = `rgb(
    ${Math.round(interpolate(colorShift, [0, 1], [79, 123]))},
    ${Math.round(interpolate(colorShift, [0, 1], [56, 141]))},
    ${Math.round(interpolate(colorShift, [0, 1], [114, 62]))}
  )`;

  // Confetti particles
  const confetti = [...Array(20)].map((_, i) => {
    const startX = (i * 137) % VIDEO.width;
    const speed = 2 + (i % 3);
    const size = 6 + (i % 4) * 3;
    const y = ((frame * speed + i * 50) % (VIDEO.height + 100)) - 50;
    const x = startX + Math.sin(frame * 0.03 + i) * 30;
    const rotation = frame * (3 + i % 5);
    const isGreen = i % 2 === 0;

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size * 1.5,
          background: isGreen ? COLORS.greenHex : COLORS.violetLight,
          borderRadius: 2,
          transform: `rotate(${rotation}deg)`,
          opacity: 0.7,
          zIndex: 15,
        }}
      />
    );
  });

  // People arrangement
  const people = [
    { x: 180, delay: 5, color: COLORS.greenHex, scale: 0.9 },
    { x: 320, delay: 8, color: COLORS.violetLight, scale: 1 },
    { x: 460, delay: 3, color: COLORS.greenLight, scale: 0.95 },
    { x: 600, delay: 10, color: COLORS.violet, scale: 0.85 },
    { x: 740, delay: 6, color: COLORS.greenHex, scale: 1 },
    { x: 880, delay: 12, color: COLORS.violetLight, scale: 0.9 },
  ];

  return (
    <div
      style={{
        width: VIDEO.width,
        height: VIDEO.height,
        background: `radial-gradient(ellipse at 50% 50%, ${bgColor} 0%, ${COLORS.darkBg} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background stripes */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: `${i * 20 - 10 + Math.sin(frame * 0.03 + i) * 5}%`,
            width: "8%",
            height: "100%",
            background:
              i % 2 === 0
                ? `linear-gradient(180deg, ${COLORS.greenHex}15, transparent)`
                : `linear-gradient(180deg, ${COLORS.violetLight}15, transparent)`,
            transform: `skewX(${-10 + Math.sin(frame * 0.02 + i) * 5}deg)`,
            zIndex: 1,
          }}
        />
      ))}

      {/* Group of people */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          zIndex: 20,
        }}
      >
        <svg
          width={VIDEO.width}
          height="300"
          viewBox={`0 0 ${VIDEO.width} 200`}
        >
          {people.map((p, i) => (
            <PersonSilhouette key={i} {...p} />
          ))}
        </svg>
      </div>

      {/* Fun emoji/reaction bubbles */}
      {["😂", "🔥", "🎉", "💚", "💜"].map((emoji, i) => {
        const emojiEntrance = spring({
          frame: frame - 20 - i * 8,
          fps,
          config: { damping: 8, stiffness: 100 },
        });
        const floatY = Math.sin(frame * 0.04 + i * 2) * 10;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${25 + i * 8 + floatY}%`,
              left: `${15 + i * 17}%`,
              fontSize: 40 + i * 5,
              opacity: emojiEntrance * 0.8,
              transform: `scale(${emojiEntrance}) rotate(${Math.sin(frame * 0.03 + i) * 10}deg)`,
              zIndex: 25,
            }}
          >
            {emoji}
          </div>
        );
      })}

      {confetti}

      {/* Text */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          zIndex: 30,
          width: "100%",
        }}
      >
        <AnimatedText
          text="Join the Society"
          fontSize={72}
          color={COLORS.offWhite}
          delay={10}
          style="glow"
        />
      </div>

      <GlowEffect color={COLORS.violetLight} intensity={0.2} position="bottom" />
      <LightLeaks
        color1="rgba(123, 141, 62, 0.12)"
        color2="rgba(79, 56, 114, 0.12)"
        intensity={0.8}
      />
      <GrainOverlay intensity={0.04} />
    </div>
  );
};
