import { Quadrant } from "./quadrant";
import { Ring } from "./ring";
import { Blip, type BlipStatus } from "./blip";
import {
  RING_NAMES,
  QUADRANT_POSITIONS,
  type QuadrantPosition,
} from "../config";
import type { TechRadarData } from "../data/tech-radar-data";

export type RingsMap = Record<string, Ring>;

/**
 * Convert a string to kebab-case lowercase
 * e.g., "Languages & Frameworks" -> "languages-frameworks"
 *       "Tech Stack" -> "tech-stack"
 */
function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/&/g, "") // Remove ampersands
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dashes
    .replace(/^-+|-+$/g, "") // Trim leading/trailing dashes
    .replace(/-+/g, "-"); // Collapse multiple dashes
}

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

    // Extract and normalize quadrant names from blips
    // Build a map from normalized name -> first original label seen (preserves friendly display name)
    const normalizedToOriginal = new Map<string, string>();
    for (const blip of data.blips) {
      const original = blip.quadrant.trim();
      const normalized = toKebabCase(original);
      if (!normalizedToOriginal.has(normalized)) {
        normalizedToOriginal.set(normalized, original);
      }
    }

    // Determine deterministic ordering for quadrants
    let orderedNormalizedNames: string[];

    if (data.quadrants && data.quadrants.length > 0) {
      // Use provided quadrants order (normalized)
      const providedNormalized = data.quadrants.map((q) => toKebabCase(q.trim()));
      const blipNormalized = new Set(normalizedToOriginal.keys());

      // Validate provided quadrants match blip quadrants
      const missingInBlips = providedNormalized.filter((n) => !blipNormalized.has(n));
      const missingInProvided = [...blipNormalized].filter(
        (n) => !providedNormalized.includes(n)
      );

      if (missingInBlips.length > 0) {
        console.warn(
          `Quadrants in data.quadrants not found in blips: [${missingInBlips.join(", ")}]`
        );
      }
      if (missingInProvided.length > 0) {
        console.warn(
          `Quadrants in blips not found in data.quadrants: [${missingInProvided.join(", ")}] (original labels: [${missingInProvided.map((n) => normalizedToOriginal.get(n)).join(", ")}])`
        );
      }

      // Use provided order, filtering to only include those found in blips
      orderedNormalizedNames = providedNormalized.filter((n) => blipNormalized.has(n));

      // Add any missing from blips (sorted alphabetically)
      const remaining = [...blipNormalized]
        .filter((n) => !orderedNormalizedNames.includes(n))
        .sort();
      orderedNormalizedNames.push(...remaining);
    } else {
      // No explicit order provided - sort alphabetically for deterministic ordering
      orderedNormalizedNames = [...normalizedToOriginal.keys()].sort();
    }

    // Validate exactly 4 quadrant names
    if (orderedNormalizedNames.length !== 4) {
      const originalLabels = orderedNormalizedNames.map(
        (n) => normalizedToOriginal.get(n) || n
      );
      throw new Error(
        `Expected exactly 4 quadrant names, but found ${orderedNormalizedNames.length}: [${originalLabels.join(", ")}]`
      );
    }

    // Create mappings: normalized -> position and normalized -> display name
    const normalizedToPosition = new Map<string, QuadrantPosition>();
    QUADRANT_POSITIONS.forEach((position, index) => {
      const normalizedName = orderedNormalizedNames[index];
      normalizedToPosition.set(normalizedName, position);
      // Use kebab-case as the display name
      radar._quadrants.set(position, new Quadrant(position, normalizedName));
    });

    // Add blips to their respective quadrants
    data.blips.forEach((rawBlip) => {
      const ring = rings[rawBlip.ring.toLowerCase()];
      if (!ring) {
        console.warn(`Unknown ring: ${rawBlip.ring}`);
        return;
      }

      const normalizedQuadrant = toKebabCase(rawBlip.quadrant.trim());
      const position = normalizedToPosition.get(normalizedQuadrant);
      if (!position) {
        const originalLabel = normalizedToOriginal.get(normalizedQuadrant) || rawBlip.quadrant;
        console.warn(`Unknown quadrant: "${rawBlip.quadrant}" (normalized: "${normalizedQuadrant}", original label: "${originalLabel}")`);
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
