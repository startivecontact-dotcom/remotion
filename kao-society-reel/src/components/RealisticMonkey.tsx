import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

interface RealisticMonkeyProps {
  mode: "sleeping" | "waking" | "walking" | "standing" | "celebrating";
  scale?: number;
  direction?: 1 | -1; // 1 = right, -1 = left
}

export const RealisticMonkey: React.FC<RealisticMonkeyProps> = ({
  mode,
  scale = 1,
  direction = 1,
}) => {
  const frame = useCurrentFrame();

  // === WALK CYCLE (realistic 24-frame cycle) ===
  const walkSpeed = 0.12;
  const walkPhase = (frame * walkSpeed) % (Math.PI * 2);
  const isWalking = mode === "walking";
  const isCelebrating = mode === "celebrating";

  // Body vertical bob during walk (goes down at mid-stride)
  const bodyBob = isWalking ? Math.abs(Math.sin(walkPhase)) * -8 : 0;
  const bodyLean = isWalking ? Math.sin(walkPhase) * 2 : 0;

  // Leg angles for walk cycle
  const leftHipAngle = isWalking ? Math.sin(walkPhase) * 35 : 0;
  const rightHipAngle = isWalking ? Math.sin(walkPhase + Math.PI) * 35 : 0;
  const leftKneeAngle = isWalking
    ? interpolate(Math.sin(walkPhase - 0.5), [-1, 1], [0, 45])
    : 0;
  const rightKneeAngle = isWalking
    ? interpolate(Math.sin(walkPhase + Math.PI - 0.5), [-1, 1], [0, 45])
    : 0;

  // Arm swing (opposite to legs)
  const leftArmAngle = isWalking ? Math.sin(walkPhase + Math.PI) * 30 : isCelebrating ? -140 + Math.sin(frame * 0.15) * 15 : 10;
  const rightArmAngle = isWalking ? Math.sin(walkPhase) * 30 : isCelebrating ? -130 + Math.sin(frame * 0.15 + 1) * 15 : -10;
  const leftElbowAngle = isWalking
    ? interpolate(Math.sin(walkPhase + Math.PI - 0.3), [-1, 1], [20, 50])
    : isCelebrating ? 30 + Math.sin(frame * 0.2) * 10 : 25;
  const rightElbowAngle = isWalking
    ? interpolate(Math.sin(walkPhase - 0.3), [-1, 1], [20, 50])
    : isCelebrating ? 30 + Math.sin(frame * 0.2 + 1) * 10 : 25;

  // Tail sway
  const tailSway = isWalking
    ? Math.sin(walkPhase * 2) * 12
    : Math.sin(frame * 0.03) * 6;

  // Head bob
  const headBob = isWalking ? Math.sin(walkPhase * 2) * 3 : 0;
  const headTilt = isWalking ? Math.sin(walkPhase) * 3 : 0;

  // Breathing
  const breathe = mode === "sleeping"
    ? Math.sin(frame * 0.04) * 3
    : Math.sin(frame * 0.06) * 1.5;

  // Eye blink
  const blinkCycle = frame % 100;
  const isBlinking = blinkCycle > 90 && blinkCycle < 97;
  const eyeScale = mode === "sleeping" ? 0 :
    mode === "waking" ? interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" }) :
    isBlinking ? interpolate(blinkCycle, [90, 93, 97], [1, 0.1, 1]) : 1;

  // Sleeping Z's
  const showZs = mode === "sleeping";

  // Waking stretch
  const stretchArms = mode === "waking"
    ? interpolate(frame, [10, 30, 50], [0, -90, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Colors
  const furDark = "#3A2555";
  const furMain = "#4F3872";
  const furLight = "#6B4A8E";
  const furHighlight = "#8B6AAE";
  const skinTone = "#E8D5C0";
  const skinDark = "#C4A882";
  const noseMouth = "#2D1F42";

  return (
    <div
      style={{
        transform: `scale(${scale * direction}, ${scale})`,
        width: 400,
        height: 500,
        position: "relative",
      }}
    >
      <svg
        width="400"
        height="500"
        viewBox="0 0 400 500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Fur texture gradient */}
          <radialGradient id="furGrad" cx="0.4" cy="0.3" r="0.8">
            <stop offset="0%" stopColor={furLight} />
            <stop offset="60%" stopColor={furMain} />
            <stop offset="100%" stopColor={furDark} />
          </radialGradient>
          {/* Shadow */}
          <filter id="shadow">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
          </filter>
          {/* Soft shadow under body */}
          <filter id="groundShadow">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          {/* Inner glow for depth */}
          <filter id="innerDepth">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
            <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
            <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
          </filter>
          {/* Face skin gradient */}
          <radialGradient id="skinGrad" cx="0.45" cy="0.4" r="0.6">
            <stop offset="0%" stopColor={skinTone} />
            <stop offset="100%" stopColor={skinDark} />
          </radialGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse
          cx="200"
          cy="475"
          rx={isWalking ? 70 : 50}
          ry="12"
          fill="rgba(0,0,0,0.25)"
          filter="url(#groundShadow)"
        />

        {/* === BODY GROUP (with bob and lean) === */}
        <g
          transform={`translate(200, ${240 + bodyBob}) rotate(${bodyLean})`}
          style={{ transformOrigin: "0px 0px" }}
          filter="url(#shadow)"
        >
          {/* === TAIL === */}
          <path
            d={`M15 50 Q${50 + tailSway} 80 ${45 + tailSway} 130 Q${40 + tailSway * 0.7} 170 ${50 + tailSway * 0.5} 195 Q${55 + tailSway * 0.3} 210 ${45 + tailSway * 0.2} 218`}
            stroke={furMain}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          {/* Tail highlight */}
          <path
            d={`M15 50 Q${48 + tailSway} 78 ${43 + tailSway} 125`}
            stroke={furLight}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          />

          {/* === LEFT LEG (behind) === */}
          <g transform={`rotate(${leftHipAngle}, -18, 65)`}>
            {/* Thigh */}
            <path
              d="M-18 65 Q-22 105 -20 130"
              stroke={furDark}
              strokeWidth="26"
              strokeLinecap="round"
              fill="none"
            />
            {/* Shin */}
            <g transform={`rotate(${leftKneeAngle}, -20, 130)`}>
              <path
                d="M-20 130 Q-18 165 -15 190"
                stroke={furDark}
                strokeWidth="22"
                strokeLinecap="round"
                fill="none"
              />
              {/* Foot */}
              <ellipse cx="-12" cy="195" rx="18" ry="9" fill={furDark} />
            </g>
          </g>

          {/* === LEFT ARM (behind) === */}
          <g transform={`rotate(${leftArmAngle + stretchArms}, -30, -35)`}>
            {/* Upper arm */}
            <path
              d="M-30 -35 Q-45 0 -48 25"
              stroke={furDark}
              strokeWidth="22"
              strokeLinecap="round"
              fill="none"
            />
            {/* Forearm */}
            <g transform={`rotate(${leftElbowAngle}, -48, 25)`}>
              <path
                d="M-48 25 Q-50 50 -46 70"
                stroke={furDark}
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />
              {/* Hand */}
              <circle cx="-45" cy="73" r="10" fill={skinDark} />
            </g>
          </g>

          {/* === TORSO === */}
          {/* Main body */}
          <ellipse
            cx="0"
            cy="20"
            rx="48"
            ry={58 + breathe}
            fill="url(#furGrad)"
          />
          {/* Chest lighter area */}
          <ellipse
            cx="-3"
            cy="15"
            rx="28"
            ry="38"
            fill={furLight}
            opacity="0.35"
          />
          {/* Belly */}
          <ellipse
            cx="0"
            cy="35"
            rx="22"
            ry="20"
            fill={furHighlight}
            opacity="0.2"
          />

          {/* === RIGHT LEG (front) === */}
          <g transform={`rotate(${rightHipAngle}, 18, 65)`}>
            {/* Thigh */}
            <path
              d="M18 65 Q22 105 20 130"
              stroke={furMain}
              strokeWidth="28"
              strokeLinecap="round"
              fill="none"
            />
            {/* Thigh highlight */}
            <path
              d="M14 70 Q16 100 15 120"
              stroke={furLight}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              opacity="0.3"
            />
            {/* Shin */}
            <g transform={`rotate(${rightKneeAngle}, 20, 130)`}>
              <path
                d="M20 130 Q18 165 15 190"
                stroke={furMain}
                strokeWidth="24"
                strokeLinecap="round"
                fill="none"
              />
              {/* Foot */}
              <ellipse cx="12" cy="195" rx="20" ry="10" fill={furMain} />
              <ellipse cx="12" cy="194" rx="14" ry="5" fill={furDark} opacity="0.3" />
            </g>
          </g>

          {/* === RIGHT ARM (front) === */}
          <g transform={`rotate(${rightArmAngle + stretchArms}, 30, -35)`}>
            {/* Upper arm */}
            <path
              d="M30 -35 Q45 0 48 25"
              stroke={furMain}
              strokeWidth="24"
              strokeLinecap="round"
              fill="none"
            />
            {/* Arm highlight */}
            <path
              d="M28 -30 Q40 -5 42 15"
              stroke={furLight}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              opacity="0.3"
            />
            {/* Forearm */}
            <g transform={`rotate(${rightElbowAngle}, 48, 25)`}>
              <path
                d="M48 25 Q50 50 46 70"
                stroke={furMain}
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
              />
              {/* Hand */}
              <circle cx="45" cy="73" r="11" fill={skinTone} />
              {/* Fingers hint */}
              <path
                d="M40 78 Q38 85 40 88 M45 80 Q45 88 46 90 M50 78 Q52 85 50 88"
                stroke={skinDark}
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.4"
              />
            </g>
          </g>

          {/* === HEAD === */}
          <g transform={`translate(0, ${-80 + headBob}) rotate(${headTilt})`}>
            {/* Head main shape */}
            <ellipse cx="0" cy="0" rx="48" ry="44" fill={furMain} />

            {/* Fur texture on top */}
            <ellipse cx="0" cy="-15" rx="42" ry="30" fill={furLight} opacity="0.25" />

            {/* Spiky hair / messy fur on top */}
            <path
              d="M-28 -32 L-32 -58 L-20 -42 L-15 -62 L-5 -45 L0 -68 L8 -46 L15 -60 L22 -40 L30 -55 L28 -32"
              fill={furDark}
            />
            <path
              d="M-25 -35 L-28 -52 L-18 -40 L-12 -55 L-3 -42 L2 -60 L10 -43 L17 -54 L24 -38"
              fill={furMain}
              opacity="0.6"
            />
            {/* Side fur tufts */}
            <path
              d="M-42 -10 L-56 -22 L-48 -5 M42 -10 L56 -22 L48 -5"
              fill={furMain}
            />

            {/* Ears */}
            <g>
              {/* Left ear */}
              <ellipse cx="-42" cy="-8" rx="16" ry="20" fill={furMain} />
              <ellipse cx="-42" cy="-8" rx="10" ry="14" fill={skinDark} opacity="0.5" />
              <ellipse cx="-42" cy="-6" rx="6" ry="9" fill="#D4A882" opacity="0.4" />
              {/* Right ear */}
              <ellipse cx="42" cy="-8" rx="16" ry="20" fill={furMain} />
              <ellipse cx="42" cy="-8" rx="10" ry="14" fill={skinDark} opacity="0.5" />
              <ellipse cx="42" cy="-6" rx="6" ry="9" fill="#D4A882" opacity="0.4" />
            </g>

            {/* Face area */}
            <ellipse cx="0" cy="8" rx="32" ry="30" fill="url(#skinGrad)" />

            {/* Brow ridge */}
            <path
              d="M-22 -6 Q-12 -12 0 -10 Q12 -12 22 -6"
              stroke={furMain}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              opacity="0.4"
            />

            {/* Eyes */}
            <g>
              {/* Left eye socket */}
              <ellipse cx="-12" cy="0" rx="10" ry={9 * eyeScale} fill="white" />
              {eyeScale > 0.2 && (
                <>
                  <ellipse cx="-11" cy="0" rx="6" ry={6 * eyeScale} fill="#2A1A0A" />
                  <circle cx="-9" cy="-2" r={2.5 * eyeScale} fill="white" />
                  <circle cx="-13" cy="2" r={1 * eyeScale} fill="white" opacity="0.5" />
                </>
              )}
              {/* Right eye socket */}
              <ellipse cx="12" cy="0" rx="10" ry={9 * eyeScale} fill="white" />
              {eyeScale > 0.2 && (
                <>
                  <ellipse cx="13" cy="0" rx="6" ry={6 * eyeScale} fill="#2A1A0A" />
                  <circle cx="15" cy="-2" r={2.5 * eyeScale} fill="white" />
                  <circle cx="11" cy="2" r={1 * eyeScale} fill="white" opacity="0.5" />
                </>
              )}
              {/* Closed eyes for sleeping */}
              {mode === "sleeping" && (
                <>
                  <path d="M-20 0 Q-12 5 -4 0" stroke={noseMouth} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M4 0 Q12 5 20 0" stroke={noseMouth} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </>
              )}
            </g>

            {/* Nose */}
            <ellipse cx="0" cy="12" rx="8" ry="6" fill={noseMouth} opacity="0.8" />
            <ellipse cx="-3" cy="11" rx="2.5" ry="3" fill={furDark} opacity="0.6" />
            <ellipse cx="3" cy="11" rx="2.5" ry="3" fill={furDark} opacity="0.6" />
            {/* Nose highlight */}
            <ellipse cx="-1" cy="10" rx="2" ry="1.5" fill="rgba(255,255,255,0.15)" />

            {/* Mouth */}
            {mode === "celebrating" ? (
              <>
                <path d="M-12 20 Q0 30 12 20" stroke={noseMouth} strokeWidth="2.5" fill={noseMouth} opacity="0.7" />
                <path d="M-8 20 Q0 24 8 20" fill="white" opacity="0.8" />
              </>
            ) : mode === "sleeping" ? (
              <path d="M-6 22 Q0 25 6 22" stroke={noseMouth} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
            ) : (
              <path d="M-8 20 Q0 26 8 20" stroke={noseMouth} strokeWidth="2" fill="none" strokeLinecap="round" />
            )}

            {/* Cheek fur tufts */}
            <path d="M-30 15 Q-35 20 -32 25" stroke={furLight} strokeWidth="3" fill="none" opacity="0.3" />
            <path d="M30 15 Q35 20 32 25" stroke={furLight} strokeWidth="3" fill="none" opacity="0.3" />
          </g>

          {/* Sleeping Z's */}
          {showZs && (
            <g>
              <text
                x={60 + Math.sin(frame * 0.02) * 3}
                y={-100 + Math.sin(frame * 0.015) * 5}
                fill={COLORS.offWhite}
                fontSize="28"
                fontFamily="Arial Black"
                fontWeight="bold"
                opacity={interpolate(Math.sin(frame * 0.05), [-1, 1], [0.2, 0.7])}
              >
                z
              </text>
              <text
                x={80 + Math.sin(frame * 0.02 + 1) * 4}
                y={-125 + Math.sin(frame * 0.015 + 1) * 5}
                fill={COLORS.offWhite}
                fontSize="36"
                fontFamily="Arial Black"
                fontWeight="bold"
                opacity={interpolate(Math.sin(frame * 0.05 + 1) , [-1, 1], [0.15, 0.5])}
              >
                Z
              </text>
              <text
                x={100 + Math.sin(frame * 0.02 + 2) * 5}
                y={-155 + Math.sin(frame * 0.015 + 2) * 5}
                fill={COLORS.offWhite}
                fontSize="46"
                fontFamily="Arial Black"
                fontWeight="bold"
                opacity={interpolate(Math.sin(frame * 0.05 + 2), [-1, 1], [0.1, 0.35])}
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
