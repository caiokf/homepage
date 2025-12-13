import type { QuadrantPosition } from "../types";
import { RING_RATIOS, RING_NAMES } from "../constants";

// =============================================================================
// TYPES
// =============================================================================

export type SeparatorLine = {
  angle: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type RingLabel = {
  x: number;
  name: string;
};

// =============================================================================
// RADAR LAYOUT
// Static geometry calculations for Radar rendering.
// =============================================================================

/**
 * Calculate viewBox offset for zoomed quadrant view.
 * Position labels match visual location (NW = top-left, etc.)
 */
export function getZoomedViewBoxOffset(
  position: QuadrantPosition,
  radarSize: number
): { x: number; y: number } {
  const center = radarSize / 2;
  switch (position) {
    case "NW": // top-left
      return { x: 0, y: 0 };
    case "NE": // top-right
      return { x: center, y: 0 };
    case "SW": // bottom-left
      return { x: 0, y: center };
    case "SE": // bottom-right
      return { x: center, y: center };
  }
}

/**
 * Calculate X position for quadrant label.
 * Position labels match visual location (NW = top-left, etc.)
 */
export function getQuadrantLabelX(
  position: QuadrantPosition,
  outerRadius: number
): number {
  const offset = 30;

  switch (position) {
    case "NW": // top-left quadrant (label on left side)
      return -outerRadius + offset;
    case "SW": // bottom-left quadrant (label on left side)
      return -outerRadius + offset;
    case "NE": // top-right quadrant (label on right side)
      return outerRadius - offset - 150;
    case "SE": // bottom-right quadrant (label on right side)
      return outerRadius - offset - 150;
  }
}

/**
 * Calculate Y position for quadrant label.
 * Position labels match visual location (NW = top-left, etc.)
 */
export function getQuadrantLabelY(
  position: QuadrantPosition,
  outerRadius: number
): number {
  const offset = 30;

  switch (position) {
    case "NW": // top-left quadrant
      return -outerRadius + offset;
    case "SW": // bottom-left quadrant
      return outerRadius - 2 * offset;
    case "NE": // top-right quadrant
      return -outerRadius + offset;
    case "SE": // bottom-right quadrant
      return outerRadius - 2 * offset;
  }
}

/**
 * Calculate separator lines between quadrants.
 */
export function getSeparatorLines(outerRadius: number): SeparatorLine[] {
  const boundaryAngles = [0, 90, -90, 180];

  return boundaryAngles.map((angle) => {
    const angleInRadians = ((angle - 90) * Math.PI) / 180;

    return {
      angle,
      x1: 0,
      y1: 0,
      x2: outerRadius * Math.sin(angleInRadians),
      y2: -outerRadius * Math.cos(angleInRadians),
    };
  });
}

// =============================================================================
// RING LAYOUT
// Static geometry calculations for Ring rendering.
// =============================================================================

/**
 * Calculate all ring radii based on max radius and ratios.
 * Returns array of radii from center (0) to outer edge.
 */
export function calculateRingRadii(
  maxRadius: number,
  ratios: readonly number[] = RING_RATIOS
): number[] {
  return ratios.map((ratio) => ratio * maxRadius);
}

/**
 * Get the radius for a specific ring index.
 */
export function getRingRadiusAtIndex(
  ringIndex: number,
  maxRadius: number,
  ratios: readonly number[] = RING_RATIOS
): number {
  if (ringIndex < 0 || ringIndex >= ratios.length) {
    return 0;
  }
  return ratios[ringIndex] * maxRadius;
}

/**
 * Calculate ring label positions on horizontal separator line.
 * Labels are placed at the midpoint of each ring, on both left and right sides.
 */
export function getRingLabelsOnSeparators(ringRadii: number[]): RingLabel[] {
  const labels: RingLabel[] = [];

  for (let i = 0; i < RING_NAMES.length; i++) {
    const radius = (ringRadii[i] + ringRadii[i + 1]) / 2;

    // Left side (negative x)
    labels.push({ x: -radius, name: RING_NAMES[i] });

    // Right side (positive x)
    labels.push({ x: radius, name: RING_NAMES[i] });
  }

  return labels;
}

// =============================================================================
// LEGACY CLASS EXPORTS (for backwards compatibility during migration)
// =============================================================================

/**
 * @deprecated Use standalone functions instead
 */
export class RadarGeometry {
  static getZoomedViewBoxOffset = getZoomedViewBoxOffset;
  static getQuadrantLabelX = getQuadrantLabelX;
  static getQuadrantLabelY = getQuadrantLabelY;
  static getSeparatorLines = getSeparatorLines;
}

/**
 * @deprecated Use standalone functions instead
 */
export class RingGeometry {
  static calculateRadii = calculateRingRadii;
  static getRadiusAtIndex = getRingRadiusAtIndex;
  static getLabelsOnSeparators = getRingLabelsOnSeparators;
}
