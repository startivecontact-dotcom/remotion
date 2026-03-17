import React from "react";
import { Composition } from "remotion";
import { KaoSocietyReel } from "./KaoSocietyReel";
import { VIDEO } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="KaoSocietyReel"
        component={KaoSocietyReel}
        durationInFrames={VIDEO.durationInFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
