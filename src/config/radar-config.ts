// Radar Configuration
// Configurable ring and quadrant names, dimensions, and colors

/**
/**
 * Adopt
 * Trial
 * Assess
 * Hold
 * 
 * -- Alternative meaning scheme:
 * Proven (things I am experienced with and comfortably use in production)
 * Experimental (used in smaller features or places with low risk/easy change)
 * Learning (currently exploring or skill-building)
 * Avoid (known not to suit our context)
 */
export const RING_NAMES = ["Adopt", "Trial", "Assess", "Hold"] as const;
export type RingName = (typeof RING_NAMES)[number];

/**
 * "Techniques",
 * "Platforms",
 * "Tools",
 * "Languages & Frameworks",
 *
 * -- Alternative:
 * Techniques:
 * Tools:
 * Tech Stack:
 * AI:
 */
export const QUADRANT_NAMES = [
  "Techniques",
  "Platforms",
  "Tools",
  "Languages & Frameworks",
] as const;
export type QuadrantName = (typeof QUADRANT_NAMES)[number];

// Quadrant positions using compass directions
export type QuadrantPosition = "NE" | "NW" | "SE" | "SW";

// Quadrant configuration with position, angle, and default name
export const QUADRANT_CONFIG: Record<
  QuadrantPosition,
  { startAngle: number; defaultName: string }
> = {
  NE: { startAngle: 0, defaultName: "Techniques" },
  NW: { startAngle: -90, defaultName: "Platforms" },
  SW: { startAngle: 90, defaultName: "Tools" },
  SE: { startAngle: -180, defaultName: "Languages & Frameworks" },
} as const;

// Ordered list of positions for iteration
export const QUADRANT_POSITIONS: QuadrantPosition[] = ["NE", "NW", "SW", "SE"];

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

// Quadrant colors by position
export const quadrantColors: Record<
  QuadrantPosition,
  { base: string; dark: string }
> = {
  NE: {
    base: "#47a1ad", // sapphire
    dark: "#1f8290",
  },
  NW: {
    base: "#cc850a", // turmeric
    dark: "#a06908",
  },
  SW: {
    base: "#6b9e78", // jade
    dark: "#517b5c",
  },
  SE: {
    base: "#e16a7c", // flamingo
    dark: "#9b293c",
  },
} as const;

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
