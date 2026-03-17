import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS, VIDEO } from "../theme";

interface JungleBackgroundProps {
  timeOfDay?: "night" | "dawn" | "day";
  intensity?: number;
}

export const JungleBackground: React.FC<JungleBackgroundProps> = ({
  timeOfDay = "night",
  intensity = 1,
}) => {
  const frame = useCurrentFrame();

  const bgColors = {
    night: {
      sky1: "#050810",
      sky2: "#0B1A12",
      sky3: "#0D1F15",
    },
    dawn: {
      sky1: "#1A0E2E",
      sky2: "#2D1845",
      sky3: "#1A3320",
    },
    day: {
      sky1: "#0E2818",
      sky2: "#1A3D25",
      sky3: "#2B5A30",
    },
  };

  const bg = bgColors[timeOfDay];

  // Parallax movement
  const parallax1 = Math.sin(frame * 0.005) * 10;
  const parallax2 = Math.sin(frame * 0.008) * 6;
  const parallax3 = Math.sin(frame * 0.003) * 15;

  // Moon glow pulse
  const moonGlow = interpolate(Math.sin(frame * 0.02), [-1, 1], [0.3, 0.6]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: VIDEO.width,
        height: VIDEO.height,
        overflow: "hidden",
      }}
    >
      {/* Sky gradient */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `linear-gradient(180deg, ${bg.sky1} 0%, ${bg.sky2} 50%, ${bg.sky3} 100%)`,
        }}
      />

      {/* Moon/light source (night & dawn) */}
      {(timeOfDay === "night" || timeOfDay === "dawn") && (
        <div
          style={{
            position: "absolute",
            top: "8%",
            right: "15%",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: timeOfDay === "night"
              ? `radial-gradient(circle, rgba(200, 210, 240, 0.8) 0%, rgba(200, 210, 240, 0.1) 50%, transparent 70%)`
              : `radial-gradient(circle, rgba(255, 180, 100, 0.6) 0%, rgba(255, 150, 50, 0.1) 50%, transparent 70%)`,
            filter: "blur(8px)",
            opacity: moonGlow,
          }}
        />
      )}

      {/* Stars (night only) */}
      {timeOfDay === "night" && (
        <svg
          width={VIDEO.width}
          height={VIDEO.height * 0.4}
          style={{ position: "absolute", top: 0 }}
        >
          {[...Array(30)].map((_, i) => {
            const cx = ((i * 137) % 1080);
            const cy = ((i * 73) % 600) + 20;
            const r = (i % 3) + 1;
            const twinkle = interpolate(
              Math.sin(frame * 0.03 + i * 2.3),
              [-1, 1],
              [0.1, 0.7]
            );
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill={COLORS.white}
                opacity={twinkle}
              />
            );
          })}
        </svg>
      )}

      {/* Far background trees (silhouette layer 1) */}
      <svg
        width={VIDEO.width + 100}
        height={VIDEO.height}
        style={{
          position: "absolute",
          top: 0,
          left: parallax3 - 50,
        }}
      >
        {/* Distant tree silhouettes */}
        {[0, 150, 300, 500, 700, 850, 1000].map((x, i) => {
          const h = 400 + (i % 3) * 120;
          const w = 80 + (i % 4) * 30;
          return (
            <g key={i}>
              {/* Trunk */}
              <rect
                x={x + w / 2 - 8}
                y={VIDEO.height * 0.3}
                width={16}
                height={h}
                fill={bg.sky3}
                opacity={0.4}
              />
              {/* Canopy */}
              <ellipse
                cx={x + w / 2}
                cy={VIDEO.height * 0.3}
                rx={w}
                ry={w * 0.8}
                fill={bg.sky3}
                opacity={0.3}
              />
            </g>
          );
        })}
      </svg>

      {/* Mid-ground foliage (layer 2) */}
      <svg
        width={VIDEO.width + 80}
        height={VIDEO.height}
        style={{
          position: "absolute",
          top: 0,
          left: parallax2 - 40,
        }}
      >
        {/* Hanging vines */}
        {[50, 200, 450, 750, 950].map((x, i) => {
          const vineLen = 200 + (i % 3) * 100;
          const vineSway = Math.sin(frame * 0.012 + i * 1.5) * 8;
          return (
            <path
              key={`vine-${i}`}
              d={`M${x} 0 Q${x + vineSway} ${vineLen * 0.5} ${x + vineSway * 1.5} ${vineLen}`}
              stroke={COLORS.jungleMid}
              strokeWidth={3 + (i % 2)}
              fill="none"
              opacity={0.5}
            />
          );
        })}

        {/* Large leaf clusters */}
        {[80, 350, 600, 900].map((x, i) => {
          const leafSway = Math.sin(frame * 0.01 + i * 2) * 3;
          return (
            <g key={`leaf-cluster-${i}`} transform={`translate(${leafSway}, 0)`}>
              {[...Array(5)].map((_, j) => {
                const angle = -30 + j * 15;
                const lx = x + (j - 2) * 20;
                const ly = 50 + (j % 3) * 30;
                return (
                  <ellipse
                    key={j}
                    cx={lx}
                    cy={ly}
                    rx={35}
                    ry={12}
                    fill={i % 2 === 0 ? COLORS.jungleMid : COLORS.jungleLight}
                    opacity={0.4}
                    transform={`rotate(${angle}, ${lx}, ${ly})`}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Ground fog / mist */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: parallax1,
          width: "120%",
          height: "30%",
          background: `linear-gradient(0deg, ${COLORS.jungleFog} 0%, transparent 100%)`,
          filter: "blur(20px)",
          opacity: interpolate(Math.sin(frame * 0.01), [-1, 1], [0.3, 0.6]),
        }}
      />

      {/* Foreground leaves (closest layer) */}
      <svg
        width={VIDEO.width}
        height={VIDEO.height}
        style={{
          position: "absolute",
          top: 0,
          left: parallax1,
        }}
      >
        {/* Big foreground leaf top-left */}
        <g transform={`rotate(${Math.sin(frame * 0.008) * 2}, 0, 0)`}>
          <path
            d="M-30 0 Q60 80 40 200 Q20 120 -30 0"
            fill={COLORS.jungleLight}
            opacity={0.25}
          />
        </g>
        {/* Big foreground leaf top-right */}
        <g transform={`translate(${VIDEO.width - 80}, 0) rotate(${Math.sin(frame * 0.01 + 1) * 3}, 40, 0)`}>
          <path
            d="M100 0 Q20 90 40 250 Q60 130 100 0"
            fill={COLORS.jungleMid}
            opacity={0.2}
          />
        </g>
        {/* Bottom left foliage */}
        <g transform={`translate(0, ${VIDEO.height - 300})`}>
          {[...Array(4)].map((_, i) => (
            <ellipse
              key={i}
              cx={30 + i * 25}
              cy={200 + (i % 2) * 40}
              rx={60}
              ry={25}
              fill={COLORS.jungleLight}
              opacity={0.3}
              transform={`rotate(${-20 + i * 10 + Math.sin(frame * 0.01 + i) * 2}, ${30 + i * 25}, ${200 + (i % 2) * 40})`}
            />
          ))}
        </g>
        {/* Bottom right foliage */}
        <g transform={`translate(${VIDEO.width - 200}, ${VIDEO.height - 250})`}>
          {[...Array(4)].map((_, i) => (
            <ellipse
              key={i}
              cx={100 + i * 25}
              cy={180 + (i % 2) * 30}
              rx={55}
              ry={22}
              fill={COLORS.jungleMid}
              opacity={0.3}
              transform={`rotate(${10 - i * 8 + Math.sin(frame * 0.012 + i) * 2}, ${100 + i * 25}, ${180 + (i % 2) * 30})`}
            />
          ))}
        </g>
      </svg>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
          zIndex: 2,
        }}
      />
    </div>
  );
};
