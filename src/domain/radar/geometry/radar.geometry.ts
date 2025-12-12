import type { QuadrantPosition } from "../config";

export type SeparatorLine = {
  angle: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

/**
 * Static geometry calculations for Radar rendering.
 */
export class RadarGeometry {
  /**
   * Calculate viewBox offset for zoomed quadrant view.
   * Position labels match visual location (NW = top-left, etc.)
   */
  static getZoomedViewBoxOffset(
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
  static getQuadrantLabelX(
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
  static getQuadrantLabelY(
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
  static getSeparatorLines(outerRadius: number): SeparatorLine[] {
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
}
