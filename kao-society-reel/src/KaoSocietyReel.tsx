import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { VIDEO, SCENES, COLORS } from "./theme";
import { IntroScene } from "./scenes/IntroScene";
import { AwakeningScene } from "./scenes/AwakeningScene";
import { OutdoorScene } from "./scenes/OutdoorScene";
import { IndoorScene } from "./scenes/IndoorScene";
import { CommunityScene } from "./scenes/CommunityScene";
import { OutroScene } from "./scenes/OutroScene";

// Transition overlay between scenes
const SceneTransition: React.FC<{
  type: "fade" | "slide" | "glitch";
  duration: number;
}> = ({ type, duration }) => {
  const frame = useCurrentFrame();

  if (type === "fade") {
    const opacity = interpolate(frame, [0, duration], [1, 0], {
      extrapolateRight: "clamp",
    });
    return (
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.black,
          opacity,
          zIndex: 200,
        }}
      />
    );
  }

  if (type === "slide") {
    const translateX = interpolate(frame, [0, duration], [0, -VIDEO.width], {
      extrapolateRight: "clamp",
    });
    return (
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, ${COLORS.greenHex}, ${COLORS.violet})`,
          transform: `translateX(${translateX}px)`,
          zIndex: 200,
        }}
      />
    );
  }

  // Glitch transition
  const progress = frame / duration;
  const opacity = interpolate(progress, [0, 0.5, 1], [1, 0.5, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ zIndex: 200 }}>
      {[...Array(8)].map((_, i) => {
        const sliceH = VIDEO.height / 8;
        const offset =
          Math.sin(frame * 10 + i * 3) *
          40 *
          interpolate(progress, [0, 0.5, 1], [1, 0.5, 0]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: i * sliceH,
              left: offset,
              width: VIDEO.width,
              height: sliceH,
              background:
                i % 2 === 0 ? COLORS.greenHex : COLORS.violet,
              opacity: opacity * 0.8,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const KaoSocietyReel: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.darkBg,
        width: VIDEO.width,
        height: VIDEO.height,
      }}
    >
      {/* Scene 1: Intro (0-3s, frames 0-90) */}
      <Sequence from={SCENES.intro.start} durationInFrames={90}>
        <IntroScene />
      </Sequence>

      {/* Transition: Glitch into Awakening */}
      <Sequence from={85} durationInFrames={10}>
        <SceneTransition type="glitch" duration={10} />
      </Sequence>

      {/* Scene 2: Awakening (3-6s, frames 90-180) */}
      <Sequence from={SCENES.awakening.start} durationInFrames={90}>
        <AwakeningScene />
      </Sequence>

      {/* Transition: Slide into Outdoor */}
      <Sequence from={175} durationInFrames={10}>
        <SceneTransition type="slide" duration={10} />
      </Sequence>

      {/* Scene 3: Outdoor (6-12s, frames 180-360) */}
      <Sequence from={SCENES.outdoor.start} durationInFrames={180}>
        <OutdoorScene />
      </Sequence>

      {/* Transition: Fade into Indoor */}
      <Sequence from={355} durationInFrames={10}>
        <SceneTransition type="fade" duration={10} />
      </Sequence>

      {/* Scene 4: Indoor (12-18s, frames 360-540) */}
      <Sequence from={SCENES.indoor.start} durationInFrames={180}>
        <IndoorScene />
      </Sequence>

      {/* Transition: Glitch into Community */}
      <Sequence from={535} durationInFrames={10}>
        <SceneTransition type="glitch" duration={10} />
      </Sequence>

      {/* Scene 5: Community (18-22s, frames 540-660) */}
      <Sequence from={SCENES.community.start} durationInFrames={120}>
        <CommunityScene />
      </Sequence>

      {/* Transition: Fade into Outro */}
      <Sequence from={655} durationInFrames={10}>
        <SceneTransition type="fade" duration={10} />
      </Sequence>

      {/* Scene 6: Outro (22-25s, frames 660-750) */}
      <Sequence from={SCENES.outro.start} durationInFrames={90}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
