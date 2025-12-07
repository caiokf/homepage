import { Blip } from "./blip";
import type { PositionedBlip, QuadrantGeometry } from "./types";

// Seeded random number generator for reproducible positioning
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  float(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  int(min: number, max: number): number {
    return Math.floor(this.float(min, max + 1));
  }
}

interface BlipCoordinate {
  x: number;
  y: number;
  width: number;
}

export class Quadrant {
  private _blips: Blip[] = [];

  constructor(private _name: string) {}

  get name(): string {
    return this._name;
  }

  add(newBlips: Blip | Blip[]): void {
    if (Array.isArray(newBlips)) {
      this._blips = this._blips.concat(newBlips);
    } else {
      this._blips.push(newBlips);
    }
  }

  blips(): Blip[] {
    return this._blips.slice(0);
  }

  /**
   * Calculate positioned blips with collision detection for rendering.
   * Uses seeded random for reproducible positions.
   */
  calculateBlipPositions(geometry: QuadrantGeometry): PositionedBlip[] {
    const { startAngle, quadrantSize, ringRadii, center } = geometry;
    const positioned: PositionedBlip[] = [];
    const allCoordinates: BlipCoordinate[] = [];

    // Create seeded random for reproducibility
    const seed = Math.PI * quadrantSize * quadrantSize * ringRadii.length * 200;
    const random = new SeededRandom(seed);

    // Group blips by ring
    const blipsByRing = this.groupBlipsByRing();

    // Position blips ring by ring
    for (const [ringIndex, ringBlips] of blipsByRing.entries()) {
      const minRadius = ringRadii[ringIndex];
      const maxRadius = ringRadii[ringIndex + 1];

      for (const blip of ringBlips) {
        const coords = this.findBlipPosition(
          blip,
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

  private groupBlipsByRing(): Map<number, Blip[]> {
    const groups = new Map<number, Blip[]>();
    for (const blip of this._blips) {
      const ringIndex = blip.ring.order;
      if (!groups.has(ringIndex)) {
        groups.set(ringIndex, []);
      }
      groups.get(ringIndex)!.push(blip);
    }
    return groups;
  }

  private findBlipPosition(
    blip: Blip,
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
        blip.width,
        minRadius,
        maxRadius,
        startAngle,
        center,
        random
      );

      if (!this.hasCollision(coords.x, coords.y, blip.width, allCoordinates)) {
        break;
      }
    }

    return coords;
  }

  private calculateBlipCoordinates(
    blipWidth: number,
    minRadius: number,
    maxRadius: number,
    startAngleDegrees: number,
    center: { x: number; y: number },
    random: SeededRandom
  ): { x: number; y: number } {
    // Random radius within ring bounds, accounting for blip size
    const radius = random.float(
      minRadius + blipWidth / 2,
      maxRadius - blipWidth
    );

    // Calculate angle delta to prevent boundary overlap
    // Account for 32px separator lines (need extra clearance)
    const separatorBuffer = 35; // pixels buffer from separator line
    const separatorAngleDelta =
      (Math.asin(separatorBuffer / radius) * 180) / Math.PI;

    let angleDelta =
      (Math.asin(blipWidth / 2 / radius) * 180) / (Math.PI - 1.25);
    // Use the larger of the two deltas to ensure adequate spacing
    angleDelta = Math.max(angleDelta, separatorAngleDelta);
    angleDelta = Math.min(angleDelta, 45);

    // Random angle within quadrant (90 degree span)
    // Offset by the quadrant's start angle, adjusted for D3/SVG coordinate system
    const angleOffset = random.int(
      Math.ceil(angleDelta),
      90 - Math.floor(angleDelta)
    );
    const angle = ((startAngleDegrees - 90 + angleOffset) * Math.PI) / 180;

    // Convert polar to Cartesian using D3/SVG coordinate system
    // In D3 arc: 0 = top, positive = clockwise
    // sin for x, -cos for y (SVG y-axis is inverted)
    const x = center.x + radius * Math.sin(angle);
    const y = center.y - radius * Math.cos(angle);

    return { x, y };
  }

  private hasCollision(
    x: number,
    y: number,
    width: number,
    allCoordinates: BlipCoordinate[]
  ): boolean {
    const padding = 10; // Collision buffer

    return allCoordinates.some((coord) => {
      const minDistance = coord.width / 2 + width / 2 + padding;
      return (
        Math.abs(coord.x - x) < minDistance &&
        Math.abs(coord.y - y) < minDistance
      );
    });
  }
}
