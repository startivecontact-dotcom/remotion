import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS } from "../theme";

type MonkeyState = "sleeping" | "waking" | "active" | "swinging";

interface MonkeyMascotProps {
  state: MonkeyState;
  scale?: number;
  x?: number;
  y?: number;
  rotation?: number;
}

export const MonkeyMascot: React.FC<MonkeyMascotProps> = ({
  state,
  scale = 1,
  x = 0,
  y = 0,
  rotation = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === ANIMATIONS ===

  // Breathing - subtle body scale
  const breatheSpeed = state === "sleeping" ? 0.025 : 0.04;
  const breatheAmount = state === "sleeping" ? 0.008 : 0.005;
  const breathe = 1 + Math.sin(frame * breatheSpeed) * breatheAmount;

  // Body sway (hanging motion)
  const swaySpeed = state === "sleeping" ? 0.015 : state === "swinging" ? 0.08 : 0.03;
  const swayAmount = state === "sleeping" ? 2 : state === "swinging" ? 12 : 4;
  const sway = Math.sin(frame * swaySpeed) * swayAmount;

  // Eye animation
  const blinkCycle = frame % 120;
  const isBlinking = state !== "sleeping" && blinkCycle > 105 && blinkCycle < 115;
  const eyeOpen = state === "sleeping"
    ? 0
    : state === "waking"
      ? interpolate(frame, [0, 30, 45], [0, 0.3, 1], { extrapolateRight: "clamp" })
      : isBlinking
        ? interpolate(blinkCycle, [105, 110, 115], [1, 0, 1])
        : 1;

  // Tail wag
  const tailWag = state === "active" || state === "swinging"
    ? Math.sin(frame * 0.06) * 15
    : Math.sin(frame * 0.02) * 5;

  // Arm dangle
  const armDangle = Math.sin(frame * 0.025) * 3;

  // Leg dangle (opposite phase)
  const legDangleL = Math.sin(frame * 0.03) * 4;
  const legDangleR = Math.sin(frame * 0.03 + 1.5) * 4;

  // Head bob for active state
  const headBob = state === "active" || state === "swinging"
    ? Math.sin(frame * 0.05) * 2
    : 0;

  // Wake up stretch
  const stretchY = state === "waking"
    ? interpolate(frame, [20, 40, 60], [0, -8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Yawn for waking
  const yawnCycle = state === "waking" ? frame : 0;
  const isYawning = state === "waking" && frame > 30 && frame < 60;
  const yawnOpen = isYawning
    ? interpolate(frame, [30, 42, 52, 60], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  const bodyColor = COLORS.violetDeep;
  const bodyDark = COLORS.violetDark;
  const branchColor = COLORS.greenHex;
  const branchDark = COLORS.greenDark;
  const faceColor = COLORS.offWhite;

  return (
    <div
      style={{
        transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotation}deg)`,
        position: "relative",
        width: 500,
        height: 550,
      }}
    >
      <svg
        width="500"
        height="550"
        viewBox="0 0 500 550"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="monkeyShadow">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.4" />
          </filter>
          <filter id="branchShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.3" />
          </filter>
          <linearGradient id="branchGrad" x1="0" y1="0" x2="1" y2="0.3">
            <stop offset="0%" stopColor={branchColor} />
            <stop offset="50%" stopColor={COLORS.greenLight} />
            <stop offset="100%" stopColor={branchDark} />
          </linearGradient>
          <radialGradient id="bodyGrad" cx="0.4" cy="0.3" r="0.7">
            <stop offset="0%" stopColor={COLORS.violetMuted} />
            <stop offset="100%" stopColor={bodyColor} />
          </radialGradient>
        </defs>

        {/* === BRANCH === */}
        <g filter="url(#branchShadow)">
          {/* Main branch - thick, going across */}
          <path
            d="M0 170 Q80 145 160 158 Q250 168 340 155 Q420 148 500 165"
            stroke="url(#branchGrad)"
            strokeWidth="28"
            strokeLinecap="round"
            fill="none"
          />
          {/* Branch texture lines */}
          <path
            d="M30 168 Q120 148 200 158"
            stroke={branchDark}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M280 157 Q360 150 450 162"
            stroke={branchDark}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.3"
          />
          {/* Small branch stub on left */}
          <path
            d="M60 160 Q40 135 25 120"
            stroke={branchColor}
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
          {/* Small branch stub on right */}
          <path
            d="M430 158 Q450 140 470 125"
            stroke={branchColor}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* === MONKEY BODY (draped over branch) === */}
        <g
          filter="url(#monkeyShadow)"
          transform={`translate(${sway}, ${stretchY})`}
          style={{ transformOrigin: "250px 160px" }}
        >
          {/* Back body mass (on top of branch) */}
          <ellipse
            cx="270"
            cy="155"
            rx="75"
            ry="50"
            fill="url(#bodyGrad)"
            transform={`scale(1, ${breathe})`}
            style={{ transformOrigin: "270px 155px" }}
          />

          {/* Belly/underside visible below branch */}
          <ellipse
            cx="260"
            cy="200"
            rx="45"
            ry="35"
            fill={bodyColor}
          />

          {/* === HEAD (hanging down on left side) === */}
          <g transform={`translate(0, ${headBob})`}>
            {/* Neck */}
            <path
              d="M200 170 Q185 190 180 210"
              stroke={bodyColor}
              strokeWidth="30"
              strokeLinecap="round"
              fill="none"
            />

            {/* Head shape */}
            <circle cx="175" cy="235" r="52" fill={bodyColor} />

            {/* Spiky messy hair on top */}
            <path
              d="M140 195 L132 170 L148 188 L145 162 L158 182 L162 155 L172 178 L178 152 L185 175 L192 158 L198 180 L208 168 L210 192"
              fill={bodyColor}
            />
            {/* Extra spikes */}
            <path
              d="M128 205 L115 185 M215 200 L225 178"
              stroke={bodyColor}
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Face area (lighter) */}
            <ellipse cx="175" cy="242" rx="34" ry="30" fill={faceColor} />

            {/* Eyes */}
            {state === "sleeping" ? (
              <>
                {/* Closed eyes - curved lines */}
                <path
                  d="M155 235 Q160 240 168 235"
                  stroke={bodyColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M182 235 Q187 240 195 235"
                  stroke={bodyColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            ) : (
              <>
                {/* Open eyes */}
                <ellipse
                  cx="162"
                  cy="235"
                  rx="7"
                  ry={7 * eyeOpen}
                  fill={bodyColor}
                />
                <ellipse
                  cx="188"
                  cy="235"
                  rx="7"
                  ry={7 * eyeOpen}
                  fill={bodyColor}
                />
                {/* Eye shine */}
                {eyeOpen > 0.5 && (
                  <>
                    <circle cx="164" cy="233" r="2" fill={COLORS.white} opacity={eyeOpen} />
                    <circle cx="190" cy="233" r="2" fill={COLORS.white} opacity={eyeOpen} />
                  </>
                )}
              </>
            )}

            {/* Nose */}
            <ellipse cx="175" cy="248" rx="5" ry="3.5" fill={bodyDark} opacity="0.7" />

            {/* Mouth */}
            {isYawning ? (
              <ellipse
                cx="175"
                cy="258"
                rx={6 + yawnOpen * 5}
                ry={2 + yawnOpen * 8}
                fill={bodyDark}
              />
            ) : state === "active" || state === "swinging" ? (
              <path
                d="M165 256 Q175 264 185 256"
                stroke={bodyColor}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M168 257 Q175 260 182 257"
                stroke={bodyColor}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            )}

            {/* Ears */}
            <ellipse cx="130" cy="225" rx="12" ry="15" fill={bodyColor} />
            <ellipse cx="130" cy="225" rx="7" ry="9" fill={COLORS.violetMuted} />
            <ellipse cx="220" cy="225" rx="12" ry="15" fill={bodyColor} />
            <ellipse cx="220" cy="225" rx="7" ry="9" fill={COLORS.violetMuted} />
          </g>

          {/* === LEFT ARM (hanging down) === */}
          <path
            d={`M195 185 Q175 ${250 + armDangle} 165 ${310 + armDangle} Q160 ${330 + armDangle} 155 ${340 + armDangle}`}
            stroke={bodyColor}
            strokeWidth="18"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left hand */}
          <g transform={`translate(152, ${338 + armDangle})`}>
            <circle cx="0" cy="0" r="12" fill={bodyColor} />
            <path d="M-6 5 Q-8 14 -5 18" stroke={bodyColor} strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M0 8 Q0 16 2 20" stroke={bodyColor} strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M6 5 Q8 14 5 18" stroke={bodyColor} strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>

          {/* === RIGHT ARM (draped forward over branch) === */}
          <path
            d={`M310 165 Q340 180 355 ${220 + armDangle * 0.5} Q360 ${260 + armDangle * 0.5} 358 ${290 + armDangle * 0.5}`}
            stroke={bodyColor}
            strokeWidth="18"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right hand */}
          <g transform={`translate(356, ${288 + armDangle * 0.5})`}>
            <circle cx="0" cy="0" r="12" fill={bodyColor} />
            <path d="M-5 5 Q-7 13 -4 17" stroke={bodyColor} strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M1 7 Q1 15 3 19" stroke={bodyColor} strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M7 5 Q9 13 6 17" stroke={bodyColor} strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>

          {/* === LEFT LEG (hanging down) === */}
          <path
            d={`M230 210 Q215 ${280 + legDangleL} 210 ${340 + legDangleL} Q208 ${370 + legDangleL} 205 ${390 + legDangleL}`}
            stroke={bodyColor}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left foot */}
          <ellipse
            cx="203"
            cy={395 + legDangleL}
            rx="14"
            ry="8"
            fill={bodyColor}
            transform={`rotate(-10, 203, ${395 + legDangleL})`}
          />

          {/* === RIGHT LEG (hanging down) === */}
          <path
            d={`M290 205 Q300 ${275 + legDangleR} 305 ${335 + legDangleR} Q308 ${365 + legDangleR} 310 ${385 + legDangleR}`}
            stroke={bodyColor}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right foot */}
          <ellipse
            cx="312"
            cy={390 + legDangleR}
            rx="14"
            ry="8"
            fill={bodyColor}
            transform={`rotate(10, 312, ${390 + legDangleR})`}
          />

          {/* === TAIL (curling down from back) === */}
          <path
            d={`M320 175 Q${360 + tailWag} 200 ${370 + tailWag} 260 Q${365 + tailWag * 0.8} 320 ${340 + tailWag * 0.6} 370 Q${320 + tailWag * 0.4} 400 ${300 + tailWag * 0.3} 420 Q${285 + tailWag * 0.2} 440 ${295 + tailWag * 0.1} 450`}
            stroke={bodyColor}
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />

          {/* Sleeping Z's */}
          {state === "sleeping" && (
            <g opacity={interpolate(Math.sin(frame * 0.04), [-1, 1], [0.3, 0.8])}>
              <text
                x={135 + Math.sin(frame * 0.02) * 3}
                y={200 + Math.sin(frame * 0.015) * 5}
                fill={COLORS.white}
                fontSize="24"
                fontFamily="Arial Black"
                opacity="0.5"
              >
                z
              </text>
              <text
                x={120 + Math.sin(frame * 0.02 + 1) * 4}
                y={180 + Math.sin(frame * 0.015 + 1) * 5}
                fill={COLORS.white}
                fontSize="32"
                fontFamily="Arial Black"
                opacity="0.4"
              >
                Z
              </text>
              <text
                x={100 + Math.sin(frame * 0.02 + 2) * 5}
                y={155 + Math.sin(frame * 0.015 + 2) * 5}
                fill={COLORS.white}
                fontSize="42"
                fontFamily="Arial Black"
                opacity="0.3"
              >
                Z
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
