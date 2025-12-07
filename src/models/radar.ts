import { Quadrant } from "./quadrant";
import { Ring } from "./ring";
import { Blip, type BlipStatus } from "./blip";
import {
  RING_NAMES,
  QUADRANT_POSITIONS,
  type QuadrantPosition,
} from "../config/radar-config";
import type { TechRadarData } from "../data/tech-radar-data";

export type RingsMap = Record<string, Ring>;

export class Radar {
  private _blipNumber: number = 0;
  private _quadrants: Map<QuadrantPosition, Quadrant>;
  private _rings: RingsMap = {};

  constructor() {
    // Always create 4 quadrants upfront
    this._quadrants = new Map<QuadrantPosition, Quadrant>(
      QUADRANT_POSITIONS.map((position) => [position, new Quadrant(position)])
    );
  }

  static create(data: TechRadarData): Radar {
    const radar = new Radar();

    // Create rings from config or data
    const ringNames = data.rings || [...RING_NAMES];
    const rings: RingsMap = {};
    ringNames.forEach((name, index) => {
      rings[name.toLowerCase()] = new Ring(name, index);
    });
    radar._rings = rings;

    // Map quadrant names to positions
    const quadrantNames = data.quadrants || [
      "Techniques",
      "Platforms",
      "Tools",
      "Languages & Frameworks",
    ];

    // Create a mapping from name to position
    const nameToPosition = new Map<string, QuadrantPosition>();
    QUADRANT_POSITIONS.forEach((position, index) => {
      const name = quadrantNames[index];
      if (name) {
        nameToPosition.set(name.toLowerCase(), position);
        // Update quadrant with custom name
        radar._quadrants.set(position, new Quadrant(position, name));
      }
    });

    // Add blips to their respective quadrants
    data.blips.forEach((rawBlip) => {
      const ring = rings[rawBlip.ring.toLowerCase()];
      if (!ring) {
        console.warn(`Unknown ring: ${rawBlip.ring}`);
        return;
      }

      const position = nameToPosition.get(rawBlip.quadrant.toLowerCase());
      if (!position) {
        console.warn(`Unknown quadrant: ${rawBlip.quadrant}`);
        return;
      }

      const quadrant = radar._quadrants.get(position)!;
      const blip = new Blip(
        rawBlip.name,
        ring,
        rawBlip.isNew,
        rawBlip.status as BlipStatus,
        rawBlip.topic,
        rawBlip.description
      );

      quadrant.add(blip);
    });

    // Assign blip numbers across all quadrants
    radar.assignBlipNumbers();

    return radar;
  }

  private assignBlipNumbers(): void {
    for (const position of QUADRANT_POSITIONS) {
      const quadrant = this._quadrants.get(position)!;
      for (const blip of quadrant.blips()) {
        this._blipNumber++;
        blip.blipText = this._blipNumber.toString();
        blip.id = this._blipNumber;
      }
    }
  }

  get rings(): RingsMap {
    return this._rings;
  }

  /**
   * Get all quadrants as an array in position order (NE, NW, SW, SE)
   */
  get quadrants(): Quadrant[] {
    return QUADRANT_POSITIONS.map((position) => this._quadrants.get(position)!);
  }

  /**
   * Get a specific quadrant by position
   */
  getQuadrant(position: QuadrantPosition): Quadrant {
    return this._quadrants.get(position)!;
  }
}
