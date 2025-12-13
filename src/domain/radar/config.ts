// Re-export all constants for backward compatibility
// New code should import directly from ./constants or ./types
export type { QuadrantPosition, RingName, QuadrantAngle } from "./types";

export {
  // Data source
  RADAR_SHEET_ID,
  GOOGLE_API_KEY,

  // Rings
  RING_NAMES,
  RING_RATIOS,

  // Quadrants
  QUADRANT_ANGLES,
  QUADRANT_POSITIONS,
  QUADRANT_CSS_VARS,

  // Graph dimensions
  QUADRANT_SIZE,
  QUADRANTS_GAP,
  EFFECTIVE_QUADRANT_SIZE,
  RADAR_SIZE,
  graphConfig,

  // Blip dimensions
  BLIP_WIDTH,
  BLIP_MIN_WIDTH,
  BLIP_GROUP_HEIGHT,
  BLIP_NEW_GROUP_WIDTH,
  BLIP_EXISTING_GROUP_WIDTH,

  // Blip layout
  MAX_BLIPS_PER_RING,
  GROUP_BLIP_ANGLES,

  // UI dimensions
  STICKY_HEADER_HEIGHT,
  uiConfig,

  // Responsive breakpoints
  MOBILE_BREAKPOINT,
  breakpoints,

  // Animation timing
  TRANSITION_DURATION_MS,
  animationConfig,
} from "./constants";
