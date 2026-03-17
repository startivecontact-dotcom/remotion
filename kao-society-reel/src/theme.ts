// KAO SOCIETY - Brand Identity & Video Config

export const COLORS = {
  // Pantone 7491 C (Moss/Olive Green) - branch color
  green: "rgb(123, 141, 62)",
  greenHex: "#7B8D3E",
  greenDark: "#4A5525",
  greenLight: "#9BB44E",
  greenMuted: "#6B7A38",

  // Pantone 19-3737 TCX (Deep Violet) - monkey body
  violet: "#4F3872",
  violetDark: "#2D1F42",
  violetDeep: "#3A2555",
  violetLight: "#7B5BA8",
  violetGlow: "rgba(79, 56, 114, 0.6)",
  violetMuted: "#462E65",

  // Jungle palette
  jungleDark: "#0B1A0E",
  jungleMid: "#1A3320",
  jungleLight: "#2B4A2E",
  jungleMoss: "#3D5A30",
  jungleFog: "rgba(180, 210, 170, 0.08)",

  // Neutrals
  white: "#FFFFFF",
  offWhite: "#F0EDE5",
  cream: "#E8E0D0",
  black: "#0A0A0A",
  darkBg: "#0D0818",

  // Accents
  gold: "#D4A843",
  goldGlow: "rgba(212, 168, 67, 0.4)",
  firefly: "#E8D44D",
};

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInSeconds: 20,
  get durationInFrames() {
    return this.fps * this.durationInSeconds; // 600
  },
};

// Scene timings in frames (30fps)
export const SCENES = {
  intro: { start: 0, duration: 90 },         // 0-3s: Dark jungle, monkey sleeping
  wakeup: { start: 90, duration: 90 },       // 3-6s: Monkey wakes up
  swing: { start: 180, duration: 120 },      // 6-10s: Monkey swings, jungle alive
  showcase: { start: 300, duration: 120 },   // 10-14s: Brand showcase
  community: { start: 420, duration: 90 },   // 14-17s: Community
  outro: { start: 510, duration: 90 },       // 17-20s: Logo + CTA
};

export const FONTS = {
  heading: "'Arial Black', 'Impact', sans-serif",
  body: "'Helvetica Neue', 'Arial', sans-serif",
  mono: "'Courier New', monospace",
};
