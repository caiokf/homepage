import { Quadrant } from "./quadrant";
import { Ring } from "./ring";
import { Blip, type BlipStatus } from "./blip";
import { RING_NAMES, QUADRANT_NAMES } from "../config/radar-config";
import type { TechRadarData } from "../data/tech-radar-data";

class MalformedDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MalformedDataError";
  }
}

const ExceptionMessages = {
  TOO_MANY_QUADRANTS: "Too many quadrants",
};

export type QuadrantConfig = {
  order: "first" | "second" | "third" | "fourth";
  startAngle: number;
  quadrant?: Quadrant;
};

export type RingsMap = Record<string, Ring>;

export class Radar {
  private _blipNumber: number = 0;
  private _addingQuadrant: number = 0;
  private _quadrants: QuadrantConfig[] = [
    { order: "first", startAngle: 0 },
    { order: "second", startAngle: -90 },
    { order: "third", startAngle: 90 },
    { order: "fourth", startAngle: -180 },
  ];
  private _rings: RingsMap = {};

  static create(data: TechRadarData): Radar {
    const radar = new Radar();

    // Create rings from config or data
    const ringNames = data.rings || [...RING_NAMES];
    const rings: RingsMap = {};
    ringNames.forEach((name, index) => {
      rings[name.toLowerCase()] = new Ring(name, index);
    });
    radar.addRings(rings);

    // Create quadrants and add blips
    const quadrantNames = data.quadrants || [...QUADRANT_NAMES];
    const quadrantMap = new Map<string, Quadrant>();

    quadrantNames.forEach((name) => {
      const quadrant = new Quadrant(name);
      quadrantMap.set(name.toLowerCase(), quadrant);
    });

    // Add blips to their respective quadrants
    data.blips.forEach((rawBlip) => {
      const ring = rings[rawBlip.ring.toLowerCase()];
      if (!ring) {
        console.warn(`Unknown ring: ${rawBlip.ring}`);
        return;
      }

      const quadrant = quadrantMap.get(rawBlip.quadrant.toLowerCase());
      if (!quadrant) {
        console.warn(`Unknown quadrant: ${rawBlip.quadrant}`);
        return;
      }

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

    // Add quadrants to radar in order
    quadrantNames.forEach((name) => {
      const quadrant = quadrantMap.get(name.toLowerCase());
      if (quadrant) {
        radar.addQuadrant(quadrant);
      }
    });

    return radar;
  }

  private setNumbers(blips: Blip[]): void {
    blips.forEach((blip) => {
      ++this._blipNumber;
      blip.blipText = this._blipNumber.toString();
      blip.id = this._blipNumber;
    });
  }

  addQuadrant(quadrant: Quadrant): void {
    if (this._addingQuadrant >= 4) {
      throw new MalformedDataError(ExceptionMessages.TOO_MANY_QUADRANTS);
    }
    this._quadrants[this._addingQuadrant].quadrant = quadrant;
    this.setNumbers(quadrant.blips());
    this._addingQuadrant++;
  }

  addRings(allRings: RingsMap): void {
    this._rings = allRings;
  }

  get rings(): RingsMap {
    return this._rings;
  }

  get quadrants(): QuadrantConfig[] {
    return this._quadrants;
  }
}
