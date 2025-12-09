// Radar Configuration
// Configurable ring and quadrant names, dimensions, and colors

export const RADAR_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1B-ojvUlqVMigLGGs8egpn-0YaVTDmqe1Vb6EL2ji-aM/edit?gid=0#gid=0";

// Extract sheet ID from Google Sheets URL
export function extractSheetId(url: string): string | null {
  const match = url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export const RADAR_SHEET_ID = extractSheetId(RADAR_SHEET_URL);

// Google Sheets API key (for public sheets)
export const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY as string | undefined;

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
// Position labels match visual location on screen (NW = top-left, etc.)
export const QUADRANT_CONFIG: Record<
  QuadrantPosition,
  { startAngle: number; defaultName: string }
> = {
  NW: { startAngle: 0, defaultName: "Techniques" },
  SW: { startAngle: -90, defaultName: "Platforms" },
  NE: { startAngle: 90, defaultName: "Tools" },
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

// Quadrant colors - these reference CSS custom properties from style.css
// Use getComputedStyle(document.documentElement).getPropertyValue('--quadrant-NE') to access
export const QUADRANT_CSS_VARS: Record<QuadrantPosition, string> = {
  NE: "--quadrant-NE",
  NW: "--quadrant-NW",
  SW: "--quadrant-SW",
  SE: "--quadrant-SE",
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
