// Re-export all constants for backward compatibility
// New code should import directly from ./constants
export {
  // Types
  type QuadrantPosition,
  type RingName,

  // Data source
  RADAR_SHEET_URL,
  RADAR_SHEET_ID,
  GOOGLE_API_KEY,
  extractSheetId,

  // Rings
  RING_NAMES,
  RING_RATIOS,

  // Quadrants
  QUADRANT_CONFIG,
  QUADRANT_POSITIONS,
  QUADRANT_DISPLAY_ORDER,
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
  blipConfig,

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
