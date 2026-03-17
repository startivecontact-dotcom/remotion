import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, spring, useVideoConfig } from "remotion";
import { COLORS, VIDEO } from "../theme";
import { MonkeyMascot } from "../components/MonkeyMascot";
import { JungleBackground } from "../components/JungleBackground";
import { Fireflies } from "../components/Fireflies";
import { LightRays } from "../components/LightRays";
import { GrainOverlay } from "../effects/GrainOverlay";

export const WakeUpScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Transition from night to dawn
  const dawnProgress = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: "clamp" });

  // Light rays appear
  const raysOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" });

  // Shake/vibrate as monkey wakes
  const shake = frame > 15 && frame < 35
    ? Math.sin(frame * 2) * interpolate(frame, [15, 25, 35], [0, 3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Flash when fully awake
  const flash = frame > 55 && frame < 70
    ? interpolate(frame, [55, 60, 70], [0, 0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Text animation
  const textEntrance = spring({
    frame: frame - 50,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const textY = interpolate(textEntrance, [0, 1], [60, 0]);
  const textOpacity = interpolate(textEntrance, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ transform: `translateX(${shake}px)` }}>
      {/* Night background fading */}
      <div style={{ opacity: 1 - dawnProgress }}>
        <JungleBackground timeOfDay="night" />
      </div>
      {/* Dawn background appearing */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: dawnProgress }}>
        <JungleBackground timeOfDay="dawn" />
      </div>

      <div style={{ opacity: raysOpacity }}>
        <LightRays direction="top-right" intensity={dawnProgress * 1.5} />
      </div>

      <Fireflies count={8} color={COLORS.gold} />

      {/* Monkey waking up */}
      <div
        style={{
          position: "absolute",
          top: VIDEO.height * 0.25,
          left: VIDEO.width * 0.5 - 250,
          zIndex: 20,
        }}
      >
        <MonkeyMascot state="waking" scale={1.1} />
      </div>

      {/* Energy burst behind monkey */}
      {frame > 50 && (
        <div
          style={{
            position: "absolute",
            top: VIDEO.height * 0.35,
            left: VIDEO.width * 0.5,
            transform: "translate(-50%, -50%)",
            width: interpolate(frame, [50, 80], [0, 600], { extrapolateRight: "clamp" }),
            height: interpolate(frame, [50, 80], [0, 600], { extrapolateRight: "clamp" }),
            borderRadius: "50%",
            background: `radial-gradient(circle, ${COLORS.goldGlow} 0%, transparent 70%)`,
            opacity: interpolate(frame, [50, 65, 80], [0, 0.5, 0.15], { extrapolateRight: "clamp" }),
            zIndex: 15,
          }}
        />
      )}

      {/* Text */}
      <div
        style={{
          position: "absolute",
          bottom: VIDEO.height * 0.2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          zIndex: 40,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "'Arial Black', sans-serif",
            fontSize: 68,
            fontWeight: 900,
            color: COLORS.gold,
            textTransform: "uppercase",
            textAlign: "center",
            letterSpacing: "0.06em",
            textShadow: `0 0 30px ${COLORS.goldGlow}, 0 4px 15px rgba(0,0,0,0.5)`,
          }}
        >
          Wake up.
        </div>
        <div
          style={{
            fontFamily: "'Arial Black', sans-serif",
            fontSize: 52,
            fontWeight: 900,
            color: COLORS.offWhite,
            textTransform: "uppercase",
            textAlign: "center",
            letterSpacing: "0.05em",
            textShadow: "0 3px 15px rgba(0,0,0,0.5)",
          }}
        >
          Level up.
        </div>
      </div>

      {/* Flash overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.gold,
          opacity: flash,
          zIndex: 100,
          mixBlendMode: "overlay",
        }}
      />

      <GrainOverlay intensity={0.03} />
    </AbsoluteFill>
  );
};
