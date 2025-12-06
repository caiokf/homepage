// Radar Configuration
// Configurable ring and quadrant names, dimensions, and colors

export const RING_NAMES = ["Adopt", "Trial", "Assess", "Hold"] as const;
export type RingName = (typeof RING_NAMES)[number];

export const QUADRANT_NAMES = [
  "Techniques",
  "Platforms",
  "Tools",
  "Languages & Frameworks",
] as const;
export type QuadrantName = (typeof QUADRANT_NAMES)[number];

// Graph dimensions
export const graphConfig = {
  quadrantSize: 512,
  quadrantsGap: 32,

  get effectiveQuadrantSize() {
    return this.quadrantSize + this.quadrantsGap / 2;
  },

  get radarSize() {
    return this.quadrantSize * 2 + this.quadrantsGap;
  },
};

// Blip dimensions
export const blipConfig = {
  idealWidth: 22,
  minWidth: 12,
  groupHeight: 24,
  newGroupWidth: 88,
  existingGroupWidth: 124,
};

// Ring ratios for proportional spacing (0 = center, 1 = edge)
export const RING_RATIOS = [0, 0.316, 0.652, 0.832, 1] as const;

// Max blips per ring before grouping
export const MAX_BLIPS_PER_RING = [8, 22, 17, 18] as const;

// Group blip angles per ring
export const GROUP_BLIP_ANGLES = [30, 35, 60, 80] as const;

// Quadrant colors
export const quadrantColors = {
  first: {
    base: "#47a1ad", // sapphire
    dark: "#1f8290",
  },
  second: {
    base: "#cc850a", // turmeric
    dark: "#a06908",
  },
  third: {
    base: "#6b9e78", // jade
    dark: "#517b5c",
  },
  fourth: {
    base: "#e16a7c", // flamingo
    dark: "#9b293c",
  },
} as const;

export type QuadrantOrder = keyof typeof quadrantColors;

// Ring fill colors (grayscale from center outward)
export const ringColors = {
  adopt: "#bababa",
  trial: "#cacaca",
  assess: "#dadada",
  hold: "#eeeeee",
} as const;

// UI colors
export const uiColors = {
  wave: "#163c4d", // deep blue for tooltips, buttons
  mist: "#edf1f3", // light gray for backgrounds
  white: "#ffffff",
  black: "#000000",
} as const;

// Quadrant angles (starting angle for each quadrant)
export const quadrantAngles = {
  first: 0,
  second: -90,
  third: 90,
  fourth: -180,
} as const;

// Animation timing
export const animationConfig = {
  transitionDuration: 1000, // ms
  tooltipDelay: 100,
  scrollDelay: 1500,
} as const;

// UI dimensions
export const uiConfig = {
  subnavHeight: 60,
  bannerHeight: 200,
  tabletBannerHeight: 300,
  headerHeight: 80,
  legendsHeight: 42,
} as const;

// Responsive breakpoints
export const breakpoints = {
  mobile: 768,
  tablet: 1280,
  desktop: 1800,
  wide: 2560,
} as const;
