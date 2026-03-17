// KAO SOCIETY - Brand Identity
export const COLORS = {
  // Pantone 7491 C (Moss Green)
  green: "rgb(123, 141, 62)",
  greenHex: "#7B8D3E",
  greenDark: "#4A5525",
  greenLight: "#9BB44E",

  // Pantone 19-3737 TCX (Heliotrope)
  violet: "#4F3872",
  violetDark: "#2D1F42",
  violetLight: "#7B5BA8",
  violetGlow: "rgba(79, 56, 114, 0.6)",

  white: "#FFFFFF",
  offWhite: "#F0EDE5",
  black: "#0A0A0A",
  darkBg: "#1A1028",
};

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInSeconds: 25,
  get durationInFrames() {
    return this.fps * this.durationInSeconds; // 750
  },
};

// Scene timings in frames (30fps)
export const SCENES = {
  intro: { start: 0, end: 90 }, // 0-3s
  awakening: { start: 90, end: 180 }, // 3-6s
  outdoor: { start: 180, end: 360 }, // 6-12s
  indoor: { start: 360, end: 540 }, // 12-18s
  community: { start: 540, end: 660 }, // 18-22s
  outro: { start: 660, end: 750 }, // 22-25s
};

export const FONTS = {
  heading: "'Arial Black', 'Impact', sans-serif",
  body: "'Helvetica Neue', 'Arial', sans-serif",
};
