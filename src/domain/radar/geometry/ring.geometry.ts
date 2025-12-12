import { RING_RATIOS, RING_NAMES } from "../config";

export type RingLabel = {
  x: number;
  name: string;
};

/**
 * Static geometry calculations for Ring rendering.
 */
export class RingGeometry {
  /**
   * Calculate all ring radii based on max radius and ratios.
   * Returns array of radii from center (0) to outer edge.
   */
  static calculateRadii(
    maxRadius: number,
    ratios: readonly number[] = RING_RATIOS
  ): number[] {
    return ratios.map((ratio) => ratio * maxRadius);
  }

  /**
   * Get the radius for a specific ring index.
   */
  static getRadiusAtIndex(
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
  static getLabelsOnSeparators(ringRadii: number[]): RingLabel[] {
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
}
