import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

type MonkeyState = "tired" | "awakening" | "energetic";

interface MonkeyMascotProps {
  state: MonkeyState;
  scale?: number;
  accessory?: "backpack" | "gamepad" | "apron" | "sunglasses" | null;
}

export const MonkeyMascot: React.FC<MonkeyMascotProps> = ({
  state,
  scale = 1,
  accessory = null,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Eye blink animation
  const blinkCycle = frame % 90; // Blink every 3 seconds
  const isBlinking = blinkCycle > 80 && blinkCycle < 88;
  const eyeOpenness = isBlinking
    ? interpolate(blinkCycle, [80, 84, 88], [1, 0, 1])
    : 1;

  // Tired state: slow droopy eyes
  const tiredDroop =
    state === "tired"
      ? interpolate(Math.sin(frame * 0.03), [-1, 1], [0.3, 0.6])
      : 0;

  // Yawn animation for tired state
  const yawnCycle = frame % 150;
  const isYawning = state === "tired" && yawnCycle > 100 && yawnCycle < 140;
  const yawnOpen = isYawning
    ? interpolate(yawnCycle, [100, 115, 130, 140], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Body sway
  const sway =
    state === "tired"
      ? Math.sin(frame * 0.02) * 3
      : state === "energetic"
        ? Math.sin(frame * 0.08) * 5
        : Math.sin(frame * 0.05) * 2;

  // Bounce for energetic state
  const bounce =
    state === "energetic"
      ? Math.abs(Math.sin(frame * 0.1)) *
        spring({ frame, fps, config: { damping: 8, stiffness: 80 } }) *
        15
      : 0;

  // Color based on state
  const bodyColor =
    state === "tired"
      ? COLORS.violetDark
      : state === "energetic"
        ? COLORS.violet
        : COLORS.violet;

  const branchColor =
    state === "energetic" ? COLORS.greenLight : COLORS.greenHex;

  // Final eye openness
  const finalEyeOpen = Math.max(0, eyeOpenness - tiredDroop);

  return (
    <div
      style={{
        transform: `scale(${scale}) translateX(${sway}px) translateY(${-bounce}px)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <svg
        width="400"
        height="450"
        viewBox="0 0 400 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Branch */}
        <path
          d="M50 120 Q100 100 200 115 Q300 100 350 120"
          stroke={branchColor}
          strokeWidth="22"
          strokeLinecap="round"
          fill="none"
        />

        {/* Body hanging from branch */}
        <g
          transform={`translate(200, 200) rotate(${sway * 0.5})`}
          style={{ transformOrigin: "center top" }}
        >
          {/* Arms reaching up to branch */}
          <path
            d="M-30 -60 Q-60 -90 -80 -85"
            stroke={bodyColor}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M30 -60 Q60 -90 80 -85"
            stroke={bodyColor}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />

          {/* Body */}
          <ellipse cx="0" cy="20" rx="55" ry="70" fill={bodyColor} />

          {/* Head */}
          <circle cx="0" cy="-45" r="50" fill={bodyColor} />

          {/* Spiky hair */}
          <path
            d="M-25 -85 L-20 -110 L-10 -90 L0 -115 L10 -88 L20 -108 L25 -85"
            fill={bodyColor}
          />
          <path
            d="M-35 -75 L-45 -95 M35 -75 L45 -95"
            stroke={bodyColor}
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Face */}
          <ellipse cx="0" cy="-35" rx="32" ry="28" fill={COLORS.offWhite} />

          {/* Eyes */}
          <g>
            {/* Left eye */}
            <ellipse
              cx="-12"
              cy="-42"
              rx="8"
              ry={8 * finalEyeOpen}
              fill={bodyColor}
            />
            {state === "tired" && (
              <line
                x1="-20"
                y1="-50"
                x2="-4"
                y2="-46"
                stroke={bodyColor}
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}
            {/* Right eye */}
            <ellipse
              cx="12"
              cy="-42"
              rx="8"
              ry={8 * finalEyeOpen}
              fill={bodyColor}
            />
            {state === "tired" && (
              <line
                x1="4"
                y1="-46"
                x2="20"
                y2="-50"
                stroke={bodyColor}
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}
            {/* Energetic sparkle eyes */}
            {state === "energetic" && (
              <>
                <circle cx="-9" cy="-44" r="2" fill={COLORS.white} />
                <circle cx="15" cy="-44" r="2" fill={COLORS.white} />
              </>
            )}
          </g>

          {/* Mouth */}
          {isYawning ? (
            <ellipse
              cx="0"
              cy="-22"
              rx={8 + yawnOpen * 6}
              ry={3 + yawnOpen * 10}
              fill={COLORS.violetDark}
            />
          ) : state === "energetic" ? (
            <path
              d="M-10 -22 Q0 -14 10 -22"
              stroke={bodyColor}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M-8 -24 Q0 -20 8 -24"
              stroke={bodyColor}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* Legs dangling */}
          <path
            d={`M-20 80 Q-25 ${120 + Math.sin(frame * 0.04) * 5} -30 140`}
            stroke={bodyColor}
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M20 80 Q25 ${120 + Math.cos(frame * 0.04) * 5} 30 140`}
            stroke={bodyColor}
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />

          {/* Tail */}
          <path
            d={`M30 60 Q70 ${80 + Math.sin(frame * 0.03) * 10} 60 ${130 + Math.sin(frame * 0.03) * 8} Q50 160 40 170`}
            stroke={bodyColor}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />

          {/* Accessories */}
          {accessory === "backpack" && (
            <rect
              x="-35"
              y="-10"
              width="25"
              height="35"
              rx="5"
              fill={COLORS.greenHex}
              stroke={COLORS.greenDark}
              strokeWidth="2"
              transform="translate(-15, 0)"
            />
          )}
          {accessory === "gamepad" && (
            <g transform="translate(-25, 100)">
              <rect
                x="0"
                y="0"
                width="50"
                height="30"
                rx="8"
                fill={COLORS.violetLight}
              />
              <circle cx="15" cy="15" r="5" fill={COLORS.white} />
              <circle cx="35" cy="15" r="5" fill={COLORS.white} />
            </g>
          )}
          {accessory === "apron" && (
            <path
              d="M-30 -5 L-35 60 L35 60 L30 -5"
              fill={COLORS.offWhite}
              opacity={0.8}
              stroke={COLORS.greenHex}
              strokeWidth="2"
            />
          )}
          {accessory === "sunglasses" && (
            <g>
              <rect
                x="-24"
                y="-50"
                width="20"
                height="14"
                rx="3"
                fill={COLORS.black}
                opacity={0.85}
              />
              <rect
                x="4"
                y="-50"
                width="20"
                height="14"
                rx="3"
                fill={COLORS.black}
                opacity={0.85}
              />
              <line
                x1="-4"
                y1="-44"
                x2="4"
                y2="-44"
                stroke={COLORS.black}
                strokeWidth="2"
              />
            </g>
          )}
        </g>

        {/* Glow effect for energetic state */}
        {state === "energetic" && (
          <circle
            cx="200"
            cy="200"
            r="120"
            fill="none"
            stroke={COLORS.violetLight}
            strokeWidth="2"
            opacity={interpolate(
              Math.sin(frame * 0.1),
              [-1, 1],
              [0.1, 0.35]
            )}
            filter="url(#glow)"
          />
        )}

        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};
