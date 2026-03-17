import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  Audio,
  staticFile,
} from "remotion";
import { VIDEO, SCENES, COLORS } from "./theme";
import { IntroScene } from "./scenes/IntroScene";
import { WakeUpScene } from "./scenes/WakeUpScene";
import { SwingScene } from "./scenes/SwingScene";
import { ShowcaseScene } from "./scenes/ShowcaseScene";
import { CommunityScene } from "./scenes/CommunityScene";
import { OutroScene } from "./scenes/OutroScene";

// Smooth crossfade transition
const CrossFade: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, duration], [1, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.darkBg,
        opacity,
        zIndex: 200,
      }}
    />
  );
};

// Wipe transition with brand colors
const WipeTransition: React.FC<{ duration: number; color?: string }> = ({
  duration,
  color = COLORS.violetDark,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, duration], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ zIndex: 200, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${progress * 200}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${color} 0%, ${color} 40%, transparent 100%)`,
          transform: `translateX(${interpolate(progress, [0, 0.5, 1], [-100, 0, 100])}%)`,
        }}
      />
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
      {/*
        Audio track - place your audio file in public/audio/bgm.mp3
        Uncomment when you have an audio file:
      */}
      {/* <Audio src={staticFile("audio/bgm.mp3")} volume={0.7} /> */}

      {/* Scene 1: Intro - Monkey sleeping in dark jungle (0-3s) */}
      <Sequence from={SCENES.intro.start} durationInFrames={SCENES.intro.duration}>
        <IntroScene />
      </Sequence>

      {/* Transition 1→2 */}
      <Sequence from={SCENES.intro.duration - 8} durationInFrames={12}>
        <CrossFade duration={12} />
      </Sequence>

      {/* Scene 2: Wake Up - Dawn breaks, monkey wakes (3-6s) */}
      <Sequence from={SCENES.wakeup.start} durationInFrames={SCENES.wakeup.duration}>
        <WakeUpScene />
      </Sequence>

      {/* Transition 2→3 */}
      <Sequence from={SCENES.wakeup.start + SCENES.wakeup.duration - 8} durationInFrames={12}>
        <WipeTransition duration={12} color={COLORS.jungleDark} />
      </Sequence>

      {/* Scene 3: Swing - Monkey swings through jungle (6-10s) */}
      <Sequence from={SCENES.swing.start} durationInFrames={SCENES.swing.duration}>
        <SwingScene />
      </Sequence>

      {/* Transition 3→4 */}
      <Sequence from={SCENES.swing.start + SCENES.swing.duration - 8} durationInFrames={12}>
        <CrossFade duration={12} />
      </Sequence>

      {/* Scene 4: Showcase - Brand reveal (10-14s) */}
      <Sequence from={SCENES.showcase.start} durationInFrames={SCENES.showcase.duration}>
        <ShowcaseScene />
      </Sequence>

      {/* Transition 4→5 */}
      <Sequence from={SCENES.showcase.start + SCENES.showcase.duration - 8} durationInFrames={12}>
        <WipeTransition duration={12} color={COLORS.violetDark} />
      </Sequence>

      {/* Scene 5: Community (14-17s) */}
      <Sequence from={SCENES.community.start} durationInFrames={SCENES.community.duration}>
        <CommunityScene />
      </Sequence>

      {/* Transition 5→6 */}
      <Sequence from={SCENES.community.start + SCENES.community.duration - 8} durationInFrames={12}>
        <CrossFade duration={12} />
      </Sequence>

      {/* Scene 6: Outro - Logo + CTA (17-20s) */}
      <Sequence from={SCENES.outro.start} durationInFrames={SCENES.outro.duration}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
