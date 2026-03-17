import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS } from "../theme";

interface AnimatedTextProps {
  text: string;
  fontSize?: number;
  color?: string;
  delay?: number;
  style?: "bold" | "glow" | "stroke" | "cta";
  y?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  fontSize = 72,
  color = COLORS.white,
  delay = 0,
  style = "bold",
  y = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.8 },
  });

  const translateY = interpolate(entrance, [0, 1], [60, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scaleX = interpolate(entrance, [0, 1], [0.8, 1]);

  const baseStyle: React.CSSProperties = {
    fontFamily: FONTS.heading,
    fontSize,
    color,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    lineHeight: 1.1,
    textAlign: "center" as const,
    transform: `translateY(${translateY + y}px) scaleX(${scaleX})`,
    opacity,
    position: "relative" as const,
  };

  const styleVariants: Record<string, React.CSSProperties> = {
    bold: {
      fontWeight: 900,
      textShadow: `0 4px 20px rgba(0,0,0,0.5)`,
    },
    glow: {
      fontWeight: 900,
      textShadow: `0 0 30px ${COLORS.violetLight}, 0 0 60px ${COLORS.violetGlow}, 0 4px 20px rgba(0,0,0,0.5)`,
    },
    stroke: {
      fontWeight: 900,
      WebkitTextStroke: `2px ${color}`,
      color: "transparent",
      textShadow: `0 0 20px ${color}40`,
    },
    cta: {
      fontWeight: 700,
      fontSize: fontSize * 0.7,
      background: `linear-gradient(135deg, ${COLORS.greenHex}, ${COLORS.violetLight})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      padding: "10px 40px",
      border: `3px solid ${COLORS.white}40`,
      borderRadius: 50,
      display: "inline-block",
    },
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        padding: "0 40px",
      }}
    >
      <div style={{ ...baseStyle, ...styleVariants[style] }}>{text}</div>
    </div>
  );
};

// Per-word animated text
export const AnimatedWords: React.FC<
  Omit<AnimatedTextProps, "text"> & { words: string[] }
> = ({ words, fontSize = 72, color = COLORS.white, delay = 0, y = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 20px",
        padding: "0 40px",
        position: "relative",
      }}
    >
      {words.map((word, i) => {
        const wordDelay = delay + i * 5;
        const entrance = spring({
          frame: frame - wordDelay,
          fps,
          config: { damping: 12, stiffness: 120 },
        });
        const translateY = interpolate(entrance, [0, 1], [40, 0]);
        const opacity = interpolate(entrance, [0, 1], [0, 1]);

        return (
          <span
            key={i}
            style={{
              fontFamily: FONTS.heading,
              fontSize,
              color,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              transform: `translateY(${translateY + y}px)`,
              opacity,
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
              display: "inline-block",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
