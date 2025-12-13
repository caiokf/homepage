// =============================================================================
// RADAR CONSTANTS
// Centralized configuration for the Tech Radar visualization
// =============================================================================

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export type QuadrantPosition = "NE" | "NW" | "SE" | "SW";
export type RingName = (typeof RING_NAMES)[number];

// -----------------------------------------------------------------------------
// DATA SOURCE
// -----------------------------------------------------------------------------

export const RADAR_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1B-ojvUlqVMigLGGs8egpn-0YaVTDmqe1Vb6EL2ji-aM/edit?gid=0#gid=0";

export const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY as string | undefined;

/** Extract sheet ID from Google Sheets URL */
export function extractSheetId(url: string): string | null {
  const match = url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export const RADAR_SHEET_ID = extractSheetId(RADAR_SHEET_URL);

// -----------------------------------------------------------------------------
// RINGS
// -----------------------------------------------------------------------------

export const RING_NAMES = ["proven", "experimental", "learning", "avoid"] as const;

/**
 * Ring ratios for proportional spacing (0 = center, 1 = edge)
 * First ratio includes buffer to prevent blips from being cut off at center.
 * Buffer accounts for: quadrantsGap/2 (16px) + blipWidth (22px) + spacing margin
 */
export const RING_RATIOS = [0.11, 0.406, 0.652, 0.832, 1] as const;

// -----------------------------------------------------------------------------
// QUADRANTS
// -----------------------------------------------------------------------------

/**
 * Quadrant configuration with position, angle, and default name.
 * Position labels match visual location on screen (NW = top-left, etc.)
 */
export const QUADRANT_CONFIG: Record<
  QuadrantPosition,
  { startAngle: number; defaultName: string }
> = {
  NW: { startAngle: 0, defaultName: "Techniques" },
  SW: { startAngle: -90, defaultName: "Platforms" },
  NE: { startAngle: 90, defaultName: "Tools" },
  SE: { startAngle: -180, defaultName: "Languages & Frameworks" },
} as const;

/** Ordered list of quadrant positions for iteration (rendering order) */
export const QUADRANT_POSITIONS: QuadrantPosition[] = ["NE", "NW", "SW", "SE"];

/** Ordered list of quadrant positions for UI display (navigation order) */
export const QUADRANT_DISPLAY_ORDER: QuadrantPosition[] = ["NW", "NE", "SE", "SW"];

/**
 * Quadrant CSS custom property names.
 * Use getComputedStyle(document.documentElement).getPropertyValue('--quadrant-NE') to access
 */
export const QUADRANT_CSS_VARS: Record<QuadrantPosition, string> = {
  NE: "--quadrant-NE",
  NW: "--quadrant-NW",
  SW: "--quadrant-SW",
  SE: "--quadrant-SE",
} as const;

// -----------------------------------------------------------------------------
// GRAPH DIMENSIONS
// -----------------------------------------------------------------------------

/** Base quadrant size in pixels */
export const QUADRANT_SIZE = 512;

/** Gap between quadrants in pixels */
export const QUADRANTS_GAP = 32;

/** Effective quadrant size including half the gap */
export const EFFECTIVE_QUADRANT_SIZE = QUADRANT_SIZE + QUADRANTS_GAP / 2;

/** Total radar size (2 quadrants + gap) */
export const RADAR_SIZE = QUADRANT_SIZE * 2 + QUADRANTS_GAP;

/** @deprecated Use individual constants instead. Kept for backward compatibility. */
export const graphConfig = {
  quadrantSize: QUADRANT_SIZE,
  quadrantsGap: QUADRANTS_GAP,
  get effectiveQuadrantSize() {
    return EFFECTIVE_QUADRANT_SIZE;
  },
  get radarSize() {
    return RADAR_SIZE;
  },
};

// -----------------------------------------------------------------------------
// BLIP DIMENSIONS
// -----------------------------------------------------------------------------

/** Standard blip circle width in pixels */
export const BLIP_WIDTH = 22;

/** Minimum blip width in pixels */
export const BLIP_MIN_WIDTH = 12;

/** Blip group height in pixels */
export const BLIP_GROUP_HEIGHT = 24;

/** Width for "new" group blips */
export const BLIP_NEW_GROUP_WIDTH = 88;

/** Width for "existing" group blips */
export const BLIP_EXISTING_GROUP_WIDTH = 124;

/** @deprecated Use individual constants instead. Kept for backward compatibility. */
export const blipConfig = {
  idealWidth: BLIP_WIDTH,
  minWidth: BLIP_MIN_WIDTH,
  groupHeight: BLIP_GROUP_HEIGHT,
  newGroupWidth: BLIP_NEW_GROUP_WIDTH,
  existingGroupWidth: BLIP_EXISTING_GROUP_WIDTH,
};

// -----------------------------------------------------------------------------
// BLIP LAYOUT
// -----------------------------------------------------------------------------

/** Maximum blips per ring before grouping [ring0, ring1, ring2, ring3] */
export const MAX_BLIPS_PER_RING = [8, 22, 17, 18] as const;

/** Group blip angles per ring in degrees [ring0, ring1, ring2, ring3] */
export const GROUP_BLIP_ANGLES = [30, 35, 60, 80] as const;

// -----------------------------------------------------------------------------
// UI DIMENSIONS
// -----------------------------------------------------------------------------

/** Height of the sticky quadrant title header in pixels */
export const STICKY_HEADER_HEIGHT = 56;

export const uiConfig = {
  subnavHeight: 60,
  bannerHeight: 200,
  tabletBannerHeight: 300,
  headerHeight: 80,
  legendsHeight: 42,
  stickyHeaderHeight: STICKY_HEADER_HEIGHT,
} as const;

// -----------------------------------------------------------------------------
// RESPONSIVE BREAKPOINTS
// -----------------------------------------------------------------------------

/** Breakpoint for switching to mobile radar view */
export const MOBILE_BREAKPOINT = 1000;

export const breakpoints = {
  mobile: 768,
  tablet: 1280,
  desktop: 1800,
  wide: 2560,
  radarMobile: MOBILE_BREAKPOINT,
} as const;

// -----------------------------------------------------------------------------
// ANIMATION TIMING
// -----------------------------------------------------------------------------

/** Duration to wait for DOM transitions before scrolling (matches --transition-slow) */
export const TRANSITION_DURATION_MS = 300;

export const animationConfig = {
  transitionDuration: 1000,
  transitionSlow: TRANSITION_DURATION_MS,
  tooltipDelay: 100,
  scrollDelay: 1500,
} as const;
