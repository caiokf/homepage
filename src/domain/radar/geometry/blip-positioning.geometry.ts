import type { Blip } from "../models/blip";
import type { PositionedBlip, QuadrantGeometryConfig } from "../types";
import { SeededRandom } from "../utils/seeded-random";

type BlipCoordinate = {
  x: number;
  y: number;
  width: number;
};

/**
 * Static geometry calculations for blip positioning within quadrants.
 */
export class BlipPositioning {
  /**
   * Calculate positioned blips with collision detection for rendering.
   * Uses seeded random for reproducible positions.
   */
  static calculateBlipPositions(blips: Blip[], geometry: QuadrantGeometryConfig): PositionedBlip[] {
    const { startAngle, quadrantSize, ringRadii, center } = geometry;
    const positioned: PositionedBlip[] = [];
    const allCoordinates: BlipCoordinate[] = [];

    // Create seeded random for reproducibility
    const seed = Math.PI * quadrantSize * quadrantSize * ringRadii.length * 200;
    const random = new SeededRandom(seed);

    // Group blips by ring
    const blipsByRing = this.groupBlipsByRing(blips);

    // Position blips ring by ring
    for (const [ringIndex, ringBlips] of blipsByRing.entries()) {
      const minRadius = ringRadii[ringIndex];
      const maxRadius = ringRadii[ringIndex + 1];

      for (const blip of ringBlips) {
        const coords = this.findBlipPosition(
          blip.width,
          minRadius,
          maxRadius,
          startAngle,
          center,
          allCoordinates,
          random
        );

        allCoordinates.push({ x: coords.x, y: coords.y, width: blip.width });

        positioned.push({
          id: blip.id,
          name: blip.name,
          x: coords.x,
          y: coords.y,
          width: blip.width,
          ringIndex,
          isNew: blip.isNew,
          status: blip.status as PositionedBlip["status"],
          description: blip.description,
          blipText: blip.blipText,
          isGroup: blip.isGroup,
        });
      }
    }

    return positioned;
  }

  private static groupBlipsByRing(blips: Blip[]): Map<number, Blip[]> {
    const groups = new Map<number, Blip[]>();
    for (const blip of blips) {
      const ringIndex = blip.ring.order;
      if (!groups.has(ringIndex)) {
        groups.set(ringIndex, []);
      }
      groups.get(ringIndex)!.push(blip);
    }
    return groups;
  }

  private static findBlipPosition(
    blipWidth: number,
    minRadius: number,
    maxRadius: number,
    startAngle: number,
    center: { x: number; y: number },
    allCoordinates: BlipCoordinate[],
    random: SeededRandom
  ): { x: number; y: number } {
    const maxIterations = 200;
    let coords = { x: 0, y: 0 };

    for (let i = 0; i < maxIterations; i++) {
      coords = this.calculateBlipCoordinates(
        blipWidth,
        minRadius,
        maxRadius,
        startAngle,
        center,
        random
      );

      if (!this.hasCollision(coords.x, coords.y, blipWidth, allCoordinates)) {
        break;
      }
    }

    return coords;
  }

  private static calculateBlipCoordinates(
    blipWidth: number,
    minRadius: number,
    maxRadius: number,
    startAngleDegrees: number,
    center: { x: number; y: number },
    random: SeededRandom
  ): { x: number; y: number } {
    // Random radius within ring bounds, accounting for blip size
    // Blip indicators extend 18px from center (36px diameter), so use 18 instead of blipWidth/2
    const blipRadius = 18;
    const radius = random.float(minRadius + blipRadius, maxRadius - blipWidth);

    // Calculate angle delta to prevent boundary overlap
    // Account for 32px separator lines (need extra clearance)
    const separatorBuffer = 35; // pixels buffer from separator line
    const separatorAngleDelta = (Math.asin(separatorBuffer / radius) * 180) / Math.PI;

    let angleDelta = (Math.asin(blipWidth / 2 / radius) * 180) / (Math.PI - 1.25);
    // Use the larger of the two deltas to ensure adequate spacing
    angleDelta = Math.max(angleDelta, separatorAngleDelta);
    angleDelta = Math.min(angleDelta, 45);

    // Random angle within quadrant (90 degree span)
    // Offset by the quadrant's start angle, adjusted for D3/SVG coordinate system
    const angleOffset = random.int(Math.ceil(angleDelta), 90 - Math.floor(angleDelta));
    const angle = ((startAngleDegrees - 90 + angleOffset) * Math.PI) / 180;

    // Convert polar to Cartesian using D3/SVG coordinate system
    // In D3 arc: 0 = top, positive = clockwise
    // sin for x, -cos for y (SVG y-axis is inverted)
    const x = center.x + radius * Math.sin(angle);
    const y = center.y - radius * Math.cos(angle);

    return { x, y };
  }

  private static hasCollision(
    x: number,
    y: number,
    width: number,
    allCoordinates: BlipCoordinate[]
  ): boolean {
    const padding = 8; // Collision buffer between blips

    return allCoordinates.some((coord) => {
      const minDistance = coord.width / 2 + width / 2 + padding;
      // Use Euclidean distance for proper circular collision detection
      const dx = coord.x - x;
      const dy = coord.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < minDistance;
    });
  }
}
