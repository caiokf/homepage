import { RING_RATIOS, RING_NAMES } from "../config/radar-config";

export type RingLabel = {
  x: number;
  y: number;
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
   * Calculate ring label positions on separator lines.
   */
  static getLabelsOnSeparators(ringRadii: number[]): RingLabel[] {
    const labels: RingLabel[] = [];
    const angles = [0, 180]; // 0° = left, 180° = right

    for (const angle of angles) {
      const angleInRadians = ((angle - 90) * Math.PI) / 180;

      for (let i = 0; i < RING_NAMES.length; i++) {
        const radius = (ringRadii[i] + ringRadii[i + 1]) / 2;

        labels.push({
          x: radius * Math.sin(angleInRadians),
          y: -radius * Math.cos(angleInRadians),
          name: RING_NAMES[i],
        });
      }
    }

    return labels;
  }
}
